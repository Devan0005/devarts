// Navigation Manager
class NavigationManager {
    constructor() {
        this.currentSection = 'home';
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('.section');
        this.navToggle = document.getElementById('navToggle');
        this.navMenu = document.getElementById('navMenu');
        this.navbarHeight = 80; // Height of the fixed navbar
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupScrollSpy();
        this.initializePortfolioGallery();
    }
    
    setupEventListeners() {
        // Navigation links - smooth scroll to sections
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1); // Remove # from href
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - this.navbarHeight;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Restart tech animation if navigating to home
                    if (targetId === 'home' && window.portfolioGallery) {
                        setTimeout(() => {
                            window.portfolioGallery.restartTechAnimation();
                        }, 1000);
                    }
                }
                
                // Close mobile menu
                this.navMenu.classList.remove('active');
                this.navToggle.classList.remove('active');
            });
        });
        
        // Mobile toggle
        this.navToggle.addEventListener('click', () => {
            this.navMenu.classList.toggle('active');
            this.navToggle.classList.toggle('active');
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar')) {
                this.navMenu.classList.remove('active');
                this.navToggle.classList.remove('active');
            }
        });
        
        // Handle form submission
        const contactForm = document.querySelector('.futuristic-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(contactForm);
            });
        }
    }
    
    setupScrollSpy() {
        const scrollProgress = document.getElementById('scrollProgress');
        const scrollToTopBtn = document.getElementById('scrollToTop');
        
        // Update active nav link and scroll progress based on scroll position
        window.addEventListener('scroll', () => {
            let current = '';
            const scrollTop = window.pageYOffset;
            
            // Update active section
            this.sections.forEach(section => {
                const sectionTop = section.offsetTop - this.navbarHeight - 100;
                const sectionHeight = section.clientHeight;
                
                if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            if (current) {
                this.setActiveLinkBySection(current);
            }
            
            // Update scroll progress indicator
            if (scrollProgress) {
                const docHeight = document.body.scrollHeight - window.innerHeight;
                const scrollPercent = scrollTop / docHeight;
                scrollProgress.style.transform = `scaleX(${Math.min(scrollPercent, 1)})`;
            }
            
            // Show/hide scroll to top button
            if (scrollToTopBtn) {
                if (scrollTop > 300) {
                    scrollToTopBtn.classList.add('visible');
                } else {
                    scrollToTopBtn.classList.remove('visible');
                }
            }
        });
        
        // Scroll to top button functionality
        if (scrollToTopBtn) {
            scrollToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }
    
    setActiveLinkBySection(sectionId) {
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
    }
    
    setActiveLink(activeLink) {
        this.navLinks.forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }
    
    initializePortfolioGallery() {
        // Initialize portfolio gallery immediately since all sections are visible
        setTimeout(() => {
            window.portfolioGallery = new PortfolioGallery();
        }, 500); // Increased delay to ensure DOM is fully ready
    }
    
    handleFormSubmission(form) {
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Sending...</span><div class="btn-glow"></div>';
        
        // Simulate form submission (replace with actual form handling)
        setTimeout(() => {
            submitBtn.innerHTML = '<span>Message Sent!</span><div class="btn-glow"></div>';
            
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                form.reset();
            }, 2000);
        }, 1500);
    }
}

// Portfolio Gallery App
class PortfolioGallery {
    constructor() {
        this.images = [];
        this.filteredImages = [];
        this.currentImageIndex = 0;
        this.imagesPerLoad = 12;
        this.totalImages = 0;
        this.isLoading = false;
        this.lightboxActive = false;
        this.currentFilter = 'all';
        
        // DOM elements
        this.galleryContainer = document.getElementById('galleryContainer');
        this.loadingIndicator = document.getElementById('loadingIndicator');
        this.loadMoreBtn = document.getElementById('loadMoreBtn');
        this.loadMoreContainer = document.getElementById('loadMoreContainer');
        this.lightbox = document.getElementById('lightbox');
        this.lightboxImage = document.getElementById('lightboxImage');
        this.lightboxClose = document.getElementById('lightboxClose');
        this.lightboxOverlay = document.getElementById('lightboxOverlay');
        this.lightboxPrev = document.getElementById('lightboxPrev');
        this.lightboxNext = document.getElementById('lightboxNext');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        
        // Debug DOM elements
        console.log('Gallery container found:', !!this.galleryContainer);
        console.log('Filter buttons found:', this.filterBtns.length);
        
        this.init();
    }
    
    async init() {
        this.createParticles();
        this.setupEventListeners();
        this.setupMasonryGrid(); // Ensure masonry grid is created first
        await this.loadImageList();
        this.loadInitialImages();
    }
    
    // Create animated background particles
    createParticles() {
        const particlesContainer = document.getElementById('particles');
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random starting position
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 15 + 's';
            particle.style.animationDuration = (15 + Math.random() * 10) + 's';
            
            // Random colors
            const colors = ['#00ffff', '#ff00ff', '#00ff41', '#0080ff'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            particle.style.background = color;
            particle.style.boxShadow = `0 0 6px ${color}`;
            
            particlesContainer.appendChild(particle);
        }
    }
    
    // Load list of available images
    async loadImageList() {
        // For GitHub Pages compatibility, we'll use a predefined list
        // You can modify this array to include your actual image filenames
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        const maxImages = 50; // Check up to 50 images
        
        for (let i = 1; i <= maxImages; i++) {
            for (const ext of imageExtensions) {
                const imageName = `img${i}.${ext}`;
                const imageUrl = `photos/${imageName}`;
                
                try {
                    const exists = await this.imageExists(imageUrl);
                    if (exists) {
                        // Assign category based on image number for demo
                        const categories = ['portrait', 'animals', 'general'];
                        const category = categories[i % categories.length];
                        
                        this.images.push({
                            url: imageUrl,
                            name: imageName,
                            title: `${category.charAt(0).toUpperCase() + category.slice(1)} ${i}`,
                            category: category,
                            id: i
                        });
                        break; // Found this image, move to next number
                    }
                } catch (error) {
                    // Continue to next extension
                    continue;
                }
            }
        }
        
        // If no numbered images found, try some common names
        if (this.images.length === 0) {
            const commonNames = [
                'photo1', 'photo2', 'photo3', 'image1', 'image2', 'image3',
                'pic1', 'pic2', 'pic3', 'sample1', 'sample2', 'sample3',
                'demo1', 'demo2', 'demo3', 'test1', 'test2', 'test3'
            ];
            
            for (const name of commonNames) {
                for (const ext of imageExtensions) {
                    const imageName = `${name}.${ext}`;
                    const imageUrl = `photos/${imageName}`;
                    
                    try {
                        const exists = await this.imageExists(imageUrl);
                        if (exists) {
                            // Assign category based on name pattern for demo
                            const categories = ['portrait', 'animals', 'general'];
                            const category = categories[this.images.length % categories.length];
                            
                            this.images.push({
                                url: imageUrl,
                                name: imageName,
                                title: `${category.charAt(0).toUpperCase() + category.slice(1)} - ${name.charAt(0).toUpperCase() + name.slice(1)}`,
                                category: category,
                                id: this.images.length + 1
                            });
                        }
                    } catch (error) {
                        continue;
                    }
                }
            }
        }
        
        this.totalImages = this.images.length;
        console.log(`Found ${this.totalImages} images in photos folder`);
        
        // If still no images, create placeholder images for demo
        if (this.images.length === 0) {
            this.createPlaceholderImages();
        }
        
        // Initialize filtered images
        this.filteredImages = [...this.images];
    }
    
    // Check if image exists
    imageExists(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        });
    }
    
    // Create placeholder images for demo purposes
    createPlaceholderImages() {
        const placeholderColors = [
            '#00ffff', '#ff00ff', '#00ff41', '#0080ff', 
            '#ff4500', '#ffd700', '#ff1493', '#00ced1'
        ];
        
        const categories = ['portrait', 'animals', 'general'];
        
        for (let i = 1; i <= 24; i++) {
            const color = placeholderColors[i % placeholderColors.length];
            // Pinterest-style dimensions with varied aspect ratios
            const width = 400;
            const heights = [300, 400, 500, 600, 700, 800, 350, 450, 550, 650];
            const height = heights[Math.floor(Math.random() * heights.length)];
            const category = categories[Math.floor(Math.random() * categories.length)];
            
            this.images.push({
                url: `https://via.placeholder.com/${width}x${height}/${color.replace('#', '')}/ffffff?text=${category.charAt(0).toUpperCase() + category.slice(1)}+${i}`,
                name: `placeholder${i}.jpg`,
                title: `${category.charAt(0).toUpperCase() + category.slice(1)} Image ${i}`,
                category: category,
                id: i
            });
        }
        
        this.totalImages = this.images.length;
        this.filteredImages = [...this.images]; // Initially show all images
        console.log(`Created ${this.totalImages} placeholder images for demo`);
    }
    
    // Setup event listeners
    setupEventListeners() {
        // Load more button
        this.loadMoreBtn.addEventListener('click', () => {
            this.loadMoreImages();
        });
        
        // Lightbox events
        this.lightboxClose.addEventListener('click', () => {
            this.closeLightbox();
        });
        
        this.lightboxOverlay.addEventListener('click', () => {
            this.closeLightbox();
        });
        
        this.lightboxPrev.addEventListener('click', () => {
            this.showPreviousImage();
        });
        
        this.lightboxNext.addEventListener('click', () => {
            this.showNextImage();
        });
        
        // Filter buttons
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                this.setActiveFilter(btn);
                this.filterImages(filter);
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.lightboxActive) {
                switch(e.key) {
                    case 'Escape':
                        this.closeLightbox();
                        break;
                    case 'ArrowLeft':
                        this.showPreviousImage();
                        break;
                    case 'ArrowRight':
                        this.showNextImage();
                        break;
                }
            }
        });
        
        // Infinite scroll (optional alternative to load more button)
        window.addEventListener('scroll', () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000) {
                if (!this.isLoading && this.hasMoreImages()) {
                    // Uncomment the line below to enable infinite scroll instead of load more button
                    // this.loadMoreImages();
                }
            }
        });
    }
    
    // Load initial images
    async loadInitialImages() {
        console.log('Loading initial images...');
        console.log('Total images available:', this.images.length);
        console.log('Filtered images:', this.filteredImages.length);
        await this.loadMoreImages();
        this.hideLoadingIndicator();
    }
    
    // Load more images
    async loadMoreImages() {
        if (this.isLoading || !this.hasMoreImages()) return;
        
        this.isLoading = true;
        this.showLoadingState();
        
        const startIndex = this.currentImageIndex;
        const endIndex = Math.min(startIndex + this.imagesPerLoad, this.filteredImages.length);
        const imagesToLoad = this.filteredImages.slice(startIndex, endIndex);
        
        // Add delay for smooth loading animation
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Ensure masonry grid exists
        const masonryGrid = this.setupMasonryGrid();
        if (!masonryGrid) {
            console.error('Failed to create masonry grid');
            return;
        }
        
        for (let i = 0; i < imagesToLoad.length; i++) {
            const imageData = imagesToLoad[i];
            const imageCard = this.createImageCard(imageData, startIndex + i);
            masonryGrid.appendChild(imageCard);
            
            // Stagger the animation
            setTimeout(() => {
                imageCard.style.animationDelay = (i * 0.1) + 's';
            }, 50);
        }
        
        console.log(`Added ${imagesToLoad.length} images to gallery`);
        
        this.currentImageIndex = endIndex;
        this.isLoading = false;
        this.updateLoadMoreButton();
    }
    
    // Create image card element
    createImageCard(imageData, index) {
        const card = document.createElement('div');
        card.className = 'image-card';
        card.dataset.index = index;
        card.dataset.category = imageData.category || 'general';
        
        // Create image element to get natural dimensions
        const img = new Image();
        img.src = imageData.url;
        img.alt = imageData.title;
        img.loading = 'lazy';
        
        card.innerHTML = `
            <img src="${imageData.url}" alt="${imageData.title}" loading="lazy">
            <div class="image-overlay"></div>
            <div class="image-actions">
                <button class="action-btn save-btn" title="Save">
                    <span>📌</span>
                </button>
                <button class="action-btn download-btn" title="Download">
                    <span>⬇️</span>
                </button>
                <button class="action-btn share-btn" title="Share">
                    <span>📤</span>
                </button>
            </div>
            <div class="image-info">
                <div class="image-title">${imageData.title}</div>
                <div class="image-meta">${imageData.name}</div>
            </div>
        `;
        
        // Add click event for lightbox (only on image, not buttons)
        const cardImg = card.querySelector('img');
        const imageInfo = card.querySelector('.image-info');
        
        cardImg.addEventListener('click', () => {
            this.openLightbox(index);
        });
        
        imageInfo.addEventListener('click', () => {
            this.openLightbox(index);
        });
        
        // Add action button events
        const saveBtn = card.querySelector('.save-btn');
        const downloadBtn = card.querySelector('.download-btn');
        const shareBtn = card.querySelector('.share-btn');
        
        // Check if image is already saved
        if (this.isImageSaved(imageData.id)) {
            saveBtn.classList.add('saved');
        }
        
        saveBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.saveImage(imageData, saveBtn);
        });
        
        downloadBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.downloadImage(imageData);
        });
        
        shareBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.shareImage(imageData);
        });
        
        // Handle image load for masonry positioning
        const imageElement = card.querySelector('img');
        imageElement.addEventListener('load', () => {
            this.positionMasonryItem(card);
        });
        
        // Fallback positioning in case image is already loaded
        if (imageElement.complete) {
            setTimeout(() => this.positionMasonryItem(card), 200);
        }
        
        return card;
    }
    
    // Open lightbox
    openLightbox(index) {
        this.lightboxActive = true;
        this.currentLightboxIndex = index;
        this.lightboxImage.src = this.images[index].url;
        this.lightboxImage.alt = this.images[index].title;
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Close lightbox
    closeLightbox() {
        this.lightboxActive = false;
        this.lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    // Show previous image in lightbox
    showPreviousImage() {
        if (this.currentLightboxIndex > 0) {
            this.currentLightboxIndex--;
            this.lightboxImage.src = this.images[this.currentLightboxIndex].url;
            this.lightboxImage.alt = this.images[this.currentLightboxIndex].title;
        }
    }
    
    // Show next image in lightbox
    showNextImage() {
        if (this.currentLightboxIndex < this.images.length - 1) {
            this.currentLightboxIndex++;
            this.lightboxImage.src = this.images[this.currentLightboxIndex].url;
            this.lightboxImage.alt = this.images[this.currentLightboxIndex].title;
        }
    }
    
    // Filter images by category
    filterImages(category) {
        this.currentFilter = category;
        
        if (category === 'all') {
            this.filteredImages = [...this.images];
        } else {
            this.filteredImages = this.images.filter(img => img.category === category);
        }
        
        // Clear gallery and reset index
        const existingGrid = this.galleryContainer.querySelector('.masonry-grid');
        if (existingGrid) {
            existingGrid.innerHTML = '';
        } else {
            this.galleryContainer.innerHTML = '';
        }
        this.currentImageIndex = 0;
        this.setupMasonryGrid();
        
        // Load filtered images
        this.loadMoreImages();
    }
    
    // Setup masonry grid structure
    setupMasonryGrid() {
        if (!this.galleryContainer) {
            console.error('Gallery container not found');
            return;
        }
        
        let masonryGrid = this.galleryContainer.querySelector('.masonry-grid');
        if (!masonryGrid) {
            masonryGrid = document.createElement('div');
            masonryGrid.className = 'masonry-grid';
            masonryGrid.id = 'masonryGrid';
            this.galleryContainer.appendChild(masonryGrid);
            console.log('Masonry grid created');
        }
        return masonryGrid;
    }
    
    // Position masonry item using CSS Grid
    positionMasonryItem(card) {
        // With max-content rows, no manual positioning needed
        // Just ensure the card is visible
        card.style.gridRowEnd = 'auto';
        console.log('Card positioned automatically with max-content');
    }
    
    // Recalculate masonry layout
    recalculateMasonryLayout() {
        const cards = this.galleryContainer.querySelectorAll('.image-card');
        cards.forEach(card => {
            setTimeout(() => this.positionMasonryItem(card), 50);
        });
    }
    
    // Save image functionality
    saveImage(imageData, saveBtn) {
        // Add clicked animation
        saveBtn.classList.add('clicked');
        setTimeout(() => saveBtn.classList.remove('clicked'), 300);
        
        // Toggle saved state
        if (saveBtn.classList.contains('saved')) {
            saveBtn.classList.remove('saved');
            this.removeSavedImage(imageData.id);
            this.showNotification('Removed from saved images', 'info');
        } else {
            saveBtn.classList.add('saved');
            this.addSavedImage(imageData);
            this.showNotification('Image saved to collection!', 'success');
        }
    }
    
    // Download image functionality
    async downloadImage(imageData) {
        try {
            // For placeholder images from external URLs, we'll create a download link
            const response = await fetch(imageData.url);
            const blob = await response.blob();
            
            // Create download link
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = imageData.name || `image-${imageData.id}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Clean up
            window.URL.revokeObjectURL(downloadUrl);
            
            this.showNotification('Image downloaded successfully!', 'success');
        } catch (error) {
            console.error('Download failed:', error);
            this.showNotification('Download failed. Please try again.', 'error');
        }
    }
    
    // Share image functionality
    shareImage(imageData) {
        // Check if Web Share API is supported
        if (navigator.share) {
            navigator.share({
                title: imageData.title,
                text: `Check out this amazing image: ${imageData.title}`,
                url: imageData.url
            }).then(() => {
                this.showNotification('Shared successfully!', 'success');
            }).catch((error) => {
                console.error('Sharing failed:', error);
                this.fallbackShare(imageData);
            });
        } else {
            this.fallbackShare(imageData);
        }
    }
    
    // Fallback share functionality
    fallbackShare(imageData) {
        // Copy image URL to clipboard
        const shareText = `${imageData.title} - ${imageData.url}`;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareText).then(() => {
                this.showNotification('Link copied to clipboard!', 'success');
            }).catch(() => {
                this.manualCopyShare(shareText);
            });
        } else {
            this.manualCopyShare(shareText);
        }
    }
    
    // Manual copy functionality
    manualCopyShare(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showNotification('Link copied to clipboard!', 'success');
        } catch (err) {
            this.showNotification('Unable to copy. Please copy manually: ' + text, 'info');
        }
        
        document.body.removeChild(textArea);
    }
    
    // Saved images management
    addSavedImage(imageData) {
        let savedImages = JSON.parse(localStorage.getItem('savedImages') || '[]');
        if (!savedImages.find(img => img.id === imageData.id)) {
            savedImages.push(imageData);
            localStorage.setItem('savedImages', JSON.stringify(savedImages));
        }
    }
    
    removeSavedImage(imageId) {
        let savedImages = JSON.parse(localStorage.getItem('savedImages') || '[]');
        savedImages = savedImages.filter(img => img.id !== imageId);
        localStorage.setItem('savedImages', JSON.stringify(savedImages));
    }
    
    // Check if image is saved
    isImageSaved(imageId) {
        const savedImages = JSON.parse(localStorage.getItem('savedImages') || '[]');
        return savedImages.some(img => img.id === imageId);
    }
    
    // Show notification
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // Restart tech animation
    restartTechAnimation() {
        const techContainer = document.querySelector('.tech-art-container');
        
        if (techContainer) {
            // Remove and re-add the container to restart all animations
            const parent = techContainer.parentNode;
            const newContainer = techContainer.cloneNode(true);
            parent.removeChild(techContainer);
            
            setTimeout(() => {
                parent.appendChild(newContainer);
            }, 100);
        }
    }
    
    // Set active filter button
    setActiveFilter(activeBtn) {
        this.filterBtns.forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    }
    
    // Check if there are more images to load
    hasMoreImages() {
        return this.currentImageIndex < this.filteredImages.length;
    }
    
    // Show loading state
    showLoadingState() {
        this.loadMoreBtn.disabled = true;
        this.loadMoreBtn.innerHTML = '<span>Loading...</span><div class="btn-glow"></div>';
    }
    
    // Update load more button
    updateLoadMoreButton() {
        if (this.hasMoreImages()) {
            this.loadMoreBtn.disabled = false;
            this.loadMoreBtn.innerHTML = '<span>Load More</span><div class="btn-glow"></div>';
        } else {
            this.loadMoreContainer.style.display = 'none';
        }
    }
    
    // Hide loading indicator
    hideLoadingIndicator() {
        this.loadingIndicator.classList.add('hidden');
        setTimeout(() => {
            this.loadingIndicator.style.display = 'none';
        }, 400);
    }
}

// Utility functions for smooth animations
class AnimationUtils {
    static fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        let start = performance.now();
        
        const animate = (timestamp) => {
            const elapsed = timestamp - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.opacity = progress;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    static slideUp(element, duration = 300) {
        const height = element.offsetHeight;
        element.style.overflow = 'hidden';
        element.style.height = height + 'px';
        element.style.transition = `height ${duration}ms ease`;
        
        setTimeout(() => {
            element.style.height = '0px';
        }, 10);
        
        setTimeout(() => {
            element.style.display = 'none';
            element.style.height = '';
            element.style.overflow = '';
            element.style.transition = '';
        }, duration);
    }
}

// Performance optimization for masonry layout
class MasonryOptimizer {
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    static optimizeImages() {
        const images = document.querySelectorAll('.image-card img');
        
        images.forEach(img => {
            if (!img.complete) {
                img.addEventListener('load', () => {
                    this.recalculateLayout();
                });
            }
        });
    }
    
    static recalculateLayout() {
        // Force browser to recalculate the masonry layout
        const container = document.getElementById('galleryContainer');
        if (container) {
            container.style.columnGap = container.style.columnGap;
        }
    }
}

// Initialize the navigation and app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing Dev Arts Portfolio...');
    
    // Add a small delay for smooth initialization
    setTimeout(() => {
        // Initialize navigation manager
        window.navigationManager = new NavigationManager();
        
        // Optimize layout on window resize
        window.addEventListener('resize', 
            MasonryOptimizer.debounce(() => {
                MasonryOptimizer.recalculateLayout();
                if (window.portfolioGallery) {
                    window.portfolioGallery.recalculateMasonryLayout();
                }
            }, 250)
        );
        
        console.log('✨ Dev Arts Portfolio initialized successfully!');
    }, 100);
});

// Add some extra visual enhancements
document.addEventListener('DOMContentLoaded', () => {
    // Add mouse move effect to title
    const title = document.querySelector('.main-title');
    if (title) {
        document.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            
            const xPercent = (clientX / innerWidth - 0.5) * 2;
            const yPercent = (clientY / innerHeight - 0.5) * 2;
            
            title.style.transform = `translate(${xPercent * 10}px, ${yPercent * 10}px)`;
        });
    }
    
    // Add scroll-based parallax effect to grid
    const grid = document.querySelector('.grid-overlay');
    if (grid) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            grid.style.transform = `translate(${parallax * 0.1}px, ${parallax * 0.05}px)`;
        });
    }
}); 