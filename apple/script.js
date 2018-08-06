const pathParts = document.location.pathname.split('/');
const currentPage = pathParts[pathParts.length - 1].split('.')[0];

function visited() {
  return localStorage.getItem(currentPage);
}

function addVisited(el) {
  visited() ? localStorage.setItem(currentPage, `${visited()}|${el}`) : localStorage.setItem(currentPage, el);
}

const modalArrays = {
  outdoors: [
    'animals',
    'catching',
    'tag',
    'together',
    'sock',
  ],
};

document.querySelector(`.header-nav__link--${currentPage}`).classList.add('header-nav__link--active');

let modalOpen = false;

function closeModals() {
  modalOpen = false;
  document.querySelectorAll('.modal--active').forEach(function(el) {
    el.classList.remove('modal--active');
  });
  resumeAnimations();
}

function openInfoModal(line) {
  closeModals();
  modalOpen = true;
  document.querySelector(`.modal--${line}`).classList.add('modal--active');
  if (line !== 'bee') {
    document.querySelector(`.notepad__line--${line}`).classList.add('notepad__line--checked');
    addVisited(line);
  }
  pauseAnimations();
};

function pauseAnimations() {
  document.querySelector('.main__content').classList.add('pause-animations');
};

function resumeAnimations() {
  if (!modalOpen) {
    document.querySelector('.main__content').classList.remove('pause-animations');
  }
};

modalArrays[currentPage].forEach(function(line) {
  document.querySelector(`.clickable-image--${line}`).addEventListener('click', function(){ openInfoModal(line) });
  document.querySelector(`.clickable-image--${line}`).addEventListener('mouseenter', pauseAnimations);
  document.querySelector(`.clickable-image--${line}`).addEventListener('mouseleave', resumeAnimations);
  document.querySelector(`.notepad__line--${line}`).addEventListener('click', function(){ openInfoModal(line) });
});

document.querySelectorAll('.close-modal').forEach(function(el) {
  el.addEventListener('click', function() {
    closeModals();
  });
});

document.querySelector('.bee-button').addEventListener('click', function(){ openInfoModal('bee') });

if (visited()) {
  visited().split('|').forEach(function(el) {
    document.querySelector(`.notepad__line--${el}`).classList.add('notepad__line--checked');
  });
}

if (!localStorage.getItem('readInstructions')) {
  document.querySelector('.bee-button').click();
  localStorage.setItem('readInstructions', 'true');
}
