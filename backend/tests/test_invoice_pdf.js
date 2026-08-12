// Test PDF generation via API
const http = require('http');
const fs = require('fs');
const path = require('path');

function request(method, urlPath, body, token, responseType = 'json') {
    return new Promise((resolve, reject) => {
        const data = body ? JSON.stringify(body) : null;
        const options = {
            hostname: 'localhost', port: 5001,
            path: '/api' + urlPath, method,
            headers: { 'Content-Type': 'application/json' }
        };
        if (token) options.headers['Authorization'] = 'Bearer ' + token;
        const req = http.request(options, (res) => {
            const chunks = [];
            res.on('data', chunk => chunks.push(chunk));
            res.on('end', () => {
                const buffer = Buffer.concat(chunks);
                if (responseType === 'json') {
                    try { resolve({ status: res.statusCode, data: JSON.parse(buffer.toString()) }); }
                    catch { resolve({ status: res.statusCode, data: buffer.toString() }); }
                } else {
                    resolve({ status: res.statusCode, data: buffer, headers: res.headers });
                }
            });
        });
        req.on('error', reject);
        if (data) req.write(data);
        req.end();
    });
}

(async () => {
    console.log('=== INVOICE PDF TEST ===\n');

    // 1. Login
    const login = await request('POST', '/auth/login', { email: 'admin@demo.com', password: 'admin123' });
    console.log('1. Login:', login.status === 200 ? '✅' : '❌');
    const token = login.data.token;

    // 2. Get Invoices
    const invoices = await request('GET', '/invoices', null, token);
    console.log('2. Invoices:', Array.isArray(invoices.data) ? invoices.data.length : 0, 'total');
    
    let invoiceId;
    if (invoices.data.length > 0) {
        invoiceId = invoices.data[0]._id;
        console.log('3. Using existing invoice:', invoices.data[0].invoiceNumber);
    } else {
        // Let's create an invoice if there are none. We first need an order.
        const orders = await request('GET', '/orders', null, token);
        if (orders.data.length > 0) {
             const orderId = orders.data[0]._id;
             console.log('3. Creating invoice for order:', orders.data[0].orderNumber);
             const newInvoice = await request('POST', '/invoices', {
                 invoiceNumber: 'INV-TEST-' + Date.now(),
                 order: orderId,
                 dueDate: '2026-12-31'
             }, token);
             if (newInvoice.status === 201) {
                 invoiceId = newInvoice.data._id;
                 console.log('   Invoice created:', newInvoice.data.invoiceNumber);
             } else {
                 console.log('   Error creating invoice:', newInvoice.data);
                 return;
             }
        } else {
            console.log('3. ❌ No orders to create invoice from!');
            return;
        }
    }

    // 4. Download PDF
    console.log('\n4. Downloading PDF...');
    const pdfRes = await request('GET', `/invoices/${invoiceId}/pdf`, null, token, 'buffer');
    console.log('   Status:', pdfRes.status, pdfRes.status === 200 ? '✅' : '❌');
    if (pdfRes.status === 200) {
        const filePath = path.join(__dirname, 'test_invoice.pdf');
        fs.writeFileSync(filePath, pdfRes.data);
        console.log('   PDF saved to:', filePath);
        console.log('   Content-Type:', pdfRes.headers['content-type']);
        console.log('   Content-Disposition:', pdfRes.headers['content-disposition']);
    } else {
        console.log('   Error:', pdfRes.data.toString());
    }

    console.log('\n=== TEST COMPLETE ===');
})();
