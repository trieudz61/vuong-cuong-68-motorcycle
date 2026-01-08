// Script để kiểm tra display_id trong database
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkDisplayId() {
  console.log('🔍 Checking Display ID in Database...\n');

  try {
    // Lấy tất cả xe máy với display_id
    const { data: motorcycles, error } = await supabase
      .from('motorcycles')
      .select('id, title, display_id, created_at')
      .order('display_id', { ascending: true });

    if (error) {
      console.error('❌ Error fetching motorcycles:', error.message);
      return;
    }

    console.log(`✅ Found ${motorcycles.length} motorcycles:\n`);

    motorcycles.forEach((motorcycle, index) => {
      const displayId = motorcycle.display_id ? `#${String(motorcycle.display_id).padStart(4, '0')}` : 'NO ID';
      console.log(`${index + 1}. ${displayId} - ${motorcycle.title}`);
      console.log(`   ID: ${motorcycle.id}`);
      console.log(`   Created: ${new Date(motorcycle.created_at).toLocaleString('vi-VN')}\n`);
    });

    // Kiểm tra sequence hiện tại
    const { data: sequenceData, error: seqError } = await supabase
      .rpc('get_sequence_value', { sequence_name: 'motorcycles_display_id_seq' });

    if (!seqError && sequenceData) {
      console.log(`📊 Current sequence value: ${sequenceData}`);
    }

    // Kiểm tra có duplicate display_id không
    const displayIds = motorcycles.map(m => m.display_id).filter(Boolean);
    const uniqueIds = [...new Set(displayIds)];
    
    if (displayIds.length !== uniqueIds.length) {
      console.log('⚠️  Warning: Found duplicate display_id values!');
    } else {
      console.log('✅ All display_id values are unique');
    }

  } catch (error) {
    console.error('❌ Script error:', error.message);
  }

  console.log('\n🏁 Check Display ID Complete');
}

checkDisplayId();