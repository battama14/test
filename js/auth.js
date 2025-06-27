/**
 * Système d'authentification LFIST
 * Gère la connexion, l'inscription et la session utilisateur
 */

class LFISTAuth {
    constructor() {
        this.currentUser = null;
        this.users = JSON.parse(localStorage.getItem('lfist_users') || '{}');
        this.scores = JSON.parse(localStorage.getItem('lfist_user_scores') || '{}');
        this.leaderboard = JSON.parse(localStorage.getItem('lfist_leaderboard') || '[]');
        
        console.log('LFIST Auth System initialized');
        this.init();
    }

    /**
     * Initialise le système d'authentification
     */
    init() {
        // Vérifier si un utilisateur est déjà connecté
        this.loadCurrentUser();
        
        // Ajouter les écouteurs d'événements
        document.addEventListener('DOMContentLoaded', () => {
            // Bouton de connexion dans le header
            const connectWalletBtn = document.getElementById('connectWallet');
            if (connectWalletBtn) {
                connectWalletBtn.addEventListener('click', () => this.showAuthModal());
            }
            
            // Burger menu pour mobile
            const burgerBtn = document.getElementById('burger');
            if (burgerBtn) {
                burgerBtn.addEventListener('click', () => this.toggleMobileMenu());
            }
        });
    }

    /**
     * Charge l'utilisateur actuel depuis le localStorage
     */
    loadCurrentUser() {
        const savedUser = localStorage.getItem('lfist_current_user');
        if (savedUser && this.users[savedUser]) {
            this.currentUser = savedUser;
            this.updateUserInterface();
            console.log(`Welcome back, ${savedUser}!`);
        } else {
            // Afficher le modal d'authentification au chargement de la page
            setTimeout(() => {
                this.showAuthModal();
            }, 1000); // Délai pour permettre le chargement de la page
        }
    }

    /**
     * Affiche le modal d'authentification
     */
    showAuthModal() {
        // Vérifier si le modal existe déjà
        if (document.getElementById('auth-modal')) {
            document.getElementById('auth-modal').style.display = 'flex';
            return;
        }

        // Créer le modal
        const modal = document.createElement('div');
        modal.id = 'auth-modal';
        modal.className = 'auth-modal';
        modal.innerHTML = `
            <div class="auth-container">
                <div class="auth-header">
                    <h2>BIENVENUE SUR LFIST</h2>
                    <p>Veuillez vous identifier pour accéder à la plateforme</p>
                </div>
                
                <div class="auth-form">
                    <div class="form-group">
                        <label for="username-input">Nom d'utilisateur</label>
                        <input type="text" id="username-input" maxlength="20" 
                               placeholder="Votre nom d'utilisateur..." required>
                    </div>
                    
                    <div class="form-group">
                        <label for="email-input">Adresse email</label>
                        <input type="email" id="email-input" 
                               placeholder="Votre adresse email..." required>
                    </div>
                    
                    <div class="form-group mode-selection">
                        <label>Choisissez votre mode d'affichage :</label>
                        <div class="mode-options">
                            <div class="mode-option" id="mode-classic">
                                <div class="mode-icon"><i class="fas fa-user-tie"></i></div>
                                <div class="mode-info">
                                    <h4>Mode Classique</h4>
                                    <p>Pour les utilisateurs familiers avec la crypto</p>
                                </div>
                            </div>
                            <div class="mode-option" id="mode-beginner">
                                <div class="mode-icon"><i class="fas fa-graduation-cap"></i></div>
                                <div class="mode-info">
                                    <h4>Mode Débutant</h4>
                                    <p>Interface simplifiée avec explications détaillées</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="auth-actions">
                        <button class="login-btn" id="login-btn">
                            <i class="fas fa-sign-in-alt"></i> Accéder à la Plateforme
                        </button>
                    </div>
                </div>
                
                <div class="auth-footer">
                    <p>En vous connectant, vous acceptez nos <a href="#">Conditions d'utilisation</a> et notre <a href="#">Politique de confidentialité</a></p>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Focus sur l'input
        setTimeout(() => {
            document.getElementById('username-input').focus();
        }, 100);
        
        // Ajouter les écouteurs d'événements pour les modes
        document.getElementById('mode-classic').addEventListener('click', () => {
            document.getElementById('mode-classic').classList.add('selected');
            document.getElementById('mode-beginner').classList.remove('selected');
            localStorage.setItem('lfist_user_mode', 'classic');
        });
        
        document.getElementById('mode-beginner').addEventListener('click', () => {
            document.getElementById('mode-beginner').classList.add('selected');
            document.getElementById('mode-classic').classList.remove('selected');
            localStorage.setItem('lfist_user_mode', 'beginner');
        });
        
        // Sélectionner le mode classique par défaut
        document.getElementById('mode-classic').classList.add('selected');
        localStorage.setItem('lfist_user_mode', 'classic');
        
        // Ajouter les écouteurs d'événements
        document.getElementById('login-btn').addEventListener('click', () => this.loginUserWithEmail());
        
        // Gérer la touche Entrée pour se connecter
        document.getElementById('email-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.loginUserWithEmail();
            }
        });
    }

    /**
     * Connecte l'utilisateur avec email
     */
    loginUserWithEmail() {
        const username = document.getElementById('username-input').value.trim();
        const email = document.getElementById('email-input').value.trim();
        const userMode = localStorage.getItem('lfist_user_mode') || 'classic';
        const i18n = window.i18n;
        
        // Validation du nom d'utilisateur
        if (!username) {
            this.showNotification(i18n ? i18n.get('auth', 'errorUsername') : 'Veuillez entrer un nom d\'utilisateur!', 'error');
            return;
        }
        
        if (username.length < 3) {
            this.showNotification(i18n ? i18n.get('auth', 'errorUsernameLength') : 'Le nom d\'utilisateur doit contenir au moins 3 caractères!', 'error');
            return;
        }
        
        // Caractères interdits dans le nom d'utilisateur
        if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
            this.showNotification(i18n ? i18n.get('auth', 'errorUsernameChars') : 'Seuls les lettres, chiffres, _ et - sont autorisés!', 'error');
            return;
        }
        
        // Validation de l'email
        if (!email) {
            this.showNotification('Veuillez entrer une adresse email!', 'error');
            return;
        }
        
        // Vérification du format de l'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showNotification('Veuillez entrer une adresse email valide!', 'error');
            return;
        }
        
        // Créer ou récupérer l'utilisateur
        const isNewUser = !this.users[username];
        if (isNewUser) {
            this.users[username] = {
                username: username,
                email: email,
                userMode: userMode,
                createdAt: new Date().toISOString(),
                totalGames: 0,
                totalScore: 0,
                bestScore: 0,
                achievements: [],
                level: 1,
                points: 0
            };
            
            this.showNotification(`Bienvenue ${username}! Votre compte LFIST a été créé!`, 'success');
        } else {
            // Mettre à jour l'email et le mode si l'utilisateur existe déjà
            this.users[username].email = email;
            this.users[username].userMode = userMode;
            this.showNotification(`Bon retour ${username}!`, 'success');
        }
        
        // Sauvegarder
        this.currentUser = username;
        localStorage.setItem('lfist_current_user', username);
        localStorage.setItem('lfist_users', JSON.stringify(this.users));
        
        // Fermer le modal et mettre à jour l'interface
        this.closeAuthModal();
        this.updateUserInterface();
        
        // Appliquer le mode utilisateur
        this.applyUserMode(userMode);
        
        // Ajouter des points de bienvenue pour les nouveaux utilisateurs
        if (isNewUser && window.rewards) {
            window.rewards.addPoints(username, 1000, 'welcome', { message: 'Points de bienvenue' });
        }
    }
    
    /**
     * Connecte l'utilisateur (ancienne méthode, conservée pour compatibilité)
     */
    loginUser() {
        const username = document.getElementById('username-input').value.trim();
        const i18n = window.i18n;
        
        if (!username) {
            this.showNotification(i18n ? i18n.get('auth', 'errorUsername') : 'Veuillez entrer un pseudo!', 'error');
            return;
        }
        
        if (username.length < 3) {
            this.showNotification(i18n ? i18n.get('auth', 'errorUsernameLength') : 'Le pseudo doit contenir au moins 3 caractères!', 'error');
            return;
        }
        
        // Caractères interdits
        if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
            this.showNotification(i18n ? i18n.get('auth', 'errorUsernameChars') : 'Seuls les lettres, chiffres, _ et - sont autorisés!', 'error');
            return;
        }
        
        // Créer ou récupérer l'utilisateur
        const isNewUser = !this.users[username];
        if (isNewUser) {
            this.users[username] = {
                username: username,
                createdAt: new Date().toISOString(),
                totalGames: 0,
                totalScore: 0,
                bestScore: 0,
                achievements: [],
                level: 1,
                points: 0
            };
            
            this.showNotification(`Bienvenue ${username}! Votre compte LFIST a été créé!`, 'success');
        } else {
            this.showNotification(`Bon retour ${username}!`, 'success');
        }
        
        // Sauvegarder
        this.currentUser = username;
        localStorage.setItem('lfist_current_user', username);
        localStorage.setItem('lfist_users', JSON.stringify(this.users));
        
        // Fermer le modal et mettre à jour l'interface
        this.closeAuthModal();
        this.updateUserInterface();
        
        // Ajouter des points de bienvenue pour les nouveaux utilisateurs
        if (isNewUser && window.rewards) {
            window.rewards.addPoints(username, 1000, 'welcome', { message: 'Points de bienvenue' });
        }
    }

    /**
     * Permet de jouer en tant qu'invité
     */
    playAsGuest() {
        this.currentUser = 'Guest_' + Date.now();
        this.closeAuthModal();
        this.updateUserInterface();
        this.showNotification('Vous jouez en mode invité. Vos scores ne seront pas sauvegardés.', 'info');
    }

    /**
     * Ferme le modal d'authentification
     */
    closeAuthModal() {
        const modal = document.getElementById('auth-modal');
        if (modal) {
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    }

    /**
     * Met à jour l'interface utilisateur après connexion
     */
    updateUserInterface() {
        // Créer ou mettre à jour la barre utilisateur
        this.createUserBar();
        
        // Mettre à jour les éléments avec le nom d'utilisateur
        const userElements = document.querySelectorAll('.current-username');
        userElements.forEach(el => {
            el.textContent = this.getCurrentDisplayName();
        });
        
        // Mettre à jour le bouton de connexion
        const connectWalletBtn = document.getElementById('connectWallet');
        if (connectWalletBtn) {
            connectWalletBtn.innerHTML = `<i class="fas fa-user"></i> ${this.getCurrentDisplayName()}`;
            connectWalletBtn.removeEventListener('click', () => this.showAuthModal());
            connectWalletBtn.addEventListener('click', () => this.showUserMenu());
        }
        
        // Mettre à jour les points de l'utilisateur si le système de récompenses est disponible
        if (window.rewards && this.currentUser && !this.currentUser.startsWith('Guest_')) {
            window.rewards.updateUI();
        }
    }

    /**
     * Crée la barre utilisateur
     */
    createUserBar() {
        // Supprimer l'ancienne barre
        const oldBar = document.getElementById('user-bar');
        if (oldBar) oldBar.remove();
        
        const userBar = document.createElement('div');
        userBar.id = 'user-bar';
        userBar.className = 'user-bar';
        
        const userData = this.users[this.currentUser];
        const isGuest = this.currentUser?.startsWith('Guest_');
        
        userBar.innerHTML = `
            <div class="user-info">
                <span class="user-icon">${isGuest ? '<i class="fas fa-user-secret"></i>' : '<i class="fas fa-user"></i>'}</span>
                <span class="user-name">
                    ${this.getCurrentDisplayName()}
                </span>
                ${!isGuest ? `<span class="user-level">Niv.${userData?.level || 1}</span>` : ''}
                ${!isGuest ? `<span class="points-badge"><i class="fas fa-coins points-icon"></i> <span class="user-points-count">0</span></span>` : ''}
            </div>
            
            <div class="user-actions">
                ${!isGuest ? `
                    <button id="profile-btn" title="Profil">
                        <i class="fas fa-chart-bar"></i>
                    </button>
                    <button id="rewards-btn" title="Récompenses">
                        <i class="fas fa-gift"></i>
                    </button>
                ` : ''}
                
                <button id="logout-btn" class="logout-btn" title="Déconnexion">
                    <i class="fas fa-sign-out-alt"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(userBar);
        
        // Ajouter les écouteurs d'événements
        if (!isGuest) {
            document.getElementById('profile-btn').addEventListener('click', () => this.showProfile());
            document.getElementById('rewards-btn').addEventListener('click', () => {
                if (window.rewards) {
                    window.rewards.showConversionModal();
                } else {
                    window.location.href = 'rewards.html';
                }
            });
        }
        document.getElementById('logout-btn').addEventListener('click', () => this.logout());
    }

    /**
     * Affiche le menu utilisateur
     */
    showUserMenu() {
        // À implémenter si nécessaire
        this.showProfile();
    }

    /**
     * Obtient le nom d'affichage de l'utilisateur
     */
    getCurrentDisplayName() {
        if (!this.currentUser) return 'Invité';
        
        if (this.currentUser.startsWith('Guest_')) {
            return 'Invité';
        }
        
        return this.currentUser;
    }

    /**
     * Déconnecte l'utilisateur
     */
    logout() {
        if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
            this.currentUser = null;
            localStorage.removeItem('lfist_current_user');
            
            const userBar = document.getElementById('user-bar');
            if (userBar) userBar.remove();
            
            // Réinitialiser le bouton de connexion
            const connectWalletBtn = document.getElementById('connectWallet');
            if (connectWalletBtn) {
                connectWalletBtn.innerHTML = `<i class="fas fa-wallet"></i> Connect Wallet`;
                connectWalletBtn.removeEventListener('click', () => this.showUserMenu());
                connectWalletBtn.addEventListener('click', () => this.showAuthModal());
            }
            
            this.showAuthModal();
            this.showNotification('Vous avez été déconnecté!', 'info');
        }
    }

    /**
     * Enregistre un score
     */
    saveScore(gameType, score, additionalData = {}) {
        if (!this.currentUser || this.currentUser.startsWith('Guest_')) {
            console.log('Guest score not saved');
            return false;
        }
        
        const userData = this.users[this.currentUser];
        if (!userData) return false;
        
        // Mettre à jour les statistiques utilisateur
        userData.totalGames++;
        userData.totalScore += score;
        
        if (score > userData.bestScore) {
            userData.bestScore = score;
        }
        
        // Sauvegarder le score spécifique
        if (!this.scores[this.currentUser]) {
            this.scores[this.currentUser] = {};
        }
        
        if (!this.scores[this.currentUser][gameType]) {
            this.scores[this.currentUser][gameType] = [];
        }
        
        this.scores[this.currentUser][gameType].push({
            score: score,
            date: new Date().toISOString(),
            ...additionalData
        });
        
        // Garder seulement les 10 meilleurs scores par jeu
        this.scores[this.currentUser][gameType].sort((a, b) => b.score - a.score);
        this.scores[this.currentUser][gameType] = this.scores[this.currentUser][gameType].slice(0, 10);
        
        // Mettre à jour le niveau
        const newLevel = Math.floor(userData.totalScore / 10000) + 1;
        if (newLevel > userData.level) {
            userData.level = newLevel;
            this.showNotification(`Niveau ${newLevel} atteint!`, 'success');
        }
        
        // Sauvegarder
        localStorage.setItem('lfist_users', JSON.stringify(this.users));
        localStorage.setItem('lfist_user_scores', JSON.stringify(this.scores));
        
        // Mettre à jour le classement
        this.updateLeaderboard();
        
        console.log(`Score saved: ${gameType} - ${score} points for ${this.currentUser}`);
        return true;
    }

    /**
     * Met à jour le classement
     */
    updateLeaderboard() {
        const leaderboard = [];
        
        Object.keys(this.users).forEach(username => {
            const user = this.users[username];
            leaderboard.push({
                username: username,
                bestScore: user.bestScore,
                totalScore: user.totalScore,
                totalGames: user.totalGames,
                level: user.level
            });
        });
        
        // Trier par meilleur score
        leaderboard.sort((a, b) => b.bestScore - a.bestScore);
        
        this.leaderboard = leaderboard.slice(0, 20); // Top 20
        localStorage.setItem('lfist_leaderboard', JSON.stringify(this.leaderboard));
    }

    /**
     * Ouvre la page tutoriel pour les nouveaux utilisateurs
     */
    openTutorial() {
        // Rediriger vers la page tutoriel
        window.location.href = 'tutorial.html';
    }
    
    /**
     * Applique le mode utilisateur (classique ou débutant)
     * @param {string} mode - Le mode à appliquer ('classic' ou 'beginner')
     */
    applyUserMode(mode) {
        // Sauvegarder le mode dans le localStorage
        localStorage.setItem('lfist_user_mode', mode);
        
        // Ajouter une classe au body pour permettre le styling CSS spécifique au mode
        document.body.classList.remove('mode-classic', 'mode-beginner');
        document.body.classList.add(`mode-${mode}`);
        
        // Si nous sommes sur la page d'accueil, rediriger vers la version appropriée
        const currentPage = window.location.pathname.split('/').pop();
        if (currentPage === 'index.html' || currentPage === '') {
            if (mode === 'beginner') {
                // Rediriger vers la page d'accueil en mode débutant
                // Note: cette page sera créée plus tard
                this.showNotification('Mode débutant activé! La version complète sera disponible prochainement.', 'info');
            }
        }
        
        // Mettre à jour l'interface utilisateur en fonction du mode
        const beginnerElements = document.querySelectorAll('.beginner-only');
        const classicElements = document.querySelectorAll('.classic-only');
        
        beginnerElements.forEach(el => {
            el.style.display = mode === 'beginner' ? 'block' : 'none';
        });
        
        classicElements.forEach(el => {
            el.style.display = mode === 'classic' ? 'block' : 'none';
        });
        
        // Notifier l'utilisateur
        this.showNotification(`Mode ${mode === 'classic' ? 'classique' : 'débutant'} activé!`, 'success');
    }

    /**
     * Affiche le profil utilisateur
     */
    showProfile() {
        if (!this.currentUser || this.currentUser.startsWith('Guest_')) return;
        
        const userData = this.users[this.currentUser];
        const userScores = this.scores[this.currentUser] || {};
        
        const modal = document.createElement('div');
        modal.id = 'profile-modal';
        modal.className = 'auth-modal';
        modal.innerHTML = `
            <div class="auth-container" style="max-width: 600px; max-height: 80vh; overflow-y: auto;">
                <div class="auth-header">
                    <h2>PROFIL LFIST</h2>
                    <div style="font-size: 1.5rem; margin-top: 1rem;">
                        <i class="fas fa-user"></i> ${userData.username}
                    </div>
                    <div style="color: #cccccc;">Niveau ${userData.level}</div>
                </div>
                
                <div class="profile-stats" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin: 2rem 0;">
                    <div style="background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 10px; text-align: center;">
                        <div style="color: var(--primary-color); font-size: 1.5rem; font-weight: bold;">${userData.bestScore.toLocaleString()}</div>
                        <div style="color: #cccccc; font-size: 0.9rem;">Meilleur Score</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 10px; text-align: center;">
                        <div style="color: var(--secondary-color); font-size: 1.5rem; font-weight: bold;">${userData.totalGames}</div>
                        <div style="color: #cccccc; font-size: 0.9rem;">Parties Jouées</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 10px; text-align: center;">
                        <div style="color: var(--accent-color); font-size: 1.5rem; font-weight: bold;">${userData.totalScore.toLocaleString()}</div>
                        <div style="color: #cccccc; font-size: 0.9rem;">Score Total</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 10px; text-align: center;">
                        <div style="color: var(--success-color); font-size: 1.5rem; font-weight: bold;">${Math.round(userData.totalScore / Math.max(userData.totalGames, 1))}</div>
                        <div style="color: #cccccc; font-size: 0.9rem;">Score Moyen</div>
                    </div>
                </div>
                
                <div class="profile-games" style="margin-bottom: 2rem;">
                    <h3 style="color: white; margin-bottom: 1rem; text-align: center;">Scores par Jeu</h3>
                    ${Object.keys(userScores).length > 0 ? Object.keys(userScores).map(game => {
                        const gameScores = userScores[game];
                        const bestGameScore = Math.max(...gameScores.map(s => s.score));
                        return `
                            <div style="background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 10px; margin-bottom: 0.5rem;">
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <span style="color: white; font-weight: bold;">${game}</span>
                                    <span style="color: var(--primary-color);">${bestGameScore.toLocaleString()} pts</span>
                                </div>
                                <div style="color: #cccccc; font-size: 0.8rem;">${gameScores.length} partie(s) jouée(s)</div>
                            </div>
                        `;
                    }).join('') : '<div style="color: #888; text-align: center; padding: 2rem;">Aucun score enregistré</div>'}
                </div>
                
                <div class="auth-actions">
                    <button class="guest-btn" id="close-profile-btn">
                        Fermer
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Ajouter l'écouteur d'événement pour fermer
        document.getElementById('close-profile-btn').addEventListener('click', () => this.closeProfile());
    }

    /**
     * Ferme le profil utilisateur
     */
    closeProfile() {
        const modal = document.getElementById('profile-modal');
        if (modal) {
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    }

    /**
     * Affiche une notification
     */
    showNotification(message, type = 'info') {
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

    /**
     * Bascule le menu mobile
     */
    toggleMobileMenu() {
        let mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileMenu) {
            mobileMenu.classList.toggle('active');
            return;
        }
        
        // Créer le menu mobile
        mobileMenu = document.createElement('div');
        mobileMenu.id = 'mobile-menu';
        mobileMenu.className = 'mobile-menu';
        mobileMenu.innerHTML = `
            <button class="mobile-menu-close" id="mobile-menu-close">
                <i class="fas fa-times"></i>
            </button>
            
            <div class="mobile-menu-items">
                <a href="index.html"><i class="fas fa-home"></i> Accueil</a>
                <a href="games.html"><i class="fas fa-gamepad"></i> Jeux</a>
                <a href="memes.html"><i class="fas fa-images"></i> Memes</a>
                <a href="leaderboard.html"><i class="fas fa-trophy"></i> Classement</a>
                <a href="whitepaper.html"><i class="fas fa-file-alt"></i> White Paper</a>
            </div>
            
            <div class="mobile-menu-footer">
                <button id="mobile-login-btn">
                    <i class="fas fa-user"></i> ${this.currentUser ? this.getCurrentDisplayName() : 'Connexion'}
                </button>
                <button id="mobile-lang-btn">
                    🇫🇷 Français
                </button>
            </div>
        `;
        
        document.body.appendChild(mobileMenu);
        
        // Ajouter les écouteurs d'événements
        document.getElementById('mobile-menu-close').addEventListener('click', () => this.toggleMobileMenu());
        document.getElementById('mobile-login-btn').addEventListener('click', () => {
            this.toggleMobileMenu();
            if (this.currentUser) {
                this.showProfile();
            } else {
                this.showAuthModal();
            }
        });
        
        // Activer le menu
        setTimeout(() => {
            mobileMenu.classList.add('active');
        }, 10);
    }

    /**
     * Obtient le classement
     */
    getLeaderboard() {
        return this.leaderboard;
    }

    /**
     * Obtient les informations de l'utilisateur actuel
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Vérifie si l'utilisateur est connecté
     */
    isLoggedIn() {
        return this.currentUser && !this.currentUser.startsWith('Guest_');
    }
}

// Initialiser le système d'authentification
window.auth = new LFISTAuth();

console.log('LFIST Auth System loaded successfully!');