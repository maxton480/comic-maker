const Personagene = require('./models/personagene');
const ComicStoryGenerator = require('./comics/storyGenerator');
const fs = require('fs').promises;

// Função para simular a geração de histórias sem API
async function demo() {
  console.log('=== HD French - Comic Story Generator (Demo) ===');
  console.log('Este é uma demonstração do gerador de histórias em quadrinhos.\n');
  
  // Simular um personagem gerado
  const demoCharacter = {
    id: "demo123",
    characteristics: {
      appearance: 'elf with long silver hair and emerald eyes',
      clothing: 'elegant robes with intricate patterns',
      personality: 'wise and curious',
      background: 'scholar from the ancient library',
      abilities: 'powerful magic user with knowledge of ancient languages'
    },
    description: "elf with long silver hair and emerald eyes, elegant robes with intricate patterns, wise and curious, scholar from the ancient library, powerful magic user with knowledge of ancient languages",
    prompt: "flux schnell style, highly detailed character portrait, elf with long silver hair and emerald eyes, elegant robes with intricate patterns, wise and curious, scholar from the ancient library, powerful magic user with knowledge of ancient languages, fantasy character design, professional digital painting, intricate details, vibrant colors, cinematic lighting, 8k resolution",
    style: "fluxSchnell"
  };
  
  // Simular uma história gerada
  const demoStory = {
    title: "The Quest for the Lost Artifact",
    theme: "adventure",
    mainCharacter: demoCharacter,
    panels: [
      {
        id: 1,
        prompt: 'Wide establishing shot of the world where "The Quest for the Lost Artifact" takes place, fantasy landscape, cinematic view',
        image: 'demo_panel_1.jpg',
        description: 'Panel 1 of the comic story'
      },
      {
        id: 2,
        prompt: 'Close-up portrait of the main character: elf with long silver hair and emerald eyes, elegant robes with intricate patterns',
        image: 'demo_panel_2.jpg',
        description: 'Panel 2 of the comic story'
      },
      {
        id: 3,
        prompt: 'Action scene: Following a mysterious map, elf with long silver hair and emerald eyes must journey to a forgotten temple, dramatic moment, high tension',
        image: 'demo_panel_3.jpg',
        description: 'Panel 3 of the comic story'
      },
      {
        id: 4,
        prompt: 'Climactic scene: Guardian spirits protect the artifact, intense emotions, magical effects',
        image: 'demo_panel_4.jpg',
        description: 'Panel 4 of the comic story'
      },
      {
        id: 5,
        prompt: 'Resolution scene: Through wisdom and courage, the artifact is claimed, peaceful atmosphere, character growth',
        image: 'demo_panel_5.jpg',
        description: 'Panel 5 of the comic story'
      }
    ],
    createdAt: new Date().toISOString()
  };
  
  // Exibir informações da história
  console.log('=== História em Quadrinhos Gerada ===');
  console.log('Título:', demoStory.title);
  console.log('Tema:', demoStory.theme);
  console.log('Criada em:', demoStory.createdAt);
  
  console.log('\nPersonagem Principal:');
  console.log('- Aparência:', demoStory.mainCharacter.characteristics.appearance);
  console.log('- Roupas:', demoStory.mainCharacter.characteristics.clothing);
  console.log('- Personalidade:', demoStory.mainCharacter.characteristics.personality);
  console.log('- Histórico:', demoStory.mainCharacter.characteristics.background);
  console.log('- Habilidades:', demoStory.mainCharacter.characteristics.abilities);
  
  console.log('\nPainéis do Quadrinho:');
  demoStory.panels.forEach(panel => {
    console.log(`Painel ${panel.id}: ${panel.description}`);
  });
  
  // Salvar versão demo em JSON
  await fs.writeFile('comic_story_demo.json', JSON.stringify(demoStory, null, 2));
  console.log('\nVersão demo da história salva em comic_story_demo.json');
  
  // Criar versão HTML
  const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>História em Quadrinhos - ${demoStory.title}</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .header {
            text-align: center;
            background-color: #2c3e50;
            color: white;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 30px;
        }
        .character-info {
            background-color: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            margin-bottom: 30px;
        }
        .comic-panel {
            background-color: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            margin-bottom: 20px;
            text-align: center;
        }
        .panel-image {
            width: 100%;
            max-width: 600px;
            height: 300px;
            background-color: #ecf0f1;
            border: 2px dashed #bdc3c7;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 15px;
            border-radius: 5px;
        }
        .panel-description {
            font-style: italic;
            color: #7f8c8d;
        }
        .character-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 15px;
        }
        .character-item {
            background-color: #ecf0f1;
            padding: 15px;
            border-radius: 5px;
        }
        h1, h2, h3 {
            margin-top: 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            color: #7f8c8d;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${demoStory.title}</h1>
        <p>Uma história em quadrinhos gerada dinamicamente</p>
    </div>

    <div class="character-info">
        <h2>Personagem Principal</h2>
        <div class="character-grid">
            <div class="character-item">
                <strong>Aparência:</strong> ${demoStory.mainCharacter.characteristics.appearance}
            </div>
            <div class="character-item">
                <strong>Roupas:</strong> ${demoStory.mainCharacter.characteristics.clothing}
            </div>
            <div class="character-item">
                <strong>Personalidade:</strong> ${demoStory.mainCharacter.characteristics.personality}
            </div>
            <div class="character-item">
                <strong>Histórico:</strong> ${demoStory.mainCharacter.characteristics.background}
            </div>
            <div class="character-item">
                <strong>Habilidades:</strong> ${demoStory.mainCharacter.characteristics.abilities}
            </div>
        </div>
    </div>

    <h2 style="text-align: center;">Painéis do Quadrinho</h2>
${demoStory.panels.map(panel => `
    <div class="comic-panel">
        <h3>Painel ${panel.id}: ${panel.description.split(': ')[1] || panel.description}</h3>
        <div class="panel-image">
            <span>Imagem ${panel.id}: ${panel.prompt}</span>
        </div>
        <p class="panel-description">${panel.description}</p>
    </div>`).join('')}

    <div class="footer">
        <p>História gerada dinamicamente usando técnicas inspiradas no Flux Schnell e API do Fireworks AI</p>
        <p>Criada em: ${demoStory.createdAt}</p>
    </div>
</body>
</html>`;

  await fs.writeFile('comic_story_demo.html', htmlContent);
  console.log('Versão HTML da história salva em comic_story_demo.html');
  
  console.log('\n=== Como usar com a API real ===');
  console.log('1. Obtenha uma chave de API em https://fireworks.ai');
  console.log('2. Configure sua chave no arquivo .env');
  console.log('3. Execute: npm start');
}

// Executar a demonstração
demo();
