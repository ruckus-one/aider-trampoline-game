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
            vy: 0
        };

        this.trampoline = {
            x1: 100,
            y1: this.canvas.height - 100,
            x2: this.canvas.width - 100,
            y2: this.canvas.height - 100
        };

        this.gravity = 0.5;
        this.bounce = -0.7;

        this.gameLoop();
    }

    update() {
        this.player.vy += this.gravity;
        this.player.y += this.player.vy;

        if (this.player.y + this.player.radius > this.trampoline.y1) {
            const trampolineY = this.getTrampolineY(this.player.x);
            if (this.player.y + this.player.radius > trampolineY) {
                this.player.y = trampolineY - this.player.radius;
                this.player.vy *= this.bounce;
            }
        }

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
