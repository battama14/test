/**
 * LFIST - Modal d'accueil
 * Demande le nom d'utilisateur et l'adresse email à l'ouverture du site
 */

class WelcomeModal {
    constructor() {
        this.translator = window.translator || new LFISTTranslator();
        this.userContext = window.userContext || {
            setUserMode: (mode) => {
                console.log(`Setting user mode to ${mode}`);
                localStorage.setItem('lfist_user_mode', mode);
            },
            getUserMode: () => localStorage.getItem('lfist_user_mode') || 'classic'
        };
        
        this.isModalShown = false;
        this.modalElement = null;
        this.overlayElement = null;
        
        // Vérifier si l'utilisateur a déjà configuré son profil
        this.hasUserProfile = localStorage.getItem('lfist_username') && localStorage.getItem('lfist_email');
    }
    
    /**
     * Initialise le modal d'accueil
     */
    init() {
        // Ne pas afficher le modal si l'utilisateur a déjà configuré son profil
        if (this.hasUserProfile) {
            // Récupérer le mode utilisateur
            const userMode = this.userContext.getUserMode();
            console.log(`User already has a profile. Mode: ${userMode}`);
            return;
        }
        
        // Créer le modal
        this.createModal();
        
        // Afficher le modal après un court délai
        setTimeout(() => {
            this.showModal();
        }, 500);
    }
    
    /**
     * Crée le modal d'accueil
     */
    createModal() {
        // Créer l'overlay
        this.overlayElement = document.createElement('div');
        this.overlayElement.className = 'modal-overlay';
        this.overlayElement.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            z-index: 9998;
            display: none;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        // Créer le modal
        this.modalElement = document.createElement('div');
        this.modalElement.className = 'welcome-modal';
        this.modalElement.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.9);
            width: 90%;
            max-width: 500px;
            background-color: #1a1a2e;
            border-radius: 10px;
            box-shadow: 0 5px 30px rgba(0, 0, 0, 0.5);
            z-index: 9999;
            padding: 30px;
            display: none;
            opacity: 0;
            transition: all 0.3s ease;
            text-align: center;
            color: #fff;
        `;
        
        // Contenu du modal
        const t = (key) => this.translator.translate(`auth.${key}`);
        
        this.modalElement.innerHTML = `
            <div class="modal-header">
                <h2>${t('title')}</h2>
                <p>${t('subtitle')}</p>
            </div>
            <div class="modal-body">
                <form id="welcome-form">
                    <div class="form-group">
                        <label for="username">${t('username')}</label>
                        <input type="text" id="username" name="username" placeholder="${t('usernamePlaceholder')}" required>
                        <div class="error-message" id="username-error"></div>
                    </div>
                    <div class="form-group">
                        <label for="email">${t('email')}</label>
                        <input type="email" id="email" name="email" placeholder="${t('emailPlaceholder')}" required>
                        <div class="error-message" id="email-error"></div>
                    </div>
                    <div class="form-group mode-selection">
                        <label>${t('modeSelection')}</label>
                        <div class="mode-options">
                            <div class="mode-option">
                                <input type="radio" id="classic-mode" name="user-mode" value="classic" checked>
                                <label for="classic-mode">
                                    <div class="mode-title">${t('classicMode')}</div>
                                    <div class="mode-desc">${t('classicModeDesc')}</div>
                                </label>
                            </div>
                            <div class="mode-option">
                                <input type="radio" id="beginner-mode" name="user-mode" value="beginner">
                                <label for="beginner-mode">
                                    <div class="mode-title">${t('beginnerMode')}</div>
                                    <div class="mode-desc">${t('beginnerModeDesc')}</div>
                                </label>
                            </div>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary">${t('login')}</button>
                </form>
            </div>
            <div class="modal-footer">
                <p>${t('footer')} <a href="#" class="terms-link">${t('termsLink')}</a> & <a href="#" class="privacy-link">${t('privacyLink')}</a></p>
            </div>
        `;
        
        // Ajouter du CSS pour le modal
        const style = document.createElement('style');
        style.textContent = `
            .welcome-modal .form-group {
                margin-bottom: 20px;
                text-align: left;
            }
            
            .welcome-modal label {
                display: block;
                margin-bottom: 5px;
                font-weight: bold;
                color: #e2e2e2;
            }
            
            .welcome-modal input[type="text"],
            .welcome-modal input[type="email"] {
                width: 100%;
                padding: 12px;
                border-radius: 5px;
                border: 1px solid #444;
                background-color: #252538;
                color: #fff;
                font-size: 16px;
            }
            
            .welcome-modal .error-message {
                color: #ff6b6b;
                font-size: 14px;
                margin-top: 5px;
                min-height: 20px;
            }
            
            .welcome-modal .mode-options {
                display: flex;
                gap: 15px;
                margin-top: 10px;
            }
            
            .welcome-modal .mode-option {
                flex: 1;
                position: relative;
            }
            
            .welcome-modal .mode-option input[type="radio"] {
                position: absolute;
                opacity: 0;
            }
            
            .welcome-modal .mode-option label {
                display: block;
                padding: 15px;
                background-color: #252538;
                border: 2px solid #444;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .welcome-modal .mode-option input[type="radio"]:checked + label {
                border-color: #4f8cff;
                background-color: #2a3a5a;
            }
            
            .welcome-modal .mode-title {
                font-weight: bold;
                margin-bottom: 5px;
                color: #fff;
            }
            
            .welcome-modal .mode-desc {
                font-size: 14px;
                color: #aaa;
            }
            
            .welcome-modal .btn-primary {
                background-color: #4f8cff;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 5px;
                font-size: 16px;
                font-weight: bold;
                cursor: pointer;
                transition: background-color 0.3s ease;
                width: 100%;
                margin-top: 10px;
            }
            
            .welcome-modal .btn-primary:hover {
                background-color: #3a7ae0;
            }
            
            .welcome-modal .modal-footer {
                margin-top: 20px;
                font-size: 14px;
                color: #aaa;
            }
            
            .welcome-modal .modal-footer a {
                color: #4f8cff;
                text-decoration: none;
            }
            
            .welcome-modal .modal-footer a:hover {
                text-decoration: underline;
            }
            
            .welcome-modal .modal-header h2 {
                margin-top: 0;
                color: #fff;
                font-size: 24px;
            }
            
            .welcome-modal .modal-header p {
                color: #aaa;
                margin-bottom: 20px;
            }
        `;
        
        // Ajouter les éléments au DOM
        document.head.appendChild(style);
        document.body.appendChild(this.overlayElement);
        document.body.appendChild(this.modalElement);
        
        // Ajouter les écouteurs d'événements
        this.addEventListeners();
    }
    
    /**
     * Ajoute les écouteurs d'événements au modal
     */
    addEventListeners() {
        const form = this.modalElement.querySelector('#welcome-form');
        const usernameInput = this.modalElement.querySelector('#username');
        const emailInput = this.modalElement.querySelector('#email');
        const usernameError = this.modalElement.querySelector('#username-error');
        const emailError = this.modalElement.querySelector('#email-error');
        
        // Soumission du formulaire
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Réinitialiser les messages d'erreur
            usernameError.textContent = '';
            emailError.textContent = '';
            
            // Récupérer les valeurs
            const username = usernameInput.value.trim();
            const email = emailInput.value.trim();
            const userMode = this.modalElement.querySelector('input[name="user-mode"]:checked').value;
            
            // Valider le nom d'utilisateur
            if (!username) {
                usernameError.textContent = this.translator.translate('auth.errorUsername');
                return;
            }
            
            if (username.length < 3) {
                usernameError.textContent = this.translator.translate('auth.errorUsernameLength');
                return;
            }
            
            if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
                usernameError.textContent = this.translator.translate('auth.errorUsernameChars');
                return;
            }
            
            // Valider l'email
            if (!email) {
                emailError.textContent = this.translator.translate('auth.errorEmail');
                return;
            }
            
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                emailError.textContent = this.translator.translate('auth.errorEmailFormat');
                return;
            }
            
            // Sauvegarder les informations
            localStorage.setItem('lfist_username', username);
            localStorage.setItem('lfist_email', email);
            
            // Définir le mode utilisateur
            this.userContext.setUserMode(userMode);
            
            // Afficher une notification
            const modeKey = userMode === 'beginner' ? 'userModeBeginnerSoon' : 'userModeClassic';
            this.showNotification(this.translator.translate(`auth.${modeKey}`));
            
            // Fermer le modal
            this.hideModal();
            
            // Recharger la page pour appliquer les changements
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        });
    }
    
    /**
     * Affiche le modal d'accueil
     */
    showModal() {
        if (this.isModalShown) return;
        
        this.overlayElement.style.display = 'block';
        this.modalElement.style.display = 'block';
        
        // Forcer un reflow pour que la transition fonctionne
        this.overlayElement.offsetHeight;
        this.modalElement.offsetHeight;
        
        this.overlayElement.style.opacity = '1';
        this.modalElement.style.opacity = '1';
        this.modalElement.style.transform = 'translate(-50%, -50%) scale(1)';
        
        this.isModalShown = true;
    }
    
    /**
     * Cache le modal d'accueil
     */
    hideModal() {
        if (!this.isModalShown) return;
        
        this.overlayElement.style.opacity = '0';
        this.modalElement.style.opacity = '0';
        this.modalElement.style.transform = 'translate(-50%, -50%) scale(0.9)';
        
        setTimeout(() => {
            this.overlayElement.style.display = 'none';
            this.modalElement.style.display = 'none';
            this.isModalShown = false;
        }, 300);
    }
    
    /**
     * Affiche une notification
     * @param {string} message - Le message à afficher
     * @param {string} type - Le type de notification (success, error, info)
     */
    showNotification(message, type = 'success') {
        // Vérifier si la fonction showNotification existe globalement
        if (typeof window.showNotification === 'function') {
            window.showNotification(message, type);
            return;
        }
        
        // Créer une notification simple si la fonction globale n'existe pas
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background-color: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
            color: white;
            border-radius: 5px;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            opacity: 0;
            transform: translateY(-20px);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Forcer un reflow pour que la transition fonctionne
        notification.offsetHeight;
        
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialiser le modal d'accueil lorsque le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    const welcomeModal = new WelcomeModal();
    welcomeModal.init();
    
    // Rendre le modal accessible globalement
    window.welcomeModal = welcomeModal;
});