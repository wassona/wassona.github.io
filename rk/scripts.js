
var levelOne = {
	kittyPlacement: [0, 1],
	robotPlacement: [4, 4],
	commandsAvailable: ["move(direction, distance)"],
	board: [['empty', 'empty', 'empty', 'empty', 'empty'], ['empty', 'empty', 'empty', 'empty', 'empty'], ['empty', 'empty', 'empty', 'empty', 'empty'], ['empty', 'empty', 'empty', 'empty', 'empty'], ['empty', 'empty', 'empty', 'empty', 'empty']]
}

var levelTwo = {
	kittyPlacement: [1, 1],
	robotPlacement: [4, 4],
	commandsAvailable: ["move(direction, distance)"],
	board: [['empty', 'empty', 'empty'], ['empty', 'empty', 'empty'], ['empty', 'empty', 'empty', 'empty', 'empty'], ["offset 2", "offset-2", "empty", "empty", "empty"], ["offset 2", "offset-2", "empty", "empty", "empty"]]
}

var levelThree = {
	kittyPlacement: [2, 2],
	robotPlacement: [4, 0],
	commandsAvailable: ["move(direction, distance)"],
	board: [['empty', 'empty', 'empty', 'empty', 'empty'], ['empty', 'mountain', 'mountain', 'mountain', 'empty'], ['empty', 'empty', 'empty', 'mountain', 'empty'], ['mountain', 'mountain', 'mountain', 'mountain', 'empty'], ['empty', 'empty', 'empty', 'empty', 'empty']]
}

var levelFour = {
	kittyPlacement: [0, 1],
	robotPlacement: [4, 4],
	commandsAvailable: ["move(direction, distance)", "jump(direction)"],
	board: [['empty', 'empty', 'empty', 'empty', 'empty'], ['empty', 'empty', 'empty', 'empty', 'empty'], ['empty', 'empty', 'empty', 'empty', 'empty'], ["river", "river", "river", "river", "river"], ["empty", "empty", "empty", "empty", "empty"]]
}

var levelFive = {
	kittyPlacement: [0, 1],
	robotPlacement: [4, 4],
	commandsAvailable: ["move(direction, distance)", "jump(direction)"],
	board: [['empty', 'empty', 'empty', 'empty', 'empty'], ["river", "river", "river", "river", "river"], ['empty', 'empty', 'empty', 'empty', 'empty'], ["river", "river", "river", "river", "river"], ["empty", "empty", "empty", "empty", "empty"]]
}

var levelSix = {
	kittyPlacement: [4, 0],
	robotPlacement: [0, 4],
	commandsAvailable: ["move(direction, distance)", "jump(direction)"],
	board: [['mountain', 'mountain', 'empty', 'empty', 'empty'], ['empty', 'empty', 'empty', 'empty', 'empty'], ['empty', 'empty', 'empty', 'empty', 'empty'], ['river', 'river', 'empty', 'empty', 'empty'], ['empty', 'mountain', 'mountain', 'empty', 'empty']]
}

var levels = [levelOne, levelTwo, levelThree, levelFour, levelFive, levelSix];

var robot = new Robot();
var kitty = new Kitty();

var myGame = new Game(levels, robot, kitty);

myGame.start();

function Game(levels, robot, kitty) {
	var game = this;
	game.levels = levels;
	game.currentLevel = 0;
	game.start = start;
	game.generateBoard = generateBoard;
	game.checkWin = checkWin;
	game.checkCommands = checkCommands;
	game.board = document.getElementsByClassName('board-container')[0];

	function start() {
		generateBoard(game.levels[3]);
		initializeListeners();
	}

	function generateBoard(level) {
		game.board.innerHTML = "";
		document.getElementsByClassName("command-input-container")[0].innerHTML = "";
		addLine();
		document.getElementsByClassName("command-list")[0].innerHTML = level.commandsAvailable.join("<br>");
		for (var i = 0; i < level.board.length; i++) {
			var row = document.createElement('div');
			row.classList.add('row');
			game.board.appendChild(row);
			generateRow(level.board[i], row);
		}

		[robot, kitty].map(function(robotOrKitty) {
			place(robotOrKitty, level);
		});

	}

	function place(robotOrKitty, level) {
		robotOrKitty.coords = level[robotOrKitty.name + "Placement"];
		var placeRow = robotOrKitty.coords[0];
		var placeColumn = robotOrKitty.coords[1];
		var robotOrKittySpan = document.createElement("span");
		robotOrKittySpan.classList.add(robotOrKitty.name);
		document.getElementsByClassName("row")[placeRow].getElementsByTagName("div")[placeColumn].append(robotOrKittySpan);
		robotOrKitty.element = robotOrKittySpan;
	}

	function generateRow(innerMapArray, row) {
		var splitString = innerMapArray[0].split(" ");
		if (splitString[0] === "offset") {
			row.classList.add("offset-" + splitString[1]);
			for (var i = 0; i < splitString.length; i++) {
				var space = document.createElement("div");
				space.classList.add("space");
				row.append(space);
			}
		}
		for (var i = splitString[1] || 0; i < innerMapArray.length; i++) {
			var tile = document.createElement('div');
			tile.classList.add("square", innerMapArray[i]);
			row.appendChild(tile);
		}
	}

	function checkWin() {
		if (robot.coords[0] === kitty.coords[0] && robot.coords[1] === kitty.coords[1]) {
			alert("You saved Bad Kitty!");
			game.currentLevel += 1;
			game.generateBoard(game.levels[game.currentLevel]);
		} else {
			alert("Try again!");
			game.generateBoard(game.levels[game.currentLevel]);
			robot.element.style.left = "0px";
			robot.element.style.top = "0px";
		}
	}
	function checkCommands() {
		var commands = document.getElementsByClassName("command");
		for (let i = 0; i < commands.length; i++) {
			if (commands[i].innerHTML) {
				setTimeout(function() {
					var fnName = commands[i].innerHTML.split('(')[0];
					var fnParams = [];
					if (fnName === "move") {
						fnParams = commands[i].innerHTML.split('(')[1].split(', ');
						fnParams[1] = parseInt(fnParams[1].slice(0, 1));
					} else {
						var directionString = commands[i].innerHTML.split('(')[1];
						fnParams[0] = directionString.substring(0, directionString.length - 1);
					}
					var fn = robot[fnName];
					if (typeof fn === "function") fn.apply(robot, fnParams);
				}, (i * 2200))
			}
		}
		setTimeout(checkWin, (commands.length * 2200))
	}

	function addLine() {
		var newLine = document.createElement("div");
		newLine.contentEditable = "true";
		newLine.classList.add("command");
		document.getElementsByClassName("command-input-container")[0].append(newLine);
		enterAddLine(newLine);
		newLine.focus();
	}

	function enterAddLine(commandDiv) {
		commandDiv.addEventListener("keypress", function(event) {
			var keyCode = event.which || event.keyCode;
			if (keyCode === 13) {
				event.preventDefault();
				addLine();
			}
		})
	}

	function initializeListeners() {
		document.getElementsByClassName('add-line')[0].addEventListener("click", addLine);
		document.getElementsByClassName('go-btn')[0].addEventListener("click", game.checkCommands);
	};

}

function Robot() {
	this.name = "robot";
	this.element,
	this.coords;

	this.move = move;
	this.jump = jump;

	function move(direction, amount, jumpAmount) {
		var jumpAmount = jumpAmount || 1;
		var currentLeft = parseInt(this.element.style["left"].split("px")[0]) || 0;
		var currentTop = parseInt(this.element.style["top"].split("px")[0]) || 0;
		switch(direction) {
			case "left":
				for (var i = this.coords[1] - jumpAmount; i > this.coords[1] - 1 - amount; i-- ) {

					var checkSquare = document.getElementsByClassName("row")[this.coords[0]].getElementsByTagName("div")[i];
					console.log(checkSquare);
					if (!checkSquare || !checkSquare.classList.contains("empty")) {
						console.log("Left", checkSquare);
						alert("Sorry");
						return;
					}
				}
				this.element.style["left"] = currentLeft - (amount * 75 + (amount * 2)) + "px";
				this.coords[1] -= amount;
				break;
			case "right":
				for (var i = this.coords[1] + jumpAmount; i < this.coords[1] + 1 + amount; i++ ) {
					var checkSquare = document.getElementsByClassName("row")[this.coords[0]].getElementsByTagName("div")[i];
					console.log(checkSquare)
					if (!checkSquare || !checkSquare.classList.contains("empty")) {
						console.log(checkSquare)
						alert("Sorry");
						return;
						break;
					}

				}
				this.element.style["left"] = currentLeft + (amount * 75 + (amount * 2)) + "px";
				this.coords[1] += amount;
				break;
			case "up":
				for (var i = this.coords[0] - jumpAmount; i > this.coords[0] - 1 - amount; i-- ) {
					var checkRow = document.getElementsByClassName("row")[i];
					if (checkRow) {
						var checkSquare = checkRow.getElementsByTagName("div")[this.coords[1]];
							if (!checkSquare || !checkSquare.classList.contains("empty")) {
								alert("Sorry");
								return;
							}
						} else {
						errorType(checkSquare)
						return;
					}
				}
				this.element.style["top"] = currentTop - (amount * 75 + (amount * 2)) + "px";
				this.coords[0] -= amount;
				break;
			case "down":
				for (var i = this.coords[0] + jumpAmount; i < this.coords[0] + 1 + amount; i++ ) {
					var checkRow = document.getElementsByClassName("row")[i];
					if (checkRow) {
						var checkSquare = checkRow.getElementsByTagName("div")[this.coords[1]];
							if (!checkSquare || !checkSquare.classList.contains("empty")) {
								alert("Sorry");
								return;
							}
						} else {
						alert("Sorry");
						return;
					}
				}
				this.element.style["top"] = currentTop + (amount * 75 + (amount * 2)) + "px";
				this.coords[0] += amount;
				break;
		}

	}

	function jump(direction) {
		switch (direction) {
			case "left":
				var checkRow = document.getElementsByClassName("row")[this.coords[0]];
				var checkSquare = checkRow.getElementsByClassName("square")[this.coords[1] -1];
				checkSquareForMountains.apply(this, [checkSquare, "left"])
			break;
			case "right":
				var checkRow = document.getElementsByClassName("row")[this.coords[0]];
				var checkSquare = checkRow.getElementsByClassName("square")[this.coords[1] + 1];
				checkSquareForMountains.apply(this, [checkSquare, "right"])
			break;
			case "up":
				var checkRow = document.getElementsByClassName("row")[this.coords[0] -1];
				var checkSquare = checkRow.getElementsByClassName("square")[this.coords[1]];
				checkSquareForMountains.apply(this, [checkSquare, "up"])
			break;
			case "down":
				var checkRow = document.getElementsByClassName("row")[this.coords[0] + 1];
				var checkSquare = checkRow.getElementsByClassName("square")[this.coords[1]];
				checkSquareForMountains.apply(this, [checkSquare, "down"])
			break;
		}
	}

	function checkSquareForMountains(square, direction) {
		if (square.classList.contains("mountain")) {
			alert("I can't jump over mountains!");
		} else {
			this.move(direction, 2, 2);
		}
	}

}

function Kitty() {
	this.name = "kitty";
}
