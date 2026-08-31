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

    // Ticket‑cut animation using GSAP
    var mask = document.getElementById('ticket-mask');
    if (mask) {
      var tl = gsap.timeline({ onComplete: function () { mask.parentNode.removeChild(mask); } });
      // Start with mask fully covering the ticket, then slide it away with a slight rotation
      tl.fromTo(mask, { clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' }, { duration: 1, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', ease: 'power2.out' })
        .fromTo(mask, { rotation: -5, x: -20 }, { rotation: 0, x: 0, duration: 0.4, ease: 'back.out(1.7)' }, '-=0.3');
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
