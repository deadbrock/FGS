# Script para configurar Firewall do Windows para o servidor Vite
# Execute como Administrador!

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host " 🔥 Configurador de Firewall - FGS Sistema" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Verificar se está rodando como Administrador
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "❌ ERRO: Este script precisa ser executado como Administrador!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Como executar como Admin:" -ForegroundColor Yellow
    Write-Host "1. Clique com botão direito no arquivo" -ForegroundColor Yellow
    Write-Host "2. Selecione 'Executar com PowerShell' ou 'Executar como Administrador'" -ForegroundColor Yellow
    Write-Host ""
    pause
    exit
}

Write-Host "✅ Executando como Administrador" -ForegroundColor Green
Write-Host ""

# Porta do Vite
$port = 3000
$ruleName = "FGS Vite Dev Server - Port $port"

Write-Host "🔍 Verificando regras existentes..." -ForegroundColor Yellow
Write-Host ""

# Verificar se a regra já existe
$existingRule = Get-NetFirewallRule -DisplayName $ruleName -ErrorAction SilentlyContinue

if ($existingRule) {
    Write-Host "⚠️  Regra já existe no Firewall" -ForegroundColor Yellow
    Write-Host ""
    $response = Read-Host "Deseja recriar a regra? (S/N)"
    
    if ($response -eq "S" -or $response -eq "s") {
        Write-Host ""
        Write-Host "🗑️  Removendo regra antiga..." -ForegroundColor Yellow
        Remove-NetFirewallRule -DisplayName $ruleName
        Write-Host "✅ Regra antiga removida" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "✅ Mantendo regra existente" -ForegroundColor Green
        Write-Host ""
        pause
        exit
    }
}

Write-Host ""
Write-Host "🔧 Criando nova regra no Firewall..." -ForegroundColor Yellow
Write-Host ""

try {
    # Criar regra TCP
    New-NetFirewallRule `
        -DisplayName "$ruleName (TCP)" `
        -Direction Inbound `
        -LocalPort $port `
        -Protocol TCP `
        -Action Allow `
        -Profile Private,Public `
        -Description "Permite acesso ao servidor de desenvolvimento Vite FGS na porta $port" `
        -ErrorAction Stop | Out-Null
    
    Write-Host "✅ Regra TCP criada com sucesso" -ForegroundColor Green
    
    # Criar regra UDP (para WebSocket)
    New-NetFirewallRule `
        -DisplayName "$ruleName (UDP)" `
        -Direction Inbound `
        -LocalPort $port `
        -Protocol UDP `
        -Action Allow `
        -Profile Private,Public `
        -Description "Permite WebSocket para HMR do Vite na porta $port" `
        -ErrorAction Stop | Out-Null
    
    Write-Host "✅ Regra UDP criada com sucesso" -ForegroundColor Green
    Write-Host ""
    
    # Permitir Node.js também
    Write-Host "🔧 Configurando Node.js no Firewall..." -ForegroundColor Yellow
    
    $nodePath = (Get-Command node -ErrorAction SilentlyContinue).Path
    
    if ($nodePath) {
        Write-Host "   Node.js encontrado em: $nodePath" -ForegroundColor Cyan
        
        # Verificar se já existe regra para Node.js
        $nodeRule = Get-NetFirewallApplicationFilter | Where-Object { $_.Program -eq $nodePath } | Select-Object -First 1
        
        if (-not $nodeRule) {
            New-NetFirewallRule `
                -DisplayName "Node.js (FGS)" `
                -Direction Inbound `
                -Program $nodePath `
                -Action Allow `
                -Profile Private,Public `
                -Description "Permite Node.js para servidor FGS" `
                -ErrorAction SilentlyContinue | Out-Null
            
            Write-Host "✅ Node.js permitido no Firewall" -ForegroundColor Green
        } else {
            Write-Host "✅ Node.js já está permitido" -ForegroundColor Green
        }
    }
    
    Write-Host ""
    Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║  ✅ FIREWALL CONFIGURADO COM SUCESSO!                     ║" -ForegroundColor Green
    Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Green
    Write-Host ""
    Write-Host "Próximos passos:" -ForegroundColor Cyan
    Write-Host "1. Execute: npm run dev:network" -ForegroundColor White
    Write-Host "2. Anote o IP Network mostrado" -ForegroundColor White
    Write-Host "3. Acesse de outro dispositivo usando esse IP" -ForegroundColor White
    Write-Host ""
    
} catch {
    Write-Host ""
    Write-Host "❌ ERRO ao criar regras:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
}

# Mostrar IP atual
Write-Host "🌐 Seus endereços IP:" -ForegroundColor Cyan
Write-Host ""

Get-NetIPAddress -AddressFamily IPv4 | 
    Where-Object {$_.InterfaceAlias -notlike "*Loopback*" -and $_.IPAddress -notlike "169.254.*"} |
    Select-Object IPAddress, InterfaceAlias |
    ForEach-Object {
        Write-Host "   ➜ http://$($_.IPAddress):$port" -ForegroundColor Yellow
        Write-Host "      Interface: $($_.InterfaceAlias)" -ForegroundColor Gray
        Write-Host ""
    }

Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Listar regras criadas
Write-Host "📋 Regras criadas:" -ForegroundColor Cyan
Get-NetFirewallRule -DisplayName "*FGS*" | Select-Object DisplayName, Enabled, Direction | Format-Table -AutoSize

Write-Host ""
pause

