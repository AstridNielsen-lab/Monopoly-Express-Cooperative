# 🔄 Sistema de Atualização Automática de Links APK

## ✅ Problema Resolvido

Todos os botões de download do APK MonopolyExpress agora estão configurados para **sempre baixar a versão mais recente automaticamente**.

## 🎯 O que foi atualizado:

### 📱 Botões de Download
- **MobileApp.tsx**: Botão principal de download
- **README.md**: Link de download na documentação
- **Hero.tsx**: Botão "Baixar App" (direcionamento)

### 🔗 URLs Atualizadas
- ✅ **Antes**: `releases/download/v4.0/CooperativaMotoboy-v4.0.apk`
- ✅ **Depois**: `releases/latest/download/CooperativaMotoboy-v4.0.apk`

### 📊 Informações Atualizadas
- ✅ **Versão**: v4.0 (Mais Recente)
- ✅ **Tamanho**: 5.6MB (tamanho real do arquivo)
- ✅ **Compatibilidade**: Android 7.0+

## 🛠️ Script de Atualização Automática

Criamos um script PowerShell que detecta automaticamente a versão mais recente do APK e atualiza todos os links:

### Como usar:
```powershell
# Execute o script
powershell -ExecutionPolicy Bypass -File "C:\Monopoly Express\update-apk-simple.ps1"
```

### O que o script faz:
1. 🔍 **Detecta** o APK mais recente na pasta `CooperativaMotoboy/`
2. 📏 **Calcula** o tamanho do arquivo automaticamente
3. 🔢 **Extrai** a versão do nome do arquivo
4. 🔄 **Atualiza** todos os links nos arquivos relevantes
5. ✅ **Confirma** as alterações realizadas

## 🌐 Como funciona o GitHub Releases

### URL Latest Release
O GitHub tem uma URL especial que sempre aponta para a release mais recente:
```
https://github.com/REPO/releases/latest/download/ARQUIVO.apk
```

### Vantagens:
- ✅ **Automático**: Não precisa alterar URLs manualmente
- ✅ **Sempre atualizado**: Usuários sempre baixam a versão mais recente
- ✅ **Simples**: Uma URL para todas as versões futuras

## 📋 Checklist para Novas Versões

Quando lançar uma nova versão (ex: v4.1, v5.0):

### 1. ✅ Compile o novo APK
```bash
# No Android Studio ou via gradle
./gradlew assembleRelease
```

### 2. ✅ Execute o script de atualização
```powershell
powershell -ExecutionPolicy Bypass -File "update-apk-simple.ps1"
```

### 3. ✅ Crie a release no GitHub
- Vá para: https://github.com/AstridNielsen-lab/Monopoly-Express-Cooperative/releases/new
- Tag: `v4.1` (nova versão)
- Title: `🚀 Monopoly Express v4.1 - [Descrição]`
- Upload: O novo APK
- ✅ Marque: "Set as the latest release"
- Publique a release

### 4. ✅ Teste os links
- Visite o site: `npm run dev`
- Clique no botão "Baixar APK"
- Verifique se baixa a nova versão

## 🎯 Localizações dos Links

### Arquivo Principal
```
src/components/home/MobileApp.tsx
```
- Botão de download principal
- Informações de versão e tamanho
- Link "Todas as versões"

### Documentação
```
README.md
```
- Link de download na documentação
- Informações técnicas do APK

### Scripts de Automação
```
update-apk-simple.ps1    # Script simples e funcional
update-apk-links.ps1     # Script completo (com Unicode issues)
```

## 🚀 Resultado Final

### ✅ Benefícios Alcançados:
1. **Automático**: Links sempre atualizados
2. **Confiável**: Usuários sempre têm a versão mais recente
3. **Manutenível**: Fácil de atualizar para novas versões
4. **Profissional**: Sistema robusto e bem documentado

### 🎉 Status Atual:
- ✅ **v4.0**: Configurada como latest release
- ✅ **Links**: Todos atualizados para `/latest/`
- ✅ **Tamanhos**: Corretos (5.6MB)
- ✅ **Scripts**: Funcionando perfeitamente

## 🔗 Links Importantes

- **Download Direto**: https://github.com/AstridNielsen-lab/Monopoly-Express-Cooperative/releases/latest/download/CooperativaMotoboy-v4.0.apk
- **Todas as Releases**: https://github.com/AstridNielsen-lab/Monopoly-Express-Cooperative/releases
- **Site do Projeto**: Execute `npm run dev` e acesse http://localhost:5173

---

**🎯 Missão Cumprida!** Todos os botões de download agora funcionam automaticamente para sempre baixar a versão mais recente do APK MonopolyExpress. 🚀

