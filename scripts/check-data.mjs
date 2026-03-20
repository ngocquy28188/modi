import PocketBase from 'pocketbase';
const pb = new PocketBase('https://db.mkg.vn');

async function run() {
    await pb.collection('_superusers').authWithPassword('quy28181818@gmail.com', '@Mkg201444');

    // Check products
    const products = await pb.collection('modi_products').getFullList();
    console.log(`Found ${products.length} products`);

    for (const p of products) {
        const keys = Object.keys(p).filter(k => !k.startsWith('collectionId') && !k.startsWith('collection'));
        console.log(`\nID: ${p.id}`);
        for (const k of keys) {
            if (p[k] !== '' && p[k] !== null && p[k] !== undefined && k !== 'id') {
                console.log(`  ${k}: ${JSON.stringify(p[k]).slice(0, 80)}`);
            }
        }
    }

    // Also check orders collection
    const orders = await pb.collection('modi_orders').getFullList();
    console.log(`\n\nFound ${orders.length} orders`);
    if (orders.length > 0) {
        console.log('First order:', JSON.stringify(orders[0], null, 2).slice(0, 500));
    }
}

run().catch(e => console.error(e));
