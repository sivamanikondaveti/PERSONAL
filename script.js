const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
const music = document.getElementById('bg-music');
const rig = document.getElementById('camera-rig');
let particles = [];

// 1. New Camera Director Function
function moveCamera(z, x = 0, y = 0) {
    // We zoom by moving the entire rig forward in 3D space
    rig.style.transform = `translateZ(${z}px) translateX(${x}px) translateY(${y}px)`;
}

// 2. Canvas Background
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
}
window.addEventListener('resize', resize);

class Heart {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 20;
        this.size = Math.random() * (canvas.width < 600 ? 8 : 12) + 5;
        this.speed = Math.random() * 1 + 0.5;
        this.opacity = Math.random() * 0.4 + 0.1;
        this.swing = Math.random() * 2;
    }
    update() {
        this.y -= this.speed;
        this.x += Math.sin(this.y / 40) * this.swing;
        if (this.y < -20) this.reset();
    }
    draw() {
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = "#ff4d6d";
        ctx.font = `${this.size}px serif`;
        ctx.fillText('❤️', this.x, this.y);
    }
}

function initParticles() {
    const count = canvas.width < 600 ? 30 : 60;
    particles = Array.from({ length: count }, () => new Heart());
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
}

// 3. Scene Logic
function transition(from, to, callback) {
    const current = document.getElementById(`scene-${from}`);
    const next = document.getElementById(`scene-${to}`);
    current.classList.add('exit');
    setTimeout(() => {
        current.classList.remove('active', 'exit');
        next.classList.add('active');
        if (callback) callback();
    }, 1100);
}

function startExperience() {
    if (music) {
        music.volume = 0;
        music.play();
        let fadeIn = setInterval(() => {
            if (music.volume < 0.6) music.volume += 0.05;
            else clearInterval(fadeIn);
        }, 120);
    }

    transition(1, 2, () => {
        typewriter("babe-name", "Babe", 200, () => {
            setTimeout(() => transition(2, 3, startMainMessage), 2000);
        });
    });
}

function startMainMessage() {
    // Physical Zoom: Moving the camera into the card
    moveCamera(450, 0, 0); 

    const msg = `Bangaram...\n\nFrom the day you came into my life, everything started feeling different...\nYou became my peace, my happiness, my everything ❤️\n\nI know these past few weeks have been difficult... and I know I’ve hurt you.\nBut now I truly understand.\n\nAs long as I live, I will love you...\nAnd I’ll always be waiting for you.\n\n— Yours, Red Flag`;
    
    typewriter("message-container", msg, 85, () => {
        setTimeout(() => moveCamera(0), 1000); // Zoom back out
        setTimeout(() => transition(3, 4), 3500);
    });
}

function typewriter(id, text, speed, callback) {
    const el = document.getElementById(id);
    let i = 0;
    const interval = setInterval(() => {
        if (text[i] === "\n") el.innerHTML += "<br>";
        else el.innerHTML += text[i];
        
        // Subtle Steady-cam shake while zoomed in
        if (id === "message-container" && i % 5 === 0) {
            const sX = (Math.random() - 0.5) * 15;
            const sY = (Math.random() - 0.5) * 15;
            moveCamera(450, sX, sY);
        }

        i++;
        if (i >= text.length) {
            clearInterval(interval);
            if (callback) callback();
        }
    }, speed);
}

function finalExplosion() {
    particles.forEach(p => { p.speed *= 12; p.opacity = 1; });
    document.getElementById('final-text').style.opacity = "1";
}

resize();
animate();