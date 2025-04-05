class ParticleSystem {
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.particles = [];
        this.isRunning = false;

        // Default options with clear documentation
        this.options = {
            numParticles: options.numParticles || 50, // Number of particles (same as "amount")
            maxDistance: options.maxDistance || 100,  // Max distance for connecting lines (same as "proximity")
            particleRadius: options.particleRadius || 2, // Radius of the filled dots
            particleColor: options.particleColor || "rgba(255, 255, 255, 0.8)", // Color of the dots
            lineColor: options.lineColor || "rgba(255, 255, 255, 0.3)", // Color of the connecting lines
            speed: options.speed || 1, // Speed of particle movement
            lineType: options.lineType || "solid" // Type of connecting lines: "solid", "dotted", "dashed", "dash-dotted"
        };

        // Resize canvas to fit its parent
        this.resizeCanvas();
        window.addEventListener("resize", () => this.resizeCanvas());

        // Initialize particles
        this.initParticles();
    }

    // Resize the canvas to match the container dimensions
    resizeCanvas() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
    }

    // Initialize particles with random positions and velocities
    initParticles() {
        this.particles = [];
        for (let i = 0; i < this.options.numParticles; i++) {
            const particle = {
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * this.options.speed, // Random velocity based on speed
                vy: (Math.random() - 0.5) * this.options.speed,
                radius: this.options.particleRadius // Use the specified particle radius
            };
            this.particles.push(particle);
        }
    }

    // Update particle positions
    update() {
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Bounce off walls
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx *= -1;
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy *= -1;
            }
        });
    }

    // Draw particles and connecting lines
    draw() {
        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw particles
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = this.options.particleColor; // Use the specified particle color
            this.ctx.fill();
            this.ctx.closePath();
        });

        // Set the line dash pattern based on lineType
        switch (this.options.lineType) {
            case "dotted":
                this.ctx.setLineDash([2, 4]); // Short dashes for dotted effect
                break;
            case "dashed":
                this.ctx.setLineDash([10, 10]); // Longer dashes for dashed effect
                break;
            case "dash-dotted":
                this.ctx.setLineDash([10, 5, 2, 5]); // Dash-dot pattern
                break;
            case "solid":
            default:
                this.ctx.setLineDash([]); // Solid line (default)
                break;
        }

        // Draw connecting lines
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                const distance = Math.sqrt(
                    (p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2
                );

                if (distance < this.options.maxDistance) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = this.options.lineColor; // Use the specified line color
                    this.ctx.lineWidth = 1 - distance / this.options.maxDistance; // Fade line with distance
                    this.ctx.stroke();
                    this.ctx.closePath();
                }
            }
        }

        // Reset the line dash to avoid affecting other drawings
        this.ctx.setLineDash([]);
    }

    // Animation loop
    animate() {
        if (!this.isRunning) return;
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }

    // Start the animation
    start() {
        this.isRunning = true;
        this.animate();
    }

    // Stop the animation
    stop() {
        this.isRunning = false;
    }
}