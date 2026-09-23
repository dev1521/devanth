/**
 * DEVANTH — Cinematic Logo Ident
 * Authentic Netflix 2019-Style Ident Choreography
 * 
 * ACT 1: Single dimensional red ribbon "D" on pure black
 * ACT 2: Cinematic camera push-in accelerating into the D's vertical spine
 * ACT 3: Physical ribbon splits into thousands of fine vertical light strands
 * ACT 4: Camera 3D fly-through the chromatic ribbon spectrum
 * ACT 5: Resolution into clean, sharp, premium wordmark DEVANTH
 * 
 * Hardware-Accelerated 3D Canvas Projection · Original Web Audio Score
 */

(function () {
  'use strict';

  // DOM Elements
  const container = document.getElementById('container');
  const canvas = document.getElementById('identCanvas');
  const replayBtn = document.getElementById('replayBtn');
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const soundIcon = document.getElementById('soundIcon');
  const soundLabel = document.getElementById('soundLabel');

  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: false });

  // Canvas Dimensions
  let width = 0;
  let height = 0;
  let dpr = 1;

  function resizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.scale(dpr, dpr);
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // =========================================================================
  // 1. ORIGINAL PROCEDURAL CINEMATIC AUDIO ENGINE (Web Audio API)
  // =========================================================================
  class IdentAudioEngine {
    constructor() {
      this.ctx = null;
      this.masterGain = null;
      this.isEnabled = localStorage.getItem('devanth_sound_enabled') !== 'false';
      this.activeNodes = [];
      this.timeouts = [];
    }

    initContext() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        this.ctx = new AudioContext();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isEnabled ? 0.9 : 0.0, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    setSoundEnabled(enabled) {
      this.isEnabled = enabled;
      localStorage.setItem('devanth_sound_enabled', enabled ? 'true' : 'false');
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setTargetAtTime(enabled ? 0.9 : 0.0, this.ctx.currentTime, 0.05);
      }
      this.updateUI();
    }

    toggleSound() {
      this.initContext();
      this.setSoundEnabled(!this.isEnabled);
    }

    updateUI() {
      if (!soundIcon || !soundLabel) return;
      if (this.isEnabled) {
        soundLabel.textContent = 'SOUND: ON';
        soundIcon.innerHTML = `
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        `;
        soundToggleBtn.classList.remove('is-muted');
      } else {
        soundLabel.textContent = 'SOUND: OFF';
        soundIcon.innerHTML = `
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <line x1="23" y1="9" x2="17" y2="15"></line>
          <line x1="17" y1="9" x2="23" y2="15"></line>
        `;
        soundToggleBtn.classList.add('is-muted');
      }
    }

    stopAll() {
      this.timeouts.forEach(t => clearTimeout(t));
      this.timeouts = [];
      this.activeNodes.forEach(node => {
        try {
          if (node.stop) node.stop();
          node.disconnect();
        } catch (e) {}
      });
      this.activeNodes = [];
    }

    playIntroSequence() {
      this.initContext();
      this.stopAll();
      if (!this.ctx || !this.isEnabled) return;
      const t0 = this.ctx.currentTime;

      // 1. Act 1 (0.1s - 0.9s): Subtle deep tonal buildup as D appears
      this.scheduleTonalBuildup(t0 + 0.1, 0.85);

      // 2. Act 2 (0.8s - 1.6s): Rising whoosh & suction as camera accelerates into D
      this.scheduleRisingWhoosh(t0 + 0.8, 0.8);

      // 3. Act 3 (1.5s - 2.2s): Resonant dispersion strike as D explodes into strands
      this.scheduleDispersionStrike(t0 + 1.5, 0.7);

      // 4. Act 4 (2.1s - 3.3s): Fast airy cinematic ribbon flight rushing past camera
      this.scheduleAiryFlight(t0 + 2.05, 1.25);

      // 5. Act 5 (3.6s): Clean low-end resolving impact as DEVANTH emerges
      this.scheduleResolvingImpact(t0 + 3.65);
    }

    scheduleTonalBuildup(startTime, duration) {
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(46, startTime);
      osc.frequency.exponentialRampToValueAtTime(58, startTime + duration);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(100, startTime);
      filter.frequency.exponentialRampToValueAtTime(180, startTime + duration);

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(0.38, startTime + duration * 0.7);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(startTime);
      osc.stop(startTime + duration);
      this.activeNodes.push(osc, gain);
    }

    scheduleRisingWhoosh(startTime, duration) {
      const bufferSize = Math.floor(this.ctx.sampleRate * duration);
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.setValueAtTime(4.0, startTime);
      filter.frequency.setValueAtTime(120, startTime);
      filter.frequency.exponentialRampToValueAtTime(1800, startTime + duration);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.42, startTime + duration * 0.85);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      noise.start(startTime);
      noise.stop(startTime + duration);
      this.activeNodes.push(noise, gain);
    }

    scheduleDispersionStrike(startTime, duration) {
      const freqs = [146.83, 220.00, 329.63]; // D3, A3, E4
      freqs.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.05, startTime + duration);

        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.linearRampToValueAtTime(0.22 / (idx + 1), startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(startTime);
        osc.stop(startTime + duration);
        this.activeNodes.push(osc, gain);
      });
    }

    scheduleAiryFlight(startTime, duration) {
      const bufferSize = Math.floor(this.ctx.sampleRate * duration);
      const noiseBuffer = this.ctx.createBuffer(2, bufferSize, this.ctx.sampleRate);
      for (let ch = 0; ch < 2; ch++) {
        const data = noiseBuffer.getChannelData(ch);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1200, startTime);
      filter.frequency.exponentialRampToValueAtTime(450, startTime + duration);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(0.35, startTime + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      noise.start(startTime);
      noise.stop(startTime + duration);
      this.activeNodes.push(noise, gain);
    }

    scheduleResolvingImpact(startTime) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(82, startTime);
      osc.frequency.exponentialRampToValueAtTime(36, startTime + 0.55);

      gain.gain.setValueAtTime(0.65, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.65);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(startTime);
      osc.stop(startTime + 0.65);
      this.activeNodes.push(osc, gain);
    }
  }

  const audioEngine = new IdentAudioEngine();
  audioEngine.updateUI();

  // =========================================================================
  // 2. 3D RIBBON STRAND GENERATOR & CHOREOGRAPHY
  // =========================================================================

  // Netflix Prismatic Color Palette for Strands
  const SPECTRUM_COLORS = [
    { r: 229, g: 9,   b: 20  }, // Crimson Ruby (Netflix Signature Red)
    { r: 247, g: 50,  b: 28  }, // Bright Scarlet
    { r: 255, g: 95,  b: 20  }, // Vermilion Orange
    { r: 255, g: 154, b: 0   }, // Amber Gold
    { r: 255, g: 210, b: 20  }, // Warm Yellow
    { r: 30,  g: 220, b: 160 }, // Emerald Cyan
    { r: 0,   g: 185, b: 245 }, // Electric Blue / Cyan
    { r: 26,  g: 95,  b: 245 }, // Royal Cobalt Blue
    { r: 124, g: 58,  b: 237 }, // Deep Violet
    { r: 217, g: 45,  b: 195 }, // Radiant Magenta
    { r: 255, g: 30,  b: 110 }, // Hot Pink
    { r: 229, g: 9,   b: 20  }  // Return to Red
  ];

  function getSpectrumColor(ratio) {
    const clamped = Math.max(0, Math.min(1, ratio));
    const scaled = clamped * (SPECTRUM_COLORS.length - 1);
    const idx = Math.floor(scaled);
    const frac = scaled - idx;
    const c1 = SPECTRUM_COLORS[idx];
    const c2 = SPECTRUM_COLORS[Math.min(idx + 1, SPECTRUM_COLORS.length - 1)];

    return {
      r: Math.round(c1.r + (c2.r - c1.r) * frac),
      g: Math.round(c1.g + (c2.g - c1.g) * frac),
      b: Math.round(c1.b + (c2.b - c1.b) * frac)
    };
  }

  // Strand population in 3D volume
  const STRAND_COUNT = 1100;
  let strands = [];

  function initStrands() {
    strands = [];
    for (let i = 0; i < STRAND_COUNT; i++) {
      // Lateral distribution: dense ribbon corridor spanning from center outward
      const lateralSign = Math.random() < 0.5 ? -1 : 1;
      const lateralDist = Math.pow(Math.random(), 1.6) * 550 * lateralSign;

      // Z depth distribution: deep tunnel corridor along the camera trajectory
      const z = Math.random() * 3200 + 100;

      // Strand height extent in 3D space
      const strandHeight = 900 + Math.random() * 800;
      const yOffset = (Math.random() - 0.5) * 120;

      // Ribbon width: high frequency of hairline strands (70%), medium ribbons (25%), broad accents (5%)
      const typeRand = Math.random();
      let baseWidth = 0.8;
      if (typeRand > 0.95) {
        baseWidth = 3.6 + Math.random() * 2.4;
      } else if (typeRand > 0.70) {
        baseWidth = 1.8 + Math.random() * 1.4;
      } else {
        baseWidth = 0.5 + Math.random() * 0.8;
      }

      // Chromatic index mapped across lateral spread & depth
      const normLateral = (lateralDist + 550) / 1100;
      const spectrumRatio = Math.max(0, Math.min(1, normLateral + (Math.random() - 0.5) * 0.18));

      // Speed jitter for parallax variation
      const speedMult = 0.92 + Math.random() * 0.22;
      const opacity = 0.45 + Math.random() * 0.55;

      strands.push({
        x: lateralDist,
        y1: -strandHeight / 2 + yOffset,
        y2: strandHeight / 2 + yOffset,
        z: z,
        baseZ: z,
        baseWidth: baseWidth,
        spectrumRatio: spectrumRatio,
        speedMult: speedMult,
        opacity: opacity,
        noiseSeed: Math.random() * 100
      });
    }
  }

  initStrands();

  // =========================================================================
  // 3. DIMENSIONAL RIBBON D DRAWING (ACT 1 & HERO MAPPING)
  // =========================================================================

  /**
   * Draw the authentic folded red ribbon "D"
   * Modeled after the physical ribbon aesthetic of the Netflix ident:
   * - Left vertical spine: thick crimson ribbon with darker shaded return edge
   * - Curved loop ribbon: elegant arc folding seamlessly at top and bottom
   * - Fold crease / cast shadow for genuine physical dimensionality
   */
  function drawRibbonD(context, cx, cy, dHeight, alpha, sheenProgress) {
    if (alpha <= 0.001) return;
    context.save();
    context.globalAlpha = Math.max(0, Math.min(1, alpha));

    // Base ribbon dimensions
    const h = dHeight;
    const w = h * 0.74; // Standard D aspect ratio
    const stemW = w * 0.30;
    const x0 = cx - w / 2;
    const y0 = cy - h / 2;

    // 1. VERTICAL STEM RIBBON (Left spine)
    // Dark return edge (left bevel)
    const bevelW = stemW * 0.16;
    const gradBevel = context.createLinearGradient(x0, y0, x0 + bevelW, y0);
    gradBevel.addColorStop(0, '#590005');
    gradBevel.addColorStop(1, '#85030b');
    context.fillStyle = gradBevel;
    context.fillRect(x0, y0, bevelW, h);

    // Main stem face: Rich ruby gradient
    const gradStem = context.createLinearGradient(x0 + bevelW, y0, x0 + stemW, y0 + h);
    gradStem.addColorStop(0, '#ff2632');
    gradStem.addColorStop(0.3, '#e50914');
    gradStem.addColorStop(0.85, '#99050e');
    gradStem.addColorStop(1, '#680006');
    context.fillStyle = gradStem;
    context.fillRect(x0 + bevelW, y0, stemW - bevelW, h);

    // 2. CURVED LOOP RIBBON
    // Path for the outer and inner loop of the D
    context.beginPath();
    // Outer boundary
    context.moveTo(x0 + stemW * 0.8, y0);
    context.lineTo(x0 + w * 0.52, y0);
    context.bezierCurveTo(x0 + w * 1.05, y0, x0 + w * 1.05, y0 + h, x0 + w * 0.52, y0 + h);
    context.lineTo(x0 + stemW * 0.8, y0 + h);
    // Inner cutout
    const innerTop = y0 + stemW * 0.85;
    const innerBottom = y0 + h - stemW * 0.85;
    const innerW = w - stemW * 1.45;
    context.lineTo(x0 + stemW, innerBottom);
    context.bezierCurveTo(x0 + stemW + innerW * 1.02, innerBottom, x0 + stemW + innerW * 1.02, innerTop, x0 + stemW, innerTop);
    context.closePath();

    // Curved loop gradient: Dynamic sweep from bright top specular to rich crimson base
    const gradLoop = context.createLinearGradient(x0 + stemW, y0, x0 + w, y0 + h);
    gradLoop.addColorStop(0, '#ff3540');
    gradLoop.addColorStop(0.35, '#e50914');
    gradLoop.addColorStop(0.7, '#c20611');
    gradLoop.addColorStop(1, '#780008');
    context.fillStyle = gradLoop;
    context.fill();

    // 3. PHYSICAL RIBBON FOLD SHADOWS (Top & Bottom Crease)
    // Authentic folded ribbon depth where the loop joins behind the spine
    const shadowTop = context.createLinearGradient(x0 + stemW * 0.6, y0, x0 + stemW * 1.35, y0 + stemW * 0.85);
    shadowTop.addColorStop(0, 'rgba(40, 0, 4, 0.75)');
    shadowTop.addColorStop(1, 'rgba(40, 0, 4, 0.0)');
    context.fillStyle = shadowTop;
    context.beginPath();
    context.moveTo(x0 + stemW * 0.7, y0);
    context.lineTo(x0 + stemW * 1.35, y0);
    context.lineTo(x0 + stemW, y0 + stemW * 0.9);
    context.closePath();
    context.fill();

    const shadowBottom = context.createLinearGradient(x0 + stemW * 0.6, y0 + h, x0 + stemW * 1.35, y0 + h - stemW * 0.85);
    shadowBottom.addColorStop(0, 'rgba(40, 0, 4, 0.75)');
    shadowBottom.addColorStop(1, 'rgba(40, 0, 4, 0.0)');
    context.fillStyle = shadowBottom;
    context.beginPath();
    context.moveTo(x0 + stemW * 0.7, y0 + h);
    context.lineTo(x0 + stemW * 1.35, y0 + h);
    context.lineTo(x0 + stemW, y0 + h - stemW * 0.9);
    context.closePath();
    context.fill();

    // 4. RESTRAINED SPECULAR HIGHLIGHT SHEEN (Physical ribbon gloss)
    if (sheenProgress >= 0 && sheenProgress <= 1.0) {
      context.save();
      context.clip(); // Clip to the D's outer loop & stem
      const sheenX = x0 - w * 0.3 + (w * 1.6) * sheenProgress;
      const gradSheen = context.createLinearGradient(sheenX - 25, y0, sheenX + 25, y0 + h);
      gradSheen.addColorStop(0, 'rgba(255, 255, 255, 0.0)');
      gradSheen.addColorStop(0.5, 'rgba(255, 255, 255, 0.38)');
      gradSheen.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
      context.fillStyle = gradSheen;
      context.fillRect(x0 - 50, y0 - 10, w + 100, h + 20);
      context.restore();
    }

    context.restore();
  }

  // =========================================================================
  // 4. FINAL WORDMARK "DEVANTH" DRAWING (ACT 5)
  // =========================================================================

  /**
   * Draw the final DEVANTH wordmark
   * Centered, clean, sharp, premium, minimal
   * Typography shares the exact ribbon identity and proportion as the opening D
   */
  function drawFinalWordmark(context, cx, cy, alpha, sheenProgress) {
    if (alpha <= 0.001) return;
    context.save();
    context.globalAlpha = Math.max(0, Math.min(1, alpha));

    // Dynamic scale based on viewport width
    const targetFontSize = Math.max(38, Math.min(width * 0.088, 86));
    const fontHeight = targetFontSize;
    const tracking = targetFontSize * 0.16;

    context.font = `900 ${targetFontSize}px 'Montserrat', sans-serif`;
    context.textBaseline = 'middle';
    context.textAlign = 'left';

    const word = 'DEVANTH';
    let totalWidth = 0;
    const charWidths = [];
    for (let i = 0; i < word.length; i++) {
      const cw = context.measureText(word[i]).width;
      charWidths.push(cw);
      totalWidth += cw + (i < word.length - 1 ? tracking : 0);
    }

    const startX = cx - totalWidth / 2;
    const startY = cy;

    // First letter "D" drawn as the hero ribbon mark to guarantee 100% typographic identity
    const dWidth = charWidths[0];
    const dHeight = fontHeight * 1.08;
    drawRibbonD(context, startX + dWidth / 2, startY, dHeight, alpha, sheenProgress);

    // Remaining letters "E V A N T H" rendered with identical dimensional ribbon shading
    let curX = startX + dWidth + tracking;
    for (let i = 1; i < word.length; i++) {
      const char = word[i];
      const cw = charWidths[i];

      // Dimensional bevel gradient fill
      const gradChar = context.createLinearGradient(curX, startY - fontHeight / 2, curX + cw * 0.4, startY + fontHeight / 2);
      gradChar.addColorStop(0, '#ff2d38');
      gradChar.addColorStop(0.35, '#e50914');
      gradChar.addColorStop(0.85, '#99050e');
      gradChar.addColorStop(1, '#660005');

      context.fillStyle = gradChar;
      context.fillText(char, curX, startY);

      curX += cw + tracking;
    }

    // Subtle single-pass specular highlight across wordmark
    if (sheenProgress >= 0 && sheenProgress <= 1.0) {
      context.save();
      const sheenX = startX - totalWidth * 0.2 + (totalWidth * 1.4) * sheenProgress;
      const gradSheen = context.createLinearGradient(sheenX - 40, startY - fontHeight, sheenX + 40, startY + fontHeight);
      gradSheen.addColorStop(0, 'rgba(255, 255, 255, 0.0)');
      gradSheen.addColorStop(0.5, 'rgba(255, 255, 255, 0.26)');
      gradSheen.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
      context.fillStyle = gradSheen;
      context.globalCompositeOperation = 'source-atop';
      context.fillRect(startX, startY - fontHeight, totalWidth, fontHeight * 2);
      context.restore();
    }

    context.restore();
  }

  // =========================================================================
  // 5. MASTER CHOREOGRAPHY & RENDER FRAME
  // =========================================================================

  function renderFrame(elapsed) {
    // Clear canvas with pitch-black cinema atmosphere
    ctx.fillStyle = '#020203';
    ctx.fillRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;

    // -----------------------------------------------------------------------
    // TIMELINE PHASES:
    // 0.0 - 0.8s: ACT 1 — The Single Red Dimensional "D"
    // 0.8 - 1.5s: ACT 2 — Camera Push-In Accelerates into the D
    // 1.5 - 2.1s: ACT 3 — D splits into many fine vertical ribbon strands
    // 2.1 - 3.2s: ACT 4 — 3D Camera Flies Through the Ribbon Spectrum
    // 3.2 - 3.8s: ACT 5 — Motion Resolves
    // 3.8 - 4.5s: Final Wordmark DEVANTH appears
    // 4.5s+     : Final Logo Hold
    // -----------------------------------------------------------------------

    // --- ACT 1 & ACT 2: HERO D & CAMERA PUSH-IN ---
    if (elapsed < 2.05) {
      let dAlpha = 1.0;
      let dScale = 1.0;
      let targetX = cx;
      let targetY = cy;

      if (elapsed < 0.6) {
        // Act 1: Emergence from pure black
        const p = Math.max(0, elapsed / 0.6);
        dAlpha = p * p;
        dScale = 0.95 + 0.05 * Math.sin(p * Math.PI * 0.5);
      } else if (elapsed < 0.8) {
        // Act 1: Hero hold with subtle specular gleam
        dAlpha = 1.0;
        dScale = 1.0;
      } else {
        // Act 2: Cinematic Camera Push-In (Exponential Acceleration)
        const p = (elapsed - 0.8) / (1.5 - 0.8);
        const clampedP = Math.max(0, Math.min(1.0, p));
        // Exponential acceleration curve: starts slow, accelerates dramatically
        const accel = Math.pow(clampedP, 3.4);
        dScale = 1.0 + accel * 48.0;

        // Camera focal target: zooms directly into the vertical ribbon spine
        const heroHeight = Math.min(height * 0.38, 240);
        const heroStemX = -(heroHeight * 0.74 * 0.22);
        targetX = cx - heroStemX * (dScale - 1.0);
        targetY = cy;

        // Fade D as camera enters inside ribbon strands
        if (elapsed > 1.45) {
          const fadeP = (elapsed - 1.45) / (1.95 - 1.45);
          dAlpha = Math.max(0, 1.0 - Math.min(1.0, fadeP));
        }
      }

      const baseHeroHeight = Math.min(height * 0.38, 240);
      const currentHeight = baseHeroHeight * dScale;

      ctx.save();
      // Draw the dimensional hero D
      const sheenProg = (elapsed >= 0.35 && elapsed <= 0.85) ? (elapsed - 0.35) / 0.5 : -1;
      drawRibbonD(ctx, targetX, targetY, currentHeight, dAlpha, sheenProg);
      ctx.restore();
    }

    // --- ACT 3 & ACT 4: RIBBON STRANDS EXPLOSION & 3D FLY-THROUGH ---
    if (elapsed >= 1.45 && elapsed < 3.85) {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      // Forward Camera Z trajectory
      let camZ = 0;
      let ribbonEnergy = 1.0;
      let dispersionProgress = 0.0;

      if (elapsed < 2.1) {
        // Act 3: Ribbon breakdown and chromatic dispersion initiation
        const p = (elapsed - 1.45) / (2.1 - 1.45);
        camZ = Math.pow(p, 2.2) * 600;
        ribbonEnergy = Math.min(1.0, p * 1.5);
        // Strands start mostly red, then disperse into full spectrum
        dispersionProgress = Math.pow(p, 1.8);
      } else if (elapsed < 3.2) {
        // Act 4: High-speed camera flight through strands
        const p = (elapsed - 2.1) / (3.2 - 2.1);
        camZ = 600 + Math.pow(p, 1.5) * 2600;
        ribbonEnergy = 1.0;
        dispersionProgress = 1.0;
      } else {
        // Act 5 transition: Rapid resolution as camera emerges out the other side
        const p = (elapsed - 3.2) / (3.85 - 3.2);
        camZ = 3200 + p * 800;
        ribbonEnergy = Math.max(0, 1.0 - Math.pow(p, 1.4));
        dispersionProgress = 1.0;
      }

      const fov = 420; // 3D Camera Perspective Focal Length

      for (let i = 0; i < strands.length; i++) {
        const s = strands[i];
        const effectiveZ = s.z - camZ * s.speedMult;

        // Strands behind camera plane or too distant are skipped
        if (effectiveZ <= 15 || effectiveZ > 3400) continue;

        const projScale = fov / effectiveZ;
        const screenX = cx + s.x * projScale;

        // Skip if outside viewport width
        if (screenX < -60 || screenX > width + 60) continue;

        const screenYTop = cy + s.y1 * projScale;
        const screenYBottom = cy + s.y2 * projScale;
        const strandW = Math.max(0.6, s.baseWidth * projScale * 1.15);

        // Distance & entry/exit alpha fade
        let depthAlpha = 1.0;
        if (effectiveZ > 2400) {
          depthAlpha = (3400 - effectiveZ) / 1000;
        } else if (effectiveZ < 120) {
          // Smooth fade as strands pass right next to the camera
          depthAlpha = (effectiveZ - 15) / 105;
        }

        const finalAlpha = Math.max(0, Math.min(1.0, s.opacity * ribbonEnergy * depthAlpha));
        if (finalAlpha <= 0.01) continue;

        // Color computation: Transition from crimson D red to full prismatic spectrum
        let col;
        if (dispersionProgress < 0.99) {
          // Interpolate from ruby red (229, 9, 20) to spectrum color
          const specCol = getSpectrumColor(s.spectrumRatio);
          const r = Math.round(229 + (specCol.r - 229) * dispersionProgress);
          const g = Math.round(9 + (specCol.g - 9) * dispersionProgress);
          const b = Math.round(20 + (specCol.b - 20) * dispersionProgress);
          col = { r, g, b };
        } else {
          col = getSpectrumColor(s.spectrumRatio);
        }

        // Render vertical ribbon strand with smooth top/bottom light falloff
        const gradStrand = ctx.createLinearGradient(screenX, screenYTop, screenX, screenYBottom);
        gradStrand.addColorStop(0, `rgba(${col.r}, ${col.g}, ${col.b}, 0.0)`);
        gradStrand.addColorStop(0.18, `rgba(${col.r}, ${col.g}, ${col.b}, ${finalAlpha})`);
        gradStrand.addColorStop(0.5, `rgba(${Math.min(255, col.r + 30)}, ${Math.min(255, col.g + 30)}, ${Math.min(255, col.b + 30)}, ${finalAlpha})`);
        gradStrand.addColorStop(0.82, `rgba(${col.r}, ${col.g}, ${col.b}, ${finalAlpha})`);
        gradStrand.addColorStop(1, `rgba(${col.r}, ${col.g}, ${col.b}, 0.0)`);

        ctx.fillStyle = gradStrand;
        ctx.fillRect(screenX - strandW / 2, screenYTop, strandW, screenYBottom - screenYTop);

        // Motion blur streaks for nearby fast-moving strands
        if (effectiveZ < 450 && strandW > 1.2) {
          const streakW = strandW * 0.45;
          ctx.fillStyle = `rgba(${col.r}, ${col.g}, ${col.b}, ${finalAlpha * 0.35})`;
          ctx.fillRect(screenX - streakW / 2, screenYTop - 40, streakW, (screenYBottom - screenYTop) + 80);
        }
      }

      ctx.restore();
    }

    // --- ACT 5: TRANSITION & FINAL WORDMARK "DEVANTH" ---
    if (elapsed >= 3.4) {
      let wordmarkAlpha = 0.0;
      let sheenProg = -1;

      if (elapsed < 4.1) {
        // Clean resolve: Wordmark emerges sharp and solid from the black void
        const p = (elapsed - 3.4) / (4.1 - 3.4);
        wordmarkAlpha = Math.min(1.0, Math.pow(p, 1.4));
      } else {
        // Full hero presence
        wordmarkAlpha = 1.0;
        // Restrained single-pass specular highlight across wordmark (4.1s to 4.7s)
        sheenProg = (elapsed - 4.1) / 0.65;
      }

      drawFinalWordmark(ctx, cx, cy, wordmarkAlpha, sheenProg);
    }
  }

  // Expose renderAtTime for verification and inspection
  window.renderAtTime = function(elapsed) {
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }
    isRunning = false;
    renderFrame(elapsed);
  };

  // Expose canvas capture helper
  window.captureFrameAsDataUrl = function(elapsed) {
    renderFrame(elapsed);
    return canvas.toDataURL('image/png');
  };

  let startTime = null;
  let isRunning = false;
  let animFrameId = null;

  function runChoreography(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = (timestamp - startTime) / 1000;
    renderFrame(elapsed);

    if (isRunning) {
      animFrameId = requestAnimationFrame(runChoreography);
    }
  }

  function startIdent() {
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }
    initStrands();
    startTime = null;
    isRunning = true;
    audioEngine.playIntroSequence();
    animFrameId = requestAnimationFrame(runChoreography);
  }

  // Check for automated capture test query (?capture=true)
  if (window.location.search.includes('capture=true')) {
    setTimeout(async () => {
      const times = [
        { t: 0.55, file: 'act1_hero_d.png' },
        { t: 1.35, file: 'act2_camera_push.png' },
        { t: 2.50, file: 'act3_4_ribbon_spectrum.png' },
        { t: 4.25, file: 'act5_final_devanth.png' }
      ];

      for (const item of times) {
        initStrands();
        renderFrame(item.t);
        const dataUrl = canvas.toDataURL('image/png');
        await fetch('/api/save-frame', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: item.file, dataUrl })
        });
      }
      console.log('Automated frame capture complete.');
    }, 400);
  } else {
    // Normal auto-start
    document.addEventListener('DOMContentLoaded', () => {
      startIdent();
    });
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      startIdent();
    }
  }

  // Replay button click
  if (replayBtn) {
    replayBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      startIdent();
    });
  }

  // Sound toggle button click
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      audioEngine.toggleSound();
    });
  }

  // Click on background stage replays
  if (container) {
    container.addEventListener('click', (e) => {
      if (e.target.closest('#replayBtn') || e.target.closest('#soundToggleBtn')) return;
      startIdent();
    });
  }

  // Keyboard Shortcuts: Space or R to Replay, M to toggle sound
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.key === 'r' || e.key === 'R') {
      e.preventDefault();
      startIdent();
    } else if (e.key === 'm' || e.key === 'M') {
      e.preventDefault();
      audioEngine.toggleSound();
    }
  });

})();
