const Personagene = require('./models/personagene');
const ComicStoryGenerator = require('./comics/storyGenerator');
const fs = require('fs').promises;

async function main() {
  console.log('Creating comic story generator...');
  
  try {
    // Initialize generators
    const comicGenerator = new ComicStoryGenerator();
    
    // Create a custom character
    console.log('Creating custom character...');
    const customCharacteristics = {
      appearance: 'elf with long silver hair and emerald eyes',
      clothing: 'elegant robes with intricate patterns',
      personality: 'wise and curious',
      background: 'scholar from the ancient library',
      abilities: 'powerful magic user with knowledge of ancient languages'
    };
    
    // Generate a comic story
    console.log('Generating comic story...');
    const comicStory = await comicGenerator.createCustomComicStory(customCharacteristics, 'adventure');
    
    // Display the story information
    console.log('\n=== Comic Story Generated ===');
    console.log('Title:', comicStory.title);
    console.log('Theme:', comicStory.theme);
    console.log('Created at:', comicStory.createdAt);
    
    console.log('\nMain Character:');
    console.log('- Appearance:', comicStory.mainCharacter.characteristics.appearance);
    console.log('- Clothing:', comicStory.mainCharacter.characteristics.clothing);
    console.log('- Personality:', comicStory.mainCharacter.characteristics.personality);
    console.log('- Background:', comicStory.mainCharacter.characteristics.background);
    console.log('- Abilities:', comicStory.mainCharacter.characteristics.abilities);
    
    console.log('\nComic Panels:');
    comicStory.panels.forEach(panel => {
      console.log(`Panel ${panel.id}: ${panel.description}`);
      console.log(`  Prompt: ${panel.prompt}`);
    });
    
    // Save to file
    await fs.writeFile('comic_story.json', JSON.stringify(comicStory, null, 2));
    console.log('\nComic story saved to comic_story.json');
    
  } catch (error) {
    console.error('Error generating comic story:', error);
  }
}

// Run the main function
main();
