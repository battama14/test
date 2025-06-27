/**
 * LFIST - API et données externes
 * Gère les connexions aux API et les données externes
 */

// Configuration
const API_CONFIG = {
    // Remplacer par les vraies API en production
    priceApi: 'https://api.example.com/price',
    statsApi: 'https://api.example.com/stats',
    holdersApi: 'https://api.example.com/holders',
    communityApi: 'https://api.example.com/community'
};

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    // Charger les données initiales
    fetchTokenData();
    fetchCommunityStats();
    
    // Mettre à jour les données toutes les 2 minutes
    setInterval(fetchTokenData, 120000);
    setInterval(fetchCommunityStats, 300000);
});

/**
 * Récupère les données du token (prix, market cap, etc.)
 */
async function fetchTokenData() {
    try {
        // En mode démo, utiliser des données simulées
        // En production, décommenter le code ci-dessous pour utiliser l'API réelle
        
        /*
        const response = await fetch(API_CONFIG.priceApi);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        updateTokenData(data);
        */
        
        // Simuler des données pour la démo
        const mockData = generateMockTokenData();
        updateTokenData(mockData);
        
    } catch (error) {
        console.error('Error fetching token data:', error);
        // Utiliser des données de secours en cas d'erreur
        const fallbackData = generateMockTokenData();
        updateTokenData(fallbackData);
    }
}

/**
 * Récupère les statistiques de la communauté
 */
async function fetchCommunityStats() {
    try {
        // En mode démo, utiliser des données simulées
        // En production, décommenter le code ci-dessous pour utiliser l'API réelle
        
        /*
        const response = await fetch(API_CONFIG.communityApi);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        updateCommunityStats(data);
        */
        
        // Simuler des données pour la démo
        const mockData = generateMockCommunityData();
        updateCommunityStats(mockData);
        
    } catch (error) {
        console.error('Error fetching community stats:', error);
        // Utiliser des données de secours en cas d'erreur
        const fallbackData = generateMockCommunityData();
        updateCommunityStats(fallbackData);
    }
}

/**
 * Met à jour les données du token dans l'interface
 */
function updateTokenData(data) {
    // Mettre à jour le prix
    updateElement('lfist-price', data.price);
    updateElement('live-price', data.price);
    updateElement('price-change', data.priceChange, true);
    
    // Mettre à jour les statistiques
    updateElement('market-cap', data.marketCap);
    updateElement('liquidity', data.liquidity);
    updateElement('volume-24h', data.volume);
    updateElement('burned-tokens', data.burned);
    updateElement('mc-change', data.mcChange, true);
    updateElement('liq-change', data.liqChange, true);
    updateElement('vol-change', data.volChange, true);
    
    // Mettre à jour les holders
    updateElement('holder-count', data.holders.toLocaleString());
    updateElement('live-holders', data.holders.toLocaleString());
    updateElement('footer-holders', data.holders.toLocaleString());
    
    // Mettre à jour le leader du jour
    if (data.dailyLeader) {
        updateElement('daily-leader', data.dailyLeader);
    }
}

/**
 * Met à jour les statistiques de la communauté dans l'interface
 */
function updateCommunityStats(data) {
    // Mettre à jour les statistiques de la communauté
    updateElement('telegram-members', data.telegram.toLocaleString() + '+');
    updateElement('twitter-followers', data.twitter.toLocaleString() + '+');
    updateElement('discord-members', data.discord.toLocaleString() + '+');
    
    // Mettre à jour les statistiques de jeu
    updateElement('total-games', data.totalGames.toLocaleString());
    updateElement('top-score', data.topScore.toLocaleString());
    updateElement('footer-games-played', data.totalGames.toLocaleString());
    updateElement('footer-active-players', data.activePlayers.toLocaleString() + '+');
}

/**
 * Génère des données simulées pour le token
 */
function generateMockTokenData() {
    return {
        price: '$0.000' + Math.floor(Math.random() * 10000),
        priceChange: (Math.random() * 10 - 5).toFixed(2) + '%',
        holders: Math.floor(10000 + Math.random() * 5000),
        marketCap: '$' + Math.floor(500000 + Math.random() * 500000),
        liquidity: '$' + Math.floor(100000 + Math.random() * 100000),
        volume: '$' + Math.floor(50000 + Math.random() * 50000),
        burned: Math.floor(1000000 + Math.random() * 1000000) + ' LFIST',
        mcChange: (Math.random() * 8 - 2).toFixed(2) + '%',
        liqChange: (Math.random() * 5 - 1).toFixed(2) + '%',
        volChange: (Math.random() * 15 - 5).toFixed(2) + '%',
        dailyLeader: ['Crypto_King', 'LFIST_Master', 'Diamond_Hands', 'Hodler123', 'MoonShot'][Math.floor(Math.random() * 5)]
    };
}

/**
 * Génère des données simulées pour la communauté
 */
function generateMockCommunityData() {
    return {
        telegram: Math.floor(25000 + Math.random() * 5000),
        twitter: Math.floor(15000 + Math.random() * 3000),
        discord: Math.floor(10000 + Math.random() * 2000),
        totalGames: Math.floor(50000 + Math.random() * 10000),
        topScore: Math.floor(1000000 + Math.random() * 500000),
        activePlayers: Math.floor(2500 + Math.random() * 500)
    };
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