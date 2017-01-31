// Add a zero in front of a string with an odd number of digits

function prepend0(tar) {
	tar = tar.toString();
	if (tar.length %2 === 1) {
		tar = "0" + tar;
	}
	return tar;
}

// given r, g, and b, return the complementary rgb

function getComplement(r,g,b) {
	var compR = 255 - r,
		compG = 255 - g,
		compB = 255 - b;

	return "rgb("+ compR + ","+ compG +","+ compB +")";
}

// Assign all the color values on the page

function setColors(r,g,b) {
	document.getElementById("colorBack").style.backgroundColor = "rgb("+ r + ","+ g +","+ b +")";
	document.getElementById("hexClock").style.color = getComplement(r, g, b);
	document.getElementById("r").style.borderColor = getComplement(r, g, b);
	document.getElementById("g").style.borderColor = getComplement(r, g, b);
	document.getElementById("b").style.borderColor = getComplement(r, g, b);
	document.getElementById("rgb").style.borderColor = getComplement(r, g, b);
	document.getElementById("r").style.borderColor = getComplement(r, g, b);
	document.getElementById("g").style.borderColor = getComplement(r, g, b);
	document.getElementById("b").style.borderColor = getComplement(r, g, b);
	document.getElementById("dragR").style.borderColor = getComplement(r, g, b);
	document.getElementById("dragG").style.borderColor = getComplement(r, g, b);
	document.getElementById("dragB").style.borderColor = getComplement(r, g, b);
}

// The guts of the program

function run() {

	// get the time, format it, and create time based values converted to 1-255

	var date = new Date(),
		hours = prepend0(date.getHours()),
		mins = prepend0(date.getMinutes()),
		secs = prepend0(date.getSeconds()),
		hexHours = Math.floor(10.625 * hours),
		hexMins = Math.floor(4.25 * mins),
		hexSecs = Math.floor(4.25 * secs),
		hexTime = "#" + hours + mins + secs;
	document.getElementById("hexClock").innerText = hexTime;
	
	// check the values in the DOM's R, G, and B boxes and assign colors accordingly

	var checkArray = document.getElementById("rgb").children;
	var boxes = [];
	for (var i = 0; i < checkArray.length; i++) {
		boxes[i] = checkArray[i].firstChild.id.slice(4,5);
	}
	result = boxes[0] + boxes[1] + boxes[2];
	switch (result) {
		case "RGB":
			setColors(hexHours,hexMins,hexSecs);
			break;
		case "RBG":
			setColors(hexHours,hexSecs,hexMins);
			break;
		case "GRB":
			setColors(hexMins,hexHours,hexSecs);
			break;
		case "GBR":
			setColors(hexMins,hexSecs,hexHours);
			break;
		case "BRG":
			setColors(hexSecs,hexHours,hexMins);
			break;
		case "BGR":
			setColors(hexSecs,hexMins,hexHours);
			break;
		default:
			console.log("Your order assigning switch broke.")
	}
	
	// set run() to repeat

	var t = setTimeout(run, 200);
	
}

// handle a drag event

function dragstart_handler (ev) {
	ev.dataTransfer.setData("text/plain", ev.target.id);
}

// prevent defaults on dragovers

function dragover_handler (ev) {
	ev.preventDefault();
}

// drop items in appropriate places and have the item dropped on swap to the source location

function drop_handler (ev) {
	ev.preventDefault();	
	var dropzone = ev.target;
	if (dropzone.className !== 'dropzone') {
		dropzone = dropzone.parentNode;
	}
	var data = ev.dataTransfer.getData("text");
	var dragged = document.getElementById(data);
	var dragzone = dragged.parentNode;
	var swap = dropzone.firstChild;
	dragzone.appendChild(swap);
	dropzone.appendChild(document.getElementById(data));
}

// prep the drag and drop elements to both drag and also drop

function dragPrep() {
	dropzones = document.getElementsByClassName("dropzone");
	drags = document.getElementsByClassName("drag");
	console.log(dropzones, drags);
	for (var i = 0; i < dropzones.length; i++) {
		dropzones[i].addEventListener('drop', drop_handler);
		dropzones[i].addEventListener('dragover', dragover_handler);
	}
	for (var i = 0; i < drags.length; i++) {
		drags[i].draggable = true;
		drags[i].addEventListener('dragstart', dragstart_handler);
	}
}

dragPrep();

run();
