// Navigation Manager
class NavigationManager {
    constructor() {
        this.navToggle = document.querySelector('.nav-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.bindEvents();
    }

    bindEvents() {
        this.navToggle.addEventListener('click', () => {
            this.navMenu.classList.toggle('active');
        });

        this.navLinks.forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                document.querySelector(targetId).scrollIntoView({
                    behavior: 'smooth'
                });
                this.navMenu.classList.remove('active');
            });
        });
    }
}

// Portfolio Gallery
class PortfolioGallery {
    constructor() {
        this.gallery = document.getElementById('gallery');
        this.lightbox = document.getElementById('lightbox');
        this.lightboxImage = document.getElementById('lightbox-img');
        this.closeBtn = document.querySelector('.close');
        this.prevBtn = document.querySelector('.prev');
        this.nextBtn = document.querySelector('.next');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.imageIndex = 0;
        this.images = [];
        this.filteredImages = [];
        this.init();
    }

    async init() {
        await this.loadImages();
        this.bindEvents();
    }

    async loadImages() {
        try {
            // 🔹 Fetch the image list from photos.json
            const response = await fetch('photos.json');
            if (!response.ok) throw new Error('Failed to load images');
            const imageList = await response.json();

            // Convert into objects for filtering
            this.images = imageList.map((url, i) => ({
                url,
                category: i % 2 === 0 ? 'web' : 'app'
            }));

            this.filteredImages = [...this.images];
            this.displayImages();
        } catch (error) {
            console.error('Error loading images:', error);
            this.displayPlaceholder();
        }
    }

    displayImages() {
        this.gallery.innerHTML = '';
        this.filteredImages.forEach((img, index) => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.innerHTML = `
                <img src="${img.url}" alt="Portfolio image ${index + 1}" loading="lazy">
                <div class="overlay">
                    <button class="view-btn" aria-label="View image">🔍</button>
                </div>
            `;
            item.querySelector('.view-btn').addEventListener('click', () => this.openLightbox(index));
            this.gallery.appendChild(item);
        });
    }

    displayPlaceholder() {
        this.gallery.innerHTML = '<p>Gallery could not be loaded.</p>';
    }

    // (rest of your code: lightbox, next/prev, filters… stays the same)
}

// Animation Utils
class AnimationUtils {
    static init() {
        const sections = document.querySelectorAll('section');
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, { threshold: 0.1 });

        sections.forEach(section => observer.observe(section));

        // Title hover effect fix
        const title = document.querySelector('.brand-title');
        if (title) {
            title.addEventListener('mouseover', () => {
                title.style.transform = 'scale(1.05)';
            });
            title.addEventListener('mouseout', () => {
                title.style.transform = 'scale(1)';
            });
        }
    }
}

// Form Handler
class FormHandler {
    constructor() {
        this.form = document.querySelector('.contact-form');
        this.submitBtn = this.form.querySelector('button');
        this.bindEvents();
    }

    bindEvents() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            this.submitBtn.textContent = 'Sending...';
            this.submitBtn.disabled = true;
            
            // Fake async submit
            setTimeout(() => {
                this.form.reset();
                this.submitBtn.textContent = 'Sent!';
                setTimeout(() => {
                    this.submitBtn.textContent = 'Send';
                    this.submitBtn.disabled = false;
                }, 2000);
            }, 1000);
        });
    }
}

// Masonry Optimizer
class MasonryOptimizer {
    constructor(gallery) {
        this.gallery = gallery;
        this.resizeTimeout = null;
        this.init();
    }

    init() {
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => this.optimize(), 200);
        });
        this.optimize();
    }

    optimize() {
        if (!this.gallery) return;
        const items = this.gallery.querySelectorAll('.gallery-item');
        items.forEach(item => {
            item.style.height = Math.random() > 0.5 ? '200px' : '300px';
        });
    }
}

// Saved Collection
class SavedCollection {
    constructor() {
        this.savedImages = JSON.parse(localStorage.getItem('savedImages')) || [];
    }

    saveImage(imageUrl) {
        if (!this.savedImages.includes(imageUrl)) {
            this.savedImages.push(imageUrl);
            localStorage.setItem('savedImages', JSON.stringify(this.savedImages));
        }
    }

    downloadImage(imageUrl) {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = imageUrl.split('/').pop();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    shareImage(imageUrl) {
        if (navigator.share) {
            navigator.share({ title: 'Check out this photo', url: imageUrl });
        } else {
            navigator.clipboard.writeText(imageUrl);
            alert('Image URL copied to clipboard');
        }
    }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    new NavigationManager();
    const gallery = new PortfolioGallery();
    AnimationUtils.init();
    new FormHandler();
    new MasonryOptimizer(document.getElementById('gallery'));
});

