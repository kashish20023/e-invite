/**
 * Interactive & Procedural Sky Cloud Background Animation
 * Realistic drifting clouds over a sky gradient (matching reference image)
 * Zero checkerboards, 100% smooth transparent volumetric cloud rendering.
 */

(function () {
  'use strict';

  let canvas, ctx;
  let width, height;
  let clouds = [];
  let cloudCanvases = [];
  let animFrameId = null;

  const CLOUD_IMAGE_SOURCES = [
    'images/cloud1.png',
    'images/cloud2.png',
    'images/cloud3.png'
  ];

  // Initialize Canvas
  function initCanvas() {
    canvas = document.getElementById('sky-clouds-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'sky-clouds-canvas';
      document.body.prepend(canvas);
    }

    ctx = canvas.getContext('2d');

    // Canvas Fixed Background Styling
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.zIndex = '-1';
    canvas.style.pointerEvents = 'none';

    handleResize();
    window.addEventListener('resize', handleResize);
  }

  function handleResize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Re-initialize clouds if dimensions change significantly
    if (clouds.length === 0) {
      initClouds();
    }
  }

  // Pre-process black-background cloud images into 100% transparent RGBA canvases
  function processCloudImage(img) {
    const offscreen = document.createElement('canvas');
    const w = img.naturalWidth || img.width || 512;
    const h = img.naturalHeight || img.height || 512;
    offscreen.width = w;
    offscreen.height = h;

    const oCtx = offscreen.getContext('2d');
    oCtx.drawImage(img, 0, 0);

    const imgData = oCtx.getImageData(0, 0, w, h);
    const data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Calculate brightness/luminance of pixel
      const luma = 0.299 * r + 0.587 * g + 0.114 * b;

      // Extract alpha: pure black becomes 0 alpha, bright white cloud becomes full opacity
      // Smooth curve threshold to eliminate any background dark halo
      let alpha = 0;
      if (luma > 15) {
        alpha = Math.min(255, (luma - 15) * 1.25);
      }

      data[i + 3] = alpha;

      // Soft white cloud tinting (slightly warm top highlights)
      if (alpha > 0) {
        const factor = alpha / 255;
        data[i] = Math.min(255, 235 + (r - 200) * 0.5);
        data[i + 1] = Math.min(255, 242 + (g - 200) * 0.5);
        data[i + 2] = Math.min(255, 255);
      }
    }

    oCtx.putImageData(imgData, 0, 0);
    return offscreen;
  }

  // Create fallback procedural cloud canvas if images are loading
  function createProceduralCloudCanvas() {
    const offscreen = document.createElement('canvas');
    offscreen.width = 400;
    offscreen.height = 240;
    const oCtx = offscreen.getContext('2d');

    // Draw multi-puff fluffy cumulus cloud shape
    const puffs = [
      { x: 120, y: 130, r: 65 },
      { x: 170, y: 100, r: 85 },
      { x: 230, y: 95, r: 75 },
      { x: 280, y: 125, r: 60 },
      { x: 200, y: 140, r: 70 },
      { x: 150, y: 140, r: 50 }
    ];

    puffs.forEach(p => {
      const grad = oCtx.createRadialGradient(p.x, p.y, p.r * 0.2, p.x, p.y, p.r);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      grad.addColorStop(0.6, 'rgba(240, 246, 255, 0.7)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      oCtx.fillStyle = grad;
      oCtx.beginPath();
      oCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      oCtx.fill();
    });

    return offscreen;
  }

  // Load cloud assets
  function loadCloudTextures() {
    // Add procedural fallback first so clouds appear instantly
    cloudCanvases.push(createProceduralCloudCanvas());

    let loadedCount = 0;
    CLOUD_IMAGE_SOURCES.forEach(src => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = src;
      img.onload = function () {
        const transparentCanvas = processCloudImage(img);
        cloudCanvases.push(transparentCanvas);
        loadedCount++;
      };
      img.onerror = function () {
        console.warn('Could not load cloud asset:', src);
      };
    });
  }

  // Initialize Cloud Objects
  function initClouds() {
    clouds = [];
    // Include extra large dramatic clouds + ambient clouds
    const count = Math.max(16, Math.floor(width / 70));

    for (let i = 0; i < count; i++) {
      clouds.push(generateCloud(true));
    }
  }

  function generateCloud(isInitial = false) {
    const layer = Math.random(); // 0 (far background) to 1 (large foreground)
    // Make clouds much bigger: width ranges from 600px to 1400px!
    const baseWidth = Math.max(width * 0.75, 750);

    const cloudW = baseWidth * (0.7 + layer * 0.85); // 70% to 155% of baseWidth!
    const cloudH = cloudW * (0.55 + Math.random() * 0.15);

    return {
      x: isInitial ? (Math.random() * (width + cloudW) - cloudW * 0.5) : (width + Math.random() * 200),
      y: Math.random() * (height * 0.85) - cloudH * 0.25,
      width: cloudW,
      height: cloudH,
      speed: 0.12 + layer * 0.35, // Smooth drift speed
      opacity: 0.5 + layer * 0.45,
      layer: layer,
      textureIndex: Math.floor(Math.random() * 3), // select cloud variant
      floatOffset: Math.random() * Math.PI * 2,
      floatSpeed: 0.0006 + Math.random() * 0.0008
    };
  }

  // Render Sky Gradient (matching real sky image: rich deep sky blue to light horizon blue)
  function renderSky() {
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
    skyGrad.addColorStop(0, '#1064b8');    // Deep zenith blue
    skyGrad.addColorStop(0.35, '#228be6'); // Vivid sky blue
    skyGrad.addColorStop(0.70, '#4dabf7'); // Soft bright azure
    skyGrad.addColorStop(1.0, '#91d5ff');  // Gentle horizon haze

    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    // Subtle sun glow accent in top-right sky
    const sunGrad = ctx.createRadialGradient(width * 0.85, height * 0.15, 20, width * 0.85, height * 0.15, height * 0.6);
    sunGrad.addColorStop(0, 'rgba(255, 253, 240, 0.35)');
    sunGrad.addColorStop(0.4, 'rgba(255, 245, 220, 0.12)');
    sunGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = sunGrad;
    ctx.fillRect(0, 0, width, height);
  }

  // Main Render & Animation Loop
  function animate(timestamp) {
    ctx.clearRect(0, 0, width, height);

    // 1. Render Sky Background
    renderSky();

    // Sort clouds by layer for depth rendering (far background to foreground)
    clouds.sort((a, b) => a.layer - b.layer);

    // 2. Render & Update Drifting Clouds
    clouds.forEach(cloud => {
      // Horizontal drift (right to left)
      cloud.x -= cloud.speed;

      // Vertical subtle floating motion
      cloud.floatOffset += cloud.floatSpeed;
      const currentY = cloud.y + Math.sin(cloud.floatOffset) * 12;

      // Wrap around screen when off the left edge
      if (cloud.x < -cloud.width - 100) {
        cloud.x = width + Math.random() * 200;
        cloud.y = Math.random() * (height * 0.75) - 50;
        cloud.opacity = 0.35 + cloud.layer * 0.55;
      }

      // Draw Cloud Texture / Canvas
      ctx.save();
      ctx.globalAlpha = cloud.opacity;

      // Pick available texture or fallback
      let cloudCanvas = cloudCanvases[cloud.textureIndex % cloudCanvases.length] || cloudCanvases[0];

      if (cloudCanvas) {
        ctx.drawImage(cloudCanvas, cloud.x, currentY, cloud.width, cloud.height);
      }

      ctx.restore();
    });

    animFrameId = requestAnimationFrame(animate);
  }

  // Start Animation System
  function init() {
    initCanvas();
    loadCloudTextures();
    if (!animFrameId) {
      animFrameId = requestAnimationFrame(animate);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
