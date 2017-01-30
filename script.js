document.querySelectorAll('.project-link').forEach(function(el){
	el.addEventListener('click', addLink, false);
});

function addLink(e){
		location = e.target.getAttribute('href');
}