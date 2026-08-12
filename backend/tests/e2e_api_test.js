// Full end-to-end API test
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
    console.log('=== E2E API TEST ===\n');

    // 1. Login
    console.log('1. Login as demo admin...');
    const login = await request('POST', '/auth/login', { email: 'admin@demo.com', password: 'admin123' });
    console.log('   Status:', login.status, login.status === 200 ? '✅' : '❌');
    console.log('   User ID:', login.data._id);
    const token = login.data.token;

    // 2. Get Dashboard
    console.log('\n2. Dashboard...');
    const dash = await request('GET', '/dashboard', null, token);
    console.log('   Status:', dash.status, dash.status === 200 ? '✅' : '❌');
    console.log('   Data:', JSON.stringify(dash.data));

    // 3. Get Customers
    console.log('\n3. Customers...');
    const custs = await request('GET', '/customers?search=', null, token);
    console.log('   Status:', custs.status, custs.status === 200 ? '✅' : '❌');
    console.log('   Count:', Array.isArray(custs.data) ? custs.data.length : 'N/A');

    // 4. Get Products
    console.log('\n4. Products...');
    const prods = await request('GET', '/products?search=', null, token);
    console.log('   Status:', prods.status, prods.status === 200 ? '✅' : '❌');
    console.log('   Count:', Array.isArray(prods.data) ? prods.data.length : 'N/A');

    // 5. Create Quotation
    console.log('\n5. Create Quotation...');
    if (Array.isArray(custs.data) && custs.data.length > 0 && Array.isArray(prods.data) && prods.data.length > 0) {
        const q = await request('POST', '/quotations', {
            quotationNumber: 'Q-E2E-' + Date.now(),
            customer: custs.data[0]._id,
            validTill: '2026-12-31',
            discount: 10,
            remarks: 'E2E Test',
            products: [{ product: prods.data[0]._id, quantity: 3, unitPrice: prods.data[0].sellingPrice }]
        }, token);
        console.log('   Status:', q.status, q.status === 201 ? '✅' : '❌');
        if (q.status === 201) {
            console.log('   Quotation ID:', q.data._id);
            console.log('   Grand Total:', q.data.grandTotal);
        } else {
            console.log('   Error:', JSON.stringify(q.data));
        }
    } else {
        console.log('   ⚠️ Skipped - no customers/products');
    }

    // 6. Get Quotations
    console.log('\n6. Quotations list...');
    const quotes = await request('GET', '/quotations', null, token);
    console.log('   Status:', quotes.status, quotes.status === 200 ? '✅' : '❌');
    console.log('   Count:', Array.isArray(quotes.data) ? quotes.data.length : 'N/A');

    // 7. Get Orders
    console.log('\n7. Orders...');
    const orders = await request('GET', '/orders', null, token);
    console.log('   Status:', orders.status, orders.status === 200 ? '✅' : '❌');
    console.log('   Count:', Array.isArray(orders.data) ? orders.data.length : 'N/A');

    // 8. Get Invoices
    console.log('\n8. Invoices...');
    const inv = await request('GET', '/invoices', null, token);
    console.log('   Status:', inv.status, inv.status === 200 ? '✅' : '❌');

    // 9. Get Payments
    console.log('\n9. Payments...');
    const pay = await request('GET', '/payments', null, token);
    console.log('   Status:', pay.status, pay.status === 200 ? '✅' : '❌');

    // 10. Get Activities
    console.log('\n10. Activity Timeline...');
    const act = await request('GET', '/activities', null, token);
    console.log('    Status:', act.status, act.status === 200 ? '✅' : '❌');
    console.log('    Count:', Array.isArray(act.data) ? act.data.length : 'N/A');

    // 11. Profile
    console.log('\n11. Profile...');
    const prof = await request('GET', '/auth/profile', null, token);
    console.log('    Status:', prof.status, prof.status === 200 ? '✅' : '❌');
    console.log('    Name:', prof.data.name);

    console.log('\n=== TEST COMPLETE ===');
})();
