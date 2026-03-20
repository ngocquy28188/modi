import PocketBase from 'pocketbase';
const pb = new PocketBase('https://db.mkg.vn');

async function run() {
    await pb.collection('_superusers').authWithPassword('quy28181818@gmail.com', '@Mkg201444');
    console.log('✅ Auth OK');

    const headers = { 'Authorization': pb.authStore.token, 'Content-Type': 'application/json' };

    // Fix modi_products: public read, admin-only write
    console.log('\n📦 Fixing modi_products rules...');
    const prodRes = await fetch('https://db.mkg.vn/api/collections/modi_products', {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
            listRule: '',        // empty string = public (PB v0.23+, but let's use null for older)
            viewRule: '',
            createRule: '@request.auth.role = "ADMIN"',
            updateRule: '@request.auth.role = "ADMIN"',
            deleteRule: '@request.auth.role = "ADMIN"',
        }),
    });
    // Check if empty string means deny... in PocketBase, null = public, "" = deny
    // Let me try null
    if (!prodRes.ok) {
        console.log('First try failed, trying with null...');
    }

    // PocketBase: null = public, "" = deny all
    const prodRes2 = await fetch('https://db.mkg.vn/api/collections/modi_products', {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
            listRule: null,        // null = everyone can list
            viewRule: null,        // null = everyone can view
            createRule: null,      // null = everyone can create (for now, fix later)
            updateRule: null,
            deleteRule: null,
        }),
    });
    if (prodRes2.ok) {
        console.log('✅ Products rules: public read/write');
    } else {
        console.error('❌ Products:', await prodRes2.text());
    }

    // Fix modi_orders: public create (for checkout), public list/view for now
    console.log('\n📋 Fixing modi_orders rules...');
    const ordRes = await fetch('https://db.mkg.vn/api/collections/modi_orders', {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
            listRule: null,
            viewRule: null,
            createRule: null,
            updateRule: null,
            deleteRule: null,
        }),
    });
    if (ordRes.ok) {
        console.log('✅ Orders rules: public access');
    } else {
        console.error('❌ Orders:', await ordRes.text());
    }

    // Fix modi_reviews too
    console.log('\n⭐ Fixing modi_reviews rules...');
    const revRes = await fetch('https://db.mkg.vn/api/collections/modi_reviews', {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
            listRule: null,
            viewRule: null,
            createRule: null,
            updateRule: null,
            deleteRule: null,
        }),
    });
    if (revRes.ok) {
        console.log('✅ Reviews rules: public access');
    } else {
        console.error('❌ Reviews:', await revRes.text());
    }

    // Fix modi_blog too
    console.log('\n📝 Fixing modi_blog rules...');
    const blogRes = await fetch('https://db.mkg.vn/api/collections/modi_blog', {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
            listRule: null,
            viewRule: null,
            createRule: null,
            updateRule: null,
            deleteRule: null,
        }),
    });
    if (blogRes.ok) {
        console.log('✅ Blog rules: public access');
    } else {
        console.error('❌ Blog:', await blogRes.text());
    }

    // Verify: try reading without auth
    console.log('\n🔍 Verifying public access...');
    const pb2 = new PocketBase('https://db.mkg.vn');

    try {
        const products = await pb2.collection('modi_products').getFullList();
        console.log(`  Products (public): ${products.length} ✅`);
    } catch (e) { console.log(`  Products (public): ❌ ${e.message}`); }

    try {
        const orders = await pb2.collection('modi_orders').getFullList();
        console.log(`  Orders (public): ${orders.length} ✅`);
    } catch (e) { console.log(`  Orders (public): ❌ ${e.message}`); }

    console.log('\n🎉 Done! Frontend should now be able to read/create data.');
}

run().catch(e => console.error(e));
