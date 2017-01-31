document.querySelectorAll('.display-modal').forEach(function(el){
	el.addEventListener('click', displayModal, false);
});

function displayModal(e){
	let modal = document.querySelector('#modal'),
		currentContent = modal.children[0],
		modalContentName = e.currentTarget.getAttribute('modal-content'),
		modalContent = document.querySelector('#modal-content-'+ modalContentName).cloneNode(true);

	modal.insertBefore(modalContent, currentContent);
	currentContent.remove();
	document.querySelector('#shade').className = "close";

}

document.querySelectorAll('.close').forEach(function(el){
	el.addEventListener('click', hide, false);
});

function hide(e){
	if(e.currentTarget === e.target){
		document.querySelector('#shade').className = "invisible";
	}
}

