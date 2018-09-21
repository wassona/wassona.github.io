const currentPage = document.location.pathname.split('/')[1].split('.')[0];

const visited = () => localStorage.getItem(currentPage);
const addVisited = (el) => visited() ? localStorage.setItem(currentPage, visited() + '|' + el) : localStorage.setItem(currentPage, el);

const modalArrays = {
  outdoors: [
    'animals',
    'catching',
    'tag',
    'together',
    'sock',
  ],
};

let modalOpen = false;

const closeModals = () => {
  modalOpen = false;
  document.querySelectorAll('.modal--active').forEach((el) => {
    el.classList.remove('modal--active');
  });
  resumeAnimations();
};

const openInfoModal = (line) => {
  closeModals();
  modalOpen = true;
  document.querySelector(`.modal--${line}`).classList.add('modal--active');
  if (line !== 'bee') {
    document.querySelector(`.notepad__line--${line}`).classList.add('notepad__line--checked');
    addVisited(line);
  }
  pauseAnimations();
}

const pauseAnimations = () => {
  document.querySelector('.main__content').classList.add('pause-animations');
};

const resumeAnimations = () => {
  if (!modalOpen){
    document.querySelector('.main__content').classList.remove('pause-animations');
  }
};

modalArrays[currentPage].forEach((line) => {
  document.querySelector(`.clickable-image--${line}`).addEventListener('click', () => openInfoModal(line));
  document.querySelector(`.clickable-image--${line}`).addEventListener('mouseenter', pauseAnimations);
  document.querySelector(`.clickable-image--${line}`).addEventListener('mouseleave', resumeAnimations);
  document.querySelector(`.notepad__line--${line}`).addEventListener('click', () => openInfoModal(line));
});

document.querySelectorAll('.close-modal').forEach((el) => {
  el.addEventListener('click', () => {
    closeModals();
  });
});

document.querySelector('.bee-button').addEventListener('click', () => openInfoModal('bee'));

if (visited()) {
  visited().split('|').forEach((el) => {
    document.querySelector(`.notepad__line--${el}`).classList.add('notepad__line--checked');
  })
}

if (!localStorage.getItem('readInstructions')) {
  document.querySelector('.bee-button').click();
  localStorage.setItem('readInstructions', 'true');
}
