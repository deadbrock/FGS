# 🚀 Acesso Rápido em Rede - Guia Simplificado

## ⚡ Início Rápido (3 passos)

### 1️⃣ Configure o Firewall (APENAS UMA VEZ)

**Clique com botão direito em `configurar-firewall.ps1`** → **Executar com PowerShell**

Ou execute manualmente:
```powershell
PowerShell -ExecutionPolicy Bypass -File .\configurar-firewall.ps1
```

✅ Isso libera a porta 3000 no firewall do Windows

---

### 2️⃣ Inicie o Servidor

**Opção A - Duplo clique:**
```
iniciar-rede.bat
```

**Opção B - Terminal:**
```bash
npm run dev:network
```

**Saída esperada:**
```
➜  Local:   http://localhost:3000/
➜  Network: http://192.168.1.100:3000/  ← COPIE ESTE ENDEREÇO
```

---

### 3️⃣ Acesse de Outro Dispositivo

No celular/tablet/outro PC:
```
http://192.168.1.100:3000
```

*(Substitua pelo IP que apareceu no passo 2)*

---

## 🔍 Descobrir IP Rapidamente

```cmd
ipconfig | findstr IPv4
```

Resultado:
```
IPv4 Address. . . . . . . . . . . : 192.168.1.100  ← ESTE É SEU IP
```

---

## ✅ Checklist Rápido

- [ ] Firewall configurado (executou `configurar-firewall.ps1`)
- [ ] Servidor rodando (`npm run dev:network`)
- [ ] Dispositivos na mesma rede Wi-Fi
- [ ] IP correto copiado

---

## 🐛 Se Não Funcionar

### Problema: "Não consigo acessar"

1. **Ping no IP:**
   ```cmd
   ping 192.168.1.100
   ```

2. **Teste localhost primeiro:**
   ```
   http://localhost:3000
   ```
   - Se funciona → Problema é firewall/rede
   - Se não funciona → Problema é servidor

3. **Desabilite antivírus temporariamente** (só para testar)

4. **Verifique se está na mesma rede**

---

## 📱 QR Code

Gere um QR Code com seu IP em: https://www.qr-code-generator.com/

Cole: `http://SEU_IP:3000`

Escaneie com o celular para acesso rápido!

---

## 🎯 Comandos Úteis

```bash
# Ver IP
ipconfig | findstr IPv4

# Iniciar servidor
npm run dev:network

# Testar porta
netstat -ano | findstr :3000

# Permitir firewall manualmente
netsh advfirewall firewall add rule name="Vite FGS" dir=in action=allow protocol=TCP localport=3000
```

---

**Precisa de mais detalhes?** → Veja `GUIA_ACESSO_REDE.md`

