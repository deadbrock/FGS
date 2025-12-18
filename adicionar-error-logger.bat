@echo off
echo ========================================
echo  Adicionar Error Logger ao .env
echo ========================================
echo.

REM Adicionar ao .env do frontend
echo. >> .env
echo # Error Logger >> .env
echo VITE_ERROR_LOGGER_URL=http://localhost:4000/api/errors/log >> .env

echo [OK] Variavel adicionada ao .env do frontend
echo.

REM Adicionar ao .env do backend
echo. >> backend\.env
echo # Error Logger >> backend\.env
echo ERROR_LOGGER_URL=http://localhost:4000/api/errors/log >> backend\.env

echo [OK] Variavel adicionada ao backend\.env
echo.
echo ========================================
echo  Concluido!
echo ========================================
echo.
echo IMPORTANTE: Reinicie o frontend e backend
echo   Frontend: npm run dev
echo   Backend: npm start
echo.
pause

