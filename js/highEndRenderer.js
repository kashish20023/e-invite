(function() {
  // Ensure DOM is ready
  function init() {
    // Render the ticket using the generic renderer
    if (typeof renderTicket === 'function') {
      renderTicket('#ticket-mount', invitationData);
    } else {
      console.error('renderTicket function not found');
      return;
    }

    // Remove ticket-mask if present without animation
    var mask = document.getElementById('ticket-mask');
    if (mask && mask.parentNode) {
      mask.parentNode.removeChild(mask);
    }

    // Pulse the highlighted date circle
    gsap.to('.highlight-circle', { scale: 1.3, repeat: -1, yoyo: true, duration: 0.8, ease: 'sine.inOut' });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
