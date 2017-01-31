
// Deal a card by randomly creating a card and verifying that is hasn't been dealt

var dealt = [];
function deal(target, optional=0){
	
	

	var check = true;
	while (check) {

		// Deal the card specified in the optional parameter

		if (optional !== 0) {
			var card = parseInt(optional, 10);
		} 
		// Create a 'card', a string between 0 and 51
		else {var card = (Math.floor(Math.random()*52));
		}
		
		// Verify that the card isn't already in the dealt array
		if (!dealt.includes(card)) {

			// Assign the 'card' a traditional card value

			var value = "" + ((card % 13) + 1);
			if (value === "11") { var value = "J"; }
			else if (value === "12") { value = "Q"; } 
			else if (value === "13") { value = "K"; }
			else if (value === "1") { value = "A"; }
			

			// Assign the card a traditional suit

			var suit = 0;
			var color = "black"
			switch(true) {
				case card < 13:
					suit = "../docs/heart.ico";
					color = "red";
					break;
				case card >= 13 && card < 26:
					suit = "../docs/spade.png";
					break;
				case card >= 26 && card < 39:
					suit = "../docs/club.png";
					break;
				case card >= 39:
					suit = "../docs/Diamond.png";
					color = "red";
					break;
				default:
					throw new Error("Bad card " + card);
				}
			
			// Offset a card based on its position in a tableau, or, if in a foundation, do not offset
			
			var depth = document.getElementById(target).childElementCount;
			
			if (target.slice(0,1) === "f") {
				var position = "absolute";
				var left = 0;
				var bottom = 0;
				var style = "style='display: none;'"
			} else {
				var position = "absolute";
				var left = 20*depth;
				var style = ""
			}
			
			// Generate an html element representation of the card

			document.getElementById(target).insertAdjacentHTML ('beforeend', "\
				<div id='" + card + "' class='card' data-suit='" + suit + "' style='position:" + position + "; left: " + left +"%;' draggable='true' ondragstart='dragstart_handler(event);'> \
					<div class='id' style='color:" + color +"'>\
						" + value + "\
					</div>\
					<img src=" + suit + " class='icon' draggable='false'>\
					<div class='id2' style='color:" + color +"'>\
						" + value + "\
					</div>\
					<div class='back' "+ style +" onclick='flip(this);'></div>\
				</div>"
			);

			// Break the while loop

			check = false;

			// Push the card to the dealt array so that future deal()'s won't generate repeat cards

			dealt.push(card);
			console.log(dealt.length + "cards dealt"); 
			
			// Make cards under the top card immovable

			cardsAbove = document.getElementById(target).children;
			for (var i = 0; i < (cardsAbove.length -1); i++) {
				cardsAbove[i].draggable = false;
				console.log(cardsAbove[i]);
			}
		}

		// If all cards are dealt, break the while loop

		else if (dealt.length === 52) {
			check = false;
			
			/* If the game uses a draw pile, this code will change the styling on the pile to indicate that it is empty.
			   Beleaguered Castle does not use a draw pile, so this code is unnecessary.

			document.getElementById("draw").style.cssText = "background-color: transparent; border-style: dashed;";
			document.getElementById("draw").innerHTML = "";

			*/
		}
	}
}

function start() {

	// Deal out the Aces
	deal("f1", "13");
	deal("f2", "26");
	deal("f3", "39");
	deal("f4", "0");

	// Deal 6 cards to each tableau

	for (var i = 0; i < 6; i++) {
		deal("t1");
		deal("t2");
		deal("t3");
		deal("t4");
		deal("t5");
		deal("t6");
		deal("t7");
		deal("t8");

	}
}

// Transfers element data to temporary storage on dragstart

function dragstart_handler(ev) {
	ev.dataTransfer.setData("text/plain", ev.target.id);
	console.log("drag start")
}

// Prevent default click effects (like activating links) while dragging

function dragover_handler(ev) {
	ev.preventDefault();
}

// Transfer element data from storage to target element

function drop_handler(ev) {
	console.log("drop start")

	ev.preventDefault();
	var data = ev.dataTransfer.getData("text");

	if (ev.target.className === "foundation" || ev.target.className === "tableau") {
		ev.target.appendChild(document.getElementById(data));
		document.getElementById(data).style.left = "0px";
	}

	// Ensure that dropped element becomes child of target, not child of another card

	var dropzone = ev.target;
	
	
	while (dropzone.className !== "foundation" && dropzone.className !== "tableau") {
	    dropzone = dropzone.parentNode;
	}

	
		/* --------------------------------------------------------------------


				The following code creates the specific rules for Beleaguered Castle.

				To allow freeplay, where cards can be placed in any stack with no restrictions,
				just use

			dropzone.appendChild(document.getElementById(data));


			----------------------------------------------------------------------- */


	// set cards to stack directly on top of each other on the foundations
	
	if (dropzone.className === "foundation") {
		if (document.getElementById(data).getAttribute("data-suit") === dropzone.firstElementChild.getAttribute("data-suit")) {
			console.log(typeof (document.getElementById(data).id - 1));
			console.log(typeof dropzone.lastElementChild.id);

			if ((document.getElementById(data).id - 1) === parseInt(dropzone.lastElementChild.id, 10)) {
				document.getElementById(data).style.left = "0px";
				
				// Append dropped element to target

				dropzone.appendChild(document.getElementById(data));
			}
		}
	}

	// set cards to offset depending on depth of stack when dropped on a tableau

	var depth = dropzone.childElementCount;
	var cardvalue = ((document.getElementById(data).id%13));
	var prevvalue = parseInt((dropzone.lastElementChild.id)%13, 10)

	if (dropzone.className === "tableau") {
		if ((((document.getElementById(data).id%13)+1)) == (parseInt((dropzone.lastElementChild.id)%13, 10))) {
			console.log("data is " + document.getElementById(data).style.left);
			document.getElementById(data).style.left = 20 * depth + "%";
			
			// Append dropped element to target

			dropzone.appendChild(document.getElementById(data));
		}
	}

	



	// Make all cards undraggable

	cards = document.getElementsByClassName("card");
	for (var i = 0; i < cards.length; i++) {
		cards[i].draggable = false;
	}

	// Make cards on top of stacks draggable

	for (var i = 1; i < 9; i++) {
		var id = "t" + i;
		document.getElementById(id).lastElementChild.draggable = true;
	}

	


}

// Modal code

function show() {
	console.log("show");
	document.getElementById("mask").style.display = "block";
}

function hide() {
	console.log("close");
	document.getElementById("mask").style.display = "none";
}

var modalTimer = window.setTimeout(show,3000);

console.log("js loaded")