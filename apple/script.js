var pathParts = document.location.pathname.split('/');
var currentPage = pathParts[pathParts.length - 1].split('.')[0] || 'index';

function visited() {
  if (document.cookie.includes(currentPage + "=") && !document.cookie.includes(currentPage + "=filler")) {
    return document.cookie.split(currentPage + "=")[1].split(';')[0];
  }
  return '';
}

function addVisited(el) {
  document.cookie = currentPage + "=" + visited() + el + "|";
}

var modalArrays = {
  index: [],
  outdoors: ['animals', 'catching', 'tag', 'together', 'sock'],
  class: ['morning', 'circle', 'snack', 'transitions', 'nap'],
  welcome: ['infants', 'toddlers', 'preschoolers'],
  bulletin: ['policies', 'calendar', 'assessments', 'toolkit', 'wellness']
};

if (currentPage === 'index') {
  var header = document.querySelector('header');
  header.classList.add('header--index');
} else {
  document.querySelector('.header-nav__link--' + currentPage).classList.add('header-nav__link--active');
}

var modalOpen = false;

function closeModals() {
  modalOpen = false;
  document.querySelectorAll('.modal--active').forEach(function (el) {
    el.classList.remove('modal--active');
  });
  resumeAnimations();
}

function openInfoModal(line) {
  closeModals();
  modalOpen = true;
  document.querySelector('.modal--' + line).classList.add('modal--active');
  if (line !== 'bee') {
    document.querySelector('.notepad__line--' + line).classList.add('notepad__line--checked');
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

console.log('c', currentPage);

modalArrays[currentPage].forEach(function (line) {
  document.querySelector('.clickable-image--' + line).addEventListener('click', function () {
    openInfoModal(line);
  });
  document.querySelector('.clickable-image--' + line).addEventListener('mouseenter', pauseAnimations);
  document.querySelector('.clickable-image--' + line).addEventListener('mouseleave', resumeAnimations);
  document.querySelector('.notepad__line--' + line).addEventListener('click', function () {
    openInfoModal(line);
  });
});

document.querySelectorAll('.modal').forEach(function (el) {
  el.addEventListener('click', function () {
    closeModals();
  });
});

var modalElements = ['.modal-image', '.modal-title', '.modal-body'];

modalElements.forEach(function (className) {
  var elements = document.querySelectorAll(className);
  if (elements.length) {
    elements.forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.stopPropagation();
      });
    });
  }
});

document.querySelector('.bee-button').addEventListener('click', function () {
  openInfoModal('bee');
});

if (visited()) {
  console.log(visited());
  visited().split('|').forEach(function (el) {
    console.log(el);
    if (el) {
      document.querySelector('.notepad__line--' + el).classList.add('notepad__line--checked');
    }
  });
}

if (!document.cookie.includes(currentPage + "=")) {
  document.querySelector('.bee-button').click();
  document.cookie = currentPage + "=filler";
}

// if (currentPage === 'welcome') {
//   var _header = document.querySelector('.welcome-header');
//   var letters = _header.innerText.split('');
//   var svg = document.querySelector('.welcome-svg');
//   var colors = ['#e10000', '#00a2c5', '#689f38', '#fcb614'];
//   console.log(letters);
//   svg.style.height = '9rem';
//   svg.style.width = 9.5 * letters.length + 'rem';
//   svg.setAttribute('viewBox', '0 0 ' + 9.5 * letters.length + ' 9');
//
//   letters.forEach(function (letter, index) {
//     var pennant = document.createElementNS(svg.namespaceURI, 'polygon');
//     var text = document.createElementNS(svg.namespaceURI, 'text');
//     text.setAttribute('font-size', 4);
//     text.setAttribute('font-weight', 900);
//     // text.setAttribute('stroke', 'black');
//     text.setAttribute('fill', 'white');
//     text.setAttribute('x', 9.65 * index + 3.7);
//     text.setAttribute('y', 5);
//     text.setAttribute('text-anchor', 'middle');
//     // pennant.setAttribute('width', '6.4');
//     // pennant.setAttribute('height', '9');
//     pennant.setAttribute('points', '\n      ' + (9.65 * index + .5) + ',0\n      ' + (9.65 * index + 6.9) + ',0\n      ' + (9.65 * index + 6.9) + ',9\n      ' + (9.65 * index + 3.7) + ',6.6\n      ' + (9.65 * index + .5) + ',9\n      ' + (9.65 * index + .5) + ',0\n    ');
//     pennant.setAttribute('fill', colors[index % colors.length]);
//     // pennant.setAttribute('stroke', 'black');
//     // pennant.setAttribute('stroke-width', .2);
//     text.appendChild(document.createTextNode(letter.toUpperCase()));
//     svg.appendChild(pennant);
//     svg.appendChild(text);
//     _header.style.fontSize = 0;
//   });
// }

if (currentPage === 'bulletin') {
  document.querySelectorAll('.modal-button').forEach(function (button) {
    button.addEventListener('click', function (e) {
      console.log('hey');
      console.log(button.getAttribute('href'));
      window.open(button.getAttribute('href'));
    });
  });
}
