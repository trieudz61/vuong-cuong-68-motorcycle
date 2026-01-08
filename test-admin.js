// Script test admin authentication và CRUD operations
// Chạy: node test-admin.js

const BASE_URL = 'http://localhost:3000';

async function testAdminAuth() {
  console.log('🔐 Testing Admin Authentication...\n');

  try {
    // Test 1: Kiểm tra admin login endpoint
    console.log('1. Testing admin login');
    const loginResponse = await fetch(`${BASE_URL}/api/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@gmail.com',
        password: 'admin123'
      })
    });

    if (loginResponse.ok) {
      const loginResult = await loginResponse.json();
      console.log('✅ Admin login successful');
      console.log(`   User: ${loginResult.user?.email}`);
      console.log(`   Role: ${loginResult.user?.role || 'N/A'}\n`);
    } else {
      const loginError = await loginResponse.json();
      console.log(`❌ Admin login failed: ${loginError.error}\n`);
    }

    // Test 2: Kiểm tra API với admin operations
    console.log('2. Testing admin CRUD operations');
    
    // Test tạo xe mới
    const testMotorcycle = {
      title: 'Admin Test Motorcycle',
      brand: 'Yamaha',
      model: 'Exciter',
      year: 2024,
      condition: 'Mới',
      mileage: 0,
      engine_capacity: 155,
      fuel_type: 'Xăng',
      color: 'Xanh',
      price: 50000000,
      description: 'Test motorcycle từ admin',
      images: [],
      contact_phone: '0941231619',
      contact_address: '06 Lý Thường Kiệt - Phường Thành Vinh - Nghệ An'
    };

    const createResponse = await fetch(`${BASE_URL}/api/motorcycles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testMotorcycle)
    });

    if (createResponse.ok) {
      const createResult = await createResponse.json();
      console.log(`✅ Create motorcycle success: ID ${createResult.id}`);
      
      // Test cập nhật
      const updateResponse = await fetch(`${BASE_URL}/api/motorcycles/${createResult.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          title: 'Updated Admin Test Motorcycle',
          is_sold: true 
        })
      });

      if (updateResponse.ok) {
        console.log('✅ Update motorcycle success');
      } else {
        const updateError = await updateResponse.json();
        console.log(`❌ Update failed: ${updateError.error}`);
      }

      // Test xóa
      const deleteResponse = await fetch(`${BASE_URL}/api/motorcycles/${createResult.id}`, {
        method: 'DELETE'
      });

      if (deleteResponse.ok) {
        console.log('✅ Delete motorcycle success');
      } else {
        const deleteError = await deleteResponse.json();
        console.log(`❌ Delete failed: ${deleteError.error}`);
      }

    } else {
      const createError = await createResponse.json();
      console.log(`❌ Create motorcycle failed: ${createError.error}`);
    }

  } catch (error) {
    console.error('❌ Admin test error:', error.message);
  }

  console.log('\n🏁 Admin Test Complete');
}

testAdminAuth();