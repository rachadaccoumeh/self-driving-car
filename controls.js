class Controls {
    constructor(type) {
        this.forward = false;
        this.left = false
        this.right = false
        this.reverse = false

        switch (type){
            case "KEYS":
                this.#addKeyboardListeners();
                break;
            case "DUMMY":
                this.forward=true;
                break;
        }
    }

    #addKeyboardListeners() {
        document.onkeydown = (event) => {
            switch (event.key) {
                case "ArrowRight":
                    this.right = true;
                    break;
                case  "ArrowLeft":
                    this.left = true;
                    break;
                case "ArrowUp":
                    this.forward = true;
                    break;
                case "ArrowDown":
                    this.reverse = true;
                    break;
                case "Enter":
                    if (car.damaged){
                        if (parseInt(Math.abs(car.y/100)) > leastHighscore || Object.keys(playersScores).length < 10){
                            var name = prompt("new Highscore! Enter your name (3-20 characters): ");
                            while (name === null || name === "" || name.length < 3 || name.length > 20 || (/[0-9]/).test(name)){
                                name = prompt("Unvalid name. Enter your name (3-20 characters): ");
                            }
                            //check if name already exists in the highscore list. if it does, overwrite the value only if it was higher
                            if (name in playersScores){
                                if (playersScores[name] < parseInt(Math.abs(car.y/100))){
                                    playersScores[name] = parseInt(Math.abs(car.y/100));
                                }
                            }
                            else{
                                playersScores[name] = parseInt(Math.abs(car.y/100));
                            }
                            
                            
                        }
                        if(Object.keys(playersScores).length > 10){
                            var values = Object.values(playersScores);
                            leastHighscore = Math.min(...values);
                            var index = values.indexOf(leastHighscore);
                            
                            playersScores = Object.fromEntries(
                                Object.entries(playersScores).filter(([key, value]) => key !== Object.keys(playersScores)[index])
                            );

                        }
                        localStorage.setItem("selfdrivingcarscoresobject",JSON.stringify(playersScores));
                        location.reload();
                    }
                    break;
            }
        }
        document.onkeyup = (event) => {
            switch (event.key) {
                case "ArrowRight":
                    this.right = false;
                    break;
                case  "ArrowLeft":
                    this.left = false;
                    break;
                case "ArrowUp":
                    this.forward = false;
                    break;
                case "ArrowDown":
                    this.reverse = false;
                    break;
            }
        }
    }
}