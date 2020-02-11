const colors = [
  'red',
  'orange',
  'yellow',
  'olive',
  'green',
  'teal',
  'blue',
  'violet',
  'purple',
  'pink'
];

document.querySelectorAll('.display-modal').forEach(function(el, i){
	el.addEventListener('click', displayModal, false);
  if (el.classList.contains('sample')) {
    el.classList.add(colors[i % colors.length]);
  }
});

function displayModal(e){
	let modal = document.querySelector('#modal'),
		modalContentName = e.currentTarget.getAttribute('data-modal-content'),
		currentContent = modal.children[0],
		currentContainer = document.querySelector('#modal-' + currentContent.id);

	if (document.querySelector('#modal-content-'+ modalContentName).children[0]){
		let modalContent = document.querySelector('#modal-content-'+ modalContentName).children[0];


		modal.insertBefore(modalContent, currentContent);
		if(currentContainer) {
			currentContainer.append(currentContent);
		}
		document.querySelector('#shade').className = "close";
	} else {
		document.querySelector('#shade').className = "close";
	}

}

document.querySelectorAll('.close').forEach(function(el){
	el.addEventListener('click', hide, false);
});

function hide(e){
	if(e.currentTarget === e.target){
		document.querySelector('#shade').className = "invisible";
	}
}

