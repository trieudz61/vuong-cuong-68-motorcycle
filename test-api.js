// Script test API để kiểm tra CRUD operations
// Chạy: node test-api.js

const BASE_URL = 'http://localhost:3000';

async function testAPI() {
  console.log('🧪 Testing Motorcycle API...\n');

  try {
    // Test GET - Lấy danh sách xe
    console.log('1. Testing GET /api/motorcycles');
    const getResponse = await fetch(`${BASE_URL}/api/motorcycles`);
    const getResult = await getResponse.json();
    console.log(`✅ GET Success: ${getResult.motorcycles?.length || 0} motorcycles found\n`);

    // Test POST - Tạo xe mới (cần admin auth)
    console.log('2. Testing POST /api/motorcycles');
    const testMotorcycle = {
      title: 'Test Motorcycle API',
      brand: 'Honda',
      model: 'Wave',
      year: 2023,
      condition: 'Mới',
      mileage: 0,
      engine_capacity: 110,
      fuel_type: 'Xăng',
      color: 'Đỏ',
      price: 25000000,
      description: 'Test motorcycle for API',
      images: [],
      contact_phone: '0941231619',
      contact_address: '06 Lý Thường Kiệt - Phường Thành Vinh - Nghệ An'
    };

    const postResponse = await fetch(`${BASE_URL}/api/motorcycles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testMotorcycle)
    });

    if (postResponse.ok) {
      const postResult = await postResponse.json();
      console.log(`✅ POST Success: Created motorcycle with ID ${postResult.id}`);
      console.log(`   Display ID: #${String(postResult.display_id || 0).padStart(4, '0')}\n`);

      // Test PUT - Cập nhật xe
      console.log('3. Testing PUT /api/motorcycles/[id]');
      const putResponse = await fetch(`${BASE_URL}/api/motorcycles/${postResult.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_sold: true })
      });

      if (putResponse.ok) {
        const putResult = await putResponse.json();
        console.log(`✅ PUT Success: Updated motorcycle status to sold: ${putResult.is_sold}\n`);
      } else {
        const putError = await putResponse.json();
        console.log(`❌ PUT Failed: ${putError.error}\n`);
      }

      // Test DELETE - Xóa xe
      console.log('4. Testing DELETE /api/motorcycles/[id]');
      const deleteResponse = await fetch(`${BASE_URL}/api/motorcycles/${postResult.id}`, {
        method: 'DELETE'
      });

      if (deleteResponse.ok) {
        console.log(`✅ DELETE Success: Deleted motorcycle ${postResult.id}\n`);
      } else {
        const deleteError = await deleteResponse.json();
        console.log(`❌ DELETE Failed: ${deleteError.error}\n`);
      }

    } else {
      const postError = await postResponse.json();
      console.log(`❌ POST Failed: ${postError.error}`);
      console.log('   Note: POST requires admin authentication\n');
    }

  } catch (error) {
    console.error('❌ API Test Error:', error.message);
  }

  console.log('🏁 API Test Complete');
}

testAPI();