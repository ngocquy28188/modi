// Direct REST API approach to add fields to modi_auth collection
const PB_URL = 'https://db.mkg.vn';
const ADMIN_EMAIL = 'quy28181818@gmail.com';
const ADMIN_PASS = '@Mkg201444';

async function main() {
    // 1. Login as PB superadmin
    console.log('🔐 Logging in...');
    const loginRes = await fetch(`${PB_URL}/api/admins/auth-with-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identity: ADMIN_EMAIL, password: ADMIN_PASS }),
    });

    if (!loginRes.ok) {
        // Try the new PB v0.23+ superuser auth endpoint
        const loginRes2 = await fetch(`${PB_URL}/api/collections/_superusers/auth-with-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identity: ADMIN_EMAIL, password: ADMIN_PASS }),
        });
        if (!loginRes2.ok) {
            console.error('❌ Login failed with both endpoints');
            console.error(await loginRes.text());
            console.error(await loginRes2.text());
            return;
        }
        var loginData = await loginRes2.json();
    } else {
        var loginData = await loginRes.json();
    }

    const token = loginData.token;
    console.log('✅ Token acquired\n');
    const headers = { 'Authorization': token, 'Content-Type': 'application/json' };

    // 2. Get collection details
    console.log('📋 Fetching modi_auth collection...');
    const colRes = await fetch(`${PB_URL}/api/collections/modi_auth`, { headers });
    const col = await colRes.json();
    console.log('   ID:', col.id);
    console.log('   Type:', col.type);
    console.log('   Fields:', JSON.stringify(col.fields?.map(f => f.name + ':' + f.type) || col.schema?.map(f => f.name + ':' + f.type)));

    // Print the full collection JSON structure to understand the format
    console.log('\n   === Full collection structure (trimmed) ===');
    const { fields, schema, ...rest } = col;
    console.log('   Rest keys:', Object.keys(rest).join(', '));
    if (fields) {
        console.log('   Uses "fields" key');
        console.log('   Fields count:', fields.length);
        // Show first field structure as example
        if (fields.length > 0) {
            console.log('   Example field:', JSON.stringify(fields[0]));
        }
    }
    if (schema) {
        console.log('   Uses "schema" key');
        console.log('   Schema count:', schema.length);
        if (schema.length > 0) {
            console.log('   Example field:', JSON.stringify(schema[0]));
        }
    }

    // 3. Build updated fields
    const existingFields = fields || schema || [];
    const existingNames = existingFields.map(f => f.name);

    const customFields = [];
    if (!existingNames.includes('fullName')) {
        customFields.push({ name: 'fullName', type: 'text' });
    }
    if (!existingNames.includes('phone')) {
        customFields.push({ name: 'phone', type: 'text' });
    }
    if (!existingNames.includes('address')) {
        customFields.push({ name: 'address', type: 'text' });
    }
    if (!existingNames.includes('role')) {
        customFields.push({ name: 'role', type: 'select', values: ['CUSTOMER', 'ADMIN'], maxSelect: 1 });
    }

    if (customFields.length === 0) {
        console.log('   ✅ All fields already exist');
    } else {
        console.log('\n   Fields to add:', customFields.map(f => f.name).join(', '));

        const updatedFields = [...existingFields, ...customFields];

        // Try PATCH with fields
        console.log('\n📝 Updating collection...');
        const key = fields ? 'fields' : 'schema';
        const body = JSON.stringify({ [key]: updatedFields });
        console.log('   Using key:', key);
        console.log('   Body preview:', body.substring(0, 200) + '...');

        const updateRes = await fetch(`${PB_URL}/api/collections/modi_auth`, {
            method: 'PATCH',
            headers,
            body,
        });

        if (updateRes.ok) {
            const updated = await updateRes.json();
            console.log('   ✅ Updated! New fields:', (updated.fields || updated.schema || []).map(f => f.name + ':' + f.type).join(', '));
        } else {
            const err = await updateRes.text();
            console.error('   ❌ Update failed:', updateRes.status, err);
        }
    }

    // 4. Set admin role
    console.log('\n👤 Finding admin user...');
    const usersRes = await fetch(`${PB_URL}/api/collections/modi_auth/records?filter=(email='admin@modi.vn')`, { headers });
    const usersData = await usersRes.json();

    if (usersData.items?.length > 0) {
        const userId = usersData.items[0].id;
        console.log('   Found:', userId);
        console.log('   Current data:', JSON.stringify(usersData.items[0]));

        const patchRes = await fetch(`${PB_URL}/api/collections/modi_auth/records/${userId}`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({ role: 'ADMIN', fullName: 'Super Admin MODI' }),
        });

        if (patchRes.ok) {
            const patched = await patchRes.json();
            console.log('   ✅ Updated role:', patched.role);
            console.log('   ✅ Updated fullName:', patched.fullName);
        } else {
            console.error('   ❌ Patch failed:', patchRes.status, await patchRes.text());
        }
    } else {
        console.log('   ⚠️ admin@modi.vn not found');
    }

    console.log('\n🎉 Done!');
}

main().catch(e => console.error('❌', e));
