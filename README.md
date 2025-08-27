# 🚀 Futuristic Portfolio Gallery

A high-tech, responsive portfolio website with a dark theme, neon highlights, and smooth animations. Features dynamic image loading from a `photos/` folder and works both locally and on GitHub Pages.

## ✨ Features

- **Futuristic Design**: Dark background with neon cyan/purple highlights
- **Responsive Masonry Grid**: Pinterest-style layout that adapts to all screen sizes
- **Dynamic Image Loading**: Automatically loads images from the `photos/` folder
- **Smooth Animations**: Hover effects, smooth transitions, and particle background
- **Lightbox Gallery**: Click images to view in full-screen lightbox with navigation
- **Load More / Infinite Scroll**: Efficiently loads images in batches
- **GitHub Pages Ready**: Works without backend or server setup

## 🎯 Quick Start

### 1. Local Development
1. Clone or download this project
2. Add your images to the `photos/` folder
3. Open `index.html` in your browser

### 2. GitHub Pages Deployment
1. Upload all files to your GitHub repository
2. Add your images to the `photos/` folder
3. Enable GitHub Pages in repository settings
4. Your portfolio will be live at `https://yourusername.github.io/repository-name`

## 📁 File Structure

```
project4/
├── index.html          # Main HTML file
├── style.css           # Futuristic styling and animations
├── script.js           # Dynamic image loading and interactions
├── photos/             # 👈 Add your images here!
│   ├── img1.jpg
│   ├── img2.png
│   └── ...
└── README.md          # This file
```

## 🖼️ Adding Your Images

The website automatically detects images in the `photos/` folder. Supported formats:
- `.jpg` / `.jpeg`
- `.png`
- `.gif`
- `.webp`

### Naming Convention (Recommended)
For best results, name your images:
- `img1.jpg`, `img2.jpg`, `img3.jpg`, etc.
- Or: `photo1.png`, `photo2.png`, etc.
- Or: `pic1.jpg`, `pic2.jpg`, etc.

The script will automatically find and load them in order.

### Custom Names
You can also use any filename - the script will try to detect common naming patterns:
- `sample1.jpg`, `demo1.png`, `test1.gif`, etc.

## 🎨 Customization

### Colors & Theme
Edit the CSS variables in `style.css`:
```css
:root {
    --primary-bg: #0a0a0a;        /* Main background */
    --neon-cyan: #00ffff;         /* Primary accent */
    --neon-purple: #ff00ff;       /* Secondary accent */
    --neon-green: #00ff41;        /* Success color */
    --neon-blue: #0080ff;         /* Info color */
}
```

### Title & Branding
Change the title in `index.html`:
```html
<span class="title-text">My Portfolio</span>
<p class="subtitle">Futuristic Digital Gallery</p>
```

### Loading Behavior
Modify `script.js` to change how many images load at once:
```javascript
this.imagesPerLoad = 12; // Change this number
```

## 🔧 Advanced Features

### Enable Infinite Scroll
In `script.js`, uncomment this line to enable infinite scroll instead of "Load More" button:
```javascript
// this.loadMoreImages(); // Remove the // to enable
```

### Custom Image Sources
To load images from a different folder or external URLs, modify the `loadImageList()` function in `script.js`.

## 📱 Responsive Design

The gallery automatically adapts to different screen sizes:
- **Mobile**: 1 column
- **Tablet**: 2 columns  
- **Desktop**: 3 columns
- **Large Desktop**: 4 columns

## 🌟 Performance Features

- **Lazy Loading**: Images load only when needed
- **Optimized Animations**: GPU-accelerated CSS transforms
- **Efficient Masonry**: CSS Grid-based layout
- **Debounced Resize**: Optimized window resize handling

## 🎮 Controls

### Lightbox Navigation
- **Click image**: Open in lightbox
- **ESC key**: Close lightbox
- **Arrow keys**: Navigate between images
- **Click arrows**: Navigate with mouse
- **Click outside**: Close lightbox

### Loading
- **Load More button**: Load additional images
- **Infinite scroll**: Automatic loading when scrolling (optional)

## 🔍 Troubleshooting

### Images Not Loading?
1. Check that images are in the `photos/` folder
2. Verify image file extensions (jpg, png, gif, webp)
3. Ensure proper naming convention (`img1.jpg`, `img2.jpg`, etc.)
4. Check browser console for error messages

### GitHub Pages Issues?
1. Make sure all files are in the repository root
2. Verify GitHub Pages is enabled in repository settings
3. Check that `photos/` folder and images are committed to the repository

### Performance Issues?
1. Optimize image sizes (recommended: under 1MB each)
2. Use modern formats like WebP when possible
3. Reduce the number of images loaded per batch

## 🎨 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Made with ⚡ for the future of web portfolios** 