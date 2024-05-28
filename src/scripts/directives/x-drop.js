import { directive } from '../directives';

let isEntered     = false;
let dragMoveEvent = 'ontouchmove' in document.documentElement ? 'touchmove' : 'mousemove';
let dragEndEvent  = 'ontouchend' in document.documentElement ? 'touchend' : 'mouseup';

directive('drop', (el, expression, attribute, x, component) => {
  document.addEventListener(dragMoveEvent, moveDrop);
  document.addEventListener(dragEndEvent, startDrop);

  el.addEventListener('mouseover', e => {
    isEntered = true;
  });

  el.addEventListener('mouseleave', e => {
    isEntered = false;
  });
});

function moveDrop(event) {
  console.log(isEntered)
  console.log(event.target.__x_template)
}

function startDrop(event) {
  console.log(event.target.__x_template)
}