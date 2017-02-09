var letterSpace = function() {
	this.gen = function(){
		this.id = "letter" +letterSpaceId;
		letterSpaceId++;
		document.getElementById("wrapper").insertAdjacentHTML('beforeend',"<div class='letterSpace' id='" + this.id + "'></div>");
	}
};

var Player = function(number) {
	this.name = "Player " + number,
	this.cash = 0,
	this.bank = 0,
	this.inventory = [],
	this.currentPlayer = false,
	this.el = document.getElementById('player'+number),
	this.setEl = function() {
		this.el.innerHTML = "Player "+number+":<br/><span style='color: green'>$"+this.cash+"</span><br/>$"+this.bank;
	}
};

var currentPlayer = function() {
		if (playerOne.currentPlayer){
			return playerOne;
		} else if (playerTwo.currentPlayer) {
			return playerTwo;
		} else if (playerThree.currentPlayer) {
			return playerThree;
		}
	}

var space = new letterSpace(),
	playerOne = new Player("One"),
	playerTwo = new Player("Two"),
	playerThree = new Player("Three"),
	lettersTried = [],
	curve = [],
	vowels = "AEIOU",
	spun = 0,
	counter = 0,
	letterSpaceId = 0,
	playSpace = document.getElementById("playSpace"),
	phrase = "",
	consonant1,
	consonant2,
	consonant3,
	vowel1,
	lines;
	
document.getElementById('start').addEventListener('click', start, false);
for (var i = 0; i < 56; i++) {
	space.gen();
	}
playerOne.currentPlayer = true;
for (var i = 0; i < 3; i += .075){
	curve.push(Math.sin(i-1.5)+1);
}

function start() {

	// initiates the game by generating a phrase, distributing whitespace on the board, saving the phrase and its
	// lines globally, and proceeding to the game's default state, the base phase

	phrase = setPhrase();
	lines = boardFormatter();
	basePhase();	
}

function setPhrase(){

	//randomly picks a result from the phrases array

	return phrases[Math.floor(Math.random()*2054)].toUpperCase();
}

function boardFormatter() {

// distributes a phrase onto up to four lines, then programmatically distributes those lines onto the board
// returns an array of lines
// phraseObject should probably be reformatted into an array

	let subject = phraseParser(),
		result = [],
		phraseObject = {
			line1: "",
			line2: "",
			line3: "",
			line4: "",
			phase: 1,
		};

	for (var i = 0; i < subject.words; i++) {
		if ((phraseObject.line1.length + subject[i].length) < 12) {
			phraseObject.line1 += " ";
			phraseObject.line1 += subject[i];
		} else if ((phraseObject.line2.length + subject[i].length) < 14) {
			phraseObject.line1 += "***********"
			phraseObject.line2 += " ";
			phraseObject.line2 += subject[i];
			phraseObject.phase = 2;
		} else if ((phraseObject.line3.length + subject[i].length) < 14) {
			phraseObject.line2 += "***********"
			phraseObject.line3 += " ";
			phraseObject.line3 += subject[i];
			phraseObject.phase = 3;
		} else if ((phraseObject.line4.length + subject[i].length) < 12) {
			phraseObject.line3 += "***********"
			phraseObject.line4 += " ";
			phraseObject.line4 += subject[i];
			phraseObject.phase = 4;
		} else {
			throw new Error("Phrase too long");
		}
	}

	phraseObject.line1 = phraseObject.line1.replace(/\*/gi, "");
	phraseObject.line2 = phraseObject.line2.replace(/\*/gi, "");
	phraseObject.line3 = phraseObject.line3.replace(/\*/gi, "");
	console.log(subject);
	console.log(phraseObject.line1,phraseObject.line2,phraseObject.line3,phraseObject.line4,phraseObject.line1.length,phraseObject.line2.length,phraseObject.line3.length,phraseObject.line4.length);

	switch (phraseObject.phase) {
		case 1:
			result.push("",phraseObject.line1,"","");
			break;
		case 2:
			result.push("",phraseObject.line1,phraseObject.line2,"");
			break;
		case 3:
			result.push(phraseObject.line1,phraseObject.line2,phraseObject.line3,"")
			break;
		case 4:
			result.push(phraseObject.line1,phraseObject.line2,phraseObject.line3,phraseObject.line4)
			break;
	}
	setBoard(result);
	return result;
}

function setBoard(phraseArray) {

	// resets the board, distributes whitespace on the board based on the phrase, then searches for and decolors
	// spaces, and searches for and reveals special characters
	
	let specialChar = "-!&():;',./? ";

	//reset the board
	for (var i = 0; i < 56; i++) {
		document.getElementById("letter"+i).style.backgroundColor = 'aqua';
		document.getElementById('letter'+i).innerText = "";
	}

	//check the phrase for special characters
	for (var i = 0; i < specialChar.length; i++) {
		for (var j = 0; j < phraseArray.length; j++) {
			checkChars(specialChar[i], phraseArray[j], 14*j);
		}
	}

	for (var i = 0; i < phraseArray.length; i++) {
		for (var j = (i*14); j < (phraseArray[i].length + (i*14)); j++) {
			document.getElementById("letter"+j).style.backgroundColor = 'white';
			if (document.getElementById("letter"+j).innerHTML == " ") {
				document.getElementById("letter"+j).style.backgroundColor = "aqua";
			}
		}	
	}
	
	document.getElementById("letter0").style.backgroundColor = "transparent";
	document.getElementById("letter13").style.backgroundColor = "transparent";
	document.getElementById("letter42").style.backgroundColor = "transparent";
	document.getElementById("letter55").style.backgroundColor = "transparent";
}

function checkChars(char,line,preSpace) {

	// searches a line for a char, then reveals that char on the board
	// used to reveal special characters at init, then to reveal characters on a correct final guess.
	// has similar functionality to checkLines, with which it probably should be merged

	for (var i = 0; i < line.length; i++) {
		if (char === line[i]) {
			document.getElementById("letter"+(preSpace+i)).innerText = char;
		}
	}
}

function phraseParser() {

// splits a phrase into its constituent words, returns an object with the words, the phrase length, and the wordcount

	let result = {};
	result.length = phrase.length;
	result.words = phrase.split(" ").length;
	for (var i = 0; i < result.words; i++) {
		result[i] = phrase.split(" ")[i];
	}
	return result;
}

function basePhase() {

	// the games default state, the base phase updates the scoreboard, indicates the current player, and allows the
	// player to spin, buy a vowel, or solve the puzzle

	updateScoreboard();
	playSpace.innerHTML = "Your turn, "+currentPlayer().name+"! What would you like to do?<br/><button id='spin'>Spin!</button><button id='vowel'>Buy a vowel!</button><button id='solve'>Solve the puzzle!</button>";
	document.getElementById('spin').addEventListener('click', spin, false);
	document.getElementById('vowel').addEventListener('click', vowelPass, false);
	document.getElementById('solve').addEventListener('click', solve, false);
}

function updateScoreboard(){

	// updates the scoreboard

	playerOne.setEl();
	playerTwo.setEl();
	playerThree.setEl();
}

function spin(){

	// animates the wheel spin and the clicker, determines the result of the spin and passes that result
	// along to the sliceHandler

	let rand = Math.floor(Math.random()*361),
		slice = ["Lose a Turn", 700, "Free Play", 650, "Bankrupt", 900, "1/2 Car1", 550, 600, "BR/M/BR", 700, "Gift", 800, 600, 700, 900, "Wild", 2500, "Bankrupt", 900, "1/2 Car2", 650, "Prize", 800];
	for (var i = 0; i < 20; i++) {
		let inc = i*curve[i]*200;
		up = window.setTimeout(flick, 0 + inc, -20);
		back = window.setTimeout(flick, 100 + inc, 0);
		down = window.setTimeout(flick, 200 + inc, -20);
		again = window.setTimeout(flick, 300 + inc, 0);	
	}
	document.getElementById("wheel2").style.transform = "rotate(" + (spun + 1080 + rand) +"deg)";
	spun += 1080 + rand;
	let landOn = Math.floor(((spun % 360) - 7)/15);
	sliceHandler(slice[landOn]);
}

function flick(degrees){

	// animates both element parts of the pointer

	document.getElementById("pointer").style.transform = "rotate("+degrees+"deg)";
	document.getElementById("inner").style.transform = "rotate("+degrees+"deg)";
}

function sliceHandler(slice) {

	// handles the unique actions each slice of the wheel requires, or, if that action isn't implemented yet,
	// emulates the base phase

	if (typeof slice === "number") {
		consonantGuess(0,slice);
	} else if (slice === "Lose a Turn") {
		playSpace.innerHTML = "Oh no! On to the next player!<br/><button id='next'>Next Player</button>";
		document.getElementById('next').addEventListener('click', nextPlayer, false);
	} else if (slice === "Bankrupt") {
		playSpace.innerHTML = "Sorry! You just lost $"+currentPlayer().cash+"!<br/><button id='next'>Next Player</button>";
		document.getElementById('next').addEventListener('click', nextPlayer, false);
		currentPlayer().cash = 0;
	} else {
		playSpace.innerHTML = "Sorry, that doesn't work yet. Try again.<br/><button id='spin'>Spin!</button><button id='vowel'>Buy a vowel!</button><button id='solve'>Solve the puzzle!</button>";
		document.getElementById('spin').addEventListener('click', spin, false);
		document.getElementById('vowel').addEventListener('click', vowelPass, false);
		document.getElementById('solve').addEventListener('click', solve, false);
	}
}

function consonantGuess(vowel=0, slice) {

	// sets the slice span, asks the user for a consonant input, and sends it to isConsonant
	// if isConsonant receives a vowel or a special character, it sends the user back to consonantGuess to try again

	if (vowel) {
		let slice = document.getElementById('slice').innerText;
		playSpace.innerHTML = vowel + "'s not a consonant! You're still playing for $<span id='slice'>"+slice+"</span> per correct guess! Please enter a consonant!<br/><input type='text' id='playInput'/>";
	} else {
		playSpace.innerHTML = "Nice spin! You're playing for $<span id='slice'>"+slice+"</span> per correct guess! Please enter a consonant!<br/><input type='text' id='playInput'/>";
	}
	document.getElementById('playInput').addEventListener('keyup', isConsonant, false);
	document.getElementById('playInput').focus();
}

function isConsonant() {

	// checks the value of the input box created by consonantGuess. If it's a consonant, it passes that value to
	// the checkLines function. If it's a vowel or a special character, it calls the consonantGuess function with a
	// vowel parameter

	let test = document.getElementById('playInput').value.slice(-1).toUpperCase();
	document.getElementById('playInput').value = "";
	if (!vowels.includes(test) && test !== test.toLowerCase()) {
		checkLines(test);
	}	else if ((vowels.includes(test) || test === test.toLowerCase()) && test !== "") {
		consonantGuess(test);
	}	else {
		consonantGuess("That");
	}
}

function vowelPass() {

	// allows a button to access vowelGuess without passing a paramater

	vowelGuess();
}

function vowelGuess(consonant=0){

	// an analog of consonantGuess, asks the user for vowel input, and sends it to isVowel
	// if isVowel receives a consonant or a special character, it sends the user back to vowelGuess to try again


	if (consonant) {
		playSpace.innerHTML = consonant + "'s not a vowel! Please enter a vowel!<br/><input type='text' id='playInput'/>";
	} else {
		playSpace.innerHTML = "What vowel would you like?<br/><input type='text' id='playInput'/>";
	}
	document.getElementById('playInput').addEventListener('keyup', isVowel, false);
	document.getElementById('playInput').focus();
}

function isVowel() {

	// an analog of isConsonant
	// checks the value of the input box created by vowelGuess. If it's a vowel, it passes that value to
	// the checkLines function. If it's a consonant or a special character, it calls the vowelGuess function with a
	// consonant parameter

	let test = document.getElementById('playInput').value.slice(-1).toUpperCase();
	document.getElementById('playInput').value = "";
	if (vowels.includes(test) && test !== test.toLowerCase() && test !== "") {
		buyAVowel(test);
	}	else if (!vowels.includes(test)) {
		vowelGuess(test);
	}	else {
		vowelGuess("That");
	}
}

function buyAVowel(test) {

	// charges the player for buying a vowel and then passes their vowel to checkLines

	currentPlayer().cash -= 250;
	checkLines(test);
}

function checkLines(char) {

	// if the user's character has already been tried, emulates the base phase. else, pushes the char to the global
	// lettersTried array, iterates through the global lines array searching for the char, revealing letters found
	// on the board, and, if a consonant, then awards the player based on number found and the number in the slice
	// span. finally, if the character was found, the user is returned to the base phase. if not, the turn passes to
	// the next player

	if (lettersTried.includes(char)) {
		playSpace.innerHTML = "Sorry, "+char+"'s already been guessed. Try again.<br/><button id='spin'>Spin!</button><button id='vowel'>Buy a vowel!</button><button id='solve'>Solve the puzzle!</button>";
		document.getElementById('spin').addEventListener('click', spin, false);
		document.getElementById('vowel').addEventListener('click', vowelPass, false);
		document.getElementById('solve').addEventListener('click', solve, false);
	} else {
		lettersTried.push(char);
		document.getElementById('display').innerHTML = "Letters Tried:<br/>"+lettersTried.join(' ');
		let numberCorrect = 0;
		if (vowels.includes(char)) {
			slice = 0;
		} else {
			slice = parseInt(document.getElementById('slice').innerText);
		}
		for (var i = 0; i < lines.length; i++) {
			for (var j = 0; j < lines[i].length; j++) {
				if (char === lines[i][j]) {
					document.getElementById("letter"+((i*14)+j)).innerText = char;
					currentPlayer().cash += slice;
					numberCorrect++;
				}
			}
		}
		if (numberCorrect === 0) {
			playSpace.innerHTML = "Sorry, no "+char+"'s.<br/><button id='next'>Next Player</button>";
			document.getElementById('next').addEventListener('click', nextPlayer, false);
			document.getElementById('next').focus();
		} else if (!vowels.includes(char)) {
			playSpace.innerHTML = "Yes, there are "+numberCorrect+" "+char+"'s, so you get $"+numberCorrect*slice+"!<br><button id='next'>Next</button>";
			document.getElementById('next').addEventListener('click', basePhase, false);
			document.getElementById('next').focus();
		} else {
			playSpace.innerHTML = "Yes, there are "+numberCorrect+" "+char+"'s!<br><button id='next'>Next</button>";
			document.getElementById('next').addEventListener('click', basePhase, false);

		}
	}
}

function solve() {

	// prompts user for their final guess, then passes that to the finalGuess function
	// support should be added so that finalGuess() runs on an enter keypress

	playSpace.innerHTML = "Make your final guess!<br/><input type='text' id='playInput'/><br/><button id='submit'>Submit</button>";
	document.getElementById('playInput').focus();
	document.getElementById('submit').addEventListener('click', finalGuess, false);
}

function finalGuess(){

	// if the guess input value is the same as the phrase, iterates through the phrase, passing each character to
	// checkChars on each line, then congratulates the user and resets the lettersTried display. else, play passes
	// to the next player
	// multi-round support should be implemented here

	if (document.getElementById('playInput').value.toUpperCase() === phrase){
		for (var i = 0; i < phrase.length; i++) {
			checkChars(phrase[i], lines[0], 0);
			checkChars(phrase[i], lines[1], 14);
			checkChars(phrase[i], lines[2], 28);
			checkChars(phrase[i], lines[3], 42);
		}
		playSpace.innerHTML = "<br/><h1>Congratulations!</h1>";
		lettersTried = [];
		document.getElementById('display').innerHTML = "Letters Tried:<br/>"+lettersTried.join(' ');
	} else {
		playSpace.innerHTML = "<br/><h1>Sorry! " + document.getElementById('playInput').value.toUpperCase() + " is incorrect.</h1><br/><button id='next'>Next Player</button>";
		document.getElementById('next').addEventListener('click', nextPlayer, false);
	}
}


function nextPlayer() {

	// changes the current player, then returns the game to the base phase

	switch (currentPlayer()) {
		case playerOne:
			playerOne.currentPlayer = false;
			playerTwo.currentPlayer = true;
			playerThree.currentPlayer = false;
			break;
		case playerTwo:
			playerOne.currentPlayer = false;
			playerTwo.currentPlayer = false;
			playerThree.currentPlayer = true;
			break;
		case playerThree:
			playerOne.currentPlayer = true;
			playerTwo.currentPlayer = false;
			playerThree.currentPlayer = false;
			break;
	}
	basePhase();
}


// deprecated functionality
function setWord(){
	return words[Math.floor(Math.random()*723)].toUpperCase();
};









