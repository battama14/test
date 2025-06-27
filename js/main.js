/**
 * LFIST - Script principal
 * Gère les fonctionnalités générales du site
 */

// Variables globales
let isLoading = true;
let visitCount = parseInt(localStorage.getItem('lfist_visit_count') || '0');

// Fonctions d'initialisation
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser le compteur de visites
    updateVisitCounter();
    
    // Simuler le chargement
    setTimeout(hideLoadingScreen, 1500);
    
    // Initialiser les événements
    initEvents();
    
    // Mettre à jour les statistiques
    updateStats();
});

/**
 * Initialise les écouteurs d'événements
 */
function initEvents() {
    // Bouton de langue
    const langButton = document.getElementById('languageButton');
    if (langButton) {
        langButton.addEventListener('click', toggleLanguage);
    }
    
    // Formulaire de contact
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    // Boutons de partage
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.classList.contains('twitter') ? shareTwitter :
                          this.classList.contains('telegram') ? shareTelegram :
                          this.classList.contains('facebook') ? shareFacebook :
                          this.classList.contains('copy') ? copyShareLink : null;
            
            if (action) action();
        });
    });
}

/**
 * Met à jour le compteur de visites
 */
function updateVisitCounter() {
    visitCount++;
    localStorage.setItem('lfist_visit_count', visitCount.toString());
    
    // Mettre à jour les éléments d'affichage
    const visitCounters = document.querySelectorAll('#visit-counter, #footer-visits');
    visitCounters.forEach(counter => {
        if (counter) counter.textContent = visitCount.toLocaleString();
    });
}

/**
 * Cache l'écran de chargement
 */
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            isLoading = false;
        }, 500);
    }
}

/**
 * Met à jour les statistiques affichées
 */
function updateStats() {
    // Simuler des données en direct (à remplacer par des API réelles)
    const mockData = {
        price: '$0.000' + Math.floor(Math.random() * 10000),
        priceChange: (Math.random() * 10 - 5).toFixed(2) + '%',
        holders: Math.floor(10000 + Math.random() * 5000),
        totalGames: Math.floor(50000 + Math.random() * 10000),
        topScore: Math.floor(1000000 + Math.random() * 500000),
        marketCap: '$' + Math.floor(500000 + Math.random() * 500000),
        liquidity: '$' + Math.floor(100000 + Math.random() * 100000),
        volume: '$' + Math.floor(50000 + Math.random() * 50000),
        burned: Math.floor(1000000 + Math.random() * 1000000) + ' LFIST',
        mcChange: (Math.random() * 8 - 2).toFixed(2) + '%',
        liqChange: (Math.random() * 5 - 1).toFixed(2) + '%',
        volChange: (Math.random() * 15 - 5).toFixed(2) + '%'
    };
    
    // Mettre à jour les éléments
    updateElement('lfist-price', mockData.price);
    updateElement('price-change', mockData.priceChange, true);
    updateElement('holder-count', mockData.holders.toLocaleString());
    updateElement('live-holders', mockData.holders.toLocaleString());
    updateElement('total-games', mockData.totalGames.toLocaleString());
    updateElement('top-score', mockData.topScore.toLocaleString());
    updateElement('live-price', mockData.price);
    updateElement('market-cap', mockData.marketCap);
    updateElement('liquidity', mockData.liquidity);
    updateElement('volume-24h', mockData.volume);
    updateElement('burned-tokens', mockData.burned);
    updateElement('mc-change', mockData.mcChange, true);
    updateElement('liq-change', mockData.liqChange, true);
    updateElement('vol-change', mockData.volChange, true);
    updateElement('footer-holders', mockData.holders.toLocaleString());
    updateElement('footer-games-played', mockData.totalGames.toLocaleString());
    
    // Leader du jour (aléatoire)
    const leaders = ['Crypto_King', 'LFIST_Master', 'Diamond_Hands', 'Hodler123', 'MoonShot'];
    updateElement('daily-leader', leaders[Math.floor(Math.random() * leaders.length)]);
}

/**
 * Met à jour un élément du DOM avec une valeur
 */
function updateElement(id, value, isChange = false) {
    const element = document.getElementById(id);
    if (!element) return;
    
    element.textContent = value;
    
    if (isChange) {
        // Ajouter la classe positive/negative pour les changements de prix
        const numValue = parseFloat(value);
        element.classList.remove('positive', 'negative');
        element.classList.add(numValue >= 0 ? 'positive' : 'negative');
        
        // Ajouter le signe + si positif
        if (numValue > 0 && !value.startsWith('+')) {
            element.textContent = '+' + value;
        }
    }
}

/**
 * Bascule entre les langues
 */
function toggleLanguage() {
    const langButton = document.getElementById('languageButton');
    if (!langButton) return;
    
    const currentLang = langButton.textContent.includes('Français') ? 'fr' : 'en';
    const newLang = currentLang === 'fr' ? 'en' : 'fr';
    
    langButton.innerHTML = newLang === 'fr' ? '🇫🇷 Français' : '🇺🇸 English';
    
    // À implémenter: système de traduction complet
    showNotification(`Langue changée en ${newLang === 'fr' ? 'Français' : 'Anglais'}`, 'info');
}

/**
 * Gère le formulaire de contact
 */
function handleContactForm(event) {
    event.preventDefault();
    
    const email = document.getElementById('contact-email').value;
    const subject = document.getElementById('contact-subject').value;
    const message = document.getElementById('contact-message').value;
    
    if (!email || !subject || !message) {
        showNotification('Veuillez remplir tous les champs', 'error');
        return;
    }
    
    // Simuler l'envoi du formulaire
    document.getElementById('contact-form').style.display = 'none';
    document.getElementById('contact-success').style.display = 'block';
    
    // Réinitialiser le formulaire après un délai
    setTimeout(() => {
        document.getElementById('contact-form').reset();
        document.getElementById('contact-form').style.display = 'block';
        document.getElementById('contact-success').style.display = 'none';
    }, 5000);
}

/**
 * Fonctions de partage social
 */
function shareTwitter() {
    const text = "Découvrez LFIST, le memecoin viral avec des jeux addictifs et une communauté explosive! 🚀";
    const url = window.location.href;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
}

function shareTelegram() {
    const text = "Découvrez LFIST, le memecoin viral avec des jeux addictifs et une communauté explosive! 🚀";
    const url = window.location.href;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
}

function shareFacebook() {
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
}

function copyShareLink() {
    const url = window.location.href;
    
    // Créer un élément temporaire pour copier
    const tempInput = document.createElement('input');
    tempInput.value = url;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    
    showNotification('Lien copié dans le presse-papiers!', 'success');
}

/**
 * Copie l'adresse du contrat
 */
function copyContract() {
    const contractAddress = document.getElementById('contractAddress').textContent;
    
    // Créer un élément temporaire pour copier
    const tempInput = document.createElement('input');
    tempInput.value = contractAddress;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    
    showNotification('Adresse du contrat copiée!', 'success');
}

/**
 * Change la période du graphique de prix
 */
function changeTimeframe(timeframe) {
    // Mettre à jour les boutons
    document.querySelectorAll('.chart-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const clickedBtn = document.querySelector(`.chart-btn:nth-child(${
        timeframe === '1H' ? 1 : 
        timeframe === '24H' ? 2 : 
        timeframe === '7D' ? 3 : 
        timeframe === '30D' ? 4 : 1
    })`);
    
    if (clickedBtn) clickedBtn.classList.add('active');
    
    // À implémenter: mise à jour du graphique
    console.log(`Timeframe changed to ${timeframe}`);
}

/**
 * Affiche une notification
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? 'var(--success-color)' : type === 'error' ? 'var(--error-color)' : '#3742fa'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        z-index: 10001;
        font-weight: bold;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        animation: slideInDown 0.3s ease;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutUp 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Mettre à jour les statistiques toutes les 30 secondes
setInterval(updateStats, 30000);