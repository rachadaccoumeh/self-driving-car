const canvas = document.getElementById("canvas");
canvas.width = 200;

const ctx = canvas.getContext("2d");
const road = new Road(canvas.width / 2, canvas.width * 0.9)
const car = new Car(road.getLaneCentre(1), 100, 30, 50,"KEYS");
//car.draw(ctx);
const traffic =[
    new Car(road.getLaneCentre(1),-100,30,50,"DUMMY",2)
];
animate();



function animate() {
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders,[]);
    }

    canvas.height = window.innerHeight;
    car.update(road.borders,traffic);

    ctx.save()
    ctx.translate(0,-car.y+canvas.height*0.7);

    road.draw(ctx);
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(ctx,"blue");
    }
    car.draw(ctx,"red");

    ctx.restore();
    requestAnimationFrame(animate);
}