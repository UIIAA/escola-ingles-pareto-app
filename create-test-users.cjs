const { createClient } = require('@supabase/supabase-js');
require('dotenv/config');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY são obrigatórias');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTestUsers() {
  console.log('🎯 Criando usuários de teste para o sistema...\n');

  // Usuário Professor
  console.log('👨‍🏫 Criando usuário PROFESSOR...');
  try {
    const { data: teacherData, error: teacherError } = await supabase.auth.signUp({
      email: 'testeprofessor@inglespareto.com.br',
      password: 'Professor123!',
      options: {
        data: {
          name: 'Prof. João Silva',
          role: 'teacher',
          full_name: 'Prof. João Silva',
          avatar_url: 'https://api.dicebear.com/7.x/initials/svg?seed=Professor'
        }
      }
    });

    if (teacherError) {
      console.error('❌ Erro ao criar professor:', teacherError.message);
    } else {
      console.log('✅ PROFESSOR criado com sucesso!');
      console.log('📧 Email: testeprofessor@inglespareto.com.br');
      console.log('🔑 Senha: Professor123!');
      console.log('👤 Role: teacher');
      console.log('🆔 ID:', teacherData.user?.id);
      console.log('');
    }
  } catch (err) {
    console.error('❌ Erro inesperado ao criar professor:', err);
  }

  // Usuário Aluno
  console.log('👨‍🎓 Criando usuário ALUNO...');
  try {
    const { data: studentData, error: studentError } = await supabase.auth.signUp({
      email: 'testealuno@inglespareto.com.br',
      password: 'Aluno123!',
      options: {
        data: {
          name: 'Maria Santos',
          role: 'student',
          full_name: 'Maria Santos',
          avatar_url: 'https://api.dicebear.com/7.x/initials/svg?seed=Student'
        }
      }
    });

    if (studentError) {
      console.error('❌ Erro ao criar aluno:', studentError.message);
    } else {
      console.log('✅ ALUNO criado com sucesso!');
      console.log('📧 Email: testealuno@inglespareto.com.br');
      console.log('🔑 Senha: Aluno123!');
      console.log('👤 Role: student');
      console.log('🆔 ID:', studentData.user?.id);
      console.log('');
    }
  } catch (err) {
    console.error('❌ Erro inesperado ao criar aluno:', err);
  }

  console.log('🎉 USUÁRIOS DE TESTE CRIADOS!');
  console.log('');
  console.log('📋 RESUMO DOS USUÁRIOS:');
  console.log('');
  console.log('👨‍🏫 PROFESSOR:');
  console.log('   📧 Email: testeprofessor@inglespareto.com.br');
  console.log('   🔑 Senha: Professor123!');
  console.log('   🎯 Acesso: Dashboard do Professor, Configurar Aulas, Ver Alunos');
  console.log('');
  console.log('👨‍🎓 ALUNO:');
  console.log('   📧 Email: testealuno@inglespareto.com.br');
  console.log('   🔑 Senha: Aluno123!');
  console.log('   🎯 Acesso: Agendar Aulas, Comprar Créditos, Fórum, AI Chat');
  console.log('');
  console.log('⚠️  IMPORTANTE:');
  console.log('   • Se os emails não estiverem confirmados, confirme manualmente no Supabase');
  console.log('   • Ou configure SMTP para confirmação automática');
  console.log('   • Acesse: http://localhost:5177/login para testar');
  console.log('');
  console.log('🧪 FLUXO DE TESTE COMPLETO:');
  console.log('   1. Login como ALUNO → Comprar créditos → Agendar aula');
  console.log('   2. Login como PROFESSOR → Ver dashboard → Configurar disponibilidade');
  console.log('   3. Testar busca "turismo" → Ver novos resultados');
  console.log('   4. Testar fórum → Criar tópicos → Responder');
  console.log('   5. Testar AI Chat → Diferentes modos de conversação');
}

createTestUsers();