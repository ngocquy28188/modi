import PocketBase from 'pocketbase';
const pb = new PocketBase('https://db.mkg.vn');

async function run() {
    await pb.collection('_superusers').authWithPassword('quy28181818@gmail.com', '@Mkg201444');
    console.log('✅ Auth OK');

    // Step 1: Get current collection info
    const res = await fetch('https://db.mkg.vn/api/collections/modi_products', {
        headers: { 'Authorization': pb.authStore.token }
    });
    const col = await res.json();

    // Step 2: Add all missing fields
    const existingFields = col.fields || [];
    const existingNames = existingFields.map(f => f.name);

    const newFields = [];
    if (!existingNames.includes('name')) newFields.push({ name: 'name', type: 'text', required: true });
    if (!existingNames.includes('slug')) newFields.push({ name: 'slug', type: 'text' });
    if (!existingNames.includes('category')) newFields.push({ name: 'category', type: 'select', values: ['BEDROOM', 'LIVING_ROOM', 'APARTMENT', 'SMART', 'COMBO'], maxSelect: 1 });
    if (!existingNames.includes('material')) newFields.push({ name: 'material', type: 'select', values: ['MDF', 'MFC', 'PLYWOOD', 'SOLID_WOOD', 'FABRIC', 'LEATHER', 'METAL', 'MIXED'], maxSelect: 1 });
    if (!existingNames.includes('dimensions')) newFields.push({ name: 'dimensions', type: 'text' });
    if (!existingNames.includes('price')) newFields.push({ name: 'price', type: 'number' });
    if (!existingNames.includes('salePrice')) newFields.push({ name: 'salePrice', type: 'number' });
    if (!existingNames.includes('description')) newFields.push({ name: 'description', type: 'text' });
    if (!existingNames.includes('features')) newFields.push({ name: 'features', type: 'json' });
    if (!existingNames.includes('status')) newFields.push({ name: 'status', type: 'select', values: ['IN_STOCK', 'PRE_ORDER', 'OUT_OF_STOCK'], maxSelect: 1 });
    if (!existingNames.includes('rating')) newFields.push({ name: 'rating', type: 'number' });
    if (!existingNames.includes('reviewCount')) newFields.push({ name: 'reviewCount', type: 'number' });
    if (!existingNames.includes('colors')) newFields.push({ name: 'colors', type: 'json' });
    if (!existingNames.includes('sku')) newFields.push({ name: 'sku', type: 'text' });
    if (!existingNames.includes('images')) newFields.push({ name: 'images', type: 'file', maxSelect: 10, maxSize: 10485760 });

    if (newFields.length === 0) {
        console.log('All fields already exist!');
        return;
    }

    console.log(`Adding ${newFields.length} fields: ${newFields.map(f => f.name).join(', ')}`);

    const updatedFields = [...existingFields, ...newFields];
    const updateRes = await fetch('https://db.mkg.vn/api/collections/modi_products', {
        method: 'PATCH',
        headers: { 'Authorization': pb.authStore.token, 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields: updatedFields }),
    });

    if (!updateRes.ok) {
        const err = await updateRes.json();
        console.error('Schema update failed:', JSON.stringify(err));
        return;
    }
    console.log('✅ Schema updated!');

    // Step 3: Delete existing empty products
    const products = await pb.collection('modi_products').getFullList();
    console.log(`🗑️ Deleting ${products.length} empty records...`);
    for (const p of products) {
        await pb.collection('modi_products').delete(p.id);
    }

    // Step 4: Seed with real data
    const PRODUCTS = [
        { name: 'Giường Ngủ Module KARA', slug: 'giuong-ngu-kara', category: 'BEDROOM', material: 'MDF', dimensions: '2000 × 1600 × 350mm', price: 8500000, salePrice: 6990000, description: 'Giường ngủ module thiết kế tối giản, tháo lắp dễ dàng.', features: ['Tháo lắp 15 phút', 'Gỗ MDF chống ẩm', 'Ngăn kéo tích hợp'], status: 'IN_STOCK', rating: 4.8, reviewCount: 124, colors: ['Trắng', 'Vân Sồi', 'Đen'], sku: 'MODI-BD-001' },
        { name: 'Tủ Quần Áo MIKA 3 Cánh', slug: 'tu-quan-ao-mika', category: 'BEDROOM', material: 'MFC', dimensions: '1800 × 600 × 2000mm', price: 12900000, salePrice: 9990000, description: 'Tủ quần áo 3 cánh module, thiết kế nhiều ngăn thông minh.', features: ['3 cánh mở', '6 ngăn + 2 thanh treo', 'Module mở rộng'], status: 'IN_STOCK', rating: 4.7, reviewCount: 89, colors: ['Trắng', 'Vân Sồi'], sku: 'MODI-WD-001' },
        { name: 'Sofa Module LUNA L-Shape', slug: 'sofa-luna-l', category: 'LIVING_ROOM', material: 'FABRIC', dimensions: '2600 × 1700 × 850mm', price: 18500000, salePrice: 14900000, description: 'Sofa góc L module, đệm bọc vải cao cấp, khung gỗ chắc chắn.', features: ['Tách rời linh hoạt', 'Vải chống bám bẩn', 'Đệm mút D40'], status: 'IN_STOCK', rating: 4.9, reviewCount: 67, colors: ['Xám Đậm', 'Be', 'Xanh Navy'], sku: 'MODI-SF-001' },
        { name: 'Kệ TV Module ZENITH', slug: 'ke-tv-zenith', category: 'LIVING_ROOM', material: 'MDF', dimensions: '1600 × 400 × 500mm', price: 5900000, description: 'Kệ TV treo tường module, thiết kế Scandinavian hiện đại.', features: ['Treo tường/đặt sàn', 'Giấu dây điện', 'Chịu tải 80kg'], status: 'IN_STOCK', rating: 4.6, reviewCount: 45, colors: ['Trắng-Sồi', 'Đen-Walnut'], sku: 'MODI-TV-001' },
        { name: 'Combo Phòng Ngủ SAKURA', slug: 'combo-phong-ngu-sakura', category: 'COMBO', material: 'MDF', dimensions: 'Giường + Tủ + Bàn + Tab', price: 35000000, salePrice: 24900000, description: 'Combo 4 món cho phòng ngủ hoàn chỉnh. Tiết kiệm 30%.', features: ['4 món đồng bộ', 'Tiết kiệm 30%', 'Tặng lắp đặt'], status: 'IN_STOCK', rating: 4.9, reviewCount: 203, colors: ['Trắng', 'Vân Sồi'], sku: 'MODI-CB-001' },
        { name: 'Bàn Làm Việc Thông Minh FLEXI', slug: 'ban-flexi', category: 'SMART', material: 'MIXED', dimensions: '1200 × 600 × 750mm', price: 7900000, salePrice: 5990000, description: 'Bàn làm việc nâng hạ điện, tích hợp sạc không dây.', features: ['Nâng hạ điện', 'Sạc không dây', 'Nhớ 3 vị trí'], status: 'PRE_ORDER', rating: 4.8, reviewCount: 52, colors: ['Trắng', 'Đen'], sku: 'MODI-DK-001' },
        { name: 'Combo Căn Hộ Studio URBAN', slug: 'combo-studio-urban', category: 'APARTMENT', material: 'MFC', dimensions: 'Full nội thất 25-35m²', price: 65000000, salePrice: 49900000, description: 'Gói nội thất trọn bộ cho căn hộ studio 25-35m². Tặng thiết kế 3D.', features: ['Trọn bộ 8 món', 'Tối ưu 25-35m²', 'Tặng thiết kế 3D'], status: 'IN_STOCK', rating: 4.7, reviewCount: 31, colors: ['Tone Trắng-Sồi', 'Tone Xám-Walnut'], sku: 'MODI-APT-001' },
        { name: 'Giá Sách Module HEXA', slug: 'gia-sach-hexa', category: 'SMART', material: 'MDF', dimensions: '400 × 350 × 400mm (mỗi ô)', price: 890000, description: 'Giá sách dạng ô lục giác module, ghép tùy ý theo tường.', features: ['Ghép tùy ý', 'Nhiều màu', 'Nam châm kết nối'], status: 'IN_STOCK', rating: 4.5, reviewCount: 178, colors: ['Trắng', 'Hồng', 'Xanh Mint', 'Vân Gỗ'], sku: 'MODI-SH-001' },
    ];

    console.log('\n🌱 Seeding products...');
    for (const p of PRODUCTS) {
        try {
            const record = await pb.collection('modi_products').create(p);
            console.log(`  ✅ ${record.name} → ${record.id} (${record.price}đ)`);
        } catch (e) {
            console.error(`  ❌ ${p.name}: ${e.message}`);
        }
    }

    // Also fix modi_orders schema
    console.log('\n📋 Checking modi_orders schema...');
    const ordersRes = await fetch('https://db.mkg.vn/api/collections/modi_orders', {
        headers: { 'Authorization': pb.authStore.token }
    });
    const ordersCol = await ordersRes.json();
    const orderFields = ordersCol.fields || [];
    const orderFieldNames = orderFields.map(f => f.name);

    const newOrderFields = [];
    if (!orderFieldNames.includes('customerName')) newOrderFields.push({ name: 'customerName', type: 'text', required: true });
    if (!orderFieldNames.includes('phone')) newOrderFields.push({ name: 'phone', type: 'text', required: true });
    if (!orderFieldNames.includes('email')) newOrderFields.push({ name: 'email', type: 'text' });
    if (!orderFieldNames.includes('shippingAddress')) newOrderFields.push({ name: 'shippingAddress', type: 'text' });
    if (!orderFieldNames.includes('notes')) newOrderFields.push({ name: 'notes', type: 'text' });
    if (!orderFieldNames.includes('paymentMethod')) newOrderFields.push({ name: 'paymentMethod', type: 'text' });
    if (!orderFieldNames.includes('totalAmount')) newOrderFields.push({ name: 'totalAmount', type: 'number' });
    if (!orderFieldNames.includes('shippingFee')) newOrderFields.push({ name: 'shippingFee', type: 'number' });
    if (!orderFieldNames.includes('status')) newOrderFields.push({ name: 'status', type: 'select', values: ['PENDING', 'CONFIRMED', 'PRODUCING', 'SHIPPING', 'DELIVERED', 'CANCELLED'], maxSelect: 1 });
    if (!orderFieldNames.includes('items')) newOrderFields.push({ name: 'items', type: 'json' });

    if (newOrderFields.length > 0) {
        console.log(`Adding ${newOrderFields.length} order fields: ${newOrderFields.map(f => f.name).join(', ')}`);
        const updateOrderRes = await fetch('https://db.mkg.vn/api/collections/modi_orders', {
            method: 'PATCH',
            headers: { 'Authorization': pb.authStore.token, 'Content-Type': 'application/json' },
            body: JSON.stringify({ fields: [...orderFields, ...newOrderFields] }),
        });
        if (!updateOrderRes.ok) {
            console.error('Orders schema update failed:', await updateOrderRes.text());
        } else {
            console.log('✅ Orders schema updated');
        }
    } else {
        console.log('Orders schema already complete');
    }

    console.log('\n🎉 Done!');
}

run().catch(e => console.error('Fatal:', e));
