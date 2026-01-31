const http = require('http');
const fs = require('fs');
const path = require('path');

// Porta do servidor
const PORT = 8081;

// Tipos MIME para diferentes extensões de arquivo
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Função para servir arquivos estáticos
function serveStaticFile(res, pathname, contentType) {
  // Se for a raiz, servir o index.html
  if (pathname === '/') {
    pathname = '/index.html';
  }
  
  let filePath;
  
  // Verificar se é um diretório de história em quadrinhos
  if (pathname.startsWith('/comic_')) {
    // Servir arquivos de histórias em quadrinhos do diretório raiz
    filePath = path.join(process.cwd(), pathname);
  } else {
    // Servir arquivos web do diretório web
    filePath = path.join(process.cwd(), 'web', pathname);
  }
  
  // Verificar se o arquivo existe
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // Arquivo não encontrado
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 Not Found</h1><p>O arquivo solicitado não foi encontrado.</p>');
      return;
    }
    
    // Ler e servir o arquivo
    fs.readFile(filePath, (err, data) => {
      if (err) {
        // Erro ao ler o arquivo
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end('<h1>500 Internal Server Error</h1><p>Ocorreu um erro ao ler o arquivo.</p>');
        return;
      }
      
      // Servir o arquivo com o tipo de conteúdo correto
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  });
}

// Função para gerar uma história em quadrinhos
function generateComicStory(theme, title, res) {
  const { spawn } = require('child_process');
  
  // Criar um processo filho para executar o script Python
  const pythonProcess = spawn('python3', ['comic_story_generator.py', theme, title], {
    cwd: process.cwd()
  });
  
  let output = '';
  let errorOutput = '';
  
  // Capturar a saída do processo
  pythonProcess.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  // Capturar erros do processo
  pythonProcess.stderr.on('data', (data) => {
    errorOutput += data.toString();
  });
  
  // Quando o processo terminar
  pythonProcess.on('close', (code) => {
    if (code === 0) {
      // Processo terminou com sucesso
      // Procurar o nome do diretório da história gerada na saída
      const directoryMatch = output.match(/Saving to directory: (comic_\d+)/);
      if (directoryMatch) {
        const directory = directoryMatch[1];
        
        // Gerar o visualizador HTML
        const viewerProcess = spawn('python3', ['comic_viewer.py', directory], {
          cwd: process.cwd()
        });
        
        viewerProcess.on('close', (viewerCode) => {
          if (viewerCode === 0) {
            // Retornar sucesso com o diretório da história gerada
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
              success: true, 
              directory: directory,
              message: 'História em quadrinhos gerada com sucesso!'
            }));
          } else {
            // Erro ao gerar o visualizador
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
              success: false, 
              error: 'Erro ao gerar o visualizador HTML',
              details: errorOutput
            }));
          }
        });
      } else {
        // Não foi possível encontrar o diretório da história gerada
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          success: false, 
          error: 'Não foi possível encontrar o diretório da história gerada',
          output: output
        }));
      }
    } else {
      // Processo terminou com erro
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        success: false, 
        error: 'Erro ao gerar a história em quadrinhos',
        details: errorOutput
      }));
    }
  });
}

// Criar o servidor
const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  // Endpoint para gerar histórias em quadrinhos
  if (req.method === 'POST' && req.url === '/api/generate-comic') {
    let body = '';
    
    // Coletar os dados da requisição
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    // Processar a requisição quando todos os dados forem recebidos
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const { theme, title } = data;
        
        // Validar os dados
        if (!theme || !title) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            success: false, 
            error: 'Tema e título são obrigatórios'
          }));
          return;
        }
        
        // Gerar a história em quadrinhos
        generateComicStory(theme, title, res);
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          success: false, 
          error: 'Dados inválidos',
          details: error.message
        }));
      }
    });
    
    return;
  }
  
  // Determinar o tipo de conteúdo com base na extensão do arquivo
  const extname = path.extname(req.url);
  const contentType = MIME_TYPES[extname] || 'text/html';
  
  // Servir o arquivo solicitado
  serveStaticFile(res, req.url, contentType);
});

// Iniciar o servidor
server.listen(PORT, () => {
  console.log(`Servidor HD French Comic Generator rodando em http://localhost:${PORT}`);
  console.log('Pressione Ctrl+C para parar o servidor');
});
