import { pool } from '../backend/server.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  try {
    console.log('🚀 Iniciando migration: Atualizar perfis de usuário...\n');

    // Ler arquivo SQL
    const sqlPath = path.join(__dirname, 'migrations', 'update-user-roles.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Executar migration
    await pool.query(sql);

    console.log('✅ Migration executada com sucesso!');
    console.log('\n📋 Perfis atualizados:');
    console.log('   ❌ Removidos: RH, SEGURANCA_TRABALHO');
    console.log('   ✅ Adicionado: USUARIO');
    console.log('\n📊 Perfis disponíveis agora:');
    console.log('   1. ADMINISTRADOR');
    console.log('   2. GESTOR');
    console.log('   3. COLABORADOR');
    console.log('   4. USUARIO\n');

    // Verificar usuários atualizados
    const result = await pool.query(
      'SELECT role, COUNT(*) as total FROM users GROUP BY role ORDER BY role'
    );
    
    console.log('✅ Distribuição de usuários por perfil:');
    result.rows.forEach((row) => {
      console.log(`   - ${row.role}: ${row.total} usuário(s)`);
    });

    console.log('\n✨ Sistema atualizado com sucesso!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao executar migration:', error);
    process.exit(1);
  }
}

runMigration();

