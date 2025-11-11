# 🌐 Guia de Acesso em Rede Local

## 📋 Índice
1. [Configuração do Servidor](#configuração-do-servidor)
2. [Descobrir IP do Servidor](#descobrir-ip-do-servidor)
3. [Iniciar Servidor](#iniciar-servidor)
4. [Acessar de Outros Dispositivos](#acessar-de-outros-dispositivos)
5. [Configuração do Firewall](#configuração-do-firewall)
6. [Problemas Comuns](#problemas-comuns)

---

## 🚀 Configuração do Servidor

O sistema já está configurado para aceitar conexões de rede! Arquivos atualizados:

### ✅ Configurações Aplicadas:

**`vite.config.ts`:**
- ✅ `host: '0.0.0.0'` - Aceita conexões de qualquer IP
- ✅ `cors: true` - CORS habilitado
- ✅ `strictPort: false` - Permite portas alternativas
- ✅ HMR configurado para rede local

**`package.json`:**
- ✅ Script `dev:network` adicionado
- ✅ Script `preview:network` adicionado

---

## 🔍 Descobrir IP do Servidor

### No Windows:

**Método 1 - Command Prompt (CMD):**
```cmd
ipconfig
```

**Método 2 - PowerShell:**
```powershell
Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.InterfaceAlias -notlike "*Loopback*"}
```

Procure por:
- **IPv4 Address** ou **Endereço IPv4**
- Normalmente algo como: `192.168.x.x` ou `10.0.x.x`

**Exemplo:**
```
Wireless LAN adapter Wi-Fi:
   IPv4 Address. . . . . . . . . . . : 192.168.1.100
```

### No Linux/Mac:

```bash
ifconfig
# ou
ip addr show
# ou
hostname -I
```

---

## ▶️ Iniciar Servidor

### Opção 1: Modo Desenvolvimento com Rede

```bash
cd C:\Users\user\Documents\FGS\FGS
npm run dev:network
```

**Saída esperada:**
```
VITE v5.x.x ready in xxx ms

➜  Local:   http://localhost:3000/
➜  Network: http://192.168.1.100:3000/
➜  press h + enter to show help
```

### Opção 2: Modo Preview (Build de Produção)

```bash
# 1. Fazer build
npm run build

# 2. Iniciar preview em rede
npm run preview:network
```

---

## 📱 Acessar de Outros Dispositivos

### Passo a Passo:

1. **Anote o IP do servidor** (ex: `192.168.1.100`)

2. **Certifique-se que os dispositivos estão na mesma rede**
   - Mesma rede Wi-Fi
   - Ou conectados no mesmo roteador

3. **No dispositivo cliente, abra o navegador e digite:**
   ```
   http://192.168.1.100:3000
   ```
   *(Substitua pelo IP real do seu servidor)*

4. **Dispositivos que podem acessar:**
   - ✅ Smartphones (Android/iOS)
   - ✅ Tablets
   - ✅ Outros computadores
   - ✅ Smart TVs com navegador

---

## 🔥 Configuração do Firewall (Windows)

Se o acesso não funcionar, pode ser o firewall bloqueando:

### Método 1: Permitir Node.js no Firewall

1. Abra **Windows Defender Firewall**
2. Clique em **"Permitir um aplicativo através do firewall"**
3. Clique em **"Alterar configurações"**
4. Clique em **"Permitir outro aplicativo..."**
5. Navegue até: `C:\Program Files\nodejs\node.exe`
6. Adicione e marque **"Privada"** e **"Pública"**

### Método 2: Criar Regra de Porta (PowerShell como Admin)

```powershell
# Permitir porta 3000 TCP
New-NetFirewallRule -DisplayName "Vite Dev Server" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow

# Permitir porta 3000 UDP (opcional)
New-NetFirewallRule -DisplayName "Vite Dev Server UDP" -Direction Inbound -LocalPort 3000 -Protocol UDP -Action Allow
```

### Método 3: Desabilitar Firewall Temporariamente (APENAS PARA TESTE!)

⚠️ **Não recomendado para uso contínuo!**

```powershell
# Desabilitar (como Admin)
Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled False

# Reabilitar depois
Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled True
```

---

## 🐛 Problemas Comuns

### ❌ Problema: "Este site não pode ser alcançado"

**Soluções:**

1. **Verifique se o servidor está rodando**
   ```bash
   # Terminal deve mostrar:
   ➜  Network: http://192.168.1.100:3000/
   ```

2. **Ping no IP do servidor** (do dispositivo cliente)
   ```bash
   ping 192.168.1.100
   ```
   - Se não responder, problema de rede

3. **Teste localhost primeiro** (no próprio servidor)
   ```
   http://localhost:3000
   ```
   - Se funcionar, problema é firewall/rede

4. **Verifique a porta**
   ```bash
   # Windows (PowerShell como Admin)
   netstat -ano | findstr :3000
   
   # Deve mostrar algo como:
   TCP    0.0.0.0:3000    0.0.0.0:0    LISTENING    12345
   ```

### ❌ Problema: "Fica carregando infinitamente"

**Causas comuns:**

1. **WebSocket bloqueado**
   - Configure no `vite.config.ts`:
   ```typescript
   hmr: {
     clientPort: 3000, // Adicione esta linha
   }
   ```

2. **CORS bloqueado**
   - Já configurado com `cors: true`

3. **Proxy reverso**
   - Se usar proxy, configure corretamente

### ❌ Problema: "NET::ERR_CONNECTION_REFUSED"

**Soluções:**

1. Firewall bloqueando
2. Antivírus bloqueando
3. VPN interferindo
4. IP incorreto

### ❌ Problema: Dispositivos não conseguem se conectar

**Checklist:**

- [ ] Servidor rodando com `dev:network`
- [ ] IP correto anotado
- [ ] Mesma rede Wi-Fi
- [ ] Firewall configurado
- [ ] Porta 3000 liberada
- [ ] Antivírus não bloqueando

---

## 🔧 Solução Alternativa: Usar IP Fixo

Se o IP muda frequentemente:

### Windows - Configurar IP Estático:

1. **Painel de Controle** → **Central de Rede**
2. Clique na sua conexão (Wi-Fi/Ethernet)
3. **Propriedades** → **IPv4** → **Propriedades**
4. Selecione **"Usar o seguinte endereço IP"**
5. Configure:
   ```
   IP: 192.168.1.100
   Máscara: 255.255.255.0
   Gateway: 192.168.1.1
   DNS: 8.8.8.8
   ```

---

## 📱 QR Code para Acesso Rápido

Você pode gerar um QR Code com o IP para facilitar:

### Usando site online:
1. Acesse: https://www.qr-code-generator.com/
2. Cole: `http://192.168.1.100:3000`
3. Gere o QR Code
4. Escaneie com o celular

### Ou adicione ao código (opcional):

Instale:
```bash
npm install qrcode-terminal --save-dev
```

---

## 🌍 Expor para Internet (Avançado)

### Opção 1: ngrok (Recomendado para testes)

```bash
# Instalar ngrok
choco install ngrok

# Expor porta 3000
ngrok http 3000
```

**Resultado:**
```
Forwarding    https://abc123.ngrok.io -> http://localhost:3000
```

### Opção 2: localtunnel

```bash
npx localtunnel --port 3000
```

### ⚠️ Segurança:

- Nunca exponha dados sensíveis
- Use apenas para testes
- Considere autenticação adicional

---

## ✅ Checklist Final

Antes de testar em outros dispositivos:

- [ ] Servidor rodando com `npm run dev:network`
- [ ] IP do servidor anotado (ex: `192.168.1.100`)
- [ ] Firewall configurado (porta 3000 liberada)
- [ ] Dispositivos na mesma rede
- [ ] Testado em `localhost:3000` primeiro
- [ ] Browser cache limpo (Ctrl+Shift+Del)

---

## 📊 Comandos Rápidos

```bash
# Descobrir IP (Windows)
ipconfig | findstr IPv4

# Verificar porta 3000
netstat -ano | findstr :3000

# Iniciar servidor em rede
npm run dev:network

# Permitir no firewall (PowerShell Admin)
New-NetFirewallRule -DisplayName "Vite Dev Server" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow

# Testar conectividade (de outro dispositivo)
ping 192.168.1.100
telnet 192.168.1.100 3000
```

---

## 🎯 Exemplo Prático

**Servidor:**
```bash
C:\Users\user\Documents\FGS\FGS> npm run dev:network

VITE v5.4.20 ready in 1543 ms

➜  Local:   http://localhost:3000/
➜  Network: http://192.168.1.100:3000/
```

**Cliente (Celular/Outro PC):**
```
Abrir navegador → http://192.168.1.100:3000
```

---

**Desenvolvido por**: Sistema FGS  
**Última atualização**: 2025  
**Suporte**: Documentação completa para acesso em rede

