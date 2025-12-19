@echo off
echo ========================================
echo   EXECUTAR MIGRATION SST NO RAILWAY
echo ========================================
echo.
echo Este script vai criar as tabelas:
echo - sst_clinicas
echo - sst_solicitacoes_exames
echo.
echo IMPORTANTE: Certifique-se que o arquivo .env esta configurado!
echo.
pause

cd ..
node database\run-migration-sst.js

echo.
echo ========================================
echo   CONCLUIDO
echo ========================================
echo.
echo Proximos passos:
echo 1. Faca REDEPLOY do backend no Railway
echo 2. Teste o modulo Solicitacoes SST
echo.
pause

