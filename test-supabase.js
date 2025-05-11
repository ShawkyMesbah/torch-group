require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'https://ttzulxpncujgizidgwxk.supabase.co';
const supabaseKey = 'YOUR_SUPABASE_KEY'; // Replace with your actual key

console.log('Supabase URL:', supabaseUrl);
console.log('Testing Supabase connection...');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // Test if we can connect to Supabase
    const { data, error } = await supabase.from('_prisma_migrations').select('*').limit(1);
    
    if (error) {
      console.error('Connection error:', error);
    } else {
      console.log('Successfully connected to Supabase!');
      console.log('Data:', data);
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

testConnection(); 