const pathParts = document.location.pathname.split('/');
const currentPage = pathParts[pathParts.length - 1].split('.')[0] || 'index';

function visited() {
  return localStorage.getItem(currentPage);
}

function addVisited(el) {
  visited() ? localStorage.setItem(currentPage, `${visited()}|${el}`) : localStorage.setItem(currentPage, el);
}

const modalArrays = {
  index: [],
  outdoors: [
    'animals',
    'catching',
    'tag',
    'together',
    'sock',
  ],
  class: [
    'morning',
    'circle',
    'snack',
    'transitions',
    'nap',
  ],
  welcome: [
    'infants',
    'toddlers',
    'preschoolers',
  ],
  bulletin: [
    'policies',
    'calendar',
    'assessments',
    'toolkit',
    'wellness',
  ],
};

if (currentPage === 'index') {
  const header = document.querySelector('header');
  header.classList.add('header--index');
} else {
  document.querySelector(`.header-nav__link--${currentPage}`).classList.add('header-nav__link--active');
}

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

console.log('c',currentPage);

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


if (currentPage === 'welcome') {
  const header = document.querySelector('.welcome-header');
  const letters = header.innerText.split('');
  const svg = document.querySelector('.welcome-svg');
  const colors = ['#e10000', '#00a2c5', '#689f38', '#fcb614'];
  console.log(letters);
  svg.style.height = '9rem';
  svg.style.width = 9.5 * letters.length + 'rem';
  svg.setAttribute('viewBox', `0 0 ${9.5 * letters.length} 9`);

  letters.forEach(function(letter, index) {
    const pennant = document.createElementNS(svg.namespaceURI, 'polygon');
    const text = document.createElementNS(svg.namespaceURI, 'text');
    text.setAttribute('font-size', 4);
    text.setAttribute('font-weight', 900);
    // text.setAttribute('stroke', 'black');
    text.setAttribute('fill', 'white');
    text.setAttribute('x', (9.65 * index + 3.7));
    text.setAttribute('y', 5);
    text.setAttribute('text-anchor', 'middle');
    // pennant.setAttribute('width', '6.4');
    // pennant.setAttribute('height', '9');
    pennant.setAttribute('points', `
      ${9.65 * index + .5},0
      ${9.65 * index + 6.9},0
      ${9.65 * index + 6.9},9
      ${9.65 * index + 3.7},6.6
      ${9.65 * index + .5},9
      ${9.65 * index + .5},0
    `);
    pennant.setAttribute('fill', (colors[index % colors.length]));
    // pennant.setAttribute('stroke', 'black');
    // pennant.setAttribute('stroke-width', .2);
    text.appendChild(document.createTextNode(letter.toUpperCase()));
    svg.appendChild(pennant);
    svg.appendChild(text);
    header.style.fontSize = 0;
  })
}

if (currentPage === 'bulletin') {
  document.querySelectorAll('.modal-button').forEach(function(button) {
    button.addEventListener('click', function(e) {
      console.log('hey')
      console.log(button.getAttribute('href'))
      window.open(button.getAttribute('href'));
    })
  });
}
