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
        this.gallery = document.getElementById('galleryContainer');
        this.lightbox = document.getElementById('lightbox');
        this.lightboxImage = document.getElementById('lightboxImage');
        this.lightboxOverlay = document.getElementById('lightboxOverlay');
        this.closeBtn = document.getElementById('lightboxClose');
        this.prevBtn = document.getElementById('lightboxPrev');
        this.nextBtn = document.getElementById('lightboxNext');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.loadingIndicator = document.getElementById('loadingIndicator');
        this.imageIndex = 0;
        this.images = [];
        this.filteredImages = [];
        this.init();
    }

    async init() {
        this.showLoading();
        await this.loadImages();
        this.hideLoading();
        try {
            this.bindEvents();
        } catch (e) {
            console.error('bindEvents failed:', e);
        }
    }

    showLoading() {
        if (this.loadingIndicator) {
            this.loadingIndicator.style.display = 'flex';
        }
    }

    hideLoading() {
        if (this.loadingIndicator) {
            this.loadingIndicator.style.display = 'none';
        }
    }

    async loadImages() {
        try {
            // Fetch the image list from photos.json (explicit relative path and no-cache)
            const response = await fetch('./photos.json', { cache: 'no-store' });
            if (!response.ok) throw new Error(`Failed to load images: ${response.status}`);
            const raw = await response.json();

            // Normalize to an array of objects: [{ url: string, category: string }]
            const toItem = (value) => {
                if (!value) return null;
                if (typeof value === 'string') return { url: value, category: 'general' };
                if (typeof value.url === 'string') return { url: value.url, category: value.category || 'general' };
                if (value.url && typeof value.url.href === 'string') return { url: value.url.href, category: value.category || 'general' };
                return null;
            };

            const list = Array.isArray(raw) ? raw : (Array.isArray(raw.images) ? raw.images : []);
            const normalized = list.map(toItem).filter(Boolean);

            if (!normalized.length) throw new Error('No valid images in photos.json');

            this.images = normalized;
            this.filteredImages = [...this.images];
            this.displayImages();
        } catch (error) {
            console.error('Error loading images:', error);
            this.displayPlaceholder();
        }
    }

    displayImages() {
        this.gallery.innerHTML = '';
        this.gallery.className = 'gallery-container masonry-grid';
        this.filteredImages.forEach((img, index) => {
            const item = document.createElement('div');
            item.className = 'image-card';
            item.setAttribute('data-category', img.category);
            item.innerHTML = `
                <img src="${img.url}" alt="Portfolio image ${index + 1}" loading="lazy">
                <div class="image-overlay"></div>
                <div class="image-actions">
                    <button class="action-btn view-btn" aria-label="View image">
                        <span>🔍</span>
                    </button>
                </div>
            `;
            item.addEventListener('click', () => this.openLightbox(index));
            this.gallery.appendChild(item);
        });
    }

    displayPlaceholder() {
        this.gallery.innerHTML = '<p>Gallery could not be loaded.</p>';
    }

    bindEvents() {
        // Filter buttons
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                this.filterBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');
                
                const filter = btn.getAttribute('data-filter');
                this.filterImages(filter);
            });
        });

        // Lightbox events
        this.closeBtn.addEventListener('click', () => this.closeLightbox());
        this.lightboxOverlay.addEventListener('click', () => this.closeLightbox());
        this.prevBtn.addEventListener('click', () => this.prevImage());
        this.nextBtn.addEventListener('click', () => this.nextImage());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.lightbox.classList.contains('active')) {
                switch(e.key) {
                    case 'Escape':
                        this.closeLightbox();
                        break;
                    case 'ArrowLeft':
                        this.prevImage();
                        break;
                    case 'ArrowRight':
                        this.nextImage();
                        break;
                }
            }
        });
    }

    filterImages(category) {
        if (category === 'all') {
            this.filteredImages = [...this.images];
        } else {
            this.filteredImages = this.images.filter(img => img.category === category);
        }
        this.displayImages();
    }

    openLightbox(index) {
        this.imageIndex = index;
        this.lightboxImage.src = this.filteredImages[index].url;
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeLightbox() {
        this.lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    prevImage() {
        this.imageIndex = (this.imageIndex - 1 + this.filteredImages.length) % this.filteredImages.length;
        this.lightboxImage.src = this.filteredImages[this.imageIndex].url;
    }

    nextImage() {
        this.imageIndex = (this.imageIndex + 1) % this.filteredImages.length;
        this.lightboxImage.src = this.filteredImages[this.imageIndex].url;
    }
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
        const items = this.gallery.querySelectorAll('.image-card');
        // Let CSS grid handle the layout naturally
        items.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
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

// Scroll to top functionality
class ScrollManager {
    constructor() {
        this.scrollToTopBtn = document.getElementById('scrollToTop');
        this.scrollProgress = document.getElementById('scrollProgress');
        this.bindEvents();
    }

    bindEvents() {
        window.addEventListener('scroll', () => {
            this.updateScrollProgress();
            this.toggleScrollToTop();
        });

        if (this.scrollToTopBtn) {
            this.scrollToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    updateScrollProgress() {
        if (!this.scrollProgress) return;
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        this.scrollProgress.style.width = scrollPercent + '%';
    }

    toggleScrollToTop() {
        if (!this.scrollToTopBtn) return;
        if (window.pageYOffset > 300) {
            this.scrollToTopBtn.classList.add('visible');
        } else {
            this.scrollToTopBtn.classList.remove('visible');
        }
    }
}

// Contact Handler
class ContactHandler {
    constructor() {
        this.instagramItem = document.querySelector('.instagram-clickable');
        this.bindEvents();
    }

    bindEvents() {
        if (this.instagramItem) {
            this.instagramItem.style.cursor = 'pointer';
            this.instagramItem.addEventListener('click', () => {
                window.open('https://www.instagram.com/_pencil__creations_/', '_blank');
            });
            
            // Add hover effect
            this.instagramItem.addEventListener('mouseenter', () => {
                this.instagramItem.style.transform = 'translateX(5px)';
                this.instagramItem.style.transition = 'transform 0.3s ease';
            });
            
            this.instagramItem.addEventListener('mouseleave', () => {
                this.instagramItem.style.transform = 'translateX(0)';
            });
        }
    }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    new NavigationManager();
    const gallery = new PortfolioGallery();
    AnimationUtils.init();
    new FormHandler();
    new ScrollManager();
    new ContactHandler();
    new MasonryOptimizer(document.getElementById('galleryContainer'));
});



