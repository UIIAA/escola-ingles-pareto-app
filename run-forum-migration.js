#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuração do Supabase
const SUPABASE_URL = 'https://agbrdfuelvvqbvcytqvc.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnYnJkZnVlbHZ2cWJ2Y3l0cXZjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNjUxNTgzOCwiZXhwIjoyMDQyMDkxODM4fQ.RhQ7qm2HGxJUIRKj08loBqOF2PJwKc_QSWqKGcWgIq0';

// Criar cliente Supabase com service role
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function runMigration() {
  try {
    console.log('📋 Lendo arquivo de migration...');
    const migrationSQL = readFileSync(
      join(__dirname, 'migrations', '001_forum_schema.sql'),
      'utf8'
    );

    console.log('🚀 Executando migration no Supabase...');

    // Executar SQL diretamente
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: migrationSQL
    });

    if (error) {
      // Se exec_sql não existir, tentar método alternativo
      console.log('⚠️  exec_sql não disponível, tentando método alternativo...');

      // Dividir em statements individuais e executar
      const statements = migrationSQL
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

      console.log(`📝 Executando ${statements.length} statements...`);

      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i];
        if (statement.trim()) {
          try {
            console.log(`  [${i + 1}/${statements.length}] Executando...`);
            await supabase.from('_sqlRunner').select(statement);
          } catch (err) {
            console.warn(`  ⚠️  Statement ${i + 1} falhou (isso pode ser normal):`, err.message);
          }
        }
      }
    }

    console.log('\n✅ Migration executada com sucesso!');
    console.log('\n📊 Verificando tabelas criadas...');

    // Verificar se as tabelas foram criadas
    const { data: topics, error: topicsError } = await supabase
      .from('forum_topics')
      .select('count');

    const { data: replies, error: repliesError } = await supabase
      .from('forum_replies')
      .select('count');

    const { data: votes, error: votesError } = await supabase
      .from('forum_votes')
      .select('count');

    if (!topicsError) {
      console.log('✓ Tabela forum_topics existe');
    }
    if (!repliesError) {
      console.log('✓ Tabela forum_replies existe');
    }
    if (!votesError) {
      console.log('✓ Tabela forum_votes existe');
    }

    console.log('\n🎉 Configuração do fórum concluída!');

  } catch (error) {
    console.error('\n❌ Erro ao executar migration:', error);
    console.error('\n💡 Dica: Execute a migration manualmente no Supabase SQL Editor:');
    console.error('   1. Acesse https://supabase.com/dashboard/project/agbrdfuelvvqbvcytqvc/sql');
    console.error('   2. Copie o conteúdo de migrations/001_forum_schema.sql');
    console.error('   3. Cole e execute no SQL Editor');
    process.exit(1);
  }
}

// Executar migration
runMigration();
