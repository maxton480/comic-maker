# HD French - Comic Story Generator

Este projeto utiliza a API do Fireworks AI e técnicas inspiradas no Flux Schnell para gerar personagens e histórias em quadrinhos de forma dinâmica.

## Funcionalidades

- Geração de personagens usando técnicas avançadas de IA
- Criação de "personagenes" com características personalizadas
- Geração automática de histórias em formato de quadrinhos
- Integração com a API do Fireworks AI para renderização de imagens
- Interface web para criação fácil de histórias
- Scripts para gerenciamento do servidor remoto e túnel SSH

## Estrutura do Projeto

```
├── config.js              # Configuração principal
├── .env                   # Chaves de API
├── web/                   # Interface web
│   ├── index.html         # Página principal
│   ├── styles.css         # Estilos
│   └── script.js          # Lógica frontend
├── start_server_remote.sh # Script para iniciar servidor web no servidor remoto
├── create_ssh_tunnel.sh   # Script para criar túnel SSH
├── create_ssh_tunnel_bg.sh # Script para criar túnel SSH em background
├── start_web_interface.sh # Script para iniciar interface web (combinado)
├── src/
│   ├── index.js           # Ponto de entrada principal
│   ├── utils/
│   │   └── fireworks.js   # Cliente da API do Fireworks
│   ├── models/
│   │   ├── characterGenerator.js  # Gerador de personagens
│   │   └── personagene.js         # Criador de personagenes
│   └── comics/
│       └── storyGenerator.js      # Gerador de histórias em quadrinhos
```

## Configuração

1. Copie o arquivo de exemplo `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```

2. Configure sua chave de API do Fireworks AI no arquivo `.env`:
   ```
   FIREWORKS_API_KEY=sua_chave_aqui
   ```

3. Instale as dependências:
   ```bash
   npm install
   ```

## Uso

### Modo Terminal

Execute o gerador de histórias:
```bash
npm start
```

O script irá:
1. Criar um personagem personalizado
2. Gerar uma história em formato de quadrinhos
3. Salvar a história em `comic_story.json`

### Modo Web (Servidor Remoto)

Inicie o servidor web no servidor remoto e crie um túnel SSH:
```bash
# Iniciar servidor web no servidor remoto
./start_server_remote.sh

# Criar túnel SSH (escolha um):
./create_ssh_tunnel.sh     # Mantém o terminal ocupado
./create_ssh_tunnel_bg.sh  # Executa em background

# Acesse a interface em http://localhost:8082
```

### Modo Web (Servidor Remoto - Combinado)

Inicie o servidor web no servidor remoto e crie um túnel SSH com um único comando:
```bash
# Iniciar interface web (servidor + túnel)
./start_web_interface.sh

# Acesse a interface em http://localhost:8082
```

### Modo Web (Local)

Inicie o servidor web localmente:
```bash
npm run web
```

Acesse a interface em `http://localhost:8081` para criar histórias através de uma interface gráfica.

### Modo Demonstração

Execute a versão de demonstração (sem API):
```bash
npm run demo
```

## Personalização

Você pode personalizar o personagem modificando o objeto `customCharacteristics` no arquivo `src/index.js`.

## Requisitos

- Node.js 14 ou superior
- Conta no Fireworks AI com chave de API válida (para modo completo)
- Acesso SSH ao servidor remoto (para modo web remoto)

## Tempo de Geração

Na sua MacBook M1, a geração de cada imagem leva aproximadamente 5-30 segundos, dependendo da complexidade.

## Suporte a Hardware

- Compatível com MacBook M1/M2
- Compatível com placas NVIDIA RTX 3090 (para implementações locais)
