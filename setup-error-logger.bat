@echo off
echo ========================================
echo  FGS - Configurar Error Logger
echo ========================================
echo.

REM Verificar se .env existe
if exist .env (
    echo [OK] Arquivo .env encontrado
    echo.
    echo Adicionando configuracao do Error Logger...
    echo.
    
    REM Verificar se já existe a configuração
    findstr /C:"VITE_ERROR_LOGGER_URL" .env >nul
    if %ERRORLEVEL% EQU 0 (
        echo [AVISO] Configuracao ja existe no .env
    ) else (
        echo. >> .env
        echo # Error Logger >> .env
        echo VITE_ERROR_LOGGER_URL=http://localhost:4000/api/errors/log >> .env
        echo [OK] Configuracao adicionada ao .env do frontend
    )
) else (
    echo [ERRO] Arquivo .env nao encontrado!
    echo Por favor, crie o arquivo .env primeiro.
    pause
    exit /b 1
)

echo.
echo ========================================
echo  Configurando Backend...
echo ========================================
echo.

REM Configurar backend
if exist backend\.env (
    echo [OK] Arquivo backend\.env encontrado
    echo.
    
    REM Verificar se já existe a configuração
    findstr /C:"ERROR_LOGGER_URL" backend\.env >nul
    if %ERRORLEVEL% EQU 0 (
        echo [AVISO] Configuracao ja existe no backend\.env
    ) else (
        echo. >> backend\.env
        echo # Error Logger >> backend\.env
        echo ERROR_LOGGER_URL=http://localhost:4000/api/errors/log >> backend\.env
        echo [OK] Configuracao adicionada ao .env do backend
    )
) else (
    echo [ERRO] Arquivo backend\.env nao encontrado!
    echo Por favor, crie o arquivo backend\.env primeiro.
)

echo.
echo ========================================
echo  Configuracao Concluida!
echo ========================================
echo.
echo As seguintes linhas foram adicionadas:
echo.
echo Frontend (.env):
echo   VITE_ERROR_LOGGER_URL=http://localhost:4000/api/errors/log
echo.
echo Backend (backend\.env):
echo   ERROR_LOGGER_URL=http://localhost:4000/api/errors/log
echo.
echo ========================================
echo  Proximos passos:
echo ========================================
echo 1. Inicie o servidor de logs (fgs-error-logger)
echo 2. Reinicie o frontend e backend do FGS
echo 3. Os erros serao capturados automaticamente!
echo.
pause

