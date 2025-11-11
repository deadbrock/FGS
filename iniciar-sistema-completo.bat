@echo off
echo.
echo ============================================
echo    SISTEMA FGS - Iniciando Completo
echo ============================================
echo.
echo [1/3] Verificando dependencias...
echo.

cd /d "%~dp0"

REM Verificar se node_modules existe
if not exist "node_modules\" (
    echo Node modules nao encontrado. Instalando dependencias...
    call npm install --legacy-peer-deps
) else (
    echo Dependencias OK!
)

echo.
echo [2/3] Configurando variaveis de ambiente...
echo.

REM Verificar se .env existe
if not exist ".env" (
    echo Arquivo .env nao encontrado!
    echo.
    echo Por favor, crie um arquivo .env com:
    echo DATABASE_URL=sua-url-postgresql
    echo FRONTEND_URL=http://localhost:3000
    echo PORT=3333
    echo NODE_ENV=development
    echo.
    pause
    exit /b
)

REM Verificar se .env.local existe
if not exist ".env.local" (
    echo Criando .env.local...
    echo VITE_API_URL=http://localhost:3333 > .env.local
)

echo Variaveis OK!

echo.
echo [3/3] Iniciando Sistema...
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:3333
echo.
echo Pressione Ctrl+C para parar o servidor
echo.
echo ============================================
echo.

REM Iniciar frontend e backend
npm run dev:full

pause

