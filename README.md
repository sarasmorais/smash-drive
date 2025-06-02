# 🚀 Smash Drive

**Smash Drive** é uma aplicação web simples e intuitiva para envio de arquivos usando a **API do Smash**. 
Com ela, você pode fazer upload de arquivos direto do seu navegador e compartilhar links de forma prática.

---

## ✨ Funcionalidades

- 📤 **Envio de arquivos** via API do Smash
- 🧾 **Geração automática de link de compartilhamento**
- 🎨 **Interface limpa e responsiva**
- 🔒 **Upload sem necessidade de autenticação**
- 📦 Limite de até **5MB** por upload (configurável)

---

## 🛠 Tecnologias Utilizadas

- ✅ HTML5  
- ✅ CSS3  
- ✅ JavaScript (Vanilla)  
- ✅ [API do Smash](https://api.fromsmash.com/)

---

## 🚀 Como usar

Siga os passos abaixo para rodar o projeto em sua máquina:

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/sarasmorais/smash-drive.git
   ```

2. **Acesse o diretório**:
   ```bash
   cd smash-drive
   ```

3. **Abra o projeto no navegador**:
   - Clique duas vezes em `index.html`  
   **ou**  
   - Use uma extensão como **Live Server** no VSCode para uma melhor experiência

---

## 🔧 Configuração da API do Smash

Você **não precisa de chave de API** para usar os recursos básicos de upload do Smash.

O envio está configurado assim no código:

```javascript
fetch('https://api.fromsmash.com/', {
  method: 'POST',
  body: arquivoSelecionado
});
```

> ⚠️ Recomendado para uploads simples, sem autenticação ou customizações.

---

## 📏 Limites da API Smash

- 🗂️ Uploads anônimos até **2GB** (nós limitamos para 5MB)
- ⏳ Links ativos por até **7 dias**
- 🚫 Sem rastreamento ou personalização sem autenticação

🔗 Veja todos os detalhes na [documentação oficial da API](https://fromsmash.com/developer)

---

## 📚 Documentação Oficial

Acesse a documentação da API Smash aqui:  
👉 [https://fromsmash.com/developer](https://fromsmash.com/developer)

---

## 📄 Licença

Este projeto está sob a licença **MIT**.  
Veja mais detalhes no arquivo [LICENSE](./LICENSE).

---

Feito por Sara Morais
Orientado por Luan Oliveira
