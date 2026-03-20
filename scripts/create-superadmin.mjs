// Tạo user Super Admin cho MODI
// Chạy: node scripts/create-superadmin.mjs

import PocketBase from 'pocketbase';

const PB_URL = 'https://db.mkg.vn';
const ADMIN_EMAIL = 'quy28181818@gmail.com';
const ADMIN_PASS = '@Mkg201444';

const pb = new PocketBase(PB_URL);

async function main() {
    console.log('🔐 Đang đăng nhập admin PocketBase...');
    await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);
    console.log('✅ Đăng nhập thành công\n');

    // Thông tin Super Admin
    const superAdmin = {
        email: 'admin@modi.vn',
        password: 'Admin@modi2026',
        passwordConfirm: 'Admin@modi2026',
        name: 'Super Admin MODI',
        phone: '0123456789',
        role: 'ADMIN',
    };

    console.log('👤 Đang tạo Super Admin...');
    console.log(`   Email: ${superAdmin.email}`);
    console.log(`   Password: ${superAdmin.password}`);
    console.log(`   Role: ${superAdmin.role}\n`);

    try {
        // Kiểm tra xem user đã tồn tại chưa
        try {
            const existing = await pb.collection('modi_auth').getFirstListItem(`email="${superAdmin.email}"`);
            if (existing) {
                console.log('⚠️  User đã tồn tại! Đang cập nhật role thành ADMIN...');
                await pb.collection('modi_auth').update(existing.id, { role: 'ADMIN' });
                console.log('✅ Đã cập nhật role thành ADMIN');
                console.log(`   ID: ${existing.id}`);
                return;
            }
        } catch {
            // User chưa tồn tại, tiếp tục tạo mới
        }

        const record = await pb.collection('modi_auth').create(superAdmin);
        console.log('🎉 Tạo Super Admin thành công!');
        console.log(`   ID: ${record.id}`);
        console.log(`   Email: ${record.email}`);
        console.log(`   Role: ${record.role}`);
    } catch (e) {
        console.error('❌ Lỗi:', e.message);
        if (e.response?.data) {
            console.error('   Chi tiết:', JSON.stringify(e.response.data, null, 2));
        }
    }

    console.log('\n📋 Thông tin đăng nhập:');
    console.log('   Email: admin@modi.vn');
    console.log('   Password: Admin@modi2026');
    console.log('   Role: ADMIN (Super Admin)');
}

main().catch(e => { console.error('\n❌', e.message); process.exit(1); });
