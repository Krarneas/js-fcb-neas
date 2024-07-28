// VARIABLES - these store values, reusable names 
let board;
let score = 0;
let rows = 4;
let columns = 4;

let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;


let startX = 0;
let startY = 0;


// FUNCTIONS - reusable tasks, can be called anytime
function setGame(){

	board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]; // GOAL, we will use this backend board to create our frontend board.

	// LOOP - repeating a certain task until it is done
	// repeats the task inside it, until it will fulfill/completes the whole task. Task in our context is until oour board will have a tile with there proper colors
	for(let r = 0; r < rows; r++){
		for(let c = 0; c < columns; c++){
			//create and design a tile

			// Created Tile using div
			let tile = document.createElement("div");

			// Each tile will have an invisible id
			tile.id = r.toString() + "-" + c.toString(); // outputs n-n, ex. 0-0, 0-1, 0-2, 1-0

			// Number of The Tile	
			let num = board[r][c]; //board[0][1]

			updateTile(tile, num);

			document.getElementById("board").append(tile)
		}
	}
	setTwo();
	setTwo();
}


// updateTile() - updates the appearance of the tile (tile number and bg color)
function updateTile(tile, num){

	tile.innerText = "";
	tile.classList.value = "";

	tile.classList.add("tile");

	if(num > 0){
		tile.innerText = num.toString();

		if(num <= 4096){
			tile.classList.add("x" + num.toString());
		}
		else{
			tile.classList.add("x8192");
		}
	}
}

window.onload = function(){
	setGame();
}

function handleSlide(event){
	console.log(event.code); 
	// console.log - will display the key pressed in the console
	// event.code - is the pressed key in our keyboard

	if(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.code)){

		event.preventDefault(); //prevents the default behavior of the browser when we press arrow keys, for ex. when right key is pressed- interface is scrolled to the right

		if(event.code == "ArrowLeft"){
			slideLeft();
			setTwo();
		}
		else if(event.code == "ArrowRight"){
			slideRight();
			setTwo();
		}
		else if(event.code == "ArrowUp"){
			slideUp();
			setTwo();
		}
		else if(event.code == "ArrowDown"){
			slideDown();
			setTwo();
		}


	}
	checkWin();

	if(hasLost() == true){
		alert("Game Over! You have lost the game. Game will restart.");
		restartGame();
		alert("Click any arrow key to restart.");
	}

	document.getElementById("score").innerText = score;
}

// addEventListener is the one who listens when a key is pressed, handleslide will work
document.addEventListener("keydown", handleSlide)

//filterZero - removes the zero
function filterZero(row){
	return row.filter(num => num != 0);
}

//slide() merges the same adjacent tile
// CORE Function for sliding and merging tiles
function slide(row){
	// 0 2 2 0
	// 2 2
	row = filterZero(row);
	for(let i = 0; i < row.length - 1; i++){
		// if 2 tiles are of the same value:
		if(row[i] == row[i + 1]){
			row[i] *= 2; // 4 2
			row[i + 1] = 0; // 4 0
			score += row[i];
		}
	}

	//Add zeroes back
	while(row.length < columns){
		row.push(0); // 4 0 0 0
	}
	return row;
}


function slideLeft(){

	for(let r = 0; r < rows; r++){
		let row = board[r]; 

		let originalRow = row.slice();

		row = slide(row); // slideLeft() function uses slide() function to merge tiles with the same values

		board[r] = row;

		for(let c = 0; c < columns; c++){

			//This code retrieves our tile element
			let tile = document.getElementById(r.toString() + "-" + c.toString());

			let num = board[r][c];

			//Animation
			if(originalRow[c] !== num && num !== 0){
				tile.style.animation = "slide-from-right 0.3s";
				setTimeout(() => {tile.style.animation = ""}, 300);
			}
			//Updates the appearance of the tile
			updateTile(tile, num); 

		}
	}
}

function slideRight(){

	for(let r = 0; r < rows; r++){
		let row = board[r];
		// 2 2 0 0
		// 0 0 2 2
		// 4 0 0 0
		// 0 0 0 4 
		let originalRow = row.slice();

		row.reverse();
		row = slide(row); // slideLeft() function uses slide() function to merge tiles with the same values
		row.reverse();

		board[r] = row;

		for(let c = 0; c < columns; c++){

			//This code retrieves our tile element
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			
			let num = board[r][c];

			//Animation
			if(originalRow[c] !== num && num !== 0){
				tile.style.animation = "slide-from-left 0.3s";
				setTimeout(() => {tile.style.animation = ""}, 300);
			}

			//Updates the appearance of the tile
			updateTile(tile, num); 
		}
	}
}

function slideUp(){

	for(let c = 0; c < columns; c++){
		let col = [board[0][c], board[1][c], board[2][c], board[3][c] ];

		let originalCol = col.slice(); 

		col = slide(col);

		let changeIndices = [];
		for(let r = 0; r < rows; r++){
			if(originalCol[r] !== col[r]){
				changeIndices.push(r);
			}
		}

		for(let r = 0; r < rows; r++){

			board[r][c] = col[r];
			//This code retrieves our tile element
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			
			let num = board[r][c];

			if(changeIndices.includes(r) && num !== 0){
				tile.style.animation = "slide-from-bottom 0.3s";
				setTimeout(() =>{
					tile.style.animation = "";
				}, 300)
			}

			//Updates the appearance of the tile
			updateTile(tile, num); 
		}
	}
}

function slideDown(){

	for(let c = 0; c < columns; c++){
		let col = [board[0][c], board[1][c], board[2][c], board[3][c] ]; 
		col.reverse();
		col = slide(col);

		let originalCol = col.slice(); 

		col.reverse();

		let changeIndices = [];
		for(let r = 0; r < rows; r++){
			if(originalCol[r] !== col[r]){
				changeIndices.push(r);
			}
		}


		for(let r = 0; r < rows; r++){

			board[r][c] = col[r];
			//This code retrieves our tile element
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			
			let num = board[r][c];

			//Animation
			if(changeIndices.includes(r) && num !== 0){
				tile.style.animation = "slide-from-top 0.3s";
				setTimeout(() =>{
					tile.style.animation = "";
				}, 300)
			}


			//Updates the appearance of the tile
			updateTile(tile, num); 
		}
	}
}

function hasEmptyTile(){
	for(let r = 0; r < rows; r++){
		for(let c = 0; c < columns; c++){
			if(board[r][c] == 0){
				return true;
			}
		}
	}

	return false;
}

function setTwo(){

    // if hasEmptyTile() function returns false, the setTwo() function will not generate a new tile.
    if(hasEmptyTile() == false){
        return; // "I will do nothing, I don't need to generate a new tile"
    }

    // the codes below are the codes to be executed once the condition above is not satisfied. 
    let found = false;

    while(!found){

        // This is to generate a random row and column position to check a random tile, and generate a tile with number 2 in it.
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);

        // if the random tile is an empty tile, the program will make it a tile with number 2. 
        if(board[r][c]==0){

            // the random vacant becomes 2 
            board[r][c] = 2;

            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("x2");

            found = true;
        }
    }

}


function checkWin(){
	for(let r = 0; r < rows; r++){
		for(let c = 0; c < columns; c++){

			if(board[r][c] == 2048 && is2048Exist == false){
				alert("You Win! You reached 2048.")
				is2048Exist = true;
			}
			else if(board[r][c] == 4096 && is4096Exist == false){
				alert("You reached 4096.")
				is4096Exist = true;
			}
			else if(board[r][c] == 8192 && is8192Exist == false){
				alert("You reached 8192.")
				is8192Exist = true;
			}
		}
	}
}

function hasLost(){
	
	for(let r = 0; r < rows; r++){
		for(let c = 0; c < columns; c++){

			if(board[r][c] == 0){
				return false;
			}

			const currentTile = board[r][c];

			if(
				// Check current tile if it has a possible merge in its UPPER tile
				r > 0 && board[r-1][c] === currentTile ||
				// Check current tile if it has a possible merge in its LOWER tile
				r < rows - 1 && board[r + 1][c] === currentTile ||
				// Check current tile if it has a possible merge in its LEFT tile
				c > 0 && board[r][c-1] === currentTile ||
				// Check current tile if it has a possible merge in its RIGHT tile
				c < columns - 1 && board[r][c + 1] === currentTile
			){
				return false;
			}
		}
	}

	return true;

}

// Replaces all tiles to zero
function restartGame(){
	for(let r = 0; r < rows; r++){
		for(let c = 0; c < columns; c++){
			board[r][c] = 0;
		}
	}
	score = 0;
	setTwo(); // generate new tiles
}



document.addEventListener('touchstart', (event) =>{
	startX = event.touches[0].clientX;
	startY = event.touches[0].clientY;

})

document.addEventListener('touchend', (event) =>{

	if(!event.target.className.includes("tile")){
		return; //Do nothing
	}

	let diffX = startX - event.changedTouches[0].clientX;
	let diffY = startY - event.changedTouches[0].clientY;

	if(Math.abs(diffX) > Math.abs(diffY)){
		if(diffX > 0){
			slideLeft();
			setTwo();
		}
		else{
			slideRight();
			setTwo();
		}
	}
	else{
		if(diffY > 0){
			slideUp();
			setTwo();
		}
		else{
			slideDown();
			setTwo();
		}

	}

	document.getElementById('score').innerText = score;
	checkWin();

	if(hasLost() == true){
		alert("Game over! You have lost the game. Game will restart.");
		restartGame();
		alert("Click any arrow key to restart");
	}

});

document.addEventListener('touchmove', (event) => {
	if(!event.target.className.includes("tile")){
		return; //Do nothing
	}

	event.preventDefault();
}, {passive: false});










