const { createClient } = require('@supabase/supabase-js');
require('dotenv/config');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY são obrigatórias');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdminUser() {
  console.log('🔧 Criando usuário administrador...');

  try {
    // Try different email for admin
    const { data, error } = await supabase.auth.signUp({
      email: 'admin@paretoingles.com',
      password: 'Admin123!',
      options: {
        data: {
          name: 'Master Admin',
          role: 'master'
        }
      }
    });

    if (error) {
      console.error('❌ Erro ao criar usuário:', error.message);
      return;
    }

    console.log('✅ Usuário admin criado com sucesso!');
    console.log('📧 Email:', 'admin@paretoingles.com');
    console.log('🔑 Senha:', 'Admin123!');
    console.log('👤 Role:', 'master');
    console.log('🆔 ID:', data.user?.id);

    if (data.user && !data.user.email_confirmed_at) {
      console.log('⚠️  Email não confirmado. Confirme manualmente no painel do Supabase ou configure SMTP.');
    }

  } catch (err) {
    console.error('❌ Erro inesperado:', err);
  }
}

createAdminUser();