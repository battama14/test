/**
 * LFIST DeFi - Améliorations UI
 * Script pour améliorer l'expérience utilisateur et éviter les tremblements
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialiser les améliorations UI
  initUIEnhancements();
});

/**
 * Initialise les améliorations UI
 */
function initUIEnhancements() {
  // Précharger les images des tokens pour éviter les tremblements
  preloadTokenImages();
  
  // Ajouter des classes pour les animations fluides
  addSmoothAnimations();
  
  // Initialiser les tooltips
  initTooltips();
}

/**
 * Précharge les images des tokens pour éviter les tremblements
 */
function preloadTokenImages() {
  const tokenImages = [
    'images/tokens/lfist-logo.png',
    'images/tokens/bnb-logo.png',
    'images/tokens/busd-logo.png',
    'images/tokens/usdt-logo.png',
    'images/tokens/btcb-logo.png'
  ];
  
  tokenImages.forEach(src => {
    const img = new Image();
    img.src = src;
  });
}

/**
 * Ajoute des classes pour les animations fluides
 */
function addSmoothAnimations() {
  // Ajouter des classes aux sections pour les animations fluides
  document.querySelectorAll('.section-container').forEach(section => {
    section.classList.add('smooth-transition');
  });
  
  // Ajouter des classes aux cartes de pool pour les animations fluides
  document.querySelectorAll('.pool-card').forEach(card => {
    card.classList.add('smooth-transition');
  });
}

/**
 * Initialise les tooltips
 */
function initTooltips() {
  // Ajouter des tooltips aux éléments qui en ont besoin
  document.querySelectorAll('[data-tooltip]').forEach(element => {
    element.addEventListener('mouseenter', showTooltip);
    element.addEventListener('mouseleave', hideTooltip);
  });
}

/**
 * Affiche un tooltip
 */
function showTooltip(event) {
  const tooltipText = event.target.getAttribute('data-tooltip');
  
  if (!tooltipText) return;
  
  const tooltip = document.createElement('div');
  tooltip.className = 'tooltip';
  tooltip.textContent = tooltipText;
  
  document.body.appendChild(tooltip);
  
  const rect = event.target.getBoundingClientRect();
  tooltip.style.top = `${rect.bottom + window.scrollY + 10}px`;
  tooltip.style.left = `${rect.left + window.scrollX + (rect.width / 2) - (tooltip.offsetWidth / 2)}px`;
  
  setTimeout(() => {
    tooltip.classList.add('show');
  }, 10);
}

/**
 * Cache un tooltip
 */
function hideTooltip() {
  const tooltips = document.querySelectorAll('.tooltip');
  tooltips.forEach(tooltip => {
    tooltip.classList.remove('show');
    setTimeout(() => {
      tooltip.remove();
    }, 300);
  });
}