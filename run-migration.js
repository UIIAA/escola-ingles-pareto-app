#!/usr/bin/env node

/**
 * Migration Runner for Supabase
 * Run forum schema migration directly
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Supabase configuration
const supabaseUrl = 'https://agbrdfuelvvqbvcytqvc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnYnJkZnVlbHZ2cWJ2Y3l0cXZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MDI3NjcsImV4cCI6MjA3MzM3ODc2N30.kETaZM0nVnoOGEb_KbMadKVwv8gHRVsxXnnYvUWsdFw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  console.log('🚀 Starting forum schema migration...');

  try {
    // Read the migration file
    const migrationPath = join(__dirname, 'migrations', '001_forum_schema.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf-8');

    console.log('📄 Migration file loaded');
    console.log('🔄 Executing migration...');

    // Execute the migration
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: migrationSQL
    });

    if (error) {
      console.error('❌ Migration failed:', error);
      process.exit(1);
    }

    console.log('✅ Migration completed successfully!');
    console.log('📊 Result:', data);

    // Verify tables were created
    console.log('🔍 Verifying tables...');

    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['forum_topics', 'forum_replies', 'forum_votes']);

    if (tablesError) {
      console.warn('⚠️ Could not verify tables:', tablesError);
    } else {
      console.log('✅ Tables verified:', tables.map(t => t.table_name));
    }

  } catch (err) {
    console.error('💥 Unexpected error:', err);
    process.exit(1);
  }
}

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigration();
}

export { runMigration };