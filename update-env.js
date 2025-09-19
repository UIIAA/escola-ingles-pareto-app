import fs from 'fs';
import path from 'path';

// Função para atualizar variáveis no arquivo .env
export function updateEnvFile(variables) {
  try {
    const envPath = path.join(process.cwd(), '.env');

    // Lê o arquivo .env atual
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }

    // Função para atualizar ou adicionar variável
    const updateEnvVar = (content, key, value) => {
      const regex = new RegExp(`^${key}=.*$`, 'm');
      const newLine = `${key}=${value}`;

      if (regex.test(content)) {
        return content.replace(regex, newLine);
      } else {
        return content + (content.endsWith('\n') || content === '' ? '' : '\n') + newLine + '\n';
      }
    };

    // Atualiza cada variável
    for (const [key, value] of Object.entries(variables)) {
      if (value) {
        envContent = updateEnvVar(envContent, key, value);
      }
    }

    // Salva o arquivo .env
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Arquivo .env atualizado com sucesso!');
    return true;
  } catch (error) {
    console.error('❌ Erro ao atualizar .env:', error);
    return false;
  }
}

// Se executado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  // Exemplo de uso
  const newVars = {
    VITE_GOOGLE_API_KEY: process.argv[2] || '',
    VITE_GOOGLE_CLIENT_ID: process.argv[3] || '',
    VITE_GOOGLE_CLIENT_SECRET: process.argv[4] || ''
  };

  updateEnvFile(newVars);
}