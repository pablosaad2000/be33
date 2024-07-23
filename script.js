document.addEventListener('DOMContentLoaded', (event) => {
    let db;
    const request = indexedDB.open("ordersDatabase", 1);

    request.onupgradeneeded = function(event) {
        db = event.target.result;
        const objectStore = db.createObjectStore("orders", { keyPath: "orderNumber" });
    };

    request.onsuccess = function(event) {
        db = event.target.result;
        loadOrders();
    };

    function saveOrder(order) {
        const transaction = db.transaction(["orders"], "readwrite");
        const objectStore = transaction.objectStore("orders");
        const request = objectStore.add(order);
        request.onsuccess = function(event) {
            console.log("Order has been added to your database.");
        };
        transaction.oncomplete = function() {
            console.log("All done!");
            loadOrders();
        };
        transaction.onerror = function(event) {
            console.error("Transaction not opened due to error: " + transaction.error);
        };
    }

    function loadOrders() {
        const transaction = db.transaction(["orders"], "readonly");
        const objectStore = transaction.objectStore("orders");
        const request = objectStore.getAll();

        request.onsuccess = function(event) {
            const orders = event.target.result;
            const orderList = document.getElementById('orderList');
            orderList.innerHTML = '';
            orders.forEach(order => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <div>اسم العميل: ${order.customerName}</div>
                    <div>رقم الطلب: ${order.orderNumber}</div>
                    <div>رصيد العميل: ${order.orderPrice}</div>
                    <div>نوع الطلب: ${order.orderType}</div>
                    <div>شركة الشحن: ${order.shippingCompany}</div>
                    <div>المحافظه: ${order.orderAddress}</div>
                    <div>رقم هاتف العميل: ${order.customerPhone}</div>
                    <div>تاريخ الطلب: ${order.orderDate}</div>
                    <button onclick="editOrder(${order.orderNumber})">تعديل</button>
                    <button onclick="deleteOrder(${order.orderNumber})">حذف</button>
                `;
                orderList.appendChild(li);
            });
        };
    }

    function deleteOrder(orderNumber) {
        const transaction = db.transaction(["orders"], "readwrite");
        const objectStore = transaction.objectStore("orders");
        const request = objectStore.delete(orderNumber);

        request.onsuccess = function(event) {
            console.log("Order has been deleted from your database.");
            loadOrders();
        };
        transaction.onerror = function(event) {
            console.error("Transaction not opened due to error: " + transaction.error);
        };
    }

    document.getElementById('orderForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const order = {
            customerName: document.getElementById('customerName').value,
            orderNumber: document.getElementById('orderNumber').value,
            orderPrice: document.getElementById('orderPrice').value,
            orderType: document.getElementById('orderType').value,
            shippingCompany: document.getElementById('shippingCompany').value,
            orderAddress: document.getElementById('orderAddress').value,
            customerPhone: document.getElementById('customerPhone').value,
            orderDate: document.getElementById('orderDate').value
        };
        saveOrder(order);
    });

    window.deleteOrder = deleteOrder;
    window.editOrder = function(orderNumber) {
        // هنا ستحتاج إلى إضافة منطق تحرير الطلب
        alert(`قم بتحرير الطلب رقم ${orderNumber}`);
    };
});
