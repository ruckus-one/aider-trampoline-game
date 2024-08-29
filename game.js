class TrampolineGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 800;
        this.canvas.height = 600;

        this.player = {
            x: this.canvas.width / 2,
            y: 50,
            radius: 20,
            vy: 0,
            vx: 0,
            speed: 5,
            jumpForce: -10
        };

        this.trampoline = {
            x1: 100,
            y1: this.canvas.height - 100,
            x2: this.canvas.width - 100,
            y2: this.canvas.height - 100
        };

        this.gravity = 0.5;
        this.bounce = -0.7;

        this.keys = {
            left: false,
            right: false,
            up: false
        };

        this.addEventListeners();
        this.gameLoop();
    }

    addEventListeners() {
        document.addEventListener('keydown', (e) => this.keyDown(e));
        document.addEventListener('keyup', (e) => this.keyUp(e));
    }

    keyDown(e) {
        if (e.key === 'ArrowLeft') this.keys.left = true;
        if (e.key === 'ArrowRight') this.keys.right = true;
        if (e.key === 'ArrowUp') this.keys.up = true;
    }

    keyUp(e) {
        if (e.key === 'ArrowLeft') this.keys.left = false;
        if (e.key === 'ArrowRight') this.keys.right = false;
        if (e.key === 'ArrowUp') this.keys.up = false;
    }

    update() {
        // Handle horizontal movement
        if (this.keys.left) this.player.vx = -this.player.speed;
        else if (this.keys.right) this.player.vx = this.player.speed;
        else this.player.vx = 0;

        // Handle jumping
        if (this.keys.up && this.player.y + this.player.radius >= this.getTrampolineY(this.player.x)) {
            this.player.vy = this.player.jumpForce;
        }

        this.player.vy += this.gravity;
        this.player.x += this.player.vx;
        this.player.y += this.player.vy;

        // Bounce off canvas edges
        if (this.player.x - this.player.radius < 0) {
            this.player.x = this.player.radius;
            this.player.vx = -this.player.vx * 0.5;
        } else if (this.player.x + this.player.radius > this.canvas.width) {
            this.player.x = this.canvas.width - this.player.radius;
            this.player.vx = -this.player.vx * 0.5;
        }

        // Bounce off trampoline
        const trampolineY = this.getTrampolineY(this.player.x);
        if (this.player.y + this.player.radius > trampolineY) {
            this.player.y = trampolineY - this.player.radius;
            this.player.vy *= this.bounce;
        }

        // Bounce off bottom of canvas
        if (this.player.y + this.player.radius > this.canvas.height) {
            this.player.y = this.canvas.height - this.player.radius;
            this.player.vy *= this.bounce;
        }
    }

    getTrampolineY(x) {
        const progress = (x - this.trampoline.x1) / (this.trampoline.x2 - this.trampoline.x1);
        return this.trampoline.y1 + (this.trampoline.y2 - this.trampoline.y1) * progress + Math.sin(progress * Math.PI) * 50;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw player
        this.ctx.beginPath();
        this.ctx.arc(this.player.x, this.player.y, this.player.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = 'red';
        this.ctx.fill();
        this.ctx.closePath();

        // Draw trampoline
        this.ctx.beginPath();
        this.ctx.moveTo(this.trampoline.x1, this.trampoline.y1);
        for (let x = this.trampoline.x1; x <= this.trampoline.x2; x++) {
            const y = this.getTrampolineY(x);
            this.ctx.lineTo(x, y);
        }
        this.ctx.strokeStyle = 'blue';
        this.ctx.lineWidth = 5;
        this.ctx.stroke();
        this.ctx.closePath();
    }

    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

new TrampolineGame();
