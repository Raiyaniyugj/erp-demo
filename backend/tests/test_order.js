// Test order creation end-to-end via API
const http = require('http');

function request(method, path, body, token) {
    return new Promise((resolve, reject) => {
        const data = body ? JSON.stringify(body) : null;
        const options = {
            hostname: 'localhost', port: 5001,
            path: '/api' + path, method,
            headers: { 'Content-Type': 'application/json' }
        };
        if (token) options.headers['Authorization'] = 'Bearer ' + token;
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', c => body += c);
            res.on('end', () => {
                try { resolve({ status: res.statusCode, data: JSON.parse(body) }); }
                catch { resolve({ status: res.statusCode, data: body }); }
            });
        });
        req.on('error', reject);
        if (data) req.write(data);
        req.end();
    });
}

(async () => {
    console.log('=== ORDER CREATION TEST ===\n');

    // 1. Login
    const login = await request('POST', '/auth/login', { email: 'admin@demo.com', password: 'admin123' });
    console.log('1. Login:', login.status === 200 ? '✅' : '❌');
    const token = login.data.token;

    // 2. Get quotations
    const quotes = await request('GET', '/quotations', null, token);
    console.log('2. Quotations:', quotes.data.length, 'total');
    
    const approved = quotes.data.filter(q => q.status === 'Approved');
    const drafts = quotes.data.filter(q => q.status === 'Draft');
    console.log('   Approved:', approved.length, '| Drafts:', drafts.length);

    // 3. Approve a draft if no approved quotations
    let quotationId;
    if (approved.length > 0) {
        quotationId = approved[0]._id;
        console.log('3. Using existing approved quotation:', approved[0].quotationNumber);
    } else if (drafts.length > 0) {
        console.log('3. Approving draft:', drafts[0].quotationNumber);
        const approve = await request('POST', '/quotations/' + drafts[0]._id + '/approve', {}, token);
        console.log('   Approve result:', approve.status, approve.status === 200 ? '✅' : '❌', JSON.stringify(approve.data));
        quotationId = drafts[0]._id;
    } else {
        console.log('3. ❌ No quotations to create order from!');
        return;
    }

    // 4. Create Order
    console.log('\n4. Creating order...');
    const order = await request('POST', '/orders', {
        orderNumber: 'ORD-TEST-' + Date.now(),
        quotation: quotationId,
        deliveryDate: '2026-12-31',
        shippingAddress: '123 Test Street, Mumbai'
    }, token);
    console.log('   Status:', order.status, order.status === 201 ? '✅' : '❌');
    if (order.status === 201) {
        console.log('   Order ID:', order.data._id);
        console.log('   Order Number:', order.data.orderNumber);
        console.log('   Grand Total:', order.data.grandTotal);
        console.log('   Status:', order.data.orderStatus);
    } else {
        console.log('   Error:', JSON.stringify(order.data));
    }

    // 5. Get Orders list
    console.log('\n5. Orders list...');
    const orders = await request('GET', '/orders', null, token);
    console.log('   Status:', orders.status, orders.status === 200 ? '✅' : '❌');
    console.log('   Count:', Array.isArray(orders.data) ? orders.data.length : 'N/A');

    console.log('\n=== TEST COMPLETE ===');
})();
