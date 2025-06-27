/**
 * LFIST - Intégration DexScreener API
 * Récupération des données DeFi en temps réel
 */

class LFISTDexScreener {
    constructor() {
        // Configuration
        this.apiBaseUrl = 'https://api.dexscreener.com/latest/dex';
        this.lfistAddress = '0xc0679bF1fda759B7CfC44691b422405Fae84253f'; // Adresse du contrat LFIST
        this.updateInterval = 60000; // Mise à jour toutes les 60 secondes
        this.retryInterval = 5000; // Réessayer après 5 secondes en cas d'échec
        this.maxRetries = 3; // Nombre maximum de tentatives
        
        // Données
        this.tokenData = null;
        this.pairData = {};
        this.chartData = {
            prices: [],
            volumes: [],
            timestamps: []
        };
        
        // État
        this.isLoading = false;
        this.lastUpdate = null;
        this.updateTimer = null;
        this.retryCount = 0;
    }
    
    /**
     * Initialise le module DexScreener
     */
    init() {
        // Charger les données initiales
        this.fetchTokenData();
        
        // Mettre en place la mise à jour automatique
        this.setupAutoUpdate();
        
        // Ajouter les écouteurs d'événements
        this.setupEventListeners();
    }
    
    /**
     * Configure la mise à jour automatique
     */
    setupAutoUpdate() {
        // Annuler le timer existant si présent
        if (this.updateTimer) {
            clearInterval(this.updateTimer);
        }
        
        // Mettre en place un nouveau timer
        this.updateTimer = setInterval(() => {
            this.fetchTokenData();
        }, this.updateInterval);
    }
    
    /**
     * Configure les écouteurs d'événements
     */
    setupEventListeners() {
        // Écouteur pour le bouton de rafraîchissement manuel
        document.querySelectorAll('.refresh-defi-data').forEach(button => {
            button.addEventListener('click', () => {
                this.fetchTokenData(true);
            });
        });
        
        // Écouteur pour les onglets de période de graphique
        document.querySelectorAll('.chart-period-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const period = e.target.getAttribute('data-period');
                this.updateChartPeriod(period);
            });
        });
    }
    
    /**
     * Récupère les données du token depuis DexScreener
     * @param {boolean} forceUpdate - Forcer la mise à jour même si les données sont récentes
     */
    async fetchTokenData(forceUpdate = false) {
        // Éviter les requêtes multiples simultanées
        if (this.isLoading) return;
        
        // Éviter les mises à jour trop fréquentes sauf si forcées
        if (!forceUpdate && this.lastUpdate && (Date.now() - this.lastUpdate) < this.updateInterval / 2) {
            return;
        }
        
        this.isLoading = true;
        this.updateLoadingState(true);
        
        try {
            // Récupérer les données du token
            const response = await fetch(`${this.apiBaseUrl}/tokens/${this.lfistAddress}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (!data || !data.pairs || data.pairs.length === 0) {
                throw new Error('No data available for this token');
            }
            
            // Stocker les données
            this.tokenData = data;
            
            // Traiter les paires
            this.processPairs(data.pairs);
            
            // Mettre à jour l'interface utilisateur
            this.updateUI();
            
            // Mettre à jour l'horodatage de la dernière mise à jour
            this.lastUpdate = Date.now();
            
            // Réinitialiser le compteur de tentatives
            this.retryCount = 0;
            
            console.log('DexScreener data updated successfully');
        } catch (error) {
            console.error('Error fetching DexScreener data:', error);
            
            // Gérer les tentatives de récupération
            this.handleFetchError();
        } finally {
            this.isLoading = false;
            this.updateLoadingState(false);
        }
    }
    
    /**
     * Traite les données des paires
     * @param {Array} pairs - Les paires de trading
     */
    processPairs(pairs) {
        // Réinitialiser les données des paires
        this.pairData = {};
        
        // Traiter chaque paire
        pairs.forEach(pair => {
            const pairKey = `${pair.baseToken.symbol}-${pair.quoteToken.symbol}`.toLowerCase();
            
            this.pairData[pairKey] = {
                address: pair.pairAddress,
                dexId: pair.dexId,
                baseToken: pair.baseToken,
                quoteToken: pair.quoteToken,
                priceUsd: pair.priceUsd,
                priceNative: pair.priceNative,
                liquidity: pair.liquidity,
                volume: {
                    h24: pair.volume.h24,
                    h6: pair.volume.h6,
                    h1: pair.volume.h1
                },
                priceChange: {
                    h24: pair.priceChange.h24,
                    h6: pair.priceChange.h6,
                    h1: pair.priceChange.h1
                },
                txns: pair.txns,
                fdv: pair.fdv,
                pairCreatedAt: pair.pairCreatedAt
            };
            
            // Extraire les données pour le graphique
            if (pair.priceUsd && pair.volume && pair.fdv) {
                const timestamp = new Date().getTime();
                
                // Limiter à 100 points de données
                if (this.chartData.timestamps.length >= 100) {
                    this.chartData.prices.shift();
                    this.chartData.volumes.shift();
                    this.chartData.timestamps.shift();
                }
                
                this.chartData.prices.push(parseFloat(pair.priceUsd));
                this.chartData.volumes.push(parseFloat(pair.volume.h24 || 0));
                this.chartData.timestamps.push(timestamp);
            }
        });
    }
    
    /**
     * Gère les erreurs de récupération des données
     */
    handleFetchError() {
        this.retryCount++;
        
        if (this.retryCount <= this.maxRetries) {
            console.log(`Retrying fetch (${this.retryCount}/${this.maxRetries}) in ${this.retryInterval / 1000}s...`);
            
            // Réessayer après un délai
            setTimeout(() => {
                this.fetchTokenData(true);
            }, this.retryInterval);
        } else {
            console.error(`Failed to fetch data after ${this.maxRetries} attempts`);
            
            // Afficher un message d'erreur dans l'interface
            this.showErrorMessage();
            
            // Réinitialiser le compteur pour la prochaine mise à jour planifiée
            this.retryCount = 0;
        }
    }
    
    /**
     * Met à jour l'état de chargement dans l'interface
     * @param {boolean} isLoading - État de chargement
     */
    updateLoadingState(isLoading) {
        const loadingElements = document.querySelectorAll('.defi-data-loading');
        const contentElements = document.querySelectorAll('.defi-data-content');
        
        loadingElements.forEach(element => {
            element.style.display = isLoading ? 'flex' : 'none';
        });
        
        contentElements.forEach(element => {
            element.style.opacity = isLoading ? '0.5' : '1';
        });
    }
    
    /**
     * Affiche un message d'erreur dans l'interface
     */
    showErrorMessage() {
        const errorElements = document.querySelectorAll('.defi-data-error');
        
        errorElements.forEach(element => {
            element.style.display = 'block';
            
            // Masquer le message d'erreur après 5 secondes
            setTimeout(() => {
                element.style.display = 'none';
            }, 5000);
        });
    }
    
    /**
     * Met à jour l'interface utilisateur avec les données récupérées
     */
    updateUI() {
        if (!this.tokenData || !this.pairData || Object.keys(this.pairData).length === 0) {
            return;
        }
        
        // Mettre à jour les statistiques générales
        this.updateGeneralStats();
        
        // Mettre à jour les données des paires
        this.updatePairsData();
        
        // Mettre à jour les graphiques
        this.updateCharts();
        
        // Mettre à jour l'horodatage de la dernière mise à jour
        this.updateLastUpdateTimestamp();
    }
    
    /**
     * Met à jour les statistiques générales
     */
    updateGeneralStats() {
        // Trouver la paire principale (généralement LFIST-BUSD ou LFIST-USDT)
        const mainPair = this.findMainPair();
        
        if (!mainPair) return;
        
        // Prix en USD
        const priceElements = document.querySelectorAll('.lfist-price-usd');
        priceElements.forEach(element => {
            element.textContent = `$${parseFloat(mainPair.priceUsd).toFixed(8)}`;
        });
        
        // Variation de prix sur 24h
        const priceChangeElements = document.querySelectorAll('.lfist-price-change-24h');
        const priceChange24h = mainPair.priceChange.h24 || 0;
        const priceChangeClass = priceChange24h >= 0 ? 'positive' : 'negative';
        
        priceChangeElements.forEach(element => {
            element.textContent = `${priceChange24h > 0 ? '+' : ''}${priceChange24h.toFixed(2)}%`;
            element.className = `lfist-price-change-24h ${priceChangeClass}`;
        });
        
        // Volume sur 24h
        const volumeElements = document.querySelectorAll('.lfist-volume-24h');
        volumeElements.forEach(element => {
            element.textContent = `$${this.formatNumber(mainPair.volume.h24 || 0)}`;
        });
        
        // Liquidité
        const liquidityElements = document.querySelectorAll('.lfist-liquidity');
        liquidityElements.forEach(element => {
            element.textContent = `$${this.formatNumber(mainPair.liquidity.usd || 0)}`;
        });
        
        // FDV (Fully Diluted Valuation)
        const fdvElements = document.querySelectorAll('.lfist-fdv');
        fdvElements.forEach(element => {
            element.textContent = `$${this.formatNumber(mainPair.fdv || 0)}`;
        });
        
        // Transactions sur 24h
        const txnsElements = document.querySelectorAll('.lfist-txns-24h');
        const txns24h = mainPair.txns?.h24;
        
        if (txns24h) {
            const buys = txns24h.buys || 0;
            const sells = txns24h.sells || 0;
            
            txnsElements.forEach(element => {
                element.innerHTML = `<span class="txns-buys">🟢 ${buys}</span> / <span class="txns-sells">🔴 ${sells}</span>`;
            });
        }
    }
    
    /**
     * Met à jour les données des paires
     */
    updatePairsData() {
        // Mettre à jour chaque paire dans l'interface
        Object.keys(this.pairData).forEach(pairKey => {
            const pair = this.pairData[pairKey];
            const pairElements = document.querySelectorAll(`.pair-${pairKey}`);
            
            pairElements.forEach(element => {
                // Prix
                const priceElement = element.querySelector('.pair-price');
                if (priceElement) {
                    priceElement.textContent = `$${parseFloat(pair.priceUsd).toFixed(8)}`;
                }
                
                // Variation de prix
                const priceChangeElement = element.querySelector('.pair-price-change');
                if (priceChangeElement) {
                    const priceChange = pair.priceChange.h24 || 0;
                    const changeClass = priceChange >= 0 ? 'positive' : 'negative';
                    
                    priceChangeElement.textContent = `${priceChange > 0 ? '+' : ''}${priceChange.toFixed(2)}%`;
                    priceChangeElement.className = `pair-price-change ${changeClass}`;
                }
                
                // Volume
                const volumeElement = element.querySelector('.pair-volume');
                if (volumeElement) {
                    volumeElement.textContent = `$${this.formatNumber(pair.volume.h24 || 0)}`;
                }
                
                // Liquidité
                const liquidityElement = element.querySelector('.pair-liquidity');
                if (liquidityElement) {
                    liquidityElement.textContent = `$${this.formatNumber(pair.liquidity.usd || 0)}`;
                }
            });
        });
    }
    
    /**
     * Met à jour les graphiques
     */
    updateCharts() {
        // Mettre à jour le graphique de prix si Chart.js est disponible
        if (window.Chart && this.chartData.prices.length > 0) {
            this.updatePriceChart();
        }
    }
    
    /**
     * Met à jour le graphique de prix
     */
    updatePriceChart() {
        const chartCanvas = document.getElementById('price-chart');
        
        if (!chartCanvas) return;
        
        // Détruire le graphique existant s'il existe
        if (window.priceChart) {
            window.priceChart.destroy();
        }
        
        // Préparer les données pour le graphique
        const labels = this.chartData.timestamps.map(timestamp => {
            const date = new Date(timestamp);
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        });
        
        const prices = this.chartData.prices;
        
        // Créer le nouveau graphique
        window.priceChart = new Chart(chartCanvas, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'LFIST Price (USD)',
                    data: prices,
                    borderColor: '#00ff88',
                    backgroundColor: 'rgba(0, 255, 136, 0.1)',
                    borderWidth: 2,
                    pointRadius: 0,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: '#00ff88',
                    pointHoverBorderColor: '#fff',
                    pointHoverBorderWidth: 2,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                return `Price: $${context.raw.toFixed(8)}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false
                        },
                        ticks: {
                            color: '#cccccc',
                            maxRotation: 0,
                            autoSkip: true,
                            maxTicksLimit: 6
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#cccccc',
                            callback: function(value) {
                                return '$' + value.toFixed(8);
                            }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }
    
    /**
     * Met à jour la période du graphique
     * @param {string} period - La période (1h, 6h, 24h, 7d, 30d)
     */
    updateChartPeriod(period) {
        // Mettre à jour la classe active des onglets
        document.querySelectorAll('.chart-period-tab').forEach(tab => {
            tab.classList.remove('active');
            
            if (tab.getAttribute('data-period') === period) {
                tab.classList.add('active');
            }
        });
        
        // Mettre à jour le graphique en fonction de la période
        // Dans une implémentation réelle, cela nécessiterait de récupérer des données historiques
        // Pour cette démo, nous utilisons simplement les données existantes
        this.updateCharts();
    }
    
    /**
     * Met à jour l'horodatage de la dernière mise à jour
     */
    updateLastUpdateTimestamp() {
        const timestampElements = document.querySelectorAll('.last-update-timestamp');
        const formattedTime = new Date().toLocaleTimeString();
        
        timestampElements.forEach(element => {
            element.textContent = formattedTime;
        });
    }
    
    /**
     * Trouve la paire principale (LFIST-BUSD ou LFIST-USDT)
     * @returns {Object} - La paire principale
     */
    findMainPair() {
        // Chercher d'abord LFIST-BUSD
        if (this.pairData['lfist-busd']) {
            return this.pairData['lfist-busd'];
        }
        
        // Sinon chercher LFIST-USDT
        if (this.pairData['lfist-usdt']) {
            return this.pairData['lfist-usdt'];
        }
        
        // Sinon chercher LFIST-BNB
        if (this.pairData['lfist-bnb']) {
            return this.pairData['lfist-bnb'];
        }
        
        // Sinon prendre la première paire disponible
        const pairKeys = Object.keys(this.pairData);
        if (pairKeys.length > 0) {
            return this.pairData[pairKeys[0]];
        }
        
        return null;
    }
    
    /**
     * Formate un nombre pour l'affichage
     * @param {number} num - Le nombre à formater
     * @returns {string} - Le nombre formaté
     */
    formatNumber(num) {
        if (num === null || num === undefined) return '0';
        
        if (num >= 1e9) {
            return (num / 1e9).toFixed(2) + 'B';
        } else if (num >= 1e6) {
            return (num / 1e6).toFixed(2) + 'M';
        } else if (num >= 1e3) {
            return (num / 1e3).toFixed(2) + 'K';
        } else {
            return num.toFixed(2);
        }
    }
}

// Créer et exporter l'instance de DexScreener
window.dexscreener = new LFISTDexScreener();

// Initialiser DexScreener au chargement du document
document.addEventListener('DOMContentLoaded', function() {
    window.dexscreener.init();
});