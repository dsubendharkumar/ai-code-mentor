# 🎨 Extension Icons - Setup Instructions

The Chrome extension requires 3 icon files in the `icons/` directory:
- `icon16.png` (16x16 pixels)
- `icon48.png` (48x48 pixels)  
- `icon128.png` (128x128 pixels)

## 📥 Option 1: Download Free Icons (Recommended)

### From Flaticon
1. Go to https://www.flaticon.com/
2. Search for: "robot ai" or "artificial intelligence" or "mentor"
3. Download icons in PNG format
4. Resize to the required dimensions
5. Save as `icon16.png`, `icon48.png`, `icon128.png`

### From Icons8
1. Go to https://icons8.com/
2. Search for: "robot" or "ai brain" or "teaching"
3. Download in different sizes
4. Save in the `icons/` folder

### Recommended Search Terms
- robot mentor
- ai assistant
- code helper
- learning robot
- brain circuit
- smart assistant

## 🎨 Option 2: Design Your Own

### Using Canva (Free)
1. Go to https://www.canva.com/
2. Create custom dimensions (16x16, 48x48, 128x128)
3. Use their AI or design tools
4. Export as PNG

### Using Figma (Free)
1. Go to https://www.figma.com/
2. Create frames with correct dimensions
3. Design your icon
4. Export as PNG

## 🤖 Option 3: AI Image Generation

### Using DALL-E, Midjourney, or Stable Diffusion

**Prompt suggestion:**
```
A simple, modern icon of a friendly robot mentor with a lightbulb, 
purple and blue gradient colors, minimalist style, flat design, 
perfect for a Chrome extension
```

Then resize to required dimensions.

## 🔧 Option 4: Simple Placeholder (Quick Start)

Create simple colored squares as placeholders:

### Using Online Tools
1. Go to https://www.favicon-generator.org/
2. Upload any image
3. Generate favicons
4. Download the PNG files
5. Rename to match requirements

### Using Command Line (ImageMagick)
```bash
# Install ImageMagick first
# macOS: brew install imagemagick
# Ubuntu: sudo apt-get install imagemagick

# Create simple colored icons
convert -size 16x16 xc:#667eea icon16.png
convert -size 48x48 xc:#667eea icon48.png
convert -size 128x128 xc:#667eea icon128.png
```

## ✅ Verification

After creating/downloading icons:

1. Place all 3 files in `extension/icons/` directory
2. Verify file names are exact:
   - `icon16.png`
   - `icon48.png`
   - `icon128.png`
3. Verify they are PNG format
4. Reload the extension in Chrome

## 🎨 Design Recommendations

**Colors:**
- Primary: Purple (#667eea) or Blue (#764ba2)
- Accent: Light purple or teal
- Style: Modern, flat, minimal

**Elements to Include:**
- Robot or AI symbol
- Lightbulb (hint/learning)
- Code brackets
- Brain or circuit

**Style Tips:**
- Keep it simple and recognizable
- Use 2-3 colors maximum
- Ensure it's visible at small sizes (16px)
- Avoid too much detail

## 📝 File Structure

```
extension/
└── icons/
    ├── icon16.png   (16x16 pixels)
    ├── icon48.png   (48x48 pixels)
    └── icon128.png  (128x128 pixels)
```

## ⚠️ Common Issues

**Issue:** Extension won't load
- **Fix:** Check file names are exact (case-sensitive)

**Issue:** Icons look blurry
- **Fix:** Use exact dimensions, don't upscale small images

**Issue:** Icons don't show in Chrome
- **Fix:** Make sure files are PNG format, not JPG or other

## 🚀 Quick Start for Testing

If you just want to test the extension without perfect icons:

1. Download ANY small PNG image
2. Resize it to 16px, 48px, and 128px
3. Name them correctly
4. You can always replace them later!

The extension will work perfectly even with simple placeholder icons.

---

**Need help?** 
- Check README.md for full setup instructions
- See SETUP_GUIDE.md for step-by-step walkthrough
