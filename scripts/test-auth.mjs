// Quick test to check what PocketBase returns for admin@modi.vn
import PocketBase from 'pocketbase';

const pb = new PocketBase('https://db.mkg.vn');

async function main() {
    console.log('Testing auth for admin@modi.vn...\n');

    try {
        const result = await pb.collection('modi_auth').authWithPassword('admin@modi.vn', 'Admin@modi2026');
        console.log('=== AUTH RESPONSE ===');
        console.log('Token:', result.token ? 'YES' : 'NO');
        console.log('Record ID:', result.record.id);
        console.log('Record email:', result.record.email);
        console.log('Record name:', result.record.name);
        console.log('Record fullName:', result.record.fullName);
        console.log('Record role:', result.record.role);
        console.log('Record phone:', result.record.phone);
        console.log('\nFull record keys:', Object.keys(result.record));
        console.log('\nFull record:', JSON.stringify(result.record, null, 2));
    } catch (e) {
        console.error('Auth failed:', e.message);
        if (e.response) console.error('Response:', JSON.stringify(e.response, null, 2));
    }
}

main();
