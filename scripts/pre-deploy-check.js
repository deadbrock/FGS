#!/usr/bin/env node

/**
 * Script de verificação pré-deploy
 * Verifica se o projeto está pronto para deploy
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

console.log('🔍 Verificação pré-deploy iniciada...\n');

let errors = [];
let warnings = [];
let success = [];

// 1. Verificar arquivos essenciais
console.log('📁 Verificando arquivos de configuração...');
const requiredFiles = [
  'package.json',
  'vite.config.ts',
  'tsconfig.json',
  'vercel.json',
  'railway.json',
  'nixpacks.toml',
  '.gitignore'
];

requiredFiles.forEach(file => {
  const filePath = join(rootDir, file);
  if (existsSync(filePath)) {
    success.push(`✅ ${file} encontrado`);
  } else {
    errors.push(`❌ ${file} não encontrado`);
  }
});

// 2. Verificar package.json
console.log('\n📦 Verificando package.json...');
try {
  const packageJson = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf8'));
  
  if (packageJson.scripts.build) {
    success.push('✅ Script "build" encontrado');
  } else {
    errors.push('❌ Script "build" não encontrado em package.json');
  }
  
  if (packageJson.scripts.preview) {
    success.push('✅ Script "preview" encontrado');
  } else {
    warnings.push('⚠️ Script "preview" não encontrado (necessário para Railway)');
  }
  
  // Verificar dependências críticas
  const criticalDeps = ['react', 'react-dom', 'react-router-dom', '@mui/material'];
  criticalDeps.forEach(dep => {
    if (packageJson.dependencies[dep]) {
      success.push(`✅ Dependência "${dep}" instalada`);
    } else {
      errors.push(`❌ Dependência "${dep}" não encontrada`);
    }
  });
  
} catch (error) {
  errors.push('❌ Erro ao ler package.json');
}

// 3. Verificar node_modules
console.log('\n📚 Verificando dependências...');
if (existsSync(join(rootDir, 'node_modules'))) {
  success.push('✅ node_modules existe');
  
  // Verificar tamanho (indicativo de instalação completa)
  try {
    const result = execSync('npm list --depth=0', { cwd: rootDir, encoding: 'utf8' });
    success.push('✅ Dependências parecem instaladas corretamente');
  } catch (error) {
    warnings.push('⚠️ Algumas dependências podem estar faltando');
  }
} else {
  errors.push('❌ node_modules não encontrado - execute "npm install"');
}

// 4. Testar build
console.log('\n🔨 Testando build de produção...');
try {
  console.log('   Executando "npm run build"...');
  execSync('npm run build', { 
    cwd: rootDir, 
    stdio: 'pipe',
    encoding: 'utf8'
  });
  success.push('✅ Build executado com sucesso');
  
  // Verificar se o diretório dist foi criado
  if (existsSync(join(rootDir, 'dist'))) {
    success.push('✅ Diretório "dist" criado');
    
    // Verificar se index.html existe
    if (existsSync(join(rootDir, 'dist', 'index.html'))) {
      success.push('✅ index.html gerado no build');
    } else {
      errors.push('❌ index.html não encontrado no build');
    }
  } else {
    errors.push('❌ Diretório "dist" não foi criado');
  }
  
} catch (error) {
  errors.push('❌ Erro no build de produção');
  errors.push(`   Detalhes: ${error.message}`);
}

// 5. Verificar Git
console.log('\n📝 Verificando Git...');
try {
  execSync('git rev-parse --git-dir', { cwd: rootDir, stdio: 'pipe' });
  success.push('✅ Repositório Git inicializado');
  
  // Verificar se tem remote
  try {
    const remotes = execSync('git remote -v', { cwd: rootDir, encoding: 'utf8' });
    if (remotes.trim()) {
      success.push('✅ Remote Git configurado');
    } else {
      warnings.push('⚠️ Nenhum remote Git configurado');
    }
  } catch (error) {
    warnings.push('⚠️ Nenhum remote Git configurado');
  }
  
  // Verificar arquivos não commitados
  try {
    const status = execSync('git status --porcelain', { cwd: rootDir, encoding: 'utf8' });
    if (status.trim()) {
      warnings.push('⚠️ Existem arquivos não commitados');
    } else {
      success.push('✅ Todos os arquivos estão commitados');
    }
  } catch (error) {
    // Ignore
  }
  
} catch (error) {
  warnings.push('⚠️ Git não inicializado');
}

// 6. Verificar .env
console.log('\n🔐 Verificando variáveis de ambiente...');
if (existsSync(join(rootDir, '.env'))) {
  warnings.push('⚠️ Arquivo .env encontrado - não commite este arquivo!');
} else {
  success.push('✅ Nenhum arquivo .env na raiz (correto)');
}

if (existsSync(join(rootDir, '.env.local'))) {
  success.push('✅ .env.local encontrado (para desenvolvimento local)');
}

// 7. Verificar logo
console.log('\n🖼️ Verificando assets...');
if (existsSync(join(rootDir, 'public', 'logo-fgs.png'))) {
  success.push('✅ Logo FGS encontrada');
} else {
  warnings.push('⚠️ Logo FGS (logo-fgs.png) não encontrada em /public');
}

// 8. Verificar TypeScript
console.log('\n📘 Verificando TypeScript...');
try {
  execSync('npx tsc --noEmit', { cwd: rootDir, stdio: 'pipe' });
  success.push('✅ Sem erros de TypeScript');
} catch (error) {
  warnings.push('⚠️ Existem erros de TypeScript');
}

// Relatório Final
console.log('\n' + '='.repeat(60));
console.log('📊 RELATÓRIO DE VERIFICAÇÃO PRÉ-DEPLOY');
console.log('='.repeat(60) + '\n');

if (success.length > 0) {
  console.log('✅ SUCESSOS:');
  success.forEach(msg => console.log(`   ${msg}`));
  console.log('');
}

if (warnings.length > 0) {
  console.log('⚠️ AVISOS:');
  warnings.forEach(msg => console.log(`   ${msg}`));
  console.log('');
}

if (errors.length > 0) {
  console.log('❌ ERROS:');
  errors.forEach(msg => console.log(`   ${msg}`));
  console.log('');
}

console.log('='.repeat(60));

// Conclusão
if (errors.length === 0) {
  console.log('\n🎉 PROJETO PRONTO PARA DEPLOY!');
  console.log('\nPróximos passos:');
  console.log('1. Commit e push para o repositório Git');
  console.log('2. Deploy na Vercel: npm run deploy:vercel (ou via dashboard)');
  console.log('3. Deploy no Railway: npm run deploy:railway (ou via dashboard)');
  console.log('\nDocumentação:');
  console.log('- Vercel: ./DEPLOY_VERCEL.md');
  console.log('- Railway: ./DEPLOY_RAILWAY.md');
  console.log('- Guia Completo: ./DEPLOY_GUIA_COMPLETO.md');
  process.exit(0);
} else {
  console.log('\n⚠️ CORRIJA OS ERROS ANTES DE FAZER DEPLOY');
  console.log(`\n${errors.length} erro(s) encontrado(s)`);
  process.exit(1);
}

