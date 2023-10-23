let playersScores = JSON.parse(localStorage.getItem("selfdrivingcarscoresobject")) || {};
let leastHighscore = 0;
let highscore = 0;
let score = document.getElementById("score");
if (localStorage.getItem("selfdrivingcarscoresobject")) {
    
    leastHighscore = Math.min(...Object.values(playersScores));
    highscore = Math.max(...Object.values(playersScores));
    //sort the playersScores object by value
    playersScores = Object.fromEntries(
        Object.entries(playersScores).sort(([, a], [, b]) => b - a)
    );

    

    var leaderboard = document.getElementById("leaderboard");
    for (player in playersScores) {
        var li = document.createElement("li");
        li.appendChild(document.createTextNode(player + ": " + playersScores[player]));
        leaderboard.appendChild(li);
    }
}

const canvas = document.getElementById("canvas");
canvas.width = 250;

const ctx = canvas.getContext("2d");
const road = new Road(canvas.width / 2, canvas.width * 0.9, 4)
const car = new Car(road.getLaneCentre(1.5), 100, 30, 50, "KEYS", 7, "red");
//car.draw(ctx);
const traffic = [
    new Car(road.getLaneCentre(0), 400, 30, 50, "DUMMY", 6.5),
    new Car(road.getLaneCentre(1), 400, 30, 50, "DUMMY", 6.5),
    new Car(road.getLaneCentre(2), 400, 30, 50, "DUMMY", 6.5),
    new Car(road.getLaneCentre(4), 400, 30, 50, "DUMMY", 6.5),
];
traffic.forEach(car => {
    car.maxSpeed = 4.5;
    car.acceleration = 0.01;
    car.friction = 0;
});

function generateRandomCar() {
    // generate random dummy cars on the road
    if (Math.random() < 0.015) {
        const laneIndex = Math.floor(Math.random() * road.lanCount);
        const laneCentre = road.getLaneCentre(laneIndex);
        traffic.push(new Car(laneCentre, car.y-700, 30, 50, "DUMMY", Math.random() * 3 + 3, getRandomColor()));

    }
}
animate();



function animate() {
    generateRandomCar();
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, []);
    }

    canvas.height = window.innerHeight;
    car.update(road.borders, traffic);

    ctx.save()
    ctx.translate(0, -car.y + canvas.height * 0.7);

    road.draw(ctx);
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(ctx, "blue");
    }
    car.draw(ctx, "red", animate);
    //location.reload();

    ctx.restore();
    score.innerHTML = "Score: " + parseInt(Math.abs(car.y / 100));
    requestAnimationFrame(animate);
    if (car.damaged) {
        ctx.fillRect(ctx.canvas.width / 2 - 100, ctx.canvas.height / 2 - 150, 200, 300);
        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("GAME OVER", ctx.canvas.width / 2, ctx.canvas.height / 2 - 100);
        ctx.font = "20px Arial";
        ctx.fillText("Score: " + parseInt(Math.abs(car.y / 100)), ctx.canvas.width / 2, ctx.canvas.height / 2 - 20);
        ctx.fillText("Highscore: " + highscore, ctx.canvas.width / 2, ctx.canvas.height / 2 + 20);
        ctx.font = "15px Arial";
        ctx.fillText("Press enter key to restart", ctx.canvas.width / 2, ctx.canvas.height / 2 + 100);
    }
}