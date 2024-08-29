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
            speed: 6,
            jumpForce: -15,
            mass: 1
        };

        this.trampoline = {
            x1: 100,
            y1: this.canvas.height - 100,
            x2: this.canvas.width - 100,
            y2: this.canvas.height - 100,
            segments: 25,
            points: [],
            k: 0.05, // spring constant (reduced from 0.3)
            damping: 0.6 // damping factor (increased from 0.9)
        };

        this.initTrampoline();

        this.gravity = 0.5;
        this.bounce = -1.1; // reduced from -1.2

        this.keys = {
            left: false,
            right: false,
            up: false
        };

        this.addEventListeners();
        this.gameLoop();
    }

    initTrampoline() {
        const segmentWidth = (this.trampoline.x2 - this.trampoline.x1) / this.trampoline.segments;
        for (let i = 0; i <= this.trampoline.segments; i++) {
            this.trampoline.points.push({
                x: this.trampoline.x1 + i * segmentWidth,
                y: this.trampoline.y1,
                vy: 0
            });
        }
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

        // Apply gravity
        this.player.vy += this.gravity;

        // Update player position
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

        // Update trampoline physics
        this.updateTrampoline();

        // Check for collision with trampoline
        const trampolineSegment = Math.floor((this.player.x - this.trampoline.x1) / ((this.trampoline.x2 - this.trampoline.x1) / this.trampoline.segments));
        if (trampolineSegment >= 0 && trampolineSegment < this.trampoline.points.length - 1) {
            const leftPoint = this.trampoline.points[trampolineSegment];
            const rightPoint = this.trampoline.points[trampolineSegment + 1];
            const trampolineY = leftPoint.y + (rightPoint.y - leftPoint.y) * (this.player.x - leftPoint.x) / (rightPoint.x - leftPoint.x);

            if (this.player.y + this.player.radius > trampolineY) {
                // Collision with trampoline
                this.player.y = trampolineY - this.player.radius;
                const avgVy = (leftPoint.vy + rightPoint.vy) / 2;
                this.player.vy = avgVy * this.bounce - this.player.vy * this.bounce;

                // Apply force to trampoline
                const force = this.player.mass * (this.player.vy - avgVy) / 2;
                leftPoint.vy += force / this.player.mass;
                rightPoint.vy += force / this.player.mass;
            }
        }

        // Bounce off bottom of canvas
        if (this.player.y + this.player.radius > this.canvas.height) {
            this.player.y = this.canvas.height - this.player.radius;
            this.player.vy *= this.bounce;
        }
    }

    updateTrampoline() {
        for (let i = 0; i < this.trampoline.points.length; i++) {
            const point = this.trampoline.points[i];
            const force = -this.trampoline.k * (point.y - this.trampoline.y1);
            point.vy += force;
            point.vy *= this.trampoline.damping;
            point.y += point.vy;
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
        this.ctx.moveTo(this.trampoline.points[0].x, this.trampoline.points[0].y);
        for (let i = 1; i < this.trampoline.points.length; i++) {
            this.ctx.lineTo(this.trampoline.points[i].x, this.trampoline.points[i].y);
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
