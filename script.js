const startBtn = document.querySelector("#start"),
  screens = document.querySelectorAll(".screen"),
  timeList = document.querySelector("#time-list"),
  difficultyList = document.querySelector("#difficulty-list"),
  timeEl = document.querySelector("#time"),
  board = document.querySelector("#board"),
  hitsEl = document.querySelector("#hits"),
  accuracyEl = document.querySelector("#accuracy"),
  heartList = document.querySelectorAll(".heart"),
  hitsOver = document.querySelector("#hits-over"),
  accuracyOver = document.querySelector("#accuracy-over"),
  restartBtn = document.querySelector(".restart"),
  restartOverBtn = document.querySelector("#restart-over")
  fullScreenBtn = document.querySelector("#fullscreen");

let time = 0;
let unlimitedTime = false;
let difficulty;
let playing = false;
let interval;
let misses = 0;
let hits = 0;
let accuracy = 0;
let hearts = 3;

startBtn.addEventListener("click", () => {
  screens[0].classList.add("off");
});

timeList.addEventListener("click", (e) => {
  if (e.target.classList.contains("time-btn")) {
    time = parseInt(e.target.getAttribute("data-time"));
    unlimitedTime = parseInt(e.target.getAttribute("data-unlimited"));
    screens[1].classList.add("off");
  }
});

difficultyList.addEventListener("click", (e) => {
  if (e.target.classList.contains("difficulty-btn")) {
    difficulty = e.target.getAttribute("data-difficulty");
    screens[2].classList.add("off");
    startGame();
  }
});

function startGame() {
  playing = true;
  interval = setInterval(decreaseTime, 1000); // set interval will call the function decreaseTime every 1000ms or 1 sec
  createRandomCircle();
}

function decreaseTime() {
  // if time is unlimited then we dont want to reduce time
  if (unlimitedTime === 1) {
    setTime("∞");
    return;
  }
  // if time is 0, then game is over
  if (time === 0) {
    gameOver();
  }

  let current = --time;
  let miliseconds = time * 1000;

  let minutes = Math.floor(miliseconds / (1000 * 60));
  let seconds = Math.floor((miliseconds % (1000 * 60)) / 1000);

  //adds leading zeros, so if 5 seconds it will become 05 , if 7 min it will become 07, if 10 or larger nothing happens

  seconds = seconds < 10 ? "0" + seconds : seconds;
  minutes = minutes < 10 ? "0" + minutes : minutes;

  setTime(`${minutes}:${seconds}`); // i kept using quotations or apostrophe instead of backticks.
}

function setTime(time) {
  timeEl.innerHTML = time;
}

function createRandomCircle() {
  if (!playing) {
    //if not playing then do nothing
    return;
  }

  const circle = document.createElement("div");
  const size = getRandomNumber(30, 100);
  const colors = ["#03DAC6", "#ff0266", "#b3ff00", "ccff00", "#9d00ff"];
  const { width, height } = board.getBoundingClientRect();
  const x = getRandomNumber(0, width - size);
  const y = getRandomNumber(0, height - size);
  circle.classList.add("circle");
  circle.style.height = `${size}px`;
  circle.style.width = `${size}px`;
  circle.style.top = `${y}px`;
  circle.style.left = `${x}px`;

  let color = Math.floor(Math.random() * 5);
  circle.style.background = `${colors[color]}`;
  board.append(circle);

  //difficulty settings
  if (difficulty === "easy") circle.style.animationDuration = "3s";
  else if (difficulty === "medium") circle.style.animationDuration = "2s";
  else if (difficulty === "hard") circle.style.animationDuration = "1s";

  //create new circle after current circle is gone or clicked
  circle.addEventListener("animationend", () => {
    circle.remove();
    createRandomCircle();
    //increments misses if didnt click circle in time
    misses++;
    updateAccuracy();
    //decrements hearts if didnt click circle in time
    --hearts;
    loseHearts();
  });

  circle.addEventListener("click", () => {
    circle.remove();
    createRandomCircle();
    //increments hits if clicked circle
    hits++;
    updateAccuracy();
    //shows hits
    hitsEl.innerHTML = hits;
  });
}

function updateAccuracy() {
  //shows accuracy
  accuracy = hits + misses === 0 ? 0 : (hits / (hits + misses)) * 100; // to prevent NaNs, also the code is just shorthand for if statment
  accuracy = accuracy.toFixed(2); //toFixed() makes sure the decimals are always to the 10ths place.
  accuracyEl.innerHTML = `${accuracy}%`;
}

function getRandomNumber(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function loseHearts() {
  //checks the number of hearts left and adjusts html accordingly
  if (hearts === 0) {
    //game over
    heartList[2].classList.add("dead");
    gameOver();
  } else if (hearts === 2) {
    heartList[0].classList.add("dead");
  } else if (hearts === 1) {
    heartList[1].classList.add("dead");
  }
}

function gameOver() {
  playing = false;
  clearInterval(interval); //clear time interval
  board.innerHTML = ""; //clear circles
  screens[3].classList.add("off");
  hitsOver.innerHTML = hitsEl.innerHTML;
  accuracyOver.innerHTML = accuracyEl.innerHTML;
  hitsEl.innerHTML = 0;
  timeEl.innerHTML = "00:00";
  accuracy.innerHTML = "0%";
  hearts = 3;
  heartList[0].classList.remove("dead");
  heartList[1].classList.remove("dead");
  heartList[2].classList.remove("dead");
}

restartBtn.addEventListener("click", () => {
  gameOver();
  screens[0].classList.remove("off");
  screens[1].classList.remove("off");
  screens[2].classList.remove("off");
  screens[3].classList.remove("off");
});

restartOverBtn.addEventListener("click", () => {
  gameOver();
  screens[0].classList.remove("off");
  screens[1].classList.remove("off");
  screens[2].classList.remove("off");
  screens[3].classList.remove("off");
});

let elem = document.documentElement;

fullScreenBtn.addEventListener("click", fullScreen);

function fullScreen() {
  if (elem.requestFullScreen) {
    elem.requestFullScreen();
  } else if (elem.mozRequestFullScreen) {
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
  }
}
