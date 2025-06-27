/**
 * LFIST - Contexte utilisateur
 * Gère les informations et préférences de l'utilisateur
 */

class UserContext {
    constructor() {
        this.translator = window.translator || new LFISTTranslator();
        
        // Récupérer les informations utilisateur depuis le localStorage
        this.username = localStorage.getItem('lfist_username') || null;
        this.email = localStorage.getItem('lfist_email') || null;
        this.userMode = localStorage.getItem('lfist_user_mode') || 'classic';
        
        // Initialiser les écouteurs d'événements
        this.initEventListeners();
    }
    
    /**
     * Initialise les écouteurs d'événements
     */
    initEventListeners() {
        // Écouteur pour le changement de mode utilisateur
        document.addEventListener('user-mode-change', (e) => {
            const newMode = e.detail.mode;
            this.setUserMode(newMode);
        });
    }
    
    /**
     * Vérifie si l'utilisateur est connecté
     * @returns {boolean} - True si l'utilisateur est connecté, false sinon
     */
    isLoggedIn() {
        return this.username !== null && this.email !== null;
    }
    
    /**
     * Récupère le nom d'utilisateur
     * @returns {string|null} - Le nom d'utilisateur ou null si non connecté
     */
    getUsername() {
        return this.username;
    }
    
    /**
     * Récupère l'email de l'utilisateur
     * @returns {string|null} - L'email de l'utilisateur ou null si non connecté
     */
    getEmail() {
        return this.email;
    }
    
    /**
     * Récupère le mode utilisateur
     * @returns {string} - Le mode utilisateur ('classic' ou 'beginner')
     */
    getUserMode() {
        return this.userMode;
    }
    
    /**
     * Définit le mode utilisateur
     * @param {string} mode - Le mode utilisateur ('classic' ou 'beginner')
     */
    setUserMode(mode) {
        if (mode !== 'classic' && mode !== 'beginner') {
            console.error(`Mode utilisateur invalide: ${mode}`);
            return;
        }
        
        this.userMode = mode;
        localStorage.setItem('lfist_user_mode', mode);
        
        // Déclencher un événement pour informer l'application du changement
        document.dispatchEvent(new CustomEvent('user-mode-updated', {
            detail: { mode }
        }));
        
        // Afficher une notification
        const modeKey = mode === 'beginner' ? 'userModeBeginner' : 'userModeClassic';
        this.showNotification(this.translator.translate(`auth.${modeKey}`));
        
        // Appliquer les changements d'interface
        this.applyUserModeChanges();
    }
    
    /**
     * Applique les changements d'interface en fonction du mode utilisateur
     */
    applyUserModeChanges() {
        const body = document.body;
        
        // Supprimer les classes de mode existantes
        body.classList.remove('classic-mode', 'beginner-mode');
        
        // Ajouter la classe correspondant au mode actuel
        body.classList.add(`${this.userMode}-mode`);
        
        // Afficher/masquer les éléments spécifiques à chaque mode
        const classicElements = document.querySelectorAll('.classic-only');
        const beginnerElements = document.querySelectorAll('.beginner-only');
        
        classicElements.forEach(el => {
            el.style.display = this.userMode === 'classic' ? '' : 'none';
        });
        
        beginnerElements.forEach(el => {
            el.style.display = this.userMode === 'beginner' ? '' : 'none';
        });
    }
    
    /**
     * Connecte un utilisateur
     * @param {string} username - Le nom d'utilisateur
     * @param {string} email - L'email de l'utilisateur
     * @param {string} mode - Le mode utilisateur ('classic' ou 'beginner')
     */
    login(username, email, mode = 'classic') {
        this.username = username;
        this.email = email;
        
        localStorage.setItem('lfist_username', username);
        localStorage.setItem('lfist_email', email);
        
        this.setUserMode(mode);
        
        // Déclencher un événement pour informer l'application de la connexion
        document.dispatchEvent(new CustomEvent('user-logged-in', {
            detail: { username, email, mode }
        }));
        
        // Afficher une notification
        this.showNotification(this.translator.translate('auth.successLogin') + ' ' + username);
    }
    
    /**
     * Déconnecte l'utilisateur
     */
    logout() {
        this.username = null;
        this.email = null;
        
        localStorage.removeItem('lfist_username');
        localStorage.removeItem('lfist_email');
        
        // Déclencher un événement pour informer l'application de la déconnexion
        document.dispatchEvent(new CustomEvent('user-logged-out'));
        
        // Afficher une notification
        this.showNotification(this.translator.translate('auth.successLogout'));
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
        
        console.log(`[${type.toUpperCase()}] ${message}`);
    }
}

// Initialiser le contexte utilisateur lorsque le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    const userContext = new UserContext();
    
    // Rendre le contexte accessible globalement
    window.userContext = userContext;
    
    // Appliquer les changements d'interface en fonction du mode utilisateur
    userContext.applyUserModeChanges();
});