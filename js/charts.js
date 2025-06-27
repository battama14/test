/**
 * LFIST - Graphiques
 * Gère les graphiques et visualisations de données
 */

// Charger Chart.js depuis CDN
document.addEventListener('DOMContentLoaded', function() {
    loadChartJS();
});

/**
 * Charge la bibliothèque Chart.js depuis CDN
 */
function loadChartJS() {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js@3.7.1/dist/chart.min.js';
    script.onload = initCharts;
    document.head.appendChild(script);
}

/**
 * Initialise tous les graphiques
 */
function initCharts() {
    // Vérifier si Chart.js est chargé
    if (typeof Chart === 'undefined') {
        console.error('Chart.js not loaded');
        return;
    }
    
    // Initialiser les graphiques
    initPriceChart();
    initDistributionChart();
}

/**
 * Initialise le graphique de prix
 */
function initPriceChart() {
    const priceChartElement = document.getElementById('price-chart');
    if (!priceChartElement) return;
    
    // Générer des données aléatoires pour la démo
    const labels = [];
    const data = [];
    
    // Créer 24 points de données (heures)
    let currentPrice = 0.00005;
    for (let i = 0; i < 24; i++) {
        labels.push(`${i}:00`);
        
        // Variation aléatoire du prix
        const change = (Math.random() - 0.4) * 0.00001;
        currentPrice = Math.max(0.00001, currentPrice + change);
        data.push(currentPrice);
    }
    
    // Configuration du graphique
    const priceChart = new Chart(priceChartElement, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Prix LFIST (USD)',
                data: data,
                borderColor: '#00ff88',
                backgroundColor: 'rgba(0, 255, 136, 0.1)',
                borderWidth: 2,
                pointBackgroundColor: '#00ff88',
                pointRadius: 3,
                pointHoverRadius: 5,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#ffffff'
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#00ff88',
                    bodyColor: '#ffffff',
                    borderColor: '#00ff88',
                    borderWidth: 1
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#cccccc'
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#cccccc',
                        callback: function(value) {
                            return '$' + value.toFixed(6);
                        }
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            },
            animations: {
                tension: {
                    duration: 1000,
                    easing: 'linear'
                }
            }
        }
    });
    
    // Fonction pour mettre à jour le graphique avec une nouvelle période
    window.updatePriceChart = function(timeframe) {
        // Générer de nouvelles données en fonction de la période
        const newLabels = [];
        const newData = [];
        
        let points = 0;
        let format = '';
        
        switch(timeframe) {
            case '1H':
                points = 60;
                format = 'min';
                break;
            case '24H':
                points = 24;
                format = 'h';
                break;
            case '7D':
                points = 7;
                format = 'd';
                break;
            case '30D':
                points = 30;
                format = 'd';
                break;
            default:
                points = 24;
                format = 'h';
        }
        
        // Générer les nouvelles données
        let newPrice = 0.00005;
        for (let i = 0; i < points; i++) {
            if (format === 'min') {
                newLabels.push(`${i}m`);
            } else if (format === 'h') {
                newLabels.push(`${i}h`);
            } else {
                newLabels.push(`J${i+1}`);
            }
            
            const change = (Math.random() - 0.4) * 0.00001;
            newPrice = Math.max(0.00001, newPrice + change);
            newData.push(newPrice);
        }
        
        // Mettre à jour le graphique
        priceChart.data.labels = newLabels;
        priceChart.data.datasets[0].data = newData;
        priceChart.update();
    };
}

/**
 * Initialise le graphique de distribution des tokens
 */
function initDistributionChart() {
    const distributionChartElement = document.getElementById('distribution-pie');
    if (!distributionChartElement) return;
    
    // Données de distribution
    const distributionData = {
        labels: ['Liquidity Pool', 'Development', 'Marketing'],
        datasets: [{
            data: [80, 10, 10],
            backgroundColor: [
                '#00ff88',
                '#ff6b6b',
                '#4ecdc4'
            ],
            borderColor: [
                '#00cc70',
                '#ff5252',
                '#33b5b5'
            ],
            borderWidth: 2
        }]
    };
    
    // Configuration du graphique
    const distributionChart = new Chart(distributionChartElement, {
        type: 'pie',
        data: distributionData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#00ff88',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw}%`;
                        }
                    }
                }
            },
            animation: {
                animateRotate: true,
                animateScale: true
            }
        }
    });
}