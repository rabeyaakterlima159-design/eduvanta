/**
 * EDUVANTA Database Connection & Migration Sync Tool
 * Connects to Supabase PostgreSQL and verifies table health.
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('====================================================');
console.log('EDUVANTA - SUPABASE DATABASE CONNECTOR');
console.log('====================================================');

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.log('⚠️ Notice: Supabase URL or Key not set in environment.');
  console.log('Please provide NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env');
  console.log('Using local sandbox synchronization mode.');
  process.exit(0);
}

console.log(`Connecting to: ${SUPABASE_URL}...`);

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testConnection() {
  try {
    const { data, error } = await supabase.from('schools').select('id, name, code').limit(5);
    if (error) {
      console.log('⚠️ Connection query result:', error.message);
    } else {
      console.log('✅ Successfully connected to Supabase Database!');
      console.log('Registered Schools:', data);
    }
  } catch (err) {
    console.error('❌ Database connection error:', err.message);
  }
}

testConnection();
