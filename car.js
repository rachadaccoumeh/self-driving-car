class Car {
    constructor(x, y, width, height, controlType, maxSpeed = 3, color = "blue") {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;

        this.speed = 0;
        this.acceleration = 0.2;
        this.maxSpeed = maxSpeed;
        this.friction = 0.05;
        this.angle = 0;
        this.damaged = false;
        this.image = new Image();
        this.color = color;

        this.image.src = "car.png";


        this.mask=document.createElement("canvas");
        this.mask.width=width;
        this.mask.height=height;

        const maskCtx=this.mask.getContext("2d");
        this.image.onload=()=>{
            this.image.ready = true;
            maskCtx.fillStyle=color;
            maskCtx.rect(0,0,this.width,this.height);
            maskCtx.fill();
            maskCtx.globalCompositeOperation="destination-atop";
            maskCtx.drawImage(this.image,0,0,this.width,this.height);
        }

        if (controlType !== "DUMMY")
            this.sensor = new Sensor(this);
        this.controls = new Controls(controlType);
    }

    update(roadBorders, traffic) {
        if (!this.damaged) {
            this.#movement();
            this.polygon = this.#createPolygon();
            this.damaged = this.#assessDamage(roadBorders, traffic);
        }
        if (this.sensor)
            this.sensor.update(roadBorders, traffic);
    }

    #createPolygon() {
        const points = [];
        const rad = Math.hypot(this.width, this.height) / 2;
        const alpha = Math.atan2(this.width, this.height);
        points.push({
            x: this.x - Math.sin(this.angle - alpha) * rad,
            y: this.y - Math.cos(this.angle - alpha) * rad
        });
        points.push({
            x: this.x - Math.sin(this.angle - alpha) * rad,
            y: this.y - Math.cos(this.angle - alpha) * rad
        });
        points.push({
            x: this.x - Math.sin(this.angle + alpha) * rad,
            y: this.y - Math.cos(this.angle + alpha) * rad
        });
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad
        });
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad
        });
        return points;
    }

    draw(ctx) {
        if (!this.image.ready) return;
        ctx.save()
        ctx.translate(this.x, this.y);
        ctx.rotate(-this.angle);
        ctx.beginPath();
        if(!this.damaged){
            ctx.drawImage(this.mask,
                -this.width/2,
                -this.height/2,
                this.width,
                this.height);
            ctx.globalCompositeOperation="multiply";
        }
        ctx.drawImage(this.image,
            -this.width/2,
            -this.height/2,
            this.width,
            this.height);
        ctx.restore();
    }

    #movement() {
        if (this.controls.forward) {
            this.speed += this.acceleration;
        }
        if (this.controls.reverse) {
            this.speed -= this.acceleration;
        }
        if (this.speed > this.maxSpeed)
            this.speed = this.maxSpeed;
        if (this.speed < -this.maxSpeed / 2)
            this.speed = -this.maxSpeed / 2;
        if (this.speed > 0)
            this.speed -= this.friction;
        if (this.speed < 0)
            this.speed += this.friction
        if (Math.abs(this.speed) < this.friction)
            this.speed = 0;
        if (this.speed !== 0) {
            const flip = this.speed > 0 ? 1 : -1;
            if (this.controls.left)
                this.angle += 0.03 * flip;
            if (this.controls.right)
                this.angle -= 0.03 * flip;
        }
        this.x -= Math.sin(this.angle) * this.speed;
        this.y -= Math.cos(this.angle) * this.speed;

    }

    #assessDamage(roadBorders, traffic) {
        for (let i = 0; i < roadBorders.length; i++) {
            if (polyIntersect(this.polygon, roadBorders[i])) {
                return true
            }
        }
        for (let i = 0; i < traffic.length; i++) {
            if (polyIntersect(this.polygon, traffic[i].polygon)) {
                return true
            }
        }
        return false;
    }
}