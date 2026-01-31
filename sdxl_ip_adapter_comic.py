import torch
from diffusers import StableDiffusionXLPipeline, StableDiffusionXLImg2ImgPipeline
from diffusers import DPMSolverMultistepScheduler
from PIL import Image, ImageDraw, ImageFont
import os
import json
import sys
import time
import random
import numpy as np

class SDXLComicGenerator:
    def __init__(self):
        self.pipe = None
        self.img2img_pipe = None
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.load_models()
        
    def load_models(self):
        """Load SDXL model for cartoon generation"""
        try:
            print("Loading SDXL model for cartoon generation...")
            
            # Load SDXL base model
            self.pipe = StableDiffusionXLPipeline.from_pretrained(
                "stabilityai/stable-diffusion-xl-base-1.0",
                torch_dtype=torch.float16,
                use_safetensors=True,
                variant="fp16"
            ).to(self.device)
            
            # Optimize for speed
            self.pipe.scheduler = DPMSolverMultistepScheduler.from_config(
                self.pipe.scheduler.config
            )
            
            # Enable memory efficient attention
            self.pipe.enable_model_cpu_offload()
            
            print("SDXL model loaded successfully!")
            
        except Exception as e:
            print(f"Error loading SDXL: {e}")
            print("Falling back to lighter model...")
            # Fallback to regular SD
            from diffusers import StableDiffusionPipeline
            self.pipe = StableDiffusionPipeline.from_pretrained(
                "runwayml/stable-diffusion-v1-5",
                torch_dtype=torch.float16
            ).to(self.device)
            print("Using SD 1.5 as fallback")
    
    def create_character_reference(self, character_type="cebolinha"):
        """Create Monica's Gang style character reference"""
        characters = {
            "cebolinha": {
                "name": "Jimmy Five",
                "name_fr": "Jimmy Cinq",
                "description": "cartoon boy with 5 spiky hair strands on top, green shirt, black shorts, big head, simple lines",
                "full_prompt": "Monica's Gang cartoon style, Jimmy Five character, boy with exactly 5 hair strands, round big head, green t-shirt, black shorts, simple flat colors, white background, comic book style, chibi"
            },
            "monica": {
                "name": "Monica", 
                "name_fr": "Monica",
                "description": "cartoon girl with short black hair, red dress, bunny teeth, holding blue bunny plush, big head",
                "full_prompt": "Monica's Gang cartoon style, Monica character, girl with bob haircut, red dress, prominent front teeth, blue stuffed bunny, round big head, simple flat colors, white background, comic book style, chibi"
            },
            "magali": {
                "name": "Maggie",
                "name_fr": "Maggie", 
                "description": "cartoon girl with yellow dress, black hair in pigtails, always eating watermelon",
                "full_prompt": "Monica's Gang cartoon style, Maggie character, girl with pigtails, yellow dress, eating watermelon, round big head, simple flat colors, white background, comic book style, chibi"
            },
            "cascao": {
                "name": "Smudge",
                "name_fr": "Cascao",
                "description": "cartoon boy with messy hair, red striped shirt, brown shorts, dirt marks",
                "full_prompt": "Monica's Gang cartoon style, Smudge character, boy with messy spiky hair, red and yellow striped shirt, brown shorts, round big head, simple flat colors, white background, comic book style, chibi"
            }
        }
        return characters.get(character_type, characters["cebolinha"])
    
    def add_speech_bubble_french(self, image, text, position="top"):
        """Add French dialogue in speech bubble"""
        draw = ImageDraw.Draw(image)
        img_width, img_height = image.size
        
        # Position variations
        positions = {
            "top": (img_width // 4, 40),
            "top-right": (img_width - 300, 40),
            "bottom": (img_width // 4, img_height - 120),
            "bottom-right": (img_width - 300, img_height - 120)
        }
        
        x, y = positions.get(position, positions["top"])
        
        # Calculate bubble size based on text
        bubble_width = min(250, max(150, len(text) * 10))
        bubble_height = 60
        
        # Draw white bubble with black outline
        draw.ellipse([x, y, x + bubble_width, y + bubble_height],
                     fill=(255, 255, 255), outline=(0, 0, 0), width=3)
        
        # Draw tail
        if "top" in position:
            tail_points = [(x + 50, y + bubble_height - 5),
                          (x + 30, y + bubble_height + 20),
                          (x + 70, y + bubble_height - 5)]
        else:
            tail_points = [(x + 50, y + 5),
                          (x + 30, y - 20),
                          (x + 70, y + 5)]
        
        draw.polygon(tail_points, fill=(255, 255, 255), outline=(0, 0, 0))
        
        # Add French text
        text_bbox = draw.textbbox((0, 0), text)
        text_width = text_bbox[2] - text_bbox[0]
        text_height = text_bbox[3] - text_bbox[1]
        text_x = x + (bubble_width - text_width) // 2
        text_y = y + (bubble_height - text_height) // 2
        draw.text((text_x, text_y), text, fill=(0, 0, 0))
        
        return image
    
    def generate_panel(self, prompt, character1, character2, seed, step_num):
        """Generate a comic panel with consistent characters"""
        try:
            # Build prompt with both characters
            if character2:
                full_prompt = f"{character1['full_prompt']}, {character2['description']}, {prompt}, cartoon comic style, simple lines, flat colors, white background"
            else:
                full_prompt = f"{character1['full_prompt']}, {prompt}, cartoon comic style, simple lines, flat colors, white background"
            
            # Negative prompt to avoid realistic styles
            negative_prompt = "realistic, photo, 3d render, complex, detailed shading, gradient, dark, violent, scary, many characters, crowd"
            
            print(f"Panel {step_num}: Generating...")
            
            # Generate with SDXL
            generator = torch.Generator(self.device).manual_seed(seed)
            
            if hasattr(self.pipe, 'text_encoder_2'):  # Check if SDXL
                image = self.pipe(
                    prompt=full_prompt,
                    negative_prompt=negative_prompt,
                    num_inference_steps=25,
                    guidance_scale=7.5,
                    generator=generator,
                    width=1024,
                    height=1024
                ).images[0]
            else:  # Fallback SD 1.5
                image = self.pipe(
                    prompt=full_prompt,
                    negative_prompt=negative_prompt,
                    num_inference_steps=30,
                    guidance_scale=7.5,
                    generator=generator
                ).images[0]
            
            return True, image
            
        except Exception as e:
            print(f"Error generating panel: {e}")
            return False, None
    
    def generate_french_comic_story(self):
        """Generate a 2-page French comic with Monica's Gang style characters"""
        
        # Initialize characters
        cebolinha = self.create_character_reference("cebolinha")
        monica = self.create_character_reference("monica")
        
        # Create directory
        story_dir = f"/tmp/comic_french_{int(time.time())}"
        os.makedirs(story_dir, exist_ok=True)
        
        # French comic story - 2 pages, 4 panels each
        story_pages = [
            {  # Page 1
                "title": "L'Aventure du Trésor Perdu",
                "panels": [
                    {
                        "scene": "two kids meeting in a park",
                        "dialogue": "Salut Monica! J'ai trouvé une carte!",
                        "characters": [cebolinha, monica],
                        "position": "top"
                    },
                    {
                        "scene": "looking at treasure map together",
                        "dialogue": "Un trésor? Allons-y!",
                        "characters": [cebolinha, monica],
                        "position": "bottom"
                    },
                    {
                        "scene": "walking through forest path",
                        "dialogue": "Par ici, je crois!",
                        "characters": [cebolinha, monica],
                        "position": "top-right"
                    },
                    {
                        "scene": "finding a big tree with X mark",
                        "dialogue": "Regardez! Le X!",
                        "characters": [cebolinha, monica],
                        "position": "bottom-right"
                    }
                ]
            },
            {  # Page 2
                "title": "La Découverte",
                "panels": [
                    {
                        "scene": "digging under the tree",
                        "dialogue": "Creusons ensemble!",
                        "characters": [cebolinha, monica],
                        "position": "top"
                    },
                    {
                        "scene": "finding a wooden chest",
                        "dialogue": "On l'a trouvé!",
                        "characters": [cebolinha, monica],
                        "position": "bottom"
                    },
                    {
                        "scene": "opening chest full of candy and toys",
                        "dialogue": "Des bonbons et des jouets!",
                        "characters": [cebolinha, monica],
                        "position": "top-right"
                    },
                    {
                        "scene": "celebrating together happily",
                        "dialogue": "Quelle aventure magnifique!",
                        "characters": [cebolinha, monica],
                        "position": "bottom-right"
                    }
                ]
            }
        ]
        
        print(f"\n{'='*60}")
        print(f"🇫🇷 Génération de Bande Dessinée - Style Turma da Mônica")
        print(f"📚 Modèle: SDXL (ou SD 1.5 fallback)")
        print(f"👦 Personnages: {cebolinha['name_fr']} et {monica['name_fr']}")
        print(f"📖 Histoire: 2 pages, 8 panneaux")
        print(f"💾 Répertoire: {story_dir}")
        print(f"{'='*60}\n")
        
        # Generate consistent seed
        base_seed = random.randint(1000, 9999)
        all_panels = []
        
        # Generate panels for each page
        for page_num, page in enumerate(story_pages, 1):
            print(f"\n📄 Page {page_num}: {page['title']}")
            print("-" * 40)
            
            page_panels = []
            
            for panel_num, panel in enumerate(page["panels"], 1):
                panel_id = (page_num - 1) * 4 + panel_num
                panel_seed = base_seed + panel_id
                
                # Generate panel
                success, image = self.generate_panel(
                    panel["scene"],
                    panel["characters"][0],
                    panel["characters"][1] if len(panel["characters"]) > 1 else None,
                    panel_seed,
                    panel_id
                )
                
                if success and image:
                    # Add French dialogue
                    image = self.add_speech_bubble_french(
                        image,
                        panel["dialogue"],
                        panel["position"]
                    )
                    
                    # Save panel
                    panel_filename = f"{story_dir}/page{page_num}_panel{panel_num}.png"
                    image.save(panel_filename)
                    print(f"✓ Panel {panel_num}: {panel['dialogue']}")
                    
                    page_panels.append({
                        "id": panel_id,
                        "page": page_num,
                        "panel": panel_num,
                        "description": panel["scene"],
                        "dialogue_fr": panel["dialogue"],
                        "image": panel_filename,
                        "generated": True
                    })
                else:
                    print(f"✗ Panel {panel_num}: Échec")
                    page_panels.append({
                        "id": panel_id,
                        "page": page_num, 
                        "panel": panel_num,
                        "description": panel["scene"],
                        "dialogue_fr": panel["dialogue"],
                        "generated": False
                    })
                
                time.sleep(2)  # Pause between panels
            
            all_panels.extend(page_panels)
        
        # Save metadata
        metadata = {
            "title_fr": "L'Aventure du Trésor Perdu",
            "title_en": "The Lost Treasure Adventure",
            "style": "Monica's Gang / Turma da Mônica",
            "model": "SDXL" if hasattr(self.pipe, 'text_encoder_2') else "SD 1.5",
            "characters": [
                {"name": cebolinha['name_fr'], "original": "Cebolinha"},
                {"name": monica['name_fr'], "original": "Mônica"}
            ],
            "pages": 2,
            "panels": all_panels,
            "language": "French",
            "created_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "directory": story_dir,
            "base_seed": base_seed
        }
        
        metadata_file = f"{story_dir}/metadata.json"
        with open(metadata_file, 'w', encoding='utf-8') as f:
            json.dump(metadata, f, ensure_ascii=False, indent=2)
        
        # Generate HTML viewer
        self.generate_comic_book_html(metadata, story_dir)
        
        print(f"\n{'='*60}")
        print(f"✅ Bande dessinée générée avec succès!")
        print(f"📁 Fichiers dans: {story_dir}/")
        print(f"🌐 Ouvrir: {story_dir}/comic_book.html")
        print(f"{'='*60}\n")
        
        return metadata
    
    def generate_comic_book_html(self, metadata, story_dir):
        """Generate HTML viewer for the comic book"""
        html_content = f"""<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{metadata['title_fr']} - Bande Dessinée</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&display=swap');
        
        body {{
            font-family: 'Kalam', cursive;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }}
        
        .comic-book {{
            max-width: 1200px;
            margin: 0 auto;
        }}
        
        .comic-header {{
            text-align: center;
            background: #ffeb3b;
            border: 4px solid #000;
            padding: 20px;
            margin-bottom: 20px;
            border-radius: 10px;
        }}
        
        h1 {{
            color: #e91e63;
            text-shadow: 3px 3px 0 #000;
            font-size: 48px;
            margin: 0;
            transform: rotate(-2deg);
        }}
        
        .page {{
            background: white;
            border: 4px solid #000;
            padding: 20px;
            margin-bottom: 30px;
            box-shadow: 10px 10px 0 rgba(0,0,0,0.3);
        }}
        
        .page-title {{
            background: #2196f3;
            color: white;
            padding: 10px;
            text-align: center;
            border: 2px solid #000;
            margin-bottom: 20px;
            font-size: 24px;
            font-weight: bold;
        }}
        
        .panels-grid {{
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }}
        
        .panel {{
            border: 3px solid #000;
            background: #fff;
            position: relative;
        }}
        
        .panel img {{
            width: 100%;
            height: auto;
            display: block;
        }}
        
        .panel-number {{
            position: absolute;
            top: 10px;
            left: 10px;
            background: #ff5722;
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            border: 2px solid #000;
            z-index: 10;
        }}
        
        .characters-info {{
            background: #4caf50;
            color: white;
            padding: 15px;
            border: 3px solid #000;
            margin-bottom: 20px;
            text-align: center;
            font-size: 18px;
        }}
        
        .character-badge {{
            display: inline-block;
            background: white;
            color: #4caf50;
            padding: 5px 15px;
            border-radius: 20px;
            margin: 0 10px;
            border: 2px solid #000;
        }}
    </style>
</head>
<body>
    <div class="comic-book">
        <div class="comic-header">
            <h1>{metadata['title_fr']}</h1>
        </div>
        
        <div class="characters-info">
            <strong>Personnages:</strong>
            {"".join([f'<span class="character-badge">{c["name"]}</span>' for c in metadata['characters']])}
        </div>
"""
        
        # Add pages
        for page_num in range(1, metadata['pages'] + 1):
            page_panels = [p for p in metadata['panels'] if p['page'] == page_num]
            
            html_content += f"""
        <div class="page">
            <div class="page-title">Page {page_num}</div>
            <div class="panels-grid">
"""
            
            for panel in page_panels:
                if panel['generated']:
                    img_path = os.path.basename(panel['image'])
                    html_content += f"""
                <div class="panel">
                    <div class="panel-number">{panel['panel']}</div>
                    <img src="{img_path}" alt="Panel {panel['panel']}">
                </div>
"""
            
            html_content += """
            </div>
        </div>
"""
        
        html_content += f"""
        <div class="comic-header" style="margin-top: 30px;">
            <p>Style: {metadata['style']}</p>
            <p>Créé le: {metadata['created_at']}</p>
            <p>Modèle: {metadata['model']}</p>
        </div>
    </div>
</body>
</html>"""
        
        html_file = f"{story_dir}/comic_book.html"
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(html_content)
        
        print(f"📖 HTML généré: {html_file}")

def main():
    generator = SDXLComicGenerator()
    generator.generate_french_comic_story()

if __name__ == "__main__":
    main()