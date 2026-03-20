import PocketBase from 'pocketbase';
const pb = new PocketBase('https://db.mkg.vn');

async function run() {
    await pb.collection('_superusers').authWithPassword('quy28181818@gmail.com', '@Mkg201444');

    // Get collection schema
    const res = await fetch('https://db.mkg.vn/api/collections/modi_products', {
        headers: { 'Authorization': pb.authStore.token }
    });
    const col = await res.json();

    console.log('Collection type:', col.type);

    // Check both possible field formats
    const fields = col.fields || col.schema || [];
    console.log('\nFields:');
    fields.forEach(f => {
        console.log(`  ${f.name} (${f.type}) ${f.required ? '*' : ''}`);
    });

    // Check one product's raw data
    const products = await pb.collection('modi_products').getFullList({ perPage: 1 });
    if (products.length > 0) {
        console.log('\nRaw product record:');
        console.log(JSON.stringify(products[0], null, 2));
    }
}

run().catch(e => console.error(e));
