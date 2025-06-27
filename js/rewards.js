/**
 * LFIST - Système de points et récompenses
 * Gestion des points, conversions et récompenses
 */

class LFISTRewards {
    constructor() {
        // Initialiser les données
        this.points = {};
        this.conversions = {};
        this.conversionRate = 1000; // 1000 points = 1 LFIST
        this.minimumConversion = 5000; // Minimum 5000 points pour convertir
        this.lockPeriod = 30; // 30 jours de blocage
        this.estimatedYield = 0.1; // 10% de rendement estimé
        
        // Charger les données depuis le localStorage
        this.loadData();
    }
    
    /**
     * Charge les données depuis le localStorage
     */
    loadData() {
        const savedPoints = localStorage.getItem('lfist_points');
        const savedConversions = localStorage.getItem('lfist_conversions');
        
        if (savedPoints) {
            this.points = JSON.parse(savedPoints);
        }
        
        if (savedConversions) {
            this.conversions = JSON.parse(savedConversions);
        }
    }
    
    /**
     * Sauvegarde les données dans le localStorage
     */
    saveData() {
        localStorage.setItem('lfist_points', JSON.stringify(this.points));
        localStorage.setItem('lfist_conversions', JSON.stringify(this.conversions));
    }
    
    /**
     * Ajoute des points à un utilisateur
     * @param {string} username - Le nom d'utilisateur
     * @param {number} amount - Le montant de points à ajouter
     * @param {string} source - La source des points (jeu, vote, etc.)
     * @param {object} metadata - Métadonnées supplémentaires
     */
    addPoints(username, amount, source, metadata = {}) {
        if (!username || username.startsWith('Guest_')) return;
        
        // Initialiser les points de l'utilisateur s'ils n'existent pas
        if (!this.points[username]) {
            this.points[username] = {
                total: 0,
                available: 0,
                converted: 0,
                history: []
            };
        }
        
        // Ajouter les points
        this.points[username].total += amount;
        this.points[username].available += amount;
        
        // Ajouter à l'historique
        this.points[username].history.push({
            date: new Date().toISOString(),
            amount: amount,
            source: source,
            metadata: metadata
        });
        
        // Sauvegarder les données
        this.saveData();
        
        // Mettre à jour l'interface utilisateur
        this.updateUI();
        
        // Afficher une notification
        this.showNotification(`+${amount} points ${window.i18n.get('common', 'earned')}!`, 'success');
        
        return amount;
    }
    
    /**
     * Convertit des points en tokens LFIST
     * @param {string} username - Le nom d'utilisateur
     * @param {number} pointsAmount - Le montant de points à convertir
     * @returns {boolean} - Succès ou échec de la conversion
     */
    convertPoints(username, pointsAmount) {
        if (!username || username.startsWith('Guest_')) return false;
        
        // Vérifier si l'utilisateur a assez de points
        if (!this.points[username] || this.points[username].available < pointsAmount) {
            this.showNotification(window.i18n.get('rewards', 'insufficientPoints'), 'error');
            return false;
        }
        
        // Vérifier le montant minimum
        if (pointsAmount < this.minimumConversion) {
            this.showNotification(`${window.i18n.get('common', 'minimum')} ${this.minimumConversion} ${window.i18n.get('common', 'points')}`, 'error');
            return false;
        }
        
        // Calculer le montant de tokens
        const tokensAmount = pointsAmount / this.conversionRate;
        
        // Calculer la date de déblocage
        const unlockDate = new Date();
        unlockDate.setDate(unlockDate.getDate() + this.lockPeriod);
        
        // Créer la conversion
        const conversionId = `conv_${Date.now()}`;
        const conversion = {
            id: conversionId,
            username: username,
            pointsAmount: pointsAmount,
            tokensAmount: tokensAmount,
            estimatedRewards: tokensAmount * this.estimatedYield,
            date: new Date().toISOString(),
            unlockDate: unlockDate.toISOString(),
            status: 'pending'
        };
        
        // Initialiser les conversions de l'utilisateur si elles n'existent pas
        if (!this.conversions[username]) {
            this.conversions[username] = [];
        }
        
        // Ajouter la conversion
        this.conversions[username].push(conversion);
        
        // Mettre à jour les points de l'utilisateur
        this.points[username].available -= pointsAmount;
        this.points[username].converted += pointsAmount;
        
        // Sauvegarder les données
        this.saveData();
        
        // Mettre à jour l'interface utilisateur
        this.updateUI();
        
        // Afficher une notification
        const formattedDate = new Date(unlockDate).toLocaleDateString();
        this.showNotification(`${window.i18n.get('rewards', 'conversionSuccess')} ${formattedDate}`, 'success');
        
        return true;
    }
    
    /**
     * Obtient les points d'un utilisateur
     * @param {string} username - Le nom d'utilisateur
     * @returns {object} - Les points de l'utilisateur
     */
    getUserPoints(username) {
        if (!username || !this.points[username]) {
            return {
                total: 0,
                available: 0,
                converted: 0,
                history: []
            };
        }
        
        return this.points[username];
    }
    
    /**
     * Obtient les conversions d'un utilisateur
     * @param {string} username - Le nom d'utilisateur
     * @returns {array} - Les conversions de l'utilisateur
     */
    getUserConversions(username) {
        if (!username || !this.conversions[username]) {
            return [];
        }
        
        return this.conversions[username];
    }
    
    /**
     * Vérifie et met à jour le statut des conversions
     */
    checkConversions() {
        const now = new Date();
        let updated = false;
        
        // Parcourir toutes les conversions
        Object.keys(this.conversions).forEach(username => {
            this.conversions[username].forEach(conversion => {
                if (conversion.status === 'pending' && new Date(conversion.unlockDate) <= now) {
                    // La période de blocage est terminée
                    conversion.status = 'completed';
                    
                    // Ajouter les récompenses (à implémenter avec un vrai wallet)
                    // Dans un environnement réel, cela déclencherait un smart contract
                    
                    updated = true;
                }
            });
        });
        
        if (updated) {
            // Sauvegarder les données
            this.saveData();
            
            // Mettre à jour l'interface utilisateur
            this.updateUI();
        }
    }
    
    /**
     * Calcule les récompenses estimées pour un montant de points
     * @param {number} pointsAmount - Le montant de points
     * @returns {object} - Les récompenses estimées
     */
    calculateEstimatedRewards(pointsAmount) {
        const tokensAmount = pointsAmount / this.conversionRate;
        const estimatedRewards = tokensAmount * this.estimatedYield;
        
        return {
            tokensAmount: tokensAmount,
            estimatedRewards: estimatedRewards,
            totalReturn: tokensAmount + estimatedRewards
        };
    }
    
    /**
     * Met à jour l'interface utilisateur
     */
    updateUI() {
        // Mettre à jour les éléments de l'interface utilisateur liés aux points et récompenses
        if (!window.auth || !window.auth.currentUser) return;
        
        const username = window.auth.currentUser;
        const userPoints = this.getUserPoints(username);
        
        // Mettre à jour les compteurs de points
        const pointsElements = document.querySelectorAll('.user-points-count');
        pointsElements.forEach(element => {
            element.textContent = userPoints.available.toLocaleString();
        });
        
        // Mettre à jour les éléments de conversion
        const convertedElements = document.querySelectorAll('.user-points-converted');
        convertedElements.forEach(element => {
            element.textContent = userPoints.converted.toLocaleString();
        });
        
        // Mettre à jour les éléments de tokens
        const tokensElements = document.querySelectorAll('.user-tokens-earned');
        tokensElements.forEach(element => {
            const tokensEarned = userPoints.converted / this.conversionRate;
            element.textContent = tokensEarned.toLocaleString();
        });
    }
    
    /**
     * Initialise les écouteurs d'événements
     */
    initEvents() {
        // Écouteur pour le bouton de conversion de points
        document.querySelectorAll('.convert-points-btn').forEach(button => {
            button.addEventListener('click', () => this.showConversionModal());
        });
        
        // Vérifier les conversions toutes les minutes
        setInterval(() => this.checkConversions(), 60000);
    }
    
    /**
     * Affiche le modal de conversion de points
     */
    showConversionModal() {
        if (!window.auth || !window.auth.currentUser || window.auth.currentUser.startsWith('Guest_')) {
            window.auth.showAuthModal();
            return;
        }
        
        const username = window.auth.currentUser;
        const userPoints = this.getUserPoints(username);
        
        // Créer le modal
        const modal = document.createElement('div');
        modal.id = 'conversion-modal';
        modal.className = 'auth-modal';
        
        const i18n = window.i18n;
        
        modal.innerHTML = `
            <div class="auth-container">
                <div class="auth-header">
                    <h2>${i18n.get('rewards', 'title')}</h2>
                    <p>${i18n.get('rewards', 'subtitle')}</p>
                </div>
                
                <div class="auth-form">
                    <div class="form-group">
                        <label for="points-amount">${i18n.get('rewards', 'amountToConvert')}</label>
                        <input type="number" id="points-amount" min="${this.minimumConversion}" max="${userPoints.available}" value="${Math.min(userPoints.available, this.minimumConversion)}" />
                    </div>
                    
                    <div class="conversion-details">
                        <div class="detail-item">
                            <span class="detail-label">${i18n.get('rewards', 'pointsBalance')}:</span>
                            <span class="detail-value">${userPoints.available.toLocaleString()} ${i18n.get('common', 'points')}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">${i18n.get('rewards', 'conversionRate')}:</span>
                            <span class="detail-value">${this.conversionRate} ${i18n.get('common', 'points')} = 1 LFIST</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">${i18n.get('rewards', 'estimatedTokens')}:</span>
                            <span class="detail-value" id="estimated-tokens">0 LFIST</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">${i18n.get('rewards', 'lockPeriod')}:</span>
                            <span class="detail-value">${this.lockPeriod} ${i18n.get('common', 'days')}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">${i18n.get('rewards', 'estimatedRewards')}:</span>
                            <span class="detail-value" id="estimated-rewards">0 LFIST</span>
                        </div>
                    </div>
                    
                    <div class="auth-actions">
                        <button id="confirm-conversion" class="login-btn">
                            <i class="fas fa-exchange-alt"></i> ${i18n.get('rewards', 'convertPoints')}
                        </button>
                        
                        <button id="cancel-conversion" class="guest-btn">
                            <i class="fas fa-times"></i> ${i18n.get('common', 'cancel')}
                        </button>
                    </div>
                </div>
                
                <div class="auth-footer">
                    <p>${i18n.get('rewards', 'investmentStrategy')}</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Ajouter les écouteurs d'événements
        const pointsAmountInput = document.getElementById('points-amount');
        pointsAmountInput.addEventListener('input', () => {
            const pointsAmount = parseInt(pointsAmountInput.value) || 0;
            const rewards = this.calculateEstimatedRewards(pointsAmount);
            
            document.getElementById('estimated-tokens').textContent = rewards.tokensAmount.toFixed(2) + ' LFIST';
            document.getElementById('estimated-rewards').textContent = rewards.estimatedRewards.toFixed(2) + ' LFIST';
        });
        
        // Déclencher l'événement input pour initialiser les valeurs
        pointsAmountInput.dispatchEvent(new Event('input'));
        
        // Bouton de confirmation
        document.getElementById('confirm-conversion').addEventListener('click', () => {
            const pointsAmount = parseInt(pointsAmountInput.value) || 0;
            const success = this.convertPoints(username, pointsAmount);
            
            if (success) {
                modal.remove();
            }
        });
        
        // Bouton d'annulation
        document.getElementById('cancel-conversion').addEventListener('click', () => {
            modal.remove();
        });
    }
    
    /**
     * Affiche l'historique des conversions
     */
    showConversionHistory() {
        if (!window.auth || !window.auth.currentUser || window.auth.currentUser.startsWith('Guest_')) {
            window.auth.showAuthModal();
            return;
        }
        
        const username = window.auth.currentUser;
        const userConversions = this.getUserConversions(username);
        
        // Créer le modal
        const modal = document.createElement('div');
        modal.id = 'history-modal';
        modal.className = 'auth-modal';
        
        const i18n = window.i18n;
        
        let conversionsHtml = '';
        
        if (userConversions.length === 0) {
            conversionsHtml = `<div class="no-data">${i18n.get('rewards', 'noConversions')}</div>`;
        } else {
            conversionsHtml = `
                <div class="conversion-history">
                    <div class="history-header">
                        <div class="history-cell">${i18n.get('rewards', 'date')}</div>
                        <div class="history-cell">${i18n.get('rewards', 'pointsConverted')}</div>
                        <div class="history-cell">${i18n.get('rewards', 'tokensReceived')}</div>
                        <div class="history-cell">${i18n.get('rewards', 'status')}</div>
                        <div class="history-cell">${i18n.get('rewards', 'unlockDate')}</div>
                    </div>
            `;
            
            userConversions.forEach(conversion => {
                const date = new Date(conversion.date).toLocaleDateString();
                const unlockDate = new Date(conversion.unlockDate).toLocaleDateString();
                const statusClass = conversion.status === 'completed' ? 'status-completed' : 'status-pending';
                const statusText = conversion.status === 'completed' ? i18n.get('rewards', 'completed') : i18n.get('rewards', 'pending');
                
                conversionsHtml += `
                    <div class="history-row">
                        <div class="history-cell">${date}</div>
                        <div class="history-cell">${conversion.pointsAmount.toLocaleString()}</div>
                        <div class="history-cell">${conversion.tokensAmount.toFixed(2)} LFIST</div>
                        <div class="history-cell"><span class="${statusClass}">${statusText}</span></div>
                        <div class="history-cell">${unlockDate}</div>
                    </div>
                `;
            });
            
            conversionsHtml += '</div>';
        }
        
        modal.innerHTML = `
            <div class="auth-container" style="max-width: 800px;">
                <div class="auth-header">
                    <h2>${i18n.get('rewards', 'conversionHistory')}</h2>
                </div>
                
                <div class="auth-form">
                    ${conversionsHtml}
                </div>
                
                <div class="auth-actions" style="justify-content: center; margin-top: 2rem;">
                    <button id="close-history" class="guest-btn">
                        <i class="fas fa-times"></i> ${i18n.get('common', 'close')}
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Bouton de fermeture
        document.getElementById('close-history').addEventListener('click', () => {
            modal.remove();
        });
    }
    
    /**
     * Affiche une notification
     * @param {string} message - Le message à afficher
     * @param {string} type - Le type de notification (success, error, info)
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            </div>
            <div class="notification-message">${message}</div>
        `;
        
        document.body.appendChild(notification);
        
        // Animation d'entrée
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Supprimer la notification après 3 secondes
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
}

// Créer et exporter l'instance du système de récompenses
window.rewards = new LFISTRewards();

// Initialiser le système de récompenses au chargement du document
document.addEventListener('DOMContentLoaded', function() {
    window.rewards.initEvents();
});