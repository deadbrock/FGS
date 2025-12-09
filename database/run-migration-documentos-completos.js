import { pool } from '../backend/server.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  try {
    console.log('🚀 Iniciando migration: Adicionar documentos admissionais completos...\n');

    // Ler arquivo SQL
    const sqlPath = path.join(__dirname, 'migrations', 'add-documentos-admissionais-completos.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Executar migration
    await pool.query(sql);

    console.log('✅ Migration executada com sucesso!');
    console.log('\n📋 Documentos configurados:');
    console.log('   1. Foto 3x4');
    console.log('   2. CTPS Digital');
    console.log('   3. Identidade (Frente)');
    console.log('   4. Identidade (Verso)');
    console.log('   5. Comprovante de Residência');
    console.log('   6. Certidão Nascimento/Casamento');
    console.log('   7. Reservista (opcional)');
    console.log('   8. Título de Eleitor');
    console.log('   9. Antecedentes Criminais');
    console.log('   10. Certidão Dependente (opcional)');
    console.log('   11. CPF Dependente (opcional)\n');

    // Verificar documentos inseridos
    const result = await pool.query(
      'SELECT tipo_documento, nome_documento, obrigatorio FROM admissao_documentos_template ORDER BY ordem'
    );
    
    console.log('✅ Verificação no banco de dados:');
    result.rows.forEach((doc, index) => {
      const status = doc.obrigatorio ? '✓ Obrigatório' : '○ Opcional';
      console.log(`   ${index + 1}. ${doc.nome_documento} [${status}]`);
    });

    console.log('\n✨ Sistema pronto para receber documentos do Trabalhe Conosco!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao executar migration:', error);
    process.exit(1);
  }
}

runMigration();

