import fs from 'fs';

const correctUrl = 'postgresql://postgres:iqEKbzqatXJTMYfXEAwnJWSvAoSqjkGj@hopper.proxy.rlwy.net:26190/railway';

// Criar .env limpo (sem espaços extras)
fs.writeFileSync('.env', `DATABASE_URL=${correctUrl}\n`, 'utf8');

console.log('✅ Arquivo .env criado corretamente!');
console.log('📋 Conteúdo:');
console.log(`DATABASE_URL=${correctUrl}`);
console.log('\n🚀 Agora execute: node database/setup-database.js');

