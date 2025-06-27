/**
 * LFIST DeFi - Gestion des fonctionnalités DeFi
 * Staking, Farming et Liquidité
 */

// Variables globales
let userWallet = null;
let userStakes = {};
let userFarms = {};
let poolsData = {
  staking: {
    // Pools de staking avec des cryptomonnaies stables uniquement
    'bnb-flexible': {
      name: 'BNB Flexible',
      token: 'BNB',
      apy: 5.2,
      minStake: 0.1,
      lockDuration: 0,
      totalStaked: 1250,
      isStableCoin: true,
      description: 'Stakez vos BNB et gagnez des rendements stables sans période de blocage.'
    },
    'bnb-30days': {
      name: 'BNB 30 Jours',
      token: 'BNB',
      apy: 7.5,
      minStake: 0.5,
      lockDuration: 30,
      totalStaked: 3200,
      isStableCoin: true,
      description: 'Bloquez vos BNB pendant 30 jours pour un rendement amélioré.'
    },
    'btcb-flexible': {
      name: 'BTCB Flexible',
      token: 'BTCB',
      apy: 4.8,
      minStake: 0.01,
      lockDuration: 0,
      totalStaked: 45,
      isStableCoin: true,
      description: 'Stakez vos BTCB (Bitcoin sur BSC) et gagnez des rendements stables sans période de blocage.'
    },
    'btcb-90days': {
      name: 'BTCB 90 Jours',
      token: 'BTCB',
      apy: 8.2,
      minStake: 0.05,
      lockDuration: 90,
      totalStaked: 120,
      isStableCoin: true,
      description: 'Bloquez vos BTCB pendant 90 jours pour un rendement optimisé.'
    },
    'busd-flexible': {
      name: 'BUSD Flexible',
      token: 'BUSD',
      apy: 6.5,
      minStake: 100,
      lockDuration: 0,
      totalStaked: 250000,
      isStableCoin: true,
      description: 'Stakez vos BUSD et gagnez des rendements stables sans période de blocage.'
    },
    'usdt-flexible': {
      name: 'USDT Flexible',
      token: 'USDT',
      apy: 6.3,
      minStake: 100,
      lockDuration: 0,
      totalStaked: 180000,
      isStableCoin: true,
      description: 'Stakez vos USDT et gagnez des rendements stables sans période de blocage.'
    }
  },
  farming: {
    // Pools de farming LFIST
    'lfist-bnb': {
      name: 'LFIST-BNB LP',
      tokens: ['LFIST', 'BNB'],
      apy: 60.0,
      multiplier: '40x',
      totalLocked: 250000,
      rewardToken: 'LFIST',
      isStablePair: false,
      description: 'Fournissez de la liquidité à la paire LFIST-BNB et gagnez des récompenses en LFIST.'
    },
    'lfist-busd': {
      name: 'LFIST-BUSD LP',
      tokens: ['LFIST', 'BUSD'],
      apy: 45.0,
      multiplier: '20x',
      totalLocked: 150000,
      rewardToken: 'LFIST',
      isStablePair: false,
      description: 'Fournissez de la liquidité à la paire LFIST-BUSD et gagnez des récompenses en LFIST.'
    },
    // Pools de farming avec des paires de cryptomonnaies stables uniquement
    'bnb-busd': {
      name: 'BNB-BUSD LP',
      tokens: ['BNB', 'BUSD'],
      apy: 8.5,
      multiplier: '10x',
      totalLocked: 1250000,
      rewardToken: 'BNB',
      isStablePair: true,
      description: 'Fournissez de la liquidité à la paire BNB-BUSD et gagnez des récompenses en BNB.'
    },
    'btcb-busd': {
      name: 'BTCB-BUSD LP',
      tokens: ['BTCB', 'BUSD'],
      apy: 7.2,
      multiplier: '8x',
      totalLocked: 950000,
      rewardToken: 'BTCB',
      isStablePair: true,
      description: 'Fournissez de la liquidité à la paire BTCB-BUSD et gagnez des récompenses en BTCB.'
    },
    'busd-usdt': {
      name: 'BUSD-USDT LP',
      tokens: ['BUSD', 'USDT'],
      apy: 5.8,
      multiplier: '5x',
      totalLocked: 2500000,
      rewardToken: 'BUSD',
      isStablePair: true,
      description: 'Fournissez de la liquidité à la paire BUSD-USDT et gagnez des récompenses en BUSD.'
    }
  }
};

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
  // Initialiser les données DeFi
  initDeFiData();
  
  // Ajouter les écouteurs d'événements
  initDeFiEvents();
  
  // Initialiser les FAQ
  initFAQ();
  
  // Vérifier si l'utilisateur est connecté
  setTimeout(checkUserLoggedIn, 1500);
});

/**
 * Initialise les données DeFi
 */
function initDeFiData() {
  // Mettre à jour les statistiques globales
  updateGlobalStats();
  
  // Mettre à jour les données des pools
  updatePoolsData();
}

/**
 * Met à jour les statistiques globales
 */
function updateGlobalStats() {
  // Calculer le TVL total
  const totalStaked = Object.values(poolsData.staking).reduce((sum, pool) => sum + pool.totalStaked, 0);
  const totalFarmed = Object.values(poolsData.farming).reduce((sum, pool) => sum + pool.totalLocked, 0);
  const tvl = totalStaked * 0.000005 + totalFarmed; // Simuler 1 LFIST = $0.000005
  
  // Calculer l'APY moyen
  const stakingApys = Object.values(poolsData.staking).map(pool => pool.apy);
  const farmingApys = Object.values(poolsData.farming).map(pool => pool.apy);
  const allApys = [...stakingApys, ...farmingApys];
  const avgApy = allApys.reduce((sum, apy) => sum + apy, 0) / allApys.length;
  
  // Mettre à jour les éléments
  updateElement('tvl', '$' + tvl.toLocaleString());
  updateElement('apy', avgApy.toFixed(1) + '%');
  updateElement('stakers', (2500 + Math.random() * 500).toFixed(0));
  updateElement('rewards-distributed', (500000 + Math.random() * 100000).toFixed(0) + ' LFIST');
}

/**
 * Met à jour les données des pools
 */
function updatePoolsData() {
  // Mettre à jour les données des pools de staking
  Object.keys(poolsData.staking).forEach(poolId => {
    const pool = poolsData.staking[poolId];
    updateElement(`${poolId}-apy`, pool.apy + '%');
    updateElement(`${poolId}-tvl`, pool.totalStaked.toLocaleString() + ' ' + pool.token);
    
    // Mettre à jour les noms et descriptions si les éléments existent
    updateElement(`${poolId}-name`, pool.name);
    updateElement(`${poolId}-description`, pool.description);
  });
  
  // Mettre à jour les données des pools de farming
  Object.keys(poolsData.farming).forEach(poolId => {
    const pool = poolsData.farming[poolId];
    updateElement(`${poolId}-apy`, pool.apy + '%');
    updateElement(`${poolId}-tvl`, '$' + pool.totalLocked.toLocaleString());
    
    // Mettre à jour les noms et descriptions si les éléments existent
    updateElement(`${poolId}-name`, pool.name);
    updateElement(`${poolId}-description`, pool.description);
  });
  
  // Mettre à jour dynamiquement les pools dans l'interface
  updatePoolsUI();
}

/**
 * Met à jour dynamiquement l'interface des pools
 */
function updatePoolsUI() {
  // Récupérer les conteneurs de pools
  const stakingPoolsContainer = document.querySelector('.staking-pools');
  const farmingPoolsContainer = document.querySelector('.farming-pools');
  
  // Si les conteneurs n'existent pas, ne rien faire
  if (!stakingPoolsContainer || !farmingPoolsContainer) return;
  
  // Vider les conteneurs
  stakingPoolsContainer.innerHTML = '';
  farmingPoolsContainer.innerHTML = '';
  
  // Générer les pools de staking
  Object.keys(poolsData.staking).forEach(poolId => {
    const pool = poolsData.staking[poolId];
    const poolCard = document.createElement('div');
    poolCard.className = 'pool-card';
    poolCard.innerHTML = `
      <div class="pool-header">
        <div class="pool-icon">
          <img src="images/tokens/${pool.token.toLowerCase()}.png" alt="${pool.token}" onerror="this.src='images/tokens/default.png'">
        </div>
        <div class="pool-title">
          <h3>${pool.name}</h3>
          <span class="pool-apy">APY: <span id="${poolId}-apy">${pool.apy}%</span></span>
        </div>
      </div>
      <div class="pool-body">
        <div class="pool-info">
          <div class="info-item">
            <span class="info-label">Token:</span>
            <span class="info-value">${pool.token}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Durée:</span>
            <span class="info-value">${pool.lockDuration === 0 ? 'Flexible' : pool.lockDuration + ' Jours (Lock)'}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Min. Stake:</span>
            <span class="info-value">${pool.minStake} ${pool.token}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Total Staké:</span>
            <span class="info-value" id="${poolId}-tvl">${pool.totalStaked.toLocaleString()} ${pool.token}</span>
          </div>
        </div>
        <div class="pool-description">
          <p>${pool.description}</p>
        </div>
        <div class="pool-actions">
          <button class="btn btn-primary stake-pool-btn" data-pool="${poolId}">
            <i class="fas fa-plus-circle"></i> STAKER
          </button>
        </div>
      </div>
    `;
    stakingPoolsContainer.appendChild(poolCard);
  });
  
  // Générer les pools de farming
  Object.keys(poolsData.farming).forEach(poolId => {
    const pool = poolsData.farming[poolId];
    const poolCard = document.createElement('div');
    poolCard.className = 'pool-card';
    poolCard.innerHTML = `
      <div class="pool-header">
        <div class="pool-icon">
          <div class="token-pair">
            <img src="images/tokens/${pool.tokens[0].toLowerCase()}.png" alt="${pool.tokens[0]}" onerror="this.src='images/tokens/default.png'">
            <img src="images/tokens/${pool.tokens[1].toLowerCase()}.png" alt="${pool.tokens[1]}" onerror="this.src='images/tokens/default.png'">
          </div>
        </div>
        <div class="pool-title">
          <h3>${pool.name}</h3>
          <span class="pool-apy">APY: <span id="${poolId}-apy">${pool.apy}%</span></span>
        </div>
      </div>
      <div class="pool-body">
        <div class="pool-info">
          <div class="info-item">
            <span class="info-label">Récompenses:</span>
            <span class="info-value">${pool.rewardToken}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Total Verrouillé:</span>
            <span class="info-value" id="${poolId}-tvl">$${pool.totalLocked.toLocaleString()}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Multiplicateur:</span>
            <span class="info-value">${pool.multiplier}</span>
          </div>
        </div>
        <div class="pool-description">
          <p>${pool.description}</p>
        </div>
        <div class="pool-actions">
          <a href="https://pancakeswap.finance/add/${pool.tokens[0]}/${pool.tokens[1]}" target="_blank" class="btn btn-secondary">
            <i class="fas fa-plus-circle"></i> OBTENIR LP
          </a>
          <button class="btn btn-primary farm-pool-btn" data-pool="${poolId}">
            <i class="fas fa-seedling"></i> FARMER
          </button>
        </div>
      </div>
    `;
    farmingPoolsContainer.appendChild(poolCard);
  });
  
  // Réattacher les écouteurs d'événements
  document.querySelectorAll('.stake-pool-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const pool = this.getAttribute('data-pool');
      document.getElementById('stake-pool').value = pool;
      showModal('stake-modal');
    });
  });
  
  document.querySelectorAll('.farm-pool-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const pool = this.getAttribute('data-pool');
      document.getElementById('farm-pool').value = pool;
      showModal('farm-modal');
    });
  });
}

/**
 * Initialise les écouteurs d'événements
 */
function initDeFiEvents() {
  // Boutons de staking
  document.getElementById('stake-btn')?.addEventListener('click', function() {
    showModal('stake-modal');
  });
  
  // Boutons de farming
  document.getElementById('farm-btn')?.addEventListener('click', function() {
    showModal('farm-modal');
  });
  
  // Boutons de liquidité
  document.getElementById('liquidity-btn')?.addEventListener('click', function() {
    window.open('https://pancakeswap.finance/add/BNB/0xc0679bF1fda759B7CfC44691b422405Fae84253f', '_blank');
  });
  
  // Boutons de connexion
  document.getElementById('connect-for-staking')?.addEventListener('click', function() {
    window.auth.showAuthModal();
  });
  
  document.getElementById('connect-for-farming')?.addEventListener('click', function() {
    window.auth.showAuthModal();
  });
  
  // Boutons de stake pool
  document.querySelectorAll('.stake-pool-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const pool = this.getAttribute('data-pool');
      document.getElementById('stake-pool').value = pool;
      showModal('stake-modal');
    });
  });
  
  // Boutons de farm pool
  document.querySelectorAll('.farm-pool-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const pool = this.getAttribute('data-pool');
      document.getElementById('farm-pool').value = pool;
      showModal('farm-modal');
    });
  });
  
  // Fermer les modals
  document.querySelectorAll('.close-modal, .close-modal-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      hideModals();
    });
  });
  
  // Confirmer le staking
  document.getElementById('confirm-stake')?.addEventListener('click', function() {
    simulateStaking();
  });
  
  // Confirmer le farming
  document.getElementById('confirm-farm')?.addEventListener('click', function() {
    simulateFarming();
  });
  
  // Calculer les récompenses estimées
  document.getElementById('stake-amount')?.addEventListener('input', updateEstimatedRewards);
  document.getElementById('stake-pool')?.addEventListener('change', updateEstimatedRewards);
  document.getElementById('farm-amount')?.addEventListener('input', updateEstimatedFarmRewards);
  document.getElementById('farm-pool')?.addEventListener('change', updateEstimatedFarmRewards);
}

/**
 * Initialise les FAQ
 */
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', function() {
      const answer = this.nextElementSibling;
      const icon = this.querySelector('.faq-toggle i');
      
      if (answer.style.maxHeight) {
        answer.style.maxHeight = null;
        icon.className = 'fas fa-plus';
      } else {
        answer.style.maxHeight = answer.scrollHeight + 'px';
        icon.className = 'fas fa-minus';
      }
    });
  });
}

/**
 * Vérifie si l'utilisateur est connecté
 */
function checkUserLoggedIn() {
  if (window.auth && window.auth.isLoggedIn()) {
    // Simuler un wallet connecté avec des cryptomonnaies stables
    userWallet = {
      address: '0x' + Math.random().toString(16).substring(2, 14),
      balance: {
        // Cryptomonnaies stables uniquement
        BNB: 1.5 + Math.random() * 3,
        BTCB: 0.05 + Math.random() * 0.1,
        BUSD: 1000 + Math.random() * 2000,
        USDT: 800 + Math.random() * 1500,
        ETH: 0.8 + Math.random() * 1.5,
        // Paires LP
        'bnb-busd-lp': 0.2 + Math.random() * 0.5,
        'btcb-busd-lp': 0.1 + Math.random() * 0.3,
        'busd-usdt-lp': 0.5 + Math.random() * 1
      }
    };
    
    // Simuler des stakes existants avec des cryptomonnaies stables
    userStakes = {
      'bnb-flexible': {
        amount: 0.5 + Math.random() * 1,
        token: 'BNB',
        startTime: Date.now() - (Math.random() * 30 * 24 * 60 * 60 * 1000),
        rewards: 0.02 + Math.random() * 0.05
      },
      'busd-flexible': {
        amount: 500 + Math.random() * 1000,
        token: 'BUSD',
        startTime: Date.now() - (Math.random() * 15 * 24 * 60 * 60 * 1000),
        rewards: 10 + Math.random() * 20
      }
    };
    
    // Simuler des farms existantes
    userFarms = {
      'bnb-busd': {
        amount: 0.15 + Math.random() * 0.3,
        tokens: ['BNB', 'BUSD'],
        startTime: Date.now() - (Math.random() * 20 * 24 * 60 * 60 * 1000),
        rewards: 0.05 + Math.random() * 0.1
      }
    };
    
    // Afficher les informations de l'utilisateur
    document.getElementById('staking-not-connected').style.display = 'none';
    document.getElementById('farming-not-connected').style.display = 'none';
    document.getElementById('user-staking-info').style.display = 'block';
    document.getElementById('user-farming-info').style.display = 'block';
    
    // Mettre à jour les données utilisateur
    updateUserData();
  }
}

/**
 * Met à jour les données utilisateur
 */
function updateUserData() {
  if (!userWallet) return;
  
  // Créer ou mettre à jour le conteneur des balances
  updateUserBalances();
  
  // Mettre à jour les stakes
  updateUserStakes();
  
  // Mettre à jour les farms
  updateUserFarms();
}

/**
 * Met à jour les balances de l'utilisateur
 */
function updateUserBalances() {
  // Récupérer ou créer le conteneur des balances
  let balancesContainer = document.getElementById('user-balances');
  if (!balancesContainer) {
    // Créer le conteneur s'il n'existe pas
    const userInfo = document.querySelector('#user-staking-info');
    if (userInfo) {
      balancesContainer = document.createElement('div');
      balancesContainer.id = 'user-balances';
      balancesContainer.className = 'user-balances';
      balancesContainer.innerHTML = '<h3>Vos Balances</h3><div class="balances-grid"></div>';
      userInfo.prepend(balancesContainer);
    } else {
      return; // Sortir si le conteneur parent n'existe pas
    }
  }
  
  // Récupérer la grille des balances
  const balancesGrid = balancesContainer.querySelector('.balances-grid');
  if (!balancesGrid) return;
  
  // Vider la grille
  balancesGrid.innerHTML = '';
  
  // Ajouter chaque balance
  Object.keys(userWallet.balance).forEach(token => {
    // Ignorer les paires LP
    if (token.includes('-lp')) return;
    
    const balance = userWallet.balance[token];
    const balanceItem = document.createElement('div');
    balanceItem.className = 'balance-item';
    
    // Formater la balance selon le type de token
    const formattedBalance = ['BNB', 'BTCB', 'ETH'].includes(token) 
      ? balance.toFixed(4) 
      : balance.toFixed(0);
    
    balanceItem.innerHTML = `
      <div class="token-icon">
        <img src="images/tokens/${token.toLowerCase()}.png" alt="${token}" onerror="this.src='images/tokens/default.png'">
      </div>
      <div class="token-balance">
        <span class="balance-value">${formattedBalance}</span>
        <span class="balance-token">${token}</span>
      </div>
    `;
    
    balancesGrid.appendChild(balanceItem);
  });
  
  // Ajouter une section pour les paires LP
  const lpBalances = Object.keys(userWallet.balance).filter(token => token.includes('-lp'));
  if (lpBalances.length > 0) {
    const lpSection = document.createElement('div');
    lpSection.className = 'lp-balances';
    lpSection.innerHTML = '<h4>Tokens LP</h4><div class="lp-grid"></div>';
    
    const lpGrid = lpSection.querySelector('.lp-grid');
    
    lpBalances.forEach(token => {
      const balance = userWallet.balance[token];
      const tokenName = token.replace('-lp', '').toUpperCase();
      const lpItem = document.createElement('div');
      lpItem.className = 'lp-item';
      lpItem.innerHTML = `
        <span class="lp-name">${tokenName}</span>
        <span class="lp-balance">${balance.toFixed(4)} LP</span>
      `;
      
      lpGrid.appendChild(lpItem);
    });
    
    balancesContainer.appendChild(lpSection);
  }
}

/**
 * Met à jour les stakes de l'utilisateur
 */
function updateUserStakes() {
  // Récupérer le conteneur des positions de staking
  const userPositions = document.querySelector('#user-staking-info .user-positions');
  if (!userPositions) return;
  
  // Vider le conteneur
  userPositions.innerHTML = '';
  
  // Ajouter chaque stake
  Object.keys(userStakes).forEach(poolId => {
    const stake = userStakes[poolId];
    const pool = poolsData.staking[poolId];
    
    if (!pool) return; // Ignorer si le pool n'existe pas
    
    const positionCard = document.createElement('div');
    positionCard.className = 'position-card';
    positionCard.innerHTML = `
      <div class="position-header">
        <div class="position-token-icon">
          <img src="images/tokens/${stake.token.toLowerCase()}.png" alt="${stake.token}" onerror="this.src='images/tokens/default.png'">
        </div>
        <h4>${pool.name}</h4>
        <span class="position-status active">Actif</span>
      </div>
      <div class="position-body">
        <div class="position-info">
          <div class="info-item">
            <span class="info-label">Montant Staké:</span>
            <span class="info-value">${stake.amount.toFixed(['BNB', 'BTCB', 'ETH'].includes(stake.token) ? 4 : 0)} ${stake.token}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Récompenses Accumulées:</span>
            <span class="info-value">${stake.rewards.toFixed(['BNB', 'BTCB', 'ETH'].includes(stake.token) ? 4 : 2)} ${stake.token}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Date de début:</span>
            <span class="info-value">${new Date(stake.startTime).toLocaleDateString()}</span>
          </div>
        </div>
        <div class="position-actions">
          <button class="btn btn-secondary claim-stake-btn" data-pool="${poolId}">
            <i class="fas fa-hand-holding-usd"></i> RÉCLAMER
          </button>
          <button class="btn btn-meme unstake-btn" data-pool="${poolId}">
            <i class="fas fa-minus-circle"></i> UNSTAKE
          </button>
        </div>
      </div>
    `;
    
    userPositions.appendChild(positionCard);
    
    // Ajouter les écouteurs d'événements
    const claimBtn = positionCard.querySelector('.claim-stake-btn');
    const unstakeBtn = positionCard.querySelector('.unstake-btn');
    
    claimBtn.addEventListener('click', function() {
      claimStakeRewards(poolId);
    });
    
    unstakeBtn.addEventListener('click', function() {
      unstake(poolId);
    });
  });
  
  // Afficher un message si aucun stake
  if (Object.keys(userStakes).length === 0) {
    userPositions.innerHTML = `
      <div class="empty-positions">
        <i class="fas fa-info-circle"></i>
        <p>Vous n'avez pas encore de positions de staking actives.</p>
        <button class="btn btn-primary" id="start-staking-btn">
          <i class="fas fa-plus-circle"></i> COMMENCER À STAKER
        </button>
      </div>
    `;
    
    // Ajouter l'écouteur d'événement
    document.getElementById('start-staking-btn')?.addEventListener('click', function() {
      document.getElementById('stake-btn').click();
    });
  }
}

/**
 * Met à jour les farms de l'utilisateur
 */
function updateUserFarms() {
  // Récupérer le conteneur des positions de farming
  const userPositions = document.querySelector('#user-farming-info .user-positions');
  if (!userPositions) return;
  
  // Vider le conteneur
  userPositions.innerHTML = '';
  
  // Ajouter chaque farm
  Object.keys(userFarms).forEach(poolId => {
    const farm = userFarms[poolId];
    const pool = poolsData.farming[poolId];
    
    if (!pool) return; // Ignorer si le pool n'existe pas
    
    const positionCard = document.createElement('div');
    positionCard.className = 'position-card';
    positionCard.innerHTML = `
      <div class="position-header">
        <div class="position-token-icon">
          <div class="token-pair">
            <img src="images/tokens/${farm.tokens[0].toLowerCase()}.png" alt="${farm.tokens[0]}" onerror="this.src='images/tokens/default.png'">
            <img src="images/tokens/${farm.tokens[1].toLowerCase()}.png" alt="${farm.tokens[1]}" onerror="this.src='images/tokens/default.png'">
          </div>
        </div>
        <h4>${pool.name}</h4>
        <span class="position-status active">Actif</span>
      </div>
      <div class="position-body">
        <div class="position-info">
          <div class="info-item">
            <span class="info-label">Montant Staké:</span>
            <span class="info-value">${farm.amount.toFixed(4)} LP</span>
          </div>
          <div class="info-item">
            <span class="info-label">Récompenses Accumulées:</span>
            <span class="info-value">${farm.rewards.toFixed(4)} ${pool.rewardToken}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Date de début:</span>
            <span class="info-value">${new Date(farm.startTime).toLocaleDateString()}</span>
          </div>
        </div>
        <div class="position-actions">
          <button class="btn btn-secondary claim-farm-btn" data-pool="${poolId}">
            <i class="fas fa-hand-holding-usd"></i> RÉCLAMER
          </button>
          <button class="btn btn-meme unstake-farm-btn" data-pool="${poolId}">
            <i class="fas fa-minus-circle"></i> UNSTAKE
          </button>
        </div>
      </div>
    `;
    
    userPositions.appendChild(positionCard);
    
    // Ajouter les écouteurs d'événements
    const claimBtn = positionCard.querySelector('.claim-farm-btn');
    const unstakeBtn = positionCard.querySelector('.unstake-farm-btn');
    
    claimBtn.addEventListener('click', function() {
      claimFarmRewards(poolId);
    });
    
    unstakeBtn.addEventListener('click', function() {
      unstakeFarm(poolId);
    });
  });
  
  // Afficher un message si aucune farm
  if (Object.keys(userFarms).length === 0) {
    userPositions.innerHTML = `
      <div class="empty-positions">
        <i class="fas fa-info-circle"></i>
        <p>Vous n'avez pas encore de positions de farming actives.</p>
        <button class="btn btn-primary" id="start-farming-btn">
          <i class="fas fa-plus-circle"></i> COMMENCER À FARMER
        </button>
      </div>
    `;
    
    // Ajouter l'écouteur d'événement
    document.getElementById('start-farming-btn')?.addEventListener('click', function() {
      document.getElementById('farm-btn').click();
    });
  }
}

/**
 * Affiche un modal
 */
function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'flex';
    
    // Mettre à jour les données du modal
    if (modalId === 'stake-modal') {
      updateEstimatedRewards();
    } else if (modalId === 'farm-modal') {
      updateEstimatedFarmRewards();
    }
  }
}

/**
 * Cache tous les modals
 */
function hideModals() {
  document.querySelectorAll('.modal').forEach(modal => {
    modal.style.display = 'none';
  });
}

/**
 * Met à jour les récompenses estimées pour le staking
 */
function updateEstimatedRewards() {
  const amount = parseFloat(document.getElementById('stake-amount').value) || 0;
  const pool = document.getElementById('stake-pool').value;
  
  let apy = poolsData.staking[pool]?.apy || 0;
  let days = poolsData.staking[pool]?.lockDuration || 365;
  if (days === 0) days = 365; // Pour le pool flexible
  
  const dailyRate = apy / 365;
  const rewards = amount * (dailyRate / 100) * days;
  document.getElementById('estimated-rewards').textContent = rewards.toFixed(2);
}

/**
 * Met à jour les récompenses estimées pour le farming
 */
function updateEstimatedFarmRewards() {
  const amount = parseFloat(document.getElementById('farm-amount').value) || 0;
  const pool = document.getElementById('farm-pool').value;
  
  let apy = poolsData.farming[pool]?.apy || 0;
  
  const dailyRate = apy / 365;
  const rewards = amount * 1000 * (dailyRate / 100); // Simuler 1 LP = 1000 LFIST en valeur
  document.getElementById('estimated-farm-rewards').textContent = rewards.toFixed(2);
}

/**
 * Simule une opération de staking
 */
function simulateStaking() {
  if (!userWallet) {
    showNotification('Veuillez connecter votre wallet', 'error');
    return;
  }
  
  const amount = parseFloat(document.getElementById('stake-amount').value) || 0;
  const pool = document.getElementById('stake-pool').value;
  
  // Vérifier si le pool existe
  if (!poolsData.staking[pool]) {
    showNotification('Pool de staking invalide', 'error');
    return;
  }
  
  const poolData = poolsData.staking[pool];
  const token = poolData.token;
  
  // Vérifier le montant minimum
  const minStake = poolData.minStake;
  if (amount < minStake) {
    showNotification(`Le montant minimum est de ${minStake} ${token}`, 'error');
    return;
  }
  
  // Vérifier la balance
  if (amount > userWallet.balance[token]) {
    showNotification(`Balance ${token} insuffisante`, 'error');
    return;
  }
  
  // Simuler le staking
  userWallet.balance[token] -= amount;
  
  // Mettre à jour ou créer le stake
  if (userStakes[pool]) {
    userStakes[pool].amount += amount;
  } else {
    userStakes[pool] = {
      amount: amount,
      token: token,
      startTime: Date.now(),
      rewards: 0
    };
  }
  
  // Mettre à jour les données de la pool
  poolsData.staking[pool].totalStaked += amount;
  
  // Mettre à jour l'interface
  updateUserData();
  updatePoolsData();
  
  // Notification de succès
  showNotification(`${amount.toFixed(token === 'BNB' || token === 'BTCB' ? 4 : 0)} ${token} stakés avec succès dans la ${poolData.name}`, 'success');
  
  // Cacher le modal
  hideModals();
}

/**
 * Réclame les récompenses de staking
 * @param {string} poolId - L'identifiant du pool
 */
function claimStakeRewards(poolId) {
  if (!userWallet || !userStakes[poolId]) {
    showNotification('Aucune position de staking trouvée', 'error');
    return;
  }
  
  const stake = userStakes[poolId];
  const token = stake.token;
  const rewards = stake.rewards;
  
  if (rewards <= 0) {
    showNotification('Aucune récompense à réclamer', 'info');
    return;
  }
  
  // Ajouter les récompenses à la balance
  userWallet.balance[token] += rewards;
  
  // Réinitialiser les récompenses
  stake.rewards = 0;
  
  // Mettre à jour l'interface
  updateUserData();
  
  // Notification de succès
  showNotification(`${rewards.toFixed(token === 'BNB' || token === 'BTCB' ? 4 : 2)} ${token} réclamés avec succès!`, 'success');
}

/**
 * Unstake des tokens
 * @param {string} poolId - L'identifiant du pool
 */
function unstake(poolId) {
  if (!userWallet || !userStakes[poolId]) {
    showNotification('Aucune position de staking trouvée', 'error');
    return;
  }
  
  const stake = userStakes[poolId];
  const pool = poolsData.staking[poolId];
  const token = stake.token;
  
  // Vérifier si le unstake est possible (période de blocage)
  if (pool.lockDuration > 0) {
    const lockEndTime = stake.startTime + (pool.lockDuration * 24 * 60 * 60 * 1000);
    if (Date.now() < lockEndTime) {
      const remainingDays = Math.ceil((lockEndTime - Date.now()) / (24 * 60 * 60 * 1000));
      showNotification(`Impossible de unstake avant la fin de la période de blocage. ${remainingDays} jours restants.`, 'error');
      return;
    }
  }
  
  // Récupérer le montant staké et les récompenses
  const amount = stake.amount;
  const rewards = stake.rewards;
  
  // Ajouter le montant staké et les récompenses à la balance
  userWallet.balance[token] += amount + rewards;
  
  // Mettre à jour les données de la pool
  poolsData.staking[poolId].totalStaked -= amount;
  
  // Supprimer le stake
  delete userStakes[poolId];
  
  // Mettre à jour l'interface
  updateUserData();
  updatePoolsData();
  
  // Notification de succès
  showNotification(`${amount.toFixed(token === 'BNB' || token === 'BTCB' ? 4 : 0)} ${token} unstakés avec succès! Vous avez également reçu ${rewards.toFixed(token === 'BNB' || token === 'BTCB' ? 4 : 2)} ${token} de récompenses.`, 'success');
}

/**
 * Simule une opération de farming
 */
function simulateFarming() {
  if (!userWallet) {
    showNotification('Veuillez connecter votre wallet', 'error');
    return;
  }
  
  const amount = parseFloat(document.getElementById('farm-amount').value) || 0;
  const pool = document.getElementById('farm-pool').value;
  
  // Vérifier si le pool existe
  if (!poolsData.farming[pool]) {
    showNotification('Pool de farming invalide', 'error');
    return;
  }
  
  const poolData = poolsData.farming[pool];
  const lpToken = `${pool}-lp`;
  
  // Vérifier le montant
  if (amount <= 0) {
    showNotification('Veuillez entrer un montant valide', 'error');
    return;
  }
  
  // Vérifier la balance
  const lpBalance = userWallet.balance[lpToken] || 0;
  if (amount > lpBalance) {
    showNotification(`Balance ${poolData.name} insuffisante`, 'error');
    return;
  }
  
  // Simuler le farming
  userWallet.balance[lpToken] -= amount;
  
  // Mettre à jour ou créer la farm
  if (userFarms[pool]) {
    userFarms[pool].amount += amount;
  } else {
    userFarms[pool] = {
      amount: amount,
      tokens: poolData.tokens,
      startTime: Date.now(),
      rewards: 0
    };
  }
  
  // Mettre à jour les données de la pool (convertir LP en USD pour la simulation)
  // Valeurs estimées pour les paires stables
  let usdValue = 0;
  if (pool === 'bnb-busd') {
    usdValue = amount * 300; // 1 LP BNB-BUSD vaut environ 300$
  } else if (pool === 'btcb-busd') {
    usdValue = amount * 1000; // 1 LP BTCB-BUSD vaut environ 1000$
  } else if (pool === 'busd-usdt') {
    usdValue = amount * 200; // 1 LP BUSD-USDT vaut environ 200$
  } else {
    usdValue = amount * 100; // Valeur par défaut
  }
  
  poolsData.farming[pool].totalLocked += usdValue;
  
  // Mettre à jour l'interface
  updateUserData();
  updatePoolsData();
  
  // Notification de succès
  showNotification(`${amount.toLocaleString()} LP stakés avec succès dans la pool ${pool}`, 'success');
  
  // Cacher le modal
  hideModals();
}

/**
 * Réclame les récompenses de farming
 */
function claimFarmRewards(poolId) {
  if (!userWallet || !userFarms[poolId]) {
    showNotification('Aucune position de farming trouvée', 'error');
    return;
  }
  
  const farm = userFarms[poolId];
  const pool = poolsData.farming[poolId];
  const rewardToken = pool.rewardToken;
  const rewards = farm.rewards;
  
  if (rewards <= 0) {
    showNotification('Aucune récompense à réclamer', 'info');
    return;
  }
  
  // Ajouter les récompenses à la balance
  userWallet.balance[rewardToken] = (userWallet.balance[rewardToken] || 0) + rewards;
  
  // Réinitialiser les récompenses
  farm.rewards = 0;
  
  // Mettre à jour l'interface
  updateUserData();
  
  // Notification de succès
  showNotification(`${rewards.toFixed(4)} ${rewardToken} réclamés avec succès!`, 'success');
}

/**
 * Unstake des LP de farming
 */
function unstakeFarm(poolId) {
  if (!userWallet || !userFarms[poolId]) {
    showNotification('Aucune position de farming trouvée', 'error');
    return;
  }
  
  const farm = userFarms[poolId];
  const pool = poolsData.farming[poolId];
  const lpToken = `${poolId}-lp`;
  const rewardToken = pool.rewardToken;
  
  // Récupérer le montant staké et les récompenses
  const amount = farm.amount;
  const rewards = farm.rewards;
  
  // Ajouter le montant staké à la balance LP
  userWallet.balance[lpToken] = (userWallet.balance[lpToken] || 0) + amount;
  
  // Ajouter les récompenses à la balance du token de récompense
  userWallet.balance[rewardToken] = (userWallet.balance[rewardToken] || 0) + rewards;
  
  // Mettre à jour les données de la pool
  // Valeurs estimées pour les paires stables
  let usdValue = 0;
  if (poolId === 'bnb-busd') {
    usdValue = amount * 300; // 1 LP BNB-BUSD vaut environ 300$
  } else if (poolId === 'btcb-busd') {
    usdValue = amount * 1000; // 1 LP BTCB-BUSD vaut environ 1000$
  } else if (poolId === 'busd-usdt') {
    usdValue = amount * 200; // 1 LP BUSD-USDT vaut environ 200$
  } else {
    usdValue = amount * 100; // Valeur par défaut
  }
  
  poolsData.farming[poolId].totalLocked -= usdValue;
  
  // Supprimer la farm
  delete userFarms[poolId];
  
  // Mettre à jour l'interface
  updateUserData();
  updatePoolsData();
  
  // Notification de succès
  showNotification(`${amount.toFixed(4)} ${pool.name} unstakés avec succès! Vous avez également reçu ${rewards.toFixed(4)} ${rewardToken} de récompenses.`, 'success');
}

/**
 * Met à jour un élément du DOM avec une valeur
 */
function updateElement(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value;
  }
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

/**
 * Met à jour les données en temps réel
 */
function updateRealTimeData() {
  // Simuler l'accumulation de récompenses
  if (userWallet) {
    // Mettre à jour les récompenses de staking
    Object.keys(userStakes).forEach(poolId => {
      const stake = userStakes[poolId];
      const pool = poolsData.staking[poolId];
      if (!pool) return; // Ignorer si le pool n'existe pas
      
      const apy = pool.apy || 0;
      const dailyRate = apy / 365;
      
      // Simuler l'accumulation de récompenses (10 secondes = 1/8640 de jour)
      const newRewards = stake.amount * dailyRate / 8640;
      stake.rewards += newRewards;
    });
    
    // Mettre à jour les récompenses de farming
    Object.keys(userFarms).forEach(poolId => {
      const farm = userFarms[poolId];
      const pool = poolsData.farming[poolId];
      if (!pool) return; // Ignorer si le pool n'existe pas
      
      const apy = pool.apy || 0;
      const dailyRate = apy / 365;
      const rewardToken = pool.rewardToken;
      
      // Simuler l'accumulation de récompenses (10 secondes = 1/8640 de jour)
      let newRewards = 0;
      
      // Calculer les récompenses en fonction du token
      if (rewardToken === 'BNB') {
        newRewards = farm.amount * 0.01 * dailyRate / 8640; // Valeur approximative en BNB
      } else if (rewardToken === 'BTCB') {
        newRewards = farm.amount * 0.0001 * dailyRate / 8640; // Valeur approximative en BTCB
      } else if (rewardToken === 'BUSD' || rewardToken === 'USDT') {
        newRewards = farm.amount * 10 * dailyRate / 8640; // Valeur approximative en stablecoins
      } else {
        newRewards = farm.amount * dailyRate / 8640; // Valeur par défaut
      }
      
      farm.rewards += newRewards;
    });
    
    // Mettre à jour l'interface utilisateur
    updateUserData();
  }
  
  // Ajouter une petite variation aléatoire aux données des pools pour simuler l'activité en temps réel
  Object.keys(poolsData.staking).forEach(poolId => {
    const variation = (Math.random() - 0.3) * 0.005; // -0.15% à +0.35%
    poolsData.staking[poolId].totalStaked *= (1 + variation);
    
    // Petite variation de l'APY pour simuler les changements de marché
    const apyVariation = (Math.random() - 0.5) * 0.002; // -0.1% à +0.1%
    poolsData.staking[poolId].apy *= (1 + apyVariation);
    poolsData.staking[poolId].apy = Math.max(0.1, Math.min(50, poolsData.staking[poolId].apy)); // Limiter entre 0.1% et 50%
  });
  
  Object.keys(poolsData.farming).forEach(poolId => {
    const variation = (Math.random() - 0.3) * 0.005; // -0.15% à +0.35%
    poolsData.farming[poolId].totalLocked *= (1 + variation);
    
    // Petite variation de l'APY pour simuler les changements de marché
    const apyVariation = (Math.random() - 0.5) * 0.003; // -0.15% à +0.15%
    poolsData.farming[poolId].apy *= (1 + apyVariation);
    poolsData.farming[poolId].apy = Math.max(0.5, Math.min(30, poolsData.farming[poolId].apy)); // Limiter entre 0.5% et 30%
  });
  
  // Mettre à jour les statistiques globales
  updateGlobalStats();
  
  // Mettre à jour les données des pools
  updatePoolsData();
  
  // Mettre à jour les prix des tokens (simulation)
  updateTokenPrices();
}

/**
 * Met à jour les prix des tokens (simulation)
 */
function updateTokenPrices() {
  // Simuler des variations de prix pour les tokens
  const tokenPrices = {
    BNB: 400 + Math.random() * 20 - 10, // ~$400 ±$10
    BTCB: 60000 + Math.random() * 1000 - 500, // ~$60,000 ±$500
    ETH: 3000 + Math.random() * 100 - 50, // ~$3,000 ±$50
    BUSD: 1.0 + Math.random() * 0.002 - 0.001, // ~$1.00 ±$0.001
    USDT: 1.0 + Math.random() * 0.002 - 0.001 // ~$1.00 ±$0.001
  };
  
  // Mettre à jour les prix dans l'interface
  Object.keys(tokenPrices).forEach(token => {
    updateElement(`${token.toLowerCase()}-price`, `$${tokenPrices[token].toFixed(token === 'BUSD' || token === 'USDT' ? 3 : 2)}`);
    
    // Simuler une variation de prix sur 24h
    const priceChange = (Math.random() * 10 - 5).toFixed(2); // -5% à +5%
    const changeClass = parseFloat(priceChange) >= 0 ? 'positive' : 'negative';
    const changeElement = document.getElementById(`${token.toLowerCase()}-change`);
    
    if (changeElement) {
      changeElement.textContent = `${priceChange}%`;
      changeElement.className = `price-change ${changeClass}`;
    }
  });
}

// Mettre à jour les données toutes les 10 secondes pour une expérience en temps réel
setInterval(updateRealTimeData, 10000);

// Mise à jour initiale
updateRealTimeData();