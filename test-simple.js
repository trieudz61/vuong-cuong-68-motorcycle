// Script test đơn giản để kiểm tra API
const BASE_URL = 'http://localhost:3000';

async function testSimple() {
  console.log('🧪 Simple API Test...\n');

  try {
    // Test GET motorcycles
    console.log('1. Testing GET /api/motorcycles');
    const response = await fetch(`${BASE_URL}/api/motorcycles?showAll=true`);
    const result = await response.json();
    console.log(`✅ Found ${result.motorcycles?.length || 0} motorcycles\n`);

    // Test POST (create)
    console.log('2. Testing POST /api/motorcycles');
    const testData = {
      title: 'Test Xe Máy',
      brand: 'Honda',
      model: 'Wave',
      year: 2024,
      condition: 'Mới',
      mileage: 0,
      engine_capacity: 110,
      fuel_type: 'Xăng',
      color: 'Đỏ',
      price: 30000000,
      description: 'Test description',
      images: [],
      contact_phone: '0941231619',
      contact_address: '06 Lý Thường Kiệt - Phường Thành Vinh - Nghệ An'
    };

    const createResponse = await fetch(`${BASE_URL}/api/motorcycles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });

    if (createResponse.ok) {
      const created = await createResponse.json();
      console.log(`✅ Created motorcycle: ${created.id}`);
      
      // Test PUT (update)
      console.log('3. Testing PUT /api/motorcycles/[id]');
      const updateResponse = await fetch(`${BASE_URL}/api/motorcycles/${created.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_sold: true })
      });

      if (updateResponse.ok) {
        console.log('✅ Updated motorcycle');
      } else {
        const updateError = await updateResponse.json();
        console.log(`❌ Update failed: ${updateError.error}`);
      }

      // Test DELETE
      console.log('4. Testing DELETE /api/motorcycles/[id]');
      const deleteResponse = await fetch(`${BASE_URL}/api/motorcycles/${created.id}`, {
        method: 'DELETE'
      });

      if (deleteResponse.ok) {
        console.log('✅ Deleted motorcycle');
      } else {
        const deleteError = await deleteResponse.json();
        console.log(`❌ Delete failed: ${deleteError.error}`);
      }

    } else {
      const createError = await createResponse.json();
      console.log(`❌ Create failed: ${createError.error}`);
    }

  } catch (error) {
    console.error('❌ Test error:', error.message);
  }

  console.log('\n🏁 Test Complete');
}

testSimple();