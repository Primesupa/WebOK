// DevHub - Main JavaScript
// ============================================
// State Management
// ============================================
let currentLanguage = localStorage.getItem('devhub_language') || 'en';
let currentTheme = localStorage.getItem('devhub_theme') || 'dark';
let selectedProgrammingLanguage = null;
let currentFilters = {
    language: 'all',
    type: 'all',
    difficulty: 'all',
    sort: 'popular'
};
let librariesDisplayCount = 12;
let videosDisplayCount = 9;

// ============================================
// Initialization
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    initializeLanguage();
    initializeNavigation();
    initializeLanguages();
    initializeLibraries();
    initializeVideos();
    initializeFilters();
    initializeSearch();
    initializeScrollEffects();
    initializeMobileMenu();
});

// ============================================
// Theme Management
// ============================================
function initializeTheme() {
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');
    
    // Apply saved theme
    if (currentTheme === 'light') {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // Theme toggle handler
    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('dark-theme')) {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            currentTheme = 'light';
        } else {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            currentTheme = 'dark';
        }
        localStorage.setItem('devhub_theme', currentTheme);
    });
}

// ============================================
// Language/i18n Management
// ============================================
function initializeLanguage() {
    const languageBtn = document.getElementById('languageBtn');
    const languageDropdown = document.getElementById('languageDropdown');
    const langOptions = document.querySelectorAll('.lang-option');
    
    // Update current language display
    updateCurrentLanguageDisplay();
    
    // Apply translations
    applyTranslations(currentLanguage);
    
    // RTL support for Arabic
    if (currentLanguage === 'ar') {
        document.body.setAttribute('dir', 'rtl');
    }
    
    // Language dropdown toggle
    languageBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        languageDropdown.classList.toggle('active');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        languageDropdown.classList.remove('active');
    });
    
    // Language option selection
    langOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const lang = option.dataset.lang;
            changeLanguage(lang);
            languageDropdown.classList.remove('active');
        });
    });
}

function changeLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('devhub_language', lang);
    
    // Update display
    updateCurrentLanguageDisplay();
    
    // Apply translations
    applyTranslations(lang);
    
    // Handle RTL
    if (lang === 'ar') {
        document.body.setAttribute('dir', 'rtl');
    } else {
        document.body.setAttribute('dir', 'ltr');
    }
}

function updateCurrentLanguageDisplay() {
    const currentLangEl = document.getElementById('currentLang');
    const langMap = {
        'en': 'EN',
        'ar': 'AR',
        'es': 'ES',
        'fr': 'FR',
        'zh': 'ZH'
    };
    currentLangEl.textContent = langMap[currentLanguage] || 'EN';
}

function applyTranslations(lang) {
    // Translate elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.dataset.i18n;
        const translation = getTranslation(key, lang);
        
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            element.placeholder = translation;
        } else {
            element.innerHTML = translation;
        }
    });
    
    // Translate placeholder attributes
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.dataset.i18nPlaceholder;
        element.placeholder = getTranslation(key, lang);
    });
}

// ============================================
// Navigation
// ============================================
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-link');
    
    // Scroll effect on navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Active link highlighting
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Remove active from all links
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            
            // Add active to clicked link
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                const targetNavLink = document.querySelector(`.nav-link[href="${href}"]`);
                if (targetNavLink) {
                    targetNavLink.classList.add('active');
                }
            }
            
            // Close mobile menu
            document.getElementById('mobileMenu').classList.remove('active');
        });
    });
}

function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });
}

// ============================================
// Programming Languages Display
// ============================================
function initializeLanguages() {
    const languagesGrid = document.getElementById('languagesGrid');
    
    programmingLanguages.forEach(lang => {
        const card = createLanguageCard(lang);
        languagesGrid.appendChild(card);
    });
}

function createLanguageCard(lang) {
    const card = document.createElement('div');
    card.className = 'language-card fade-in';
    card.dataset.language = lang.id;
    
    card.innerHTML = `
        <div class="language-icon">${lang.icon}</div>
        <div class="language-name">${lang.name}</div>
    `;
    
    card.addEventListener('click', () => {
        // Toggle selection
        const wasActive = card.classList.contains('active');
        
        // Remove active from all
        document.querySelectorAll('.language-card').forEach(c => c.classList.remove('active'));
        
        if (!wasActive) {
            card.classList.add('active');
            selectedProgrammingLanguage = lang.id;
            currentFilters.language = lang.id;
        } else {
            selectedProgrammingLanguage = null;
            currentFilters.language = 'all';
        }
        
        // Update filter select
        document.getElementById('filterLanguage').value = currentFilters.language;
        
        // Apply filters
        applyFilters();
        
        // Scroll to libraries
        document.getElementById('libraries').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    
    return card;
}

// ============================================
// Libraries Display
// ============================================
function initializeLibraries() {
    renderLibraries();
    
    // Load more button
    document.getElementById('loadMoreLibraries').addEventListener('click', () => {
        librariesDisplayCount += 9;
        renderLibraries();
    });
}

function renderLibraries() {
    const librariesGrid = document.getElementById('librariesGrid');
    const loadMoreBtn = document.getElementById('loadMoreLibraries');
    
    // Filter libraries
    const filteredLibraries = filterContent(libraries);
    
    // Clear grid
    librariesGrid.innerHTML = '';
    
    // Display libraries
    const librariesToShow = filteredLibraries.slice(0, librariesDisplayCount);
    librariesToShow.forEach((lib, index) => {
        const card = createLibraryCard(lib);
        card.style.animationDelay = `${index * 0.05}s`;
        librariesGrid.appendChild(card);
    });
    
    // Show/hide load more button
    if (filteredLibraries.length <= librariesDisplayCount) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'inline-flex';
    }
    
    // No results message
    if (filteredLibraries.length === 0) {
        librariesGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 3rem;">No libraries found matching your criteria.</p>';
    }
}

function createLibraryCard(lib) {
    const card = document.createElement('div');
    card.className = 'library-card slide-in-up';
    card.dataset.language = lib.language;
    card.dataset.difficulty = lib.difficulty;
    
    const languageInfo = programmingLanguages.find(l => l.id === lib.language);
    
    card.innerHTML = `
        <div class="library-header">
            <div class="library-logo">${lib.icon}</div>
            <div class="library-info">
                <div class="library-name">${lib.name}</div>
                <div class="library-language">
                    <span>${languageInfo?.icon || ''}</span>
                    <span>${languageInfo?.name || lib.language}</span>
                </div>
            </div>
        </div>
        <p class="library-description">${lib.description}</p>
        <div class="library-footer">
            <div class="library-stats">
                <span class="stat-badge">
                    <i class="fas fa-star"></i> ${formatNumber(lib.stars)}
                </span>
                <span class="stat-badge">
                    <i class="fas fa-download"></i> ${lib.downloads}
                </span>
            </div>
            <button class="btn-docs" onclick="window.open('${lib.docs}', '_blank')">
                ${getTranslation('view_docs', currentLanguage)}
            </button>
        </div>
    `;
    
    return card;
}

// ============================================
// Videos Display
// ============================================
function initializeVideos() {
    renderVideos();
    
    // Load more button
    document.getElementById('loadMoreVideos').addEventListener('click', () => {
        videosDisplayCount += 6;
        renderVideos();
    });
}

function renderVideos() {
    const videosGrid = document.getElementById('videosGrid');
    const loadMoreBtn = document.getElementById('loadMoreVideos');
    
    // Filter videos
    const filteredVideos = filterContent(videos);
    
    // Clear grid
    videosGrid.innerHTML = '';
    
    // Display videos
    const videosToShow = filteredVideos.slice(0, videosDisplayCount);
    videosToShow.forEach((video, index) => {
        const card = createVideoCard(video);
        card.style.animationDelay = `${index * 0.05}s`;
        videosGrid.appendChild(card);
    });
    
    // Show/hide load more button
    if (filteredVideos.length <= videosDisplayCount) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'inline-flex';
    }
    
    // No results message
    if (filteredVideos.length === 0) {
        videosGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 3rem;">No videos found matching your criteria.</p>';
    }
}

function createVideoCard(video) {
    const card = document.createElement('div');
    card.className = 'video-card slide-in-up';
    card.dataset.language = video.language;
    card.dataset.difficulty = video.difficulty;
    
    const languageInfo = programmingLanguages.find(l => l.id === video.language);
    const difficultyClass = `difficulty-${video.difficulty}`;
    
    card.innerHTML = `
        <div class="video-thumbnail">
            <img src="${video.thumbnail}" alt="${video.title}" loading="lazy">
            <div class="video-overlay">
                <div class="play-btn">
                    <i class="fas fa-play"></i>
                </div>
            </div>
            <div class="video-duration">${video.duration}</div>
        </div>
        <div class="video-content">
            <h3 class="video-title">${video.title}</h3>
            <div class="video-meta">
                <span class="video-tag">
                    <span>${languageInfo?.icon || ''}</span>
                    <span>${languageInfo?.name || video.language}</span>
                </span>
                <span class="difficulty-badge ${difficultyClass}">
                    ${video.difficulty.charAt(0).toUpperCase() + video.difficulty.slice(1)}
                </span>
            </div>
            <div class="video-stats">
                <span><i class="fas fa-eye"></i> ${video.views}</span>
                <span><i class="fas fa-star"></i> ${video.rating}</span>
            </div>
        </div>
    `;
    
    card.addEventListener('click', () => {
        if (video.videoId) {
            // Use the openVideoModal function defined in index.html
            openVideoModal(video.videoId);
        } else {
            // Fallback: open YouTube search for this video title in a new tab
            const query = encodeURIComponent(video.title);
            window.open('https://www.youtube.com/results?search_query=' + query, '_blank');
        }
    });

    return card;
}

// Modal close handlers are already set up in index.html.
// This block is kept empty intentionally to avoid duplicate listeners.
// ============================================
// Filters
// ============================================
function initializeFilters() {
    const filterLanguage = document.getElementById('filterLanguage');
    const filterType = document.getElementById('filterType');
    const filterDifficulty = document.getElementById('filterDifficulty');
    const filterSort = document.getElementById('filterSort');
    const resetBtn = document.getElementById('resetFilters');
    
    // Filter change handlers
    filterLanguage.addEventListener('change', (e) => {
        currentFilters.language = e.target.value;
        
        // Update language card selection
        document.querySelectorAll('.language-card').forEach(card => {
            card.classList.remove('active');
            if (card.dataset.language === e.target.value) {
                card.classList.add('active');
            }
        });
        
        applyFilters();
    });
    
    filterType.addEventListener('change', (e) => {
        currentFilters.type = e.target.value;
        applyFilters();
    });
    
    filterDifficulty.addEventListener('change', (e) => {
        currentFilters.difficulty = e.target.value;
        applyFilters();
    });
    
    filterSort.addEventListener('change', (e) => {
        currentFilters.sort = e.target.value;
        applyFilters();
    });
    
    // Reset filters
    resetBtn.addEventListener('click', () => {
        currentFilters = {
            language: 'all',
            type: 'all',
            difficulty: 'all',
            sort: 'popular'
        };
        
        filterLanguage.value = 'all';
        filterType.value = 'all';
        filterDifficulty.value = 'all';
        filterSort.value = 'popular';
        
        document.querySelectorAll('.language-card').forEach(card => {
            card.classList.remove('active');
        });
        
        applyFilters();
    });
}

function applyFilters() {
    librariesDisplayCount = 12;
    videosDisplayCount = 9;
    renderLibraries();
    renderVideos();
}

function filterContent(items) {
    let filtered = [...items];
    
    // Filter by language
    if (currentFilters.language !== 'all') {
        filtered = filtered.filter(item => item.language === currentFilters.language);
    }
    
    // Filter by type
    if (currentFilters.type !== 'all') {
        filtered = filtered.filter(item => item.type === currentFilters.type);
    }
    
    // Filter by difficulty
    if (currentFilters.difficulty !== 'all') {
        filtered = filtered.filter(item => item.difficulty === currentFilters.difficulty);
    }
    
    // Sort
    switch (currentFilters.sort) {
        case 'popular':
            filtered.sort((a, b) => (b.stars || b.views || 0) - (a.stars || a.views || 0));
            break;
        case 'newest':
            // In a real app, you'd sort by date
            filtered.reverse();
            break;
        case 'rating':
            filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            break;
    }
    
    return filtered;
}

// ============================================
// Search
// ============================================
function initializeSearch() {
    const heroSearch = document.getElementById('heroSearch');
    const searchToggle = document.getElementById('searchToggle');
    
    heroSearch.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        performSearch(query);
    });
    
    // Search toggle button (could expand to show a search overlay)
    searchToggle.addEventListener('click', () => {
        heroSearch.focus();
        heroSearch.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
}

function performSearch(query) {
    if (!query) {
        applyFilters();
        return;
    }
    
    // Search in libraries
    const matchingLibraries = libraries.filter(lib => 
        lib.name.toLowerCase().includes(query) ||
        lib.description.toLowerCase().includes(query) ||
        lib.language.toLowerCase().includes(query)
    );
    
    // Search in videos
    const matchingVideos = videos.filter(video => 
        video.title.toLowerCase().includes(query) ||
        video.description.toLowerCase().includes(query) ||
        video.language.toLowerCase().includes(query)
    );
    
    // Render results
    const librariesGrid = document.getElementById('librariesGrid');
    const videosGrid = document.getElementById('videosGrid');
    
    librariesGrid.innerHTML = '';
    videosGrid.innerHTML = '';
    
    if (matchingLibraries.length === 0) {
        librariesGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 3rem;">No libraries found for your search.</p>';
    } else {
        matchingLibraries.forEach(lib => {
            librariesGrid.appendChild(createLibraryCard(lib));
        });
    }
    
    if (matchingVideos.length === 0) {
        videosGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 3rem;">No videos found for your search.</p>';
    } else {
        matchingVideos.forEach(video => {
            videosGrid.appendChild(createVideoCard(video));
        });
    }
    
    // Hide load more buttons
    document.getElementById('loadMoreLibraries').style.display = 'none';
    document.getElementById('loadMoreVideos').style.display = 'none';
}

// ============================================
// Scroll Effects
// ============================================
function initializeScrollEffects() {
    const scrollTopBtn = document.getElementById('scrollTop');
    
    // Show/hide scroll to top button
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe section headers
    document.querySelectorAll('.section-header').forEach(header => {
        observer.observe(header);
    });
}

// ============================================
// Utility Functions
// ============================================
function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// ============================================
// Newsletter Subscription
// ============================================
document.querySelector('.btn-newsletter')?.addEventListener('click', () => {
    const emailInput = document.querySelector('.newsletter-input');
    const email = emailInput.value.trim();
    
    if (email && validateEmail(email)) {
        alert('Thank you for subscribing! 🎉\n\nYou will receive the latest programming resources and tutorials.');
        emailInput.value = '';
    } else {
        alert('Please enter a valid email address.');
    }
});

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ============================================
// Community Join Button
// ============================================
document.querySelector('.community-section .btn-primary')?.addEventListener('click', () => {
    alert('Welcome to the DevHub Community! 🚀\n\nThis is a demo. In production, this would redirect to the community registration page.');
});

console.log('🚀 DevHub initialized successfully!');
