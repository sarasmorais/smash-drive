// Constantes
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB em bytes
const ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf", "text/plain"];
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjdiNjExMzgzLTlhYWUtNDQ1Ni1hZTQ0LTUxNjE1NDQ0YzY1My1ldSIsInVzZXJuYW1lIjoiMWQ1NzE3MTItNDRkMC00NGM2LTlkODgtZjkyMTM5YTFlOGQyIiwicmVnaW9uIjoidXMtZWFzdC0xIiwiaXAiOiIxODcuMTguMTk4LjIxMiIsInNjb3BlIjoiTm9uZSIsImFjY291bnQiOiI4ZTVjNDBjZS1mMWE1LTRjMGYtODA1Mi0yMjhhZGQzYjAzM2ItZWEiLCJpYXQiOjE3NDYxMDI1MTMsImV4cCI6NDkwMTg2MjUxM30.CxiSQxMYWm0uZm6MtXlrsGNoadTD88Q6RCbsZbyXjcA"; // Substitua pelo seu token da API SMASH
const REGION = "us-east-1"; // Região da API SMASH conforme documentação

// Elementos do DOM
const uploadArea = document.getElementById('uploadArea');
const fileArea = document.getElementById('fileArea');
const fileInput = document.getElementById('fileInput');
const fileName = document.getElementById('fileName');
const fileSize = document.getElementById('fileSize');
const uploadButton = document.getElementById('uploadButton');
const downloadButton = document.getElementById('downloadButton');
const closeButton = document.getElementById('closeButton');
const errorContainer = document.getElementById('errorContainer');
const errorMessage = document.getElementById('errorMessage');
const progressContainer = document.getElementById('progressContainer');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');

// Variáveis de estado
let currentFile = null;
let fileDownloadUrl = null;

// Event Listeners
uploadArea.addEventListener('click', () => {
  fileInput.click();
});

uploadArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadArea.classList.add('dragging');
});

uploadArea.addEventListener('dragleave', (e) => {
  e.preventDefault();
  uploadArea.classList.remove('dragging');
});

uploadArea.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadArea.classList.remove('dragging');
  
  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    validateAndSetFile(e.dataTransfer.files[0]);
  }
});

fileInput.addEventListener('change', (e) => {
  if (e.target.files && e.target.files.length > 0) {
    validateAndSetFile(e.target.files[0]);
  }
});

uploadButton.addEventListener('click', handleUpload);
downloadButton.addEventListener('click', handleDownload);
closeButton.addEventListener('click', clearFile);

// Funções
function validateAndSetFile(file) {
  hideError();
  
  if (file.size > MAX_FILE_SIZE) {
    showError("O arquivo excede o limite de 5MB permitido.");
    return;
  }
  
  if (!ALLOWED_TYPES.includes(file.type)) {
    showError("Tipo de arquivo não permitido. Apenas JPG, PNG, PDF e TXT são aceitos.");
    return;
  }
  
  currentFile = file;
  displayFileInfo();
}

function displayFileInfo() {
  fileName.textContent = currentFile.name;
  fileSize.textContent = (currentFile.size / 1024 / 1024).toFixed(2) + ' MB';
  
  uploadArea.classList.add('hidden');
  fileArea.classList.remove('hidden');
  downloadButton.classList.add('hidden');
  uploadButton.classList.remove('hidden');
}

async function handleUpload() {
  if (!currentFile) return;
  
  uploadButton.disabled = true;
  progressContainer.classList.remove('hidden');
  hideError();
  
  try {
    // Usando a biblioteca SmashUploader
    const su = new SmashUploader({ 
      region: REGION, 
      token: API_KEY 
    });
    
    // Configurar o evento de progresso
    su.on('progress', (event) => {
      let percent = 0;
      if (event && event.progress && typeof event.progress.percent === 'number') {
        percent = event.progress.percent;
      } else if (event && typeof event.percent === 'number') {
        percent = event.percent;
      }
      
      updateProgress(percent);
    });
    
    // Iniciar o upload
    const result = await su.upload({ files: [currentFile] });
    
    // Obter a URL de transferência
    if (result && result.transfer && result.transfer.transferUrl) {
      fileDownloadUrl = result.transfer.transferUrl;
    } else {
      showError("URL de transferência não encontrada na resposta da API.");
      return;
    }
    
    // Mostrar botão de download
    uploadButton.classList.add('hidden');
    downloadButton.classList.remove('hidden');
  } catch (err) {
    showError("Ocorreu um erro durante o upload. Tente novamente.");
    console.error("Erro:", err);
  } finally {
    uploadButton.disabled = false;
  }
}

function updateProgress(value) {
  progressFill.style.width = `${value}%`;
  progressText.textContent = `${Math.round(value)}%`;
}

function handleDownload() {
  if (!fileDownloadUrl) {
    showError("URL de download não disponível.");
    return;
  }
  
  // Abrir a URL em uma nova aba
  window.open(fileDownloadUrl, '_blank');
}

function clearFile() {
  currentFile = null;
  fileDownloadUrl = null;
  fileInput.value = "";
  hideError();
  updateProgress(0);
  progressContainer.classList.add('hidden');
  
  fileArea.classList.add('hidden');
  uploadArea.classList.remove('hidden');
}

function showError(message) {
  errorMessage.textContent = message;
  errorContainer.classList.remove('hidden');
}

function hideError() {
  errorContainer.classList.add('hidden');
}