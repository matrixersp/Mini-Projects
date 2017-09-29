var numSquares = 6;
var colors = [];
var pickedColor;
var squares = document.querySelectorAll('.square');
var colorDisplay = document.querySelector('#colorDisplay');
var messageDisplay = document.querySelector('#message');
var h1 = document.querySelector('h1');
var resetButton = document.querySelector('#reset');
var modeButtons = document.querySelectorAll('.mode')

init();

function init() {
	setupModeButtons();
	setupSquares();
	reset();
}

function setupModeButtons() {
	for(var i = 0; i < modeButtons.length; i++) {
		modeButtons[i].addEventListener("click", function() {
			modeButtons[0].classList.remove("selected");
			modeButtons[1].classList.remove("selected");
			this.classList.add("selected");
			numSquares = (this.textContent === "Easy") ? 3 : 6;
			reset();
		});
	}
}

function setupSquares() {
	for(var i = 0; i < squares.length; i++) {	
		//add click listeners to squares
		squares[i].addEventListener("click", function() {
			//grab color of clicked square
			var clickedColor = this.style.background;
			//compare clickedColor to pickedColor
			if(clickedColor === pickedColor) {
				messageDisplay.textContent = "Correct!";
				changeColor(clickedColor);
				h1.style.background = clickedColor;
				resetButton.textContent = "Play Again?";
			} else {
				this.style.background = "#232323";
				messageDisplay.textContent = "Try Again";
			}
		})
	}
}

function reset() {
	//generate all new colors
	colors = generateRandomColors(numSquares);
	//pick a random color from array
	pickedColor = pickColor();
	//change colorDisplay to match pickedColor
	colorDisplay.textContent = pickedColor;
	
	//change colors of squares
	for(var i = 0; i < squares.length; i++) {
		if(colors[i]) {
			squares[i].style.display ="block";
			squares[i].style.background = colors[i];
		} else {
			squares[i].style.display = "none";
		}
		
	}
	
	h1.style.background = "steelblue";
	resetButton.textContent = "New Colors";
	message.textContent = "";
}

resetButton.addEventListener("click", function() {
	reset();
})

function changeColor(color) {
	//loop through all squares
	for(var i = 0; i < squares.length; i++) {
		//change each color to match the given color
		squares[i].style.background = color;
	}
}

function pickColor() {
	var random = Math.floor(Math.random() * colors.length);
	return colors[random];
}

function generateRandomColors(num) {
	//create an aray
	var arr = [];
	//repeat num times
	for(var i = 0; i < num; i++) {
		//get random color and push into array
		arr.push(randomColor());
	}
	//return that array
	return arr;
}

function randomColor() {
	//pick a "red" color from 0 - 255
	var red = Math.floor(Math.random() * 256);
	//pick a "green" color from 0 - 255
	var green = Math.floor(Math.random() * 256);
	//pick a "blue" color from 0 - 255
	var blue = Math.floor(Math.random() * 256);

	//return an rgb color
	return "rgb(" + red + ", " + green + ", " + blue + ")";
}