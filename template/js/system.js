// Mobil Tech — Shared utilities (light theme only)
(function() {

  function initMobileNav() {
    const toggles = document.querySelectorAll('[data-sidebar-toggle]');
    const sidebar = document.querySelector('.sidebar');
    toggles.forEach(t => t.addEventListener('click', () => {
      sidebar && sidebar.classList.toggle('open');
    }));
    document.addEventListener('click', (e) => {
      if (sidebar && sidebar.classList.contains('open') && !sidebar.contains(e.target) && !e.target.closest('[data-sidebar-toggle]')) {
        sidebar.classList.remove('open');
      }
    });
  }

  // Price formatter
  window.formatPrice = function(n) {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(n);
  };

  // Init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileNav);
  } else {
    initMobileNav();
  }

})();
