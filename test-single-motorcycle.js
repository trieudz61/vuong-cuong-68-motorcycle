// Test single motorcycle API
const BASE_URL = 'http://localhost:3000';

async function testSingleMotorcycle() {
  console.log('🔍 Testing Single Motorcycle API...\n');

  try {
    // Test specific motorcycle
    const motorcycleId = '5aa5d058-ce39-4d14-95eb-9701443937e6';
    console.log(`Testing motorcycle ID: ${motorcycleId}`);
    
    const response = await fetch(`${BASE_URL}/api/motorcycles/${motorcycleId}`);
    
    if (!response.ok) {
      console.log(`❌ API Error: ${response.status} ${response.statusText}`);
      return;
    }

    const motorcycle = await response.json();
    
    console.log('✅ Motorcycle data:');
    console.log(`   Title: ${motorcycle.title}`);
    console.log(`   Brand: ${motorcycle.brand} ${motorcycle.model}`);
    console.log(`   Year: ${motorcycle.year}`);
    console.log(`   Price: ${motorcycle.price?.toLocaleString('vi-VN')} đ`);
    console.log(`   Display ID: ${motorcycle.display_id ? `#${String(motorcycle.display_id).padStart(4, '0')}` : 'NO DISPLAY_ID'}`);
    console.log(`   Is Sold: ${motorcycle.is_sold ? 'Yes' : 'No'}`);
    console.log(`   Images: ${motorcycle.images?.length || 0} images`);
    
    if (motorcycle.display_id) {
      console.log(`\n🏷️ Mã Xe hiển thị: #${String(motorcycle.display_id).padStart(4, '0')}`);
    } else {
      console.log('\n⚠️  Không có display_id trong response!');
    }

  } catch (error) {
    console.error('❌ Test error:', error.message);
  }

  console.log('\n🏁 Test Complete');
}

testSingleMotorcycle();