// Script để kiểm tra và sửa admin user role
// Chạy: node fix-admin-user.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Sử dụng Service Role Key
);

async function fixAdminUser() {
  console.log('🔧 Fixing Admin User...\n');

  try {
    // 1. Kiểm tra user trong auth.users
    console.log('1. Checking auth.users table...');
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Error fetching auth users:', authError.message);
      return;
    }

    const adminAuthUser = authUsers.users.find(u => u.email === 'admin@gmail.com');
    
    if (!adminAuthUser) {
      console.log('❌ Admin user not found in auth.users');
      console.log('   Please create admin user first in Supabase Dashboard:');
      console.log('   Email: admin@gmail.com');
      console.log('   Password: admin123');
      return;
    }

    console.log(`✅ Found admin user in auth.users: ${adminAuthUser.id}`);

    // 2. Kiểm tra user trong public.users
    console.log('\n2. Checking public.users table...');
    const { data: publicUsers, error: publicError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'admin@gmail.com');

    if (publicError) {
      console.error('❌ Error fetching public users:', publicError.message);
      return;
    }

    if (publicUsers.length === 0) {
      console.log('⚠️  Admin user not found in public.users, creating...');
      
      // Tạo record trong public.users
      const { data: insertData, error: insertError } = await supabase
        .from('users')
        .insert({
          id: adminAuthUser.id,
          email: 'admin@gmail.com',
          role: 'admin'
        })
        .select()
        .single();

      if (insertError) {
        console.error('❌ Error creating admin user:', insertError.message);
        return;
      }

      console.log('✅ Created admin user in public.users');
      console.log(`   ID: ${insertData.id}`);
      console.log(`   Email: ${insertData.email}`);
      console.log(`   Role: ${insertData.role}`);
    } else {
      const adminUser = publicUsers[0];
      console.log(`✅ Found admin user in public.users: ${adminUser.role}`);

      if (adminUser.role !== 'admin') {
        console.log('⚠️  Admin user role is not "admin", updating...');
        
        const { data: updateData, error: updateError } = await supabase
          .from('users')
          .update({ role: 'admin' })
          .eq('id', adminUser.id)
          .select()
          .single();

        if (updateError) {
          console.error('❌ Error updating admin role:', updateError.message);
          return;
        }

        console.log('✅ Updated admin user role to "admin"');
      }
    }

    // 3. Kiểm tra lại kết quả cuối cùng
    console.log('\n3. Final verification...');
    const { data: finalCheck, error: finalError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'admin@gmail.com');

    if (finalError) {
      console.error('❌ Error in final check:', finalError.message);
      return;
    }

    if (finalCheck && finalCheck.length > 0) {
      const adminUser = finalCheck[0];
      console.log('✅ Admin user setup complete:');
      console.log(`   ID: ${adminUser.id}`);
      console.log(`   Email: ${adminUser.email}`);
      console.log(`   Role: ${adminUser.role}`);
      console.log(`   Created: ${adminUser.created_at}`);
    } else {
      console.log('❌ Admin user not found in final check');
    }

  } catch (error) {
    console.error('❌ Script error:', error.message);
  }

  console.log('\n🏁 Fix Admin User Complete');
}

fixAdminUser();