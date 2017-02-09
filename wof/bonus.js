function bonusPlay(){
	lettersTried = [];
	word = setWord();
	phrase = setPhrase();
	lines = boardFormatter();
	let freebies = ["R","S","T","L","N","E"];
	counter = 0;
	row = 0;
	console.log(phrase);
	for (var i = 0; i < freebies.length; i++) {
		checkLines(freebies[i],lines);
	}
	bonusStateOne();	
}

function bonusStateOne(vowel=0) {
	if (vowel) {
		playSpace.innerHTML = vowel + "'s not a consonant! Please enter a consonant!<br/><input type='text' id='playInput'/>";
	} else {
		playSpace.innerHTML = "Let's play! Please enter a consonant!<br/><input type='text' id='playInput'/>";
	}
	document.getElementById('playInput').addEventListener('keyup', bonusIsConsonant, false);
	document.getElementById('playInput').focus();
}

function bonusStateTwo(char) {
	switch (counter) {
		case 0:
			consonant1 = char;
			break;
		case 1:
			consonant2 = char;
			break;
		case 2:
			consonant3 = char;
			bonusStateThree();
			break;
	}
	counter++;

}

function bonusStateThree(consonant=0) {
	if (consonant) {
		playSpace.innerHTML = consonant +  "'s not a vowel! Please enter a vowel!<br/><input type='text' id='playInput'/>";
	} else {
		playSpace.innerHTML = "Good job! Please enter a vowel!<br/><input type='text' id='playInput'/>";
	}
	document.getElementById('playInput').addEventListener('keyup', bonusIsVowel, false);
	document.getElementById('playInput').focus();
}

function bonusStateFour() {
	checkLines(consonant1,lines);
	checkLines(consonant2,lines);
	checkLines(consonant3,lines);
	checkLines(vowel1,lines);
	playSpace.innerHTML = "Make your final guess!<br/><input type='text' id='playInput'/><br/><button id='submit'>Submit</button>";
	document.getElementById('playInput').focus();
	document.getElementById('submit').addEventListener('click', finalGuess, false);
}

function bonusIsConsonant(event) {
	let test = document.getElementById('playInput').value.slice(-1).toUpperCase();
		document.getElementById('playInput').value = "";
	if (!vowels.includes(test) && test !== test.toLowerCase()) {
		bonusStateTwo(test);
	}	else if (vowels.includes(test)) {
		bonusStateOne(test);
	}	else {
		bonusStateOne(test);
	}
}

function bonusIsVowel(event) {
	console.log("vowel");
	let test = document.getElementById('playInput').value.slice(-1).toUpperCase();
	document.getElementById('playInput').value = "";
	if (vowels.includes(test) && test !== test.toLowerCase()) {
		console.log("check");
		vowel1 = test;
		bonusStateFour();
	}	else if (!vowels.includes(test)) {
		bonusStateThree(test);
	}	else {
		bonusStateThree(test);
	}
}
