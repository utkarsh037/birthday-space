/* ============================================
   CINEMATIC BIRTHDAY WEBSITE - JAVASCRIPT
   Professional GSAP Animations & Music Sync
   ============================================ */

// Configuration
const CONFIG = {
    // Photo timing (in seconds) - adjust these to match music beats
    photoTimings: [
        { duration: 3.5, zoom: 1.2, moveX: 30, moveY: 0, rotate: 2, flash: true },
        { duration: 3.2, zoom: 1.15, moveX: -20, moveY: 15, rotate: -1, flash: false },
        { duration: 3.8, zoom: 1.25, moveX: 15, moveY: -20, rotate: 1.5, flash: true },
        { duration: 3.0, zoom: 1.18, moveX: -25, moveY: 10, rotate: -2, flash: false },
        { duration: 3.5, zoom: 1.22, moveX: 20, moveY: -15, rotate: 1, flash: true },
        { duration: 3.3, zoom: 1.17, moveX: -15, moveY: 20, rotate: -1.5, flash: false },
    ],
    // Paths to your photos (add more as needed)
    photoPaths: [
        'images/photo1.jpg',
        'images/photo2.jpg',
        'images/photo3.jpg',
        'images/photo4.jpg',
        'images/photo5.jpg',
        'images/photo6.jpg',
    ],
    // Transition settings
    fadeInDuration: 0.8,
    fadeOutDuration: 0.6,
    flashDuration: 0.15,
};

// Global Variables
let currentPhotoIndex = 0;
let musicStarted = false;

// DOM Elements
const startScreen = document.getElementById('startScreen');
const startButton = document.getElementById('startButton');
const cinematicContainer = document.getElementById('cinematicContainer');
const finalMessage = document.getElementById('finalMessage');
const backgroundMusic = document.getElementById('backgroundMusic');
const flashOverlay = document.getElementById('flashOverlay');
const confettiCanvas = document.getElementById('confettiCanvas');

// ============================================
// INITIALIZATION
// ============================================

// Preload images for smooth transitions
function preloadImages() {
    CONFIG.photoPaths.forEach(path => {
        const img = new Image();
        img.src = path;
    });
}

// Create photo slide elements
function createPhotoSlides() {
    CONFIG.photoPaths.forEach((path, index) => {
        const slide = document.createElement('div');
        slide.className = 'photo-slide';
        slide.id = `photo-${index}`;
        
        const img = document.createElement('img');
        img.src = path;
        img.alt = `Memory ${index + 1}`;
        
        slide.appendChild(img);
        cinematicContainer.appendChild(slide);
    });
}

// ============================================
// START SEQUENCE
// ============================================

startButton.addEventListener('click', async () => {
    // Prevent double-click
    if (musicStarted) return;
    musicStarted = true;
    
    // Animate button press
    gsap.to(startButton, {
        scale: 0.9,
        duration: 0.1,
        onComplete: () => {
            gsap.to(startButton, { scale: 1, duration: 0.2 });
        }
    });
    
    // Play music
    try {
        await backgroundMusic.play();
    } catch (error) {
        console.log('Audio playback failed:', error);
    }
    
    // Enter fullscreen
    requestFullscreen();
    
    // Hide start screen with fade
    gsap.to(startScreen, {
        opacity: 0,
        duration: 1,
        ease: 'power2.inOut',
        onComplete: () => {
            startScreen.style.display = 'none';
            // Start the cinematic sequence
            setTimeout(() => startCinematicSequence(), 300);
        }
    });
});

// Request fullscreen mode
function requestFullscreen() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(err => console.log('Fullscreen error:', err));
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
    }
}

// ============================================
// CINEMATIC ANIMATION SEQUENCE
// ============================================

function startCinematicSequence() {
    animatePhoto(0);
}

function animatePhoto(index) {
    // Check if we've shown all photos
    if (index >= CONFIG.photoPaths.length) {
        showFinalMessage();
        return;
    }
    
    const slide = document.getElementById(`photo-${index}`);
    const img = slide.querySelector('img');
    const timing = CONFIG.photoTimings[index] || CONFIG.photoTimings[0];
    
    // Flash effect (for beat drops)
    if (timing.flash) {
        createFlashEffect();
    }
    
    // Camera shake effect (subtle)
    if (timing.flash) {
        createCameraShake();
    }
    
    // Create timeline for this photo
    const tl = gsap.timeline({
        onComplete: () => {
            // Move to next photo
            animatePhoto(index + 1);
        }
    });
    
    // Initial state: set photo properties
    gsap.set(slide, { 
        opacity: 0,
        zIndex: 10 + index 
    });
    
    gsap.set(img, { 
        scale: 1,
        x: 0,
        y: 0,
        rotation: 0
    });
    
    // Animation sequence
    tl
        // Fade in
        .to(slide, {
            opacity: 1,
            duration: CONFIG.fadeInDuration,
            ease: 'power2.out'
        })
        // Simultaneous zoom, move, and rotate (cinematic camera movement)
        .to(img, {
            scale: timing.zoom,
            x: timing.moveX,
            y: timing.moveY,
            rotation: timing.rotate,
            duration: timing.duration,
            ease: 'power1.inOut'
        }, '<') // '<' means start at same time as previous animation
        // Fade out
        .to(slide, {
            opacity: 0,
            duration: CONFIG.fadeOutDuration,
            ease: 'power2.in'
        }, `-=${CONFIG.fadeOutDuration}`); // Start fade out before animation ends
}

// ============================================
// CINEMATIC EFFECTS
// ============================================

// Flash transition effect
function createFlashEffect() {
    gsap.timeline()
        .to(flashOverlay, {
            opacity: 0.7,
            duration: CONFIG.flashDuration,
            ease: 'power2.out'
        })
        .to(flashOverlay, {
            opacity: 0,
            duration: CONFIG.flashDuration * 2,
            ease: 'power2.in'
        });
}

// Camera shake effect (subtle)
function createCameraShake() {
    gsap.timeline()
        .to(cinematicContainer, {
            x: 5,
            duration: 0.05,
            ease: 'power1.inOut'
        })
        .to(cinematicContainer, {
            x: -5,
            duration: 0.05,
            ease: 'power1.inOut'
        })
        .to(cinematicContainer, {
            x: 3,
            duration: 0.05,
            ease: 'power1.inOut'
        })
        .to(cinematicContainer, {
            x: 0,
            duration: 0.05,
            ease: 'power1.inOut'
        });
}

// ============================================
// FINAL MESSAGE & CONFETTI
// ============================================

function showFinalMessage() {
    // Fade in final message
    gsap.to(finalMessage, {
        opacity: 1,
        duration: 2,
        ease: 'power2.inOut'
    });
    
    finalMessage.classList.add('visible');
    
    // Animate text with GSAP
    const birthdayText = document.querySelector('.birthday-text');
    
    gsap.fromTo(birthdayText,
        {
            scale: 0.5,
            opacity: 0,
            y: 100
        },
        {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 1.5,
            ease: 'elastic.out(1, 0.6)',
            delay: 0.5
        }
    );
    
    // Add continuous glow pulse
    gsap.to(birthdayText, {
        textShadow: '0 0 120px rgba(255, 215, 0, 0.9)',
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });
    
    // Start confetti after short delay
    setTimeout(() => {
        confettiCanvas.classList.add('visible');
        startConfetti();
    }, 1200);
}

// ============================================
// CONFETTI ANIMATION
// ============================================

function startConfetti() {
    const canvas = confettiCanvas;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Confetti particles
    const confettiPieces = [];
    const confettiCount = 150;
    const colors = ['#FFD700', '#FFA500', '#FF6B35', '#FF1744', '#9C27B0', '#2196F3'];
    
    // Create confetti pieces
    for (let i = 0; i < confettiCount; i++) {
        confettiPieces.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            width: Math.random() * 10 + 5,
            height: Math.random() * 10 + 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            speedY: Math.random() * 3 + 2,
            speedX: Math.random() * 2 - 1,
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 10 - 5
        });
    }
    
    // Animation loop
    function animateConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        confettiPieces.forEach((piece, index) => {
            // Update position
            piece.y += piece.speedY;
            piece.x += piece.speedX;
            piece.rotation += piece.rotationSpeed;
            
            // Reset if off screen
            if (piece.y > canvas.height) {
                piece.y = -20;
                piece.x = Math.random() * canvas.width;
            }
            
            // Draw confetti piece
            ctx.save();
            ctx.translate(piece.x, piece.y);
            ctx.rotate((piece.rotation * Math.PI) / 180);
            ctx.fillStyle = piece.color;
            ctx.fillRect(-piece.width / 2, -piece.height / 2, piece.width, piece.height);
            ctx.restore();
        });
        
        requestAnimationFrame(animateConfetti);
    }
    
    animateConfetti();
}

// ============================================
// WINDOW RESIZE HANDLER
// ============================================

window.addEventListener('resize', () => {
    if (confettiCanvas.classList.contains('visible')) {
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
    }
});

// ============================================
// INITIALIZE ON PAGE LOAD
// ============================================

window.addEventListener('DOMContentLoaded', () => {
    preloadImages();
    createPhotoSlides();
    
    // Add subtle animation to start button
    gsap.to(startButton, {
        scale: 1.05,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });
});
