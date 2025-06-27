/**
 * LFIST - Système de traduction internationalisé (i18n)
 * Supporte le français et l'anglais
 */

class LFISTTranslator {
    constructor() {
        // Langue par défaut
        this.currentLang = 'fr';
        
        // Récupérer la langue depuis le localStorage si disponible
        const savedLang = localStorage.getItem('lfist_language');
        if (savedLang) {
            this.currentLang = savedLang;
        }
        
        // Dictionnaire de traductions
        this.translations = {
            // Éléments communs
            common: {
                fr: {
                    home: 'Accueil',
                    games: 'Jeux',
                    memes: 'Memes',
                    leaderboard: 'Classement',
                    defi: 'DeFi',
                    whitepaper: 'White Paper',
                    connectWallet: 'Connecter Wallet',
                    profile: 'Profil',
                    logout: 'Déconnexion',
                    loading: 'Chargement...',
                    points: 'Points',
                    rewards: 'Récompenses',
                    stake: 'Staker',
                    farm: 'Farmer',
                    claim: 'Réclamer',
                    unstake: 'Unstake',
                    confirm: 'Confirmer',
                    cancel: 'Annuler',
                    close: 'Fermer',
                    back: 'Retour',
                    next: 'Suivant',
                    submit: 'Soumettre',
                    success: 'Succès',
                    error: 'Erreur',
                    warning: 'Attention',
                    info: 'Information'
                },
                en: {
                    home: 'Home',
                    games: 'Games',
                    memes: 'Memes',
                    leaderboard: 'Leaderboard',
                    defi: 'DeFi',
                    whitepaper: 'White Paper',
                    connectWallet: 'Connect Wallet',
                    profile: 'Profile',
                    logout: 'Logout',
                    loading: 'Loading...',
                    points: 'Points',
                    rewards: 'Rewards',
                    stake: 'Stake',
                    farm: 'Farm',
                    claim: 'Claim',
                    unstake: 'Unstake',
                    confirm: 'Confirm',
                    cancel: 'Cancel',
                    close: 'Close',
                    back: 'Back',
                    next: 'Next',
                    submit: 'Submit',
                    success: 'Success',
                    error: 'Error',
                    warning: 'Warning',
                    info: 'Information'
                }
            },
            
            // Page d'accueil
            home: {
                fr: {
                    heroTitle: 'LE MEMECOIN QUI RÉVOLUTIONNE LE GAMING CRYPTO',
                    heroSubtitle: 'JOUEZ, GAGNEZ, STAKEZ',
                    heroDescription: 'LFIST combine le meilleur des memecoins avec des jeux innovants et des récompenses réelles. Rejoignez la révolution du gaming crypto!',
                    buyNow: 'ACHETER LFIST',
                    playNow: 'JOUER MAINTENANT',
                    aboutTitle: 'QU\'EST-CE QUE LFIST?',
                    aboutDescription: 'LFIST est un memecoin révolutionnaire qui combine le fun des memes avec l\'utilité réelle du gaming et de la DeFi. Notre écosystème permet aux joueurs de gagner des points convertibles en tokens LFIST.',
                    pointsSystemTitle: 'SYSTÈME DE POINTS',
                    pointsSystemDescription: 'Gagnez des points en jouant à nos jeux, en votant et en participant à notre communauté. Ces points peuvent être échangés contre des tokens LFIST qui seront bloqués pendant 30 jours.',
                    rewardsTitle: 'RÉCOMPENSES AMPLIFIÉES',
                    rewardsDescription: 'Pendant la période de blocage de 30 jours, nous investissons vos tokens dans des cryptos à rendement stable. Vous récupérez vos tokens avec les bénéfices générés!',
                    featuresTitle: 'CARACTÉRISTIQUES',
                    feature1Title: 'JEUX P2E',
                    feature1Description: 'Des jeux amusants et addictifs qui vous récompensent avec des points LFIST',
                    feature2Title: 'STAKING INNOVANT',
                    feature2Description: 'Bloquez vos LFIST et recevez des récompenses amplifiées',
                    feature3Title: 'COMMUNAUTÉ ACTIVE',
                    feature3Description: 'Rejoignez des milliers de joueurs et d\'investisseurs passionnés',
                    feature4Title: 'TOKENOMICS DURABLE',
                    feature4Description: 'Un modèle économique conçu pour une croissance à long terme',
                    statsTitle: 'STATISTIQUES',
                    holders: 'Holders',
                    marketCap: 'Capitalisation',
                    totalSupply: 'Supply Totale',
                    circulatingSupply: 'Supply Circulante',
                    burned: 'Tokens Brûlés',
                    price: 'Prix Actuel',
                    volume: 'Volume (24h)',
                    roadmapTitle: 'FEUILLE DE ROUTE',
                    phase1: 'Phase 1',
                    phase2: 'Phase 2',
                    phase3: 'Phase 3',
                    phase4: 'Phase 4',
                    phase1Items: [
                        'Lancement du token LFIST',
                        'Création du site web',
                        'Premiers jeux Play-to-Earn',
                        'Construction de la communauté'
                    ],
                    phase2Items: [
                        'Système de points et récompenses',
                        'Intégration DeFi complète',
                        'Nouveaux jeux et fonctionnalités',
                        'Partenariats stratégiques'
                    ],
                    phase3Items: [
                        'Plateforme de création de memes',
                        'Expansion de l\'écosystème',
                        'Intégration multi-chaînes',
                        'Événements communautaires'
                    ],
                    phase4Items: [
                        'Marketplace NFT',
                        'Gouvernance DAO',
                        'Écosystème métavers',
                        'Adoption mondiale'
                    ]
                },
                en: {
                    heroTitle: 'THE MEMECOIN REVOLUTIONIZING CRYPTO GAMING',
                    heroSubtitle: 'PLAY, EARN, STAKE',
                    heroDescription: 'LFIST combines the best of memecoins with innovative games and real rewards. Join the crypto gaming revolution!',
                    buyNow: 'BUY LFIST',
                    playNow: 'PLAY NOW',
                    aboutTitle: 'WHAT IS LFIST?',
                    aboutDescription: 'LFIST is a revolutionary memecoin that combines the fun of memes with the real utility of gaming and DeFi. Our ecosystem allows players to earn points convertible to LFIST tokens.',
                    pointsSystemTitle: 'POINTS SYSTEM',
                    pointsSystemDescription: 'Earn points by playing our games, voting, and participating in our community. These points can be exchanged for LFIST tokens that will be locked for 30 days.',
                    rewardsTitle: 'AMPLIFIED REWARDS',
                    rewardsDescription: 'During the 30-day locking period, we invest your tokens in stable-yield cryptocurrencies. You get your tokens back with the generated profits!',
                    featuresTitle: 'FEATURES',
                    feature1Title: 'P2E GAMES',
                    feature1Description: 'Fun and addictive games that reward you with LFIST points',
                    feature2Title: 'INNOVATIVE STAKING',
                    feature2Description: 'Lock your LFIST and receive amplified rewards',
                    feature3Title: 'ACTIVE COMMUNITY',
                    feature3Description: 'Join thousands of passionate gamers and investors',
                    feature4Title: 'SUSTAINABLE TOKENOMICS',
                    feature4Description: 'An economic model designed for long-term growth',
                    statsTitle: 'STATISTICS',
                    holders: 'Holders',
                    marketCap: 'Market Cap',
                    totalSupply: 'Total Supply',
                    circulatingSupply: 'Circulating Supply',
                    burned: 'Burned Tokens',
                    price: 'Current Price',
                    volume: 'Volume (24h)',
                    roadmapTitle: 'ROADMAP',
                    phase1: 'Phase 1',
                    phase2: 'Phase 2',
                    phase3: 'Phase 3',
                    phase4: 'Phase 4',
                    phase1Items: [
                        'LFIST token launch',
                        'Website creation',
                        'First Play-to-Earn games',
                        'Community building'
                    ],
                    phase2Items: [
                        'Points and rewards system',
                        'Full DeFi integration',
                        'New games and features',
                        'Strategic partnerships'
                    ],
                    phase3Items: [
                        'Meme creation platform',
                        'Ecosystem expansion',
                        'Multi-chain integration',
                        'Community events'
                    ],
                    phase4Items: [
                        'NFT Marketplace',
                        'DAO Governance',
                        'Metaverse ecosystem',
                        'Global adoption'
                    ]
                }
            },
            
            // Page de jeux
            games: {
                fr: {
                    title: 'JEUX LFIST',
                    subtitle: 'JOUEZ ET GAGNEZ DES POINTS',
                    description: 'Nos jeux vous permettent de gagner des points qui peuvent être échangés contre des tokens LFIST. Plus vous jouez, plus vous gagnez!',
                    pointsEarned: 'Points gagnés',
                    highScore: 'Meilleur score',
                    playCount: 'Parties jouées',
                    playGame: 'JOUER',
                    comingSoon: 'BIENTÔT DISPONIBLE',
                    gameOver: 'PARTIE TERMINÉE',
                    newHighScore: 'NOUVEAU RECORD!',
                    earnedPoints: 'Points gagnés:',
                    totalPoints: 'Total des points:',
                    playAgain: 'REJOUER',
                    backToGames: 'RETOUR AUX JEUX',
                    convertPoints: 'CONVERTIR MES POINTS',
                    pointsSystem: 'SYSTÈME DE POINTS',
                    pointsExplanation: 'Les points gagnés dans les jeux peuvent être échangés contre des tokens LFIST. Ces tokens seront bloqués pendant 30 jours, période durant laquelle ils seront investis pour générer des rendements supplémentaires.',
                    conversionRate: 'Taux de conversion:',
                    pointsToLfist: '1000 points = 1 LFIST',
                    minimumConversion: 'Conversion minimum:',
                    minimumPoints: '5000 points'
                },
                en: {
                    title: 'LFIST GAMES',
                    subtitle: 'PLAY AND EARN POINTS',
                    description: 'Our games allow you to earn points that can be exchanged for LFIST tokens. The more you play, the more you earn!',
                    pointsEarned: 'Points earned',
                    highScore: 'High score',
                    playCount: 'Games played',
                    playGame: 'PLAY',
                    comingSoon: 'COMING SOON',
                    gameOver: 'GAME OVER',
                    newHighScore: 'NEW HIGH SCORE!',
                    earnedPoints: 'Points earned:',
                    totalPoints: 'Total points:',
                    playAgain: 'PLAY AGAIN',
                    backToGames: 'BACK TO GAMES',
                    convertPoints: 'CONVERT MY POINTS',
                    pointsSystem: 'POINTS SYSTEM',
                    pointsExplanation: 'Points earned in games can be exchanged for LFIST tokens. These tokens will be locked for 30 days, during which they will be invested to generate additional yields.',
                    conversionRate: 'Conversion rate:',
                    pointsToLfist: '1000 points = 1 LFIST',
                    minimumConversion: 'Minimum conversion:',
                    minimumPoints: '5000 points'
                }
            },
            
            // Page DeFi
            defi: {
                fr: {
                    title: 'LFIST DEFI',
                    subtitle: 'STAKING, FARMING ET RÉCOMPENSES',
                    description: 'Notre écosystème DeFi vous permet de staker vos tokens LFIST, de fournir de la liquidité et de recevoir des récompenses amplifiées.',
                    tvl: 'Valeur Totale Verrouillée',
                    apy: 'APY Moyen',
                    stakers: 'Stakers Actifs',
                    rewardsDistributed: 'Récompenses Distribuées',
                    stakingTitle: 'STAKING LFIST',
                    stakingDescription: 'Bloquez vos tokens LFIST et recevez des récompenses régulières. Choisissez parmi différentes périodes de blocage pour des APY variables.',
                    farmingTitle: 'FARMING DE LIQUIDITÉ',
                    farmingDescription: 'Fournissez de la liquidité aux paires LFIST et recevez des récompenses en LFIST. Plus vous fournissez, plus vous gagnez!',
                    liquidityTitle: 'AJOUTER DE LA LIQUIDITÉ',
                    liquidityDescription: 'Ajoutez de la liquidité aux paires LFIST sur PancakeSwap pour recevoir des tokens LP que vous pouvez staker pour des récompenses supplémentaires.',
                    stakingPools: 'Pools de Staking',
                    farmingPools: 'Pools de Farming',
                    flexiblePool: 'Pool Flexible',
                    thirtyDaysPool: 'Pool 30 Jours',
                    ninetyDaysPool: 'Pool 90 Jours',
                    lfistBnbPool: 'Pool LFIST-BNB',
                    lfistBusdPool: 'Pool LFIST-BUSD',
                    stakeNow: 'STAKER MAINTENANT',
                    farmNow: 'FARMER MAINTENANT',
                    addLiquidity: 'AJOUTER DE LA LIQUIDITÉ',
                    stakingFaq: 'FAQ STAKING',
                    farmingFaq: 'FAQ FARMING',
                    pointsToTokens: 'POINTS VERS TOKENS',
                    pointsToTokensDescription: 'Échangez vos points gagnés contre des tokens LFIST. Ces tokens seront bloqués pendant 30 jours, période durant laquelle ils seront investis pour générer des rendements supplémentaires.',
                    yourPoints: 'Vos points:',
                    conversionRate: 'Taux de conversion:',
                    estimatedTokens: 'Tokens estimés:',
                    lockPeriod: 'Période de blocage:',
                    estimatedRewards: 'Récompenses estimées:',
                    convertNow: 'CONVERTIR MAINTENANT',
                    faq1Question: 'Qu\'est-ce que le staking LFIST?',
                    faq1Answer: 'Le staking LFIST vous permet de bloquer vos tokens LFIST pour recevoir des récompenses. Plus la période de blocage est longue, plus l\'APY est élevé.',
                    faq2Question: 'Comment fonctionne le farming de liquidité?',
                    faq2Answer: 'Le farming de liquidité consiste à fournir des paires de tokens (comme LFIST-BNB) à des pools de liquidité. En échange, vous recevez des tokens LP que vous pouvez staker pour gagner des récompenses en LFIST.',
                    faq3Question: 'Comment fonctionne la conversion de points en tokens?',
                    faq3Answer: 'Les points gagnés dans les jeux peuvent être échangés contre des tokens LFIST à un taux de 1000 points pour 1 LFIST. Ces tokens sont bloqués pendant 30 jours et investis pour générer des rendements supplémentaires.',
                    faq4Question: 'Que se passe-t-il pendant la période de blocage de 30 jours?',
                    faq4Answer: 'Pendant cette période, vos tokens LFIST sont investis dans des cryptos à rendement stable. À la fin de la période, vous récupérez vos tokens LFIST plus les bénéfices générés.',
                    faq5Question: 'Y a-t-il un minimum de points pour la conversion?',
                    faq5Answer: 'Oui, le minimum est de 5000 points, ce qui équivaut à 5 LFIST.'
                },
                en: {
                    title: 'LFIST DEFI',
                    subtitle: 'STAKING, FARMING AND REWARDS',
                    description: 'Our DeFi ecosystem allows you to stake your LFIST tokens, provide liquidity, and receive amplified rewards.',
                    tvl: 'Total Value Locked',
                    apy: 'Average APY',
                    stakers: 'Active Stakers',
                    rewardsDistributed: 'Rewards Distributed',
                    stakingTitle: 'LFIST STAKING',
                    stakingDescription: 'Lock your LFIST tokens and receive regular rewards. Choose from different locking periods for variable APYs.',
                    farmingTitle: 'LIQUIDITY FARMING',
                    farmingDescription: 'Provide liquidity to LFIST pairs and receive LFIST rewards. The more you provide, the more you earn!',
                    liquidityTitle: 'ADD LIQUIDITY',
                    liquidityDescription: 'Add liquidity to LFIST pairs on PancakeSwap to receive LP tokens that you can stake for additional rewards.',
                    stakingPools: 'Staking Pools',
                    farmingPools: 'Farming Pools',
                    flexiblePool: 'Flexible Pool',
                    thirtyDaysPool: '30 Days Pool',
                    ninetyDaysPool: '90 Days Pool',
                    lfistBnbPool: 'LFIST-BNB Pool',
                    lfistBusdPool: 'LFIST-BUSD Pool',
                    stakeNow: 'STAKE NOW',
                    farmNow: 'FARM NOW',
                    addLiquidity: 'ADD LIQUIDITY',
                    stakingFaq: 'STAKING FAQ',
                    farmingFaq: 'FARMING FAQ',
                    pointsToTokens: 'POINTS TO TOKENS',
                    pointsToTokensDescription: 'Exchange your earned points for LFIST tokens. These tokens will be locked for 30 days, during which they will be invested to generate additional yields.',
                    yourPoints: 'Your points:',
                    conversionRate: 'Conversion rate:',
                    estimatedTokens: 'Estimated tokens:',
                    lockPeriod: 'Lock period:',
                    estimatedRewards: 'Estimated rewards:',
                    convertNow: 'CONVERT NOW',
                    faq1Question: 'What is LFIST staking?',
                    faq1Answer: 'LFIST staking allows you to lock your LFIST tokens to receive rewards. The longer the locking period, the higher the APY.',
                    faq2Question: 'How does liquidity farming work?',
                    faq2Answer: 'Liquidity farming involves providing token pairs (like LFIST-BNB) to liquidity pools. In return, you receive LP tokens that you can stake to earn LFIST rewards.',
                    faq3Question: 'How does the points to tokens conversion work?',
                    faq3Answer: 'Points earned in games can be exchanged for LFIST tokens at a rate of 1000 points for 1 LFIST. These tokens are locked for 30 days and invested to generate additional yields.',
                    faq4Question: 'What happens during the 30-day locking period?',
                    faq4Answer: 'During this period, your LFIST tokens are invested in stable-yield cryptocurrencies. At the end of the period, you get your LFIST tokens back plus the generated profits.',
                    faq5Question: 'Is there a minimum amount of points for conversion?',
                    faq5Answer: 'Yes, the minimum is 5000 points, which equals 5 LFIST.'
                }
            },
            
            // Page de classement
            leaderboard: {
                fr: {
                    title: 'CLASSEMENT LFIST',
                    subtitle: 'LES MEILLEURS JOUEURS',
                    description: 'Découvrez les meilleurs joueurs de l\'écosystème LFIST. Jouez, gagnez des points et montez dans le classement!',
                    rank: 'Rang',
                    player: 'Joueur',
                    score: 'Score',
                    points: 'Points',
                    gamesPlayed: 'Parties jouées',
                    lastPlayed: 'Dernière partie',
                    filterBy: 'Filtrer par:',
                    allTime: 'Tout temps',
                    thisMonth: 'Ce mois',
                    thisWeek: 'Cette semaine',
                    today: 'Aujourd\'hui',
                    gameFilter: 'Jeu:',
                    allGames: 'Tous les jeux',
                    yourRank: 'Votre rang:',
                    pointsToNextRank: 'Points pour le prochain rang:',
                    topPlayers: 'MEILLEURS JOUEURS',
                    mostPoints: 'PLUS DE POINTS',
                    mostActive: 'PLUS ACTIFS',
                    recentWinners: 'GAGNANTS RÉCENTS'
                },
                en: {
                    title: 'LFIST LEADERBOARD',
                    subtitle: 'TOP PLAYERS',
                    description: 'Discover the best players in the LFIST ecosystem. Play, earn points, and climb the leaderboard!',
                    rank: 'Rank',
                    player: 'Player',
                    score: 'Score',
                    points: 'Points',
                    gamesPlayed: 'Games played',
                    lastPlayed: 'Last played',
                    filterBy: 'Filter by:',
                    allTime: 'All time',
                    thisMonth: 'This month',
                    thisWeek: 'This week',
                    today: 'Today',
                    gameFilter: 'Game:',
                    allGames: 'All games',
                    yourRank: 'Your rank:',
                    pointsToNextRank: 'Points to next rank:',
                    topPlayers: 'TOP PLAYERS',
                    mostPoints: 'MOST POINTS',
                    mostActive: 'MOST ACTIVE',
                    recentWinners: 'RECENT WINNERS'
                }
            },
            
            // Système d'authentification
            auth: {
                fr: {
                    title: 'BIENVENUE SUR LFIST',
                    subtitle: 'Veuillez vous identifier pour accéder à la plateforme',
                    username: 'Nom d\'utilisateur',
                    email: 'Adresse email',
                    usernamePlaceholder: 'Votre nom d\'utilisateur...',
                    emailPlaceholder: 'Votre adresse email...',
                    modeSelection: 'Choisissez votre mode d\'affichage :',
                    classicMode: 'Mode Classique',
                    classicModeDesc: 'Pour les utilisateurs familiers avec la crypto',
                    beginnerMode: 'Mode Débutant',
                    beginnerModeDesc: 'Interface simplifiée avec explications détaillées',
                    login: 'Accéder à la Plateforme',
                    guest: 'Continuer en Invité',
                    tutorial: 'NOUVEAU DANS LA CRYPTO ? CLIQUEZ ICI',
                    footer: 'En vous connectant, vous acceptez nos Conditions d\'utilisation et notre Politique de confidentialité',
                    termsLink: 'Conditions d\'utilisation',
                    privacyLink: 'Politique de confidentialité',
                    profileTitle: 'PROFIL LFIST',
                    level: 'Niveau',
                    joinedOn: 'Inscrit le',
                    totalGames: 'Parties jouées',
                    totalScore: 'Score total',
                    totalPoints: 'Points totaux',
                    bestScore: 'Meilleur score',
                    pointsAvailable: 'Points disponibles',
                    pointsConverted: 'Points convertis',
                    tokensEarned: 'Tokens gagnés',
                    recentActivity: 'Activité récente',
                    noActivity: 'Aucune activité récente',
                    convertPoints: 'Convertir mes points',
                    editProfile: 'Modifier le profil',
                    logoutConfirm: 'Êtes-vous sûr de vouloir vous déconnecter?',
                    yes: 'Oui',
                    no: 'Non',
                    errorUsername: 'Veuillez entrer un nom d\'utilisateur!',
                    errorUsernameLength: 'Le nom d\'utilisateur doit contenir au moins 3 caractères!',
                    errorUsernameChars: 'Seuls les lettres, chiffres, _ et - sont autorisés!',
                    errorEmail: 'Veuillez entrer une adresse email!',
                    errorEmailFormat: 'Veuillez entrer une adresse email valide!',
                    successLogin: 'Connexion réussie! Bienvenue',
                    successLogout: 'Déconnexion réussie!',
                    userModeClassic: 'Mode classique activé!',
                    userModeBeginner: 'Mode débutant activé!',
                    userModeBeginnerSoon: 'Mode débutant activé! La version complète sera disponible prochainement.'
                },
                en: {
                    title: 'WELCOME TO LFIST',
                    subtitle: 'Please identify yourself to access the platform',
                    username: 'Username',
                    email: 'Email address',
                    usernamePlaceholder: 'Your username...',
                    emailPlaceholder: 'Your email address...',
                    modeSelection: 'Choose your display mode:',
                    classicMode: 'Classic Mode',
                    classicModeDesc: 'For users familiar with crypto',
                    beginnerMode: 'Beginner Mode',
                    beginnerModeDesc: 'Simplified interface with detailed explanations',
                    login: 'Access the Platform',
                    guest: 'Continue as Guest',
                    tutorial: 'NEW TO CRYPTO? CLICK HERE',
                    footer: 'By logging in, you accept our Terms of Use and Privacy Policy',
                    termsLink: 'Terms of Use',
                    privacyLink: 'Privacy Policy',
                    profileTitle: 'LFIST PROFILE',
                    level: 'Level',
                    joinedOn: 'Joined on',
                    totalGames: 'Games played',
                    totalScore: 'Total score',
                    totalPoints: 'Total points',
                    bestScore: 'Best score',
                    pointsAvailable: 'Available points',
                    pointsConverted: 'Converted points',
                    tokensEarned: 'Tokens earned',
                    recentActivity: 'Recent activity',
                    noActivity: 'No recent activity',
                    convertPoints: 'Convert my points',
                    editProfile: 'Edit profile',
                    logoutConfirm: 'Are you sure you want to log out?',
                    yes: 'Yes',
                    no: 'No',
                    errorUsername: 'Please enter a username!',
                    errorUsernameLength: 'Username must be at least 3 characters!',
                    errorUsernameChars: 'Only letters, numbers, _ and - are allowed!',
                    errorEmail: 'Please enter an email address!',
                    errorEmailFormat: 'Please enter a valid email address!',
                    successLogin: 'Login successful! Welcome',
                    successLogout: 'Logout successful!',
                    userModeClassic: 'Classic mode activated!',
                    userModeBeginner: 'Beginner mode activated!',
                    userModeBeginnerSoon: 'Beginner mode activated! The full version will be available soon.'
                }
            },
            
            // Système de points et récompenses
            rewards: {
                fr: {
                    title: 'SYSTÈME DE RÉCOMPENSES',
                    subtitle: 'CONVERTISSEZ VOS POINTS EN TOKENS',
                    description: 'Nos jeux et activités vous permettent de gagner des points qui peuvent être échangés contre des tokens LFIST. Ces tokens sont bloqués pendant 30 jours et investis pour générer des rendements supplémentaires.',
                    pointsBalance: 'Solde de points',
                    conversionRate: 'Taux de conversion',
                    minimumConversion: 'Conversion minimum',
                    lockPeriod: 'Période de blocage',
                    estimatedRewards: 'Récompenses estimées',
                    howItWorks: 'COMMENT ÇA MARCHE',
                    step1: 'Jouez à nos jeux et participez à nos activités pour gagner des points',
                    step2: 'Échangez vos points contre des tokens LFIST (minimum 5000 points)',
                    step3: 'Vos tokens sont bloqués pendant 30 jours et investis',
                    step4: 'Après 30 jours, récupérez vos tokens LFIST plus les bénéfices générés',
                    convertNow: 'CONVERTIR MAINTENANT',
                    conversionHistory: 'HISTORIQUE DES CONVERSIONS',
                    date: 'Date',
                    pointsConverted: 'Points convertis',
                    tokensReceived: 'Tokens reçus',
                    status: 'Statut',
                    unlockDate: 'Date de déblocage',
                    noConversions: 'Aucune conversion effectuée',
                    pending: 'En attente',
                    completed: 'Complété',
                    amountToConvert: 'Montant à convertir',
                    convertPoints: 'Convertir mes points',
                    insufficientPoints: 'Points insuffisants',
                    conversionSuccess: 'Conversion réussie! Vos tokens seront disponibles le',
                    investmentDetails: 'DÉTAILS DE L\'INVESTISSEMENT',
                    investmentStrategy: 'Pendant la période de blocage de 30 jours, vos tokens LFIST sont investis dans un portefeuille diversifié de cryptomonnaies à rendement stable. Notre stratégie d\'investissement vise à générer un rendement supplémentaire de 5-15% sur vos tokens bloqués.',
                    currentInvestments: 'Investissements actuels',
                    expectedReturn: 'Rendement attendu',
                    investmentRisks: 'Risques d\'investissement',
                    lowRisk: 'Risque faible',
                    mediumRisk: 'Risque moyen',
                    highRisk: 'Risque élevé'
                },
                en: {
                    title: 'REWARDS SYSTEM',
                    subtitle: 'CONVERT YOUR POINTS TO TOKENS',
                    description: 'Our games and activities allow you to earn points that can be exchanged for LFIST tokens. These tokens are locked for 30 days and invested to generate additional yields.',
                    pointsBalance: 'Points balance',
                    conversionRate: 'Conversion rate',
                    minimumConversion: 'Minimum conversion',
                    lockPeriod: 'Lock period',
                    estimatedRewards: 'Estimated rewards',
                    howItWorks: 'HOW IT WORKS',
                    step1: 'Play our games and participate in our activities to earn points',
                    step2: 'Exchange your points for LFIST tokens (minimum 5000 points)',
                    step3: 'Your tokens are locked for 30 days and invested',
                    step4: 'After 30 days, get your LFIST tokens back plus the generated profits',
                    convertNow: 'CONVERT NOW',
                    conversionHistory: 'CONVERSION HISTORY',
                    date: 'Date',
                    pointsConverted: 'Points converted',
                    tokensReceived: 'Tokens received',
                    status: 'Status',
                    unlockDate: 'Unlock date',
                    noConversions: 'No conversions made',
                    pending: 'Pending',
                    completed: 'Completed',
                    amountToConvert: 'Amount to convert',
                    convertPoints: 'Convert my points',
                    insufficientPoints: 'Insufficient points',
                    conversionSuccess: 'Conversion successful! Your tokens will be available on',
                    investmentDetails: 'INVESTMENT DETAILS',
                    investmentStrategy: 'During the 30-day locking period, your LFIST tokens are invested in a diversified portfolio of stable-yield cryptocurrencies. Our investment strategy aims to generate an additional yield of 5-15% on your locked tokens.',
                    currentInvestments: 'Current investments',
                    expectedReturn: 'Expected return',
                    investmentRisks: 'Investment risks',
                    lowRisk: 'Low risk',
                    mediumRisk: 'Medium risk',
                    highRisk: 'High risk'
                }
            }
        };
    }
    
    /**
     * Initialise le système de traduction
     */
    init() {
        // Mettre à jour les éléments de l'interface avec la langue actuelle
        this.updateUI();
        
        // Ajouter l'écouteur d'événement pour le bouton de langue
        const langButton = document.getElementById('languageButton');
        if (langButton) {
            langButton.addEventListener('click', () => this.toggleLanguage());
            this.updateLanguageButton();
        }
    }
    
    /**
     * Met à jour l'interface utilisateur avec la langue actuelle
     */
    updateUI() {
        // Mettre à jour les éléments avec l'attribut data-i18n
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const [section, id] = key.split('.');
            
            if (this.translations[section] && 
                this.translations[section][this.currentLang] && 
                this.translations[section][this.currentLang][id]) {
                element.textContent = this.translations[section][this.currentLang][id];
            }
        });
        
        // Mettre à jour les attributs placeholder avec l'attribut data-i18n-placeholder
        const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
        placeholders.forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const [section, id] = key.split('.');
            
            if (this.translations[section] && 
                this.translations[section][this.currentLang] && 
                this.translations[section][this.currentLang][id]) {
                element.placeholder = this.translations[section][this.currentLang][id];
            }
        });
    }
    
    /**
     * Met à jour le bouton de langue
     */
    updateLanguageButton() {
        const langButton = document.getElementById('languageButton');
        if (langButton) {
            langButton.textContent = this.currentLang === 'fr' ? '🇫🇷 Français' : '🇬🇧 English';
        }
    }
    
    /**
     * Bascule entre les langues disponibles
     */
    toggleLanguage() {
        this.currentLang = this.currentLang === 'fr' ? 'en' : 'fr';
        localStorage.setItem('lfist_language', this.currentLang);
        this.updateUI();
        this.updateLanguageButton();
    }
    
    /**
     * Obtient une traduction
     * @param {string} section - La section de traduction
     * @param {string} key - La clé de traduction
     * @returns {string} - La traduction
     */
    get(section, key) {
        if (this.translations[section] && 
            this.translations[section][this.currentLang] && 
            this.translations[section][this.currentLang][key]) {
            return this.translations[section][this.currentLang][key];
        }
        return key;
    }
    
    /**
     * Obtient la langue actuelle
     * @returns {string} - La langue actuelle
     */
    getCurrentLanguage() {
        return this.currentLang;
    }
}

// Créer et exporter l'instance du traducteur
window.i18n = new LFISTTranslator();

// Initialiser le système de traduction au chargement du document
document.addEventListener('DOMContentLoaded', function() {
    window.i18n.init();
});