@echo off
chcp 65001 >nul
echo.
echo ═══════════════════════════════════════════════════════════
echo  🌐 FGS - Iniciando Servidor em Rede Local
echo ═══════════════════════════════════════════════════════════
echo.

REM Ir para o diretório do projeto
cd /d "%~dp0"

echo 📂 Diretório atual: %CD%
echo.

REM Verificar se node_modules existe
if not exist "node_modules" (
    echo ⚠️  node_modules não encontrado!
    echo 📦 Instalando dependências...
    call npm install
    echo.
)

echo 🔍 Descobrindo IP da rede...
echo.

REM Mostrar IPs disponíveis
echo ╔═══════════════════════════════════════════════════════════╗
echo ║  ENDEREÇOS DE REDE DISPONÍVEIS:                           ║
echo ╚═══════════════════════════════════════════════════════════╝
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /C:"IPv4"') do (
    echo    ➜ Network: http:%%a:3000
)
echo.

echo ╔═══════════════════════════════════════════════════════════╗
echo ║  INSTRUÇÕES:                                              ║
echo ╠═══════════════════════════════════════════════════════════╣
echo ║  1. Copie um dos endereços Network acima                  ║
echo ║  2. Em outro dispositivo (celular, tablet, PC), acesse:   ║
echo ║     http://192.168.X.X:3000                               ║
echo ║  3. Certifique-se que está na mesma rede Wi-Fi            ║
echo ║  4. Se não funcionar, configure o Firewall (veja o guia)  ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.

echo 🚀 Iniciando servidor de desenvolvimento...
echo.
echo ⚡ Pressione Ctrl+C para parar o servidor
echo.

REM Iniciar servidor em modo rede
call npm run dev:network

pause

