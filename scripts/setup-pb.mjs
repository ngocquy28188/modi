// Setup script — dùng PocketBase JS SDK
// Chạy: node scripts/setup-pb.mjs

import PocketBase from 'pocketbase';

const PB_URL = 'https://db.mkg.vn';
const ADMIN_EMAIL = 'quy28181818@gmail.com';
const ADMIN_PASS = '@Mkg201444';

const pb = new PocketBase(PB_URL);

async function createCol(schema) {
    try {
        await pb.collections.create(schema);
        console.log(`  ✅ Created: ${schema.name}`);
    } catch (e) {
        if (e.message?.includes('already exists') || e.status === 400) {
            console.log(`  ⚠️  ${schema.name} exists, skipping`);
        } else {
            console.error(`  ❌ ${schema.name}: ${e.message}`);
        }
    }
}

async function seed(collection, data) {
    try {
        await pb.collection(collection).create(data);
        process.stdout.write('.');
        return true;
    } catch (e) {
        console.error(`\n  ❌ ${collection}: ${e.message}`);
        return false;
    }
}

async function main() {
    console.log('🔐 Logging in...');
    await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);
    console.log('✅ Login OK\n');

    console.log('📦 Creating collections...');

    await createCol({
        name: 'modi_products',
        type: 'base',
        listRule: '',
        viewRule: '',
        createRule: null,
        updateRule: null,
        deleteRule: null,
        schema: [
            { name: 'name', type: 'text', required: true },
            { name: 'slug', type: 'text', required: true },
            { name: 'category', type: 'select', required: true, options: { maxSelect: 1, values: ['BEDROOM', 'LIVING_ROOM', 'APARTMENT', 'SMART', 'COMBO'] } },
            { name: 'material', type: 'select', required: true, options: { maxSelect: 1, values: ['MDF', 'MFC', 'NATURAL_WOOD', 'METAL', 'FABRIC', 'LEATHER', 'MIXED'] } },
            { name: 'dimensions', type: 'text' },
            { name: 'price', type: 'number', required: true },
            { name: 'salePrice', type: 'number' },
            { name: 'images', type: 'file', options: { maxSelect: 10, mimeTypes: ['image/jpeg', 'image/png', 'image/webp'] } },
            { name: 'description', type: 'editor' },
            { name: 'features', type: 'json' },
            { name: 'colors', type: 'json' },
            { name: 'status', type: 'select', options: { maxSelect: 1, values: ['IN_STOCK', 'PRE_ORDER', 'OUT_OF_STOCK'] } },
            { name: 'rating', type: 'number' },
            { name: 'reviewCount', type: 'number' },
            { name: 'sku', type: 'text' },
        ],
    });

    await createCol({
        name: 'modi_blog',
        type: 'base',
        listRule: '',
        viewRule: '',
        createRule: null,
        updateRule: null,
        deleteRule: null,
        schema: [
            { name: 'title', type: 'text', required: true },
            { name: 'slug', type: 'text', required: true },
            { name: 'excerpt', type: 'text' },
            { name: 'content', type: 'editor' },
            { name: 'thumbnail', type: 'file', options: { maxSelect: 1 } },
            { name: 'status', type: 'select', options: { maxSelect: 1, values: ['draft', 'published'] } },
            { name: 'views', type: 'number' },
            { name: 'tags', type: 'json' },
        ],
    });

    await createCol({
        name: 'modi_auth',
        type: 'auth',
        listRule: null,
        viewRule: 'id = @request.auth.id',
        createRule: '',
        updateRule: 'id = @request.auth.id',
        deleteRule: null,
        schema: [
            { name: 'fullName', type: 'text' },
            { name: 'phone', type: 'text' },
            { name: 'address', type: 'text' },
            { name: 'role', type: 'select', options: { maxSelect: 1, values: ['CUSTOMER', 'ADMIN'] } },
        ],
    });

    await createCol({
        name: 'modi_orders',
        type: 'base',
        listRule: null,
        viewRule: null,
        createRule: '',
        updateRule: null,
        deleteRule: null,
        schema: [
            { name: 'customerName', type: 'text', required: true },
            { name: 'phone', type: 'text', required: true },
            { name: 'email', type: 'email' },
            { name: 'shippingAddress', type: 'text', required: true },
            { name: 'items', type: 'json', required: true },
            { name: 'totalAmount', type: 'number', required: true },
            { name: 'shippingFee', type: 'number' },
            { name: 'status', type: 'select', options: { maxSelect: 1, values: ['PENDING', 'CONFIRMED', 'PRODUCING', 'SHIPPING', 'DELIVERED', 'CANCELLED'] } },
            { name: 'paymentMethod', type: 'select', options: { maxSelect: 1, values: ['COD', 'BANK_TRANSFER'] } },
            { name: 'notes', type: 'text' },
        ],
    });

    await createCol({
        name: 'modi_reviews',
        type: 'base',
        listRule: '',
        viewRule: '',
        createRule: '',
        updateRule: null,
        deleteRule: null,
        schema: [
            { name: 'product', type: 'text', required: true },
            { name: 'userName', type: 'text', required: true },
            { name: 'rating', type: 'number', required: true },
            { name: 'comment', type: 'text' },
        ],
    });

    console.log('\n🌱 Seeding products...');
    const products = [
        { name: 'Giường Ngủ Module KARA', slug: 'giuong-ngu-kara', category: 'BEDROOM', material: 'MDF', dimensions: '2000 × 1600 × 350mm', price: 8500000, salePrice: 6990000, description: '<p>Giường ngủ module thiết kế tối giản, tháo lắp dễ dàng. Gỗ MDF chống ẩm.</p>', features: ['Tháo lắp 15 phút', 'Gỗ MDF chống ẩm', 'Ngăn kéo tích hợp'], colors: ['Trắng', 'Vân Sồi', 'Đen'], status: 'IN_STOCK', rating: 4.8, reviewCount: 124, sku: 'MODI-BD-001' },
        { name: 'Tủ Quần Áo MIKA 3 Cánh', slug: 'tu-quan-ao-mika', category: 'BEDROOM', material: 'MFC', dimensions: '1800 × 600 × 2000mm', price: 12900000, salePrice: 9990000, description: '<p>Tủ quần áo 3 cánh module, thiết kế nhiều ngăn thông minh.</p>', features: ['3 cánh mở', '6 ngăn + 2 thanh treo', 'Module mở rộng'], colors: ['Trắng', 'Vân Sồi'], status: 'IN_STOCK', rating: 4.7, reviewCount: 89, sku: 'MODI-WD-001' },
        { name: 'Sofa Module LUNA L-Shape', slug: 'sofa-luna-l', category: 'LIVING_ROOM', material: 'FABRIC', dimensions: '2600 × 1700 × 850mm', price: 18500000, salePrice: 14900000, description: '<p>Sofa góc L module, đệm bọc vải cao cấp, khung gỗ chắc chắn.</p>', features: ['Tách rời linh hoạt', 'Vải chống bám bẩn', 'Đệm mút D40'], colors: ['Xám Đậm', 'Be', 'Xanh Navy'], status: 'IN_STOCK', rating: 4.9, reviewCount: 67, sku: 'MODI-SF-001' },
        { name: 'Kệ TV Module ZENITH', slug: 'ke-tv-zenith', category: 'LIVING_ROOM', material: 'MDF', dimensions: '1600 × 400 × 500mm', price: 5900000, description: '<p>Kệ TV treo tường module, thiết kế Scandinavian hiện đại.</p>', features: ['Treo tường/đặt sàn', 'Giấu dây điện', 'Chịu tải 80kg'], colors: ['Trắng-Sồi', 'Đen-Walnut'], status: 'IN_STOCK', rating: 4.6, reviewCount: 45, sku: 'MODI-TV-001' },
        { name: 'Combo Phòng Ngủ SAKURA', slug: 'combo-phong-ngu-sakura', category: 'COMBO', material: 'MDF', dimensions: 'Giường + Tủ + Bàn + Tab', price: 35000000, salePrice: 24900000, description: '<p>Combo 4 món cho phòng ngủ hoàn chỉnh. Tiết kiệm 30%.</p>', features: ['4 món đồng bộ', 'Tiết kiệm 30%', 'Tặng lắp đặt'], colors: ['Trắng', 'Vân Sồi'], status: 'IN_STOCK', rating: 4.9, reviewCount: 203, sku: 'MODI-CB-001' },
        { name: 'Bàn Làm Việc FLEXI', slug: 'ban-flexi', category: 'SMART', material: 'MIXED', dimensions: '1200 × 600 × 750mm', price: 7900000, salePrice: 5990000, description: '<p>Bàn làm việc nâng hạ điện, tích hợp sạc không dây.</p>', features: ['Nâng hạ điện', 'Sạc không dây', 'Nhớ 3 vị trí'], colors: ['Trắng', 'Đen'], status: 'PRE_ORDER', rating: 4.8, reviewCount: 52, sku: 'MODI-DK-001' },
        { name: 'Combo Căn Hộ Studio URBAN', slug: 'combo-studio-urban', category: 'APARTMENT', material: 'MFC', dimensions: 'Full nội thất 25-35m²', price: 65000000, salePrice: 49900000, description: '<p>Gói nội thất trọn bộ cho căn hộ studio 25-35m².</p>', features: ['Trọn bộ 8 món', 'Tối ưu 25-35m²', 'Tặng thiết kế 3D'], colors: ['Tone Trắng-Sồi', 'Tone Xám-Walnut'], status: 'IN_STOCK', rating: 4.7, reviewCount: 31, sku: 'MODI-APT-001' },
        { name: 'Giá Sách Module HEXA', slug: 'gia-sach-hexa', category: 'SMART', material: 'MDF', dimensions: '400 × 350 × 400mm (mỗi ô)', price: 890000, description: '<p>Giá sách lục giác module, ghép tùy ý theo tường.</p>', features: ['Ghép tùy ý', 'Nhiều màu', 'Nam châm kết nối'], colors: ['Trắng', 'Hồng', 'Xanh Mint', 'Vân Gỗ'], status: 'IN_STOCK', rating: 4.5, reviewCount: 178, sku: 'MODI-SH-001' },
    ];

    let okP = 0;
    for (const p of products) if (await seed('modi_products', p)) okP++;

    console.log('\n\n🌱 Seeding blog...');
    const blogs = [
        { title: '5 Xu Hướng Nội Thất Module 2026', slug: '5-xu-huong-noi-that-module-2026', excerpt: 'Nội thất module đang thay đổi cách người Việt trang trí nhà.', content: '<h2>1. Tối giản là vua</h2><p>Minimalism đang trở thành lối sống. Nội thất module với đường nét gọn gàng chiếm lĩnh căn hộ hiện đại.</p>', status: 'published', views: 1240, tags: ['xu hướng', '2026'] },
        { title: 'Cách Bố Trí Phòng Ngủ Nhỏ 10m²', slug: 'bo-tri-phong-ngu-nho-10m2', excerpt: 'Bí quyết tối ưu phòng ngủ 10m².', content: '<h2>Nguyên tắc vàng: Không gian đa năng</h2><p>Mọi món đồ phải phục vụ ít nhất 2 mục đích.</p>', status: 'published', views: 890, tags: ['phòng ngủ nhỏ', 'tips'] },
        { title: 'Smart Furniture — Tương Lai Nội Thất Việt', slug: 'smart-furniture-tuong-lai', excerpt: 'Smart furniture đang về Việt Nam với giá hợp lý.', content: '<h2>Smart Furniture là gì?</h2><p>Đồ nội thất tích hợp công nghệ để nâng cao trải nghiệm.</p>', status: 'draft', views: 0, tags: ['smart furniture'] },
    ];

    let okB = 0;
    for (const b of blogs) if (await seed('modi_blog', b)) okB++;

    console.log(`\n\n🎉 Done! ${okP}/8 products, ${okB}/3 blog posts`);
    console.log('👉 Check: https://db.mkg.vn/_/');
}

main().catch(e => { console.error('\n❌', e.message); process.exit(1); });
