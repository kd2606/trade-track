// Test script for Phase 2 features
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Test database connection and schema
async function testDatabase() {
  console.log('🔍 Testing database connection...');
  
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    
    // Test products table exists
    const { data, error } = await supabase
      .from('products')
      .select('count')
      .limit(1);
      
    if (error) {
      console.log('❌ Products table error:', error.message);
      console.log('💡 Please run the SQL schema from DATABASE_SETUP.md');
    } else {
      console.log('✅ Products table exists and accessible');
    }
    
    // Test enhanced transactions table
    const { data: txData, error: txError } = await supabase
      .from('transactions')
      .select('product_name, cost_price, selling_price, quantity')
      .limit(1);
      
    if (txError) {
      console.log('❌ Transactions table enhancement error:', txError.message);
      console.log('💡 Please run the SQL schema from DATABASE_SETUP.md');
    } else {
      console.log('✅ Transactions table enhanced successfully');
    }
    
  } catch (error) {
    console.log('❌ Database connection error:', error.message);
  }
}

// Test invoice generation
async function testInvoiceGeneration() {
  console.log('🔍 Testing invoice generation...');
  
  try {
    const jsPDF = require('jspdf');
    console.log('✅ jsPDF library loaded successfully');
    
    // Test basic PDF creation
    const doc = new jsPDF();
    doc.text('Test Invoice', 10, 10);
    console.log('✅ PDF creation test passed');
    
  } catch (error) {
    console.log('❌ Invoice generation error:', error.message);
  }
}

// Test API endpoints
async function testAPIEndpoints() {
  console.log('🔍 Testing API endpoints...');
  
  try {
    // Test products endpoint (should return 401 without auth)
    const response = await fetch('http://localhost:3000/api/products');
    if (response.status === 401) {
      console.log('✅ Products API endpoint secured properly');
    } else {
      console.log('⚠️ Products API endpoint may not be secured');
    }
    
  } catch (error) {
    console.log('❌ API endpoint test error:', error.message);
    console.log('💡 Make sure the development server is running');
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting Phase 2 Feature Tests\n');
  
  await testDatabase();
  console.log('');
  await testInvoiceGeneration();
  console.log('');
  await testAPIEndpoints();
  
  console.log('\n✨ Phase 2 testing complete!');
  console.log('📝 Check the results above and fix any issues before proceeding.');
}

runTests().catch(console.error);
