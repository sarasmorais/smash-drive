// Definição das constantes
const MAX_FILE_SIZE = 5 * 1024 * 1024; // Define o tamanho máximo do arquivo para 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf", "text/plain"]; // Define os tipos de arquivos permitidos
const API_KEY = "SUA_CHAVE_API_AQUI"; // Chave da API para autenticação (substitua pela sua)
const REGION = "us-east-1"; // Define a região do serviço API Smash

// Captura dos elementos HTML
const uploadArea = document.getElementById('uploadArea'); // Área onde o usuário pode arrastar ou clicar para escolher o arquivo
const fileArea = document.getElementById('fileArea'); // Área onde as informações do arquivo são exibidas
const fileInput = document.getElementById('fileInput'); // Input para seleção de arquivo
const fileName = document.getElementById('fileName'); // Exibe o nome do arquivo escolhido
const fileSize = document.getElementById('fileSize'); // Exibe o tamanho do arquivo escolhido
const uploadButton = document.getElementById('uploadButton'); // Botão para fazer o upload do arquivo
const downloadButton = document.getElementById('downloadButton'); // Botão para baixar o arquivo depois do upload
const closeButton = document.getElementById('closeButton'); // Botão para cancelar e escolher outro arquivo
const errorContainer = document.getElementById('errorContainer'); // Área onde aparece a mensagem de erro
const errorMessage = document.getElementById('errorMessage'); // Texto da mensagem de erro
const progressContainer = document.getElementById('progressContainer'); // Área onde aparece a barra de progresso
const progressFill = document.getElementById('progressFill'); // Indicador de preenchimento da barra de progresso
const progressText = document.getElementById('progressText'); // Texto que mostra quantos % do arquivo já foi enviado

// Variáveis para controle do estado
let currentFile = null; // Armazena o arquivo selecionado
let fileDownloadUrl = null; // Guarda a URL de download do arquivo depois do upload

// Eventos para a área de upload
uploadArea.addEventListener('click', () => {
  fileInput.click(); // Quando o usuário clica na área de upload, o input de arquivo é ativado
});

uploadArea.addEventListener('dragover', (e) => {
  e.preventDefault(); // Previne o comportamento padrão
  uploadArea.classList.add('dragging'); // Adiciona um estilo visual quando o arquivo é arrastado sobre a área
});

uploadArea.addEventListener('dragleave', (e) => {
  e.preventDefault(); // Previne o comportamento padrão
  uploadArea.classList.remove('dragging'); // Remove o estilo visual quando o arquivo não está mais sobre a área
});

uploadArea.addEventListener('drop', (e) => {
  e.preventDefault(); // Previne o comportamento padrão
  uploadArea.classList.remove('dragging'); // Remove o efeito visual de "arrastando"

  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    validateAndSetFile(e.dataTransfer.files[0]); // Valida e salva o arquivo
  }
});

// Quando o usuário escolhe um arquivo no input
fileInput.addEventListener('change', (e) => {
  if (e.target.files && e.target.files.length > 0) {
    validateAndSetFile(e.target.files[0]); // Valida e salva o arquivo
  }
});

// Adiciona eventos aos botões
uploadButton.addEventListener('click', handleUpload); // Inicia o upload
downloadButton.addEventListener('click', handleDownload); // Inicia o download
closeButton.addEventListener('click', clearFile); // Limpa os dados do arquivo e volta ao estado inicial

// Função para validar o arquivo
function validateAndSetFile(file) {
  hideError(); // Esconde qualquer erro anterior
  
  if (file.size > MAX_FILE_SIZE) {
    showError("O arquivo excede o limite de 5MB permitido."); // Verifica se o arquivo é maior que o permitido
    return;
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    showError("Tipo de arquivo não permitido. Apenas JPG, PNG, PDF e TXT são aceitos."); // Verifica se o tipo do arquivo é permitido
    return;
  }

  currentFile = file; // Guarda o arquivo na variável
  displayFileInfo(); // Exibe as informações do arquivo na tela
}

// Função para mostrar as informações do arquivo na tela
function displayFileInfo() {
  fileName.textContent = currentFile.name; // Mostra o nome do arquivo
  fileSize.textContent = (currentFile.size / 1024 / 1024).toFixed(2) + ' MB'; // Mostra o tamanho do arquivo

  uploadArea.classList.add('hidden'); // Esconde a área de upload
  fileArea.classList.remove('hidden'); // Mostra a área de informações do arquivo
  downloadButton.classList.add('hidden'); // Esconde o botão de download
  uploadButton.classList.remove('hidden'); // Mostra o botão de upload
}

// Função para fazer o upload do arquivo
async function handleUpload() {
  if (!currentFile) return; // Se não tiver arquivo, não faz nada

  uploadButton.disabled = true; // Desativa o botão de upload enquanto envia
  progressContainer.classList.remove('hidden'); // Mostra a barra de progresso
  hideError(); // Esconde mensagens de erro anteriores

  try {
    // Criando um objeto para usar a API SmashUploader
    const su = new SmashUploader({ 
      region: REGION, 
      token: API_KEY 
    });

    // Atualizando a barra de progresso conforme o upload acontece
    su.on('progress', (event) => {
      let percent = event.progress?.percent || event.percent || 0; // Obtém a porcentagem
      updateProgress(percent); // Atualiza a barra de progresso
    });

    // Envia o arquivo para a API
    const transfer = await su.upload({ files: [currentFile] });

    fileDownloadUrl = transfer.downloadUrl; // Guarda o link do arquivo enviado

    uploadButton.classList.add('hidden'); // Esconde o botão de upload
    downloadButton.classList.remove('hidden'); // Mostra o botão de download
  } catch (err) {
    showError("Ocorreu um erro durante o upload. Tente novamente."); // Exibe um erro se houver problema
  } finally {
    uploadButton.disabled = false; // Reativa o botão depois do upload
  }
}

// Função para atualizar a barra de progresso
function updateProgress(value) {
  progressFill.style.width = `${value}%`; // Atualiza a largura da barra de progresso
  progressText.textContent = `${value}%`; // Atualiza o texto da barra de progresso
}

// Função para baixar o arquivo depois do upload
function handleDownload() {
  if (fileDownloadUrl) {
    window.open(fileDownloadUrl, '_blank'); // Abre o link do arquivo para baixar
  }
}

// Função para limpar os dados e voltar ao estado inicial
function clearFile() {
  currentFile = null;
  fileDownloadUrl = null;
  fileInput.value = "";
  hideError();
  updateProgress(0);

  fileArea.classList.add('hidden'); // Esconde a área de informações
  uploadArea.classList.remove('hidden'); // Mostra a área de upload novamente
}

// Funções para mostrar e esconder erros
function showError(message) {
  errorMessage.textContent = message;
  errorContainer.classList.remove('hidden');
}

function hideError() {
  errorContainer.classList.add('hidden');
}
