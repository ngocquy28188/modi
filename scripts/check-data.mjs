import PocketBase from 'pocketbase';
const pb = new PocketBase('https://db.mkg.vn');

async function run() {
    await pb.collection('_superusers').authWithPassword('quy28181818@gmail.com', '@Mkg201444');

    // 1. Check orders in detail
    const orders = await pb.collection('modi_orders').getFullList();
    console.log(`\n📦 Orders: ${orders.length}`);
    for (const o of orders) {
        console.log(`\n  ID: ${o.id}`);
        console.log(`  Customer: ${o.customerName}`);
        console.log(`  Phone: ${o.phone}`);
        console.log(`  Total: ${o.totalAmount}`);
        console.log(`  Status: ${o.status}`);
        console.log(`  Items: ${JSON.stringify(o.items)}`);
        console.log(`  Created: ${o.created}`);
    }

    // 2. Check collection API rules (visibility)
    for (const col of ['modi_orders', 'modi_products']) {
        const res = await fetch(`https://db.mkg.vn/api/collections/${col}`, {
            headers: { 'Authorization': pb.authStore.token }
        });
        const data = await res.json();
        console.log(`\n📋 ${col} API rules:`);
        console.log(`  listRule: ${JSON.stringify(data.listRule)}`);
        console.log(`  viewRule: ${JSON.stringify(data.viewRule)}`);
        console.log(`  createRule: ${JSON.stringify(data.createRule)}`);
        console.log(`  updateRule: ${JSON.stringify(data.updateRule)}`);
    }

    // 3. Try fetching as the admin user (not superuser)
    const pb2 = new PocketBase('https://db.mkg.vn');
    try {
        await pb2.collection('modi_auth').authWithPassword('admin@modi.vn', 'Admin@modi2026');
        console.log(`\n🔑 Logged in as admin@modi.vn`);

        try {
            const adminOrders = await pb2.collection('modi_orders').getFullList();
            console.log(`  Can see ${adminOrders.length} orders`);
        } catch (e) {
            console.log(`  ❌ Cannot read orders: ${e.message}`);
        }

        try {
            const adminProducts = await pb2.collection('modi_products').getFullList();
            console.log(`  Can see ${adminProducts.length} products`);
        } catch (e) {
            console.log(`  ❌ Cannot read products: ${e.message}`);
        }
    } catch (e) {
        console.log(`  ❌ Cannot login as admin: ${e.message}`);
    }

    // 4. Try fetching WITHOUT auth (public)
    const pb3 = new PocketBase('https://db.mkg.vn');
    try {
        const pubProducts = await pb3.collection('modi_products').getFullList();
        console.log(`\n🌍 Public: Can see ${pubProducts.length} products`);
    } catch (e) {
        console.log(`\n🌍 Public: Cannot read products: ${e.message}`);
    }
    try {
        const pubOrders = await pb3.collection('modi_orders').getFullList();
        console.log(`🌍 Public: Can see ${pubOrders.length} orders`);
    } catch (e) {
        console.log(`🌍 Public: Cannot read orders: ${e.message}`);
    }
}

run().catch(e => console.error(e));
