import { directive } from '../directives';

let clone      = null;
let isDragging = false;
let offset     = { x: 0, y: 0 };

let dragStartEvent = 'ontouchstart' in document.documentElement ? 'touchstart' : 'mousedown';
let dragMoveEvent  = 'ontouchmove' in document.documentElement ? 'touchmove' : 'mousemove';
let dragEndEvent   = 'ontouchend' in document.documentElement ? 'touchend' : 'mouseup';

directive('drag', (el, expression, attribute, x, component) => {
  el.addEventListener(dragStartEvent, startDrag);
});

function startDrag(event) {
  event.preventDefault();

  let el = event.target;

  // Создание копии элемента
  clone = el.cloneNode(true);

  clone.style.position        = 'fixed';
  clone.style.cursor          = 'move';
  clone.style.width           = `${el.offsetWidth}px`;
  clone.style.backgroundColor = 'rgba(241, 241, 241, 0.4)';
  clone.style.borderRadius    = '6px';
  clone.style.fontFamily      = 'inherit';
  clone.style.zIndex          = '9999';

  clone.__x_template = el.getAttribute('x-drag');

  document.body.appendChild(clone);

  // Захват начальной позиции курсора
  let clientX = event.clientX || event.touches[0].clientX;
  let clientY = event.clientY || event.touches[0].clientY;
  offset.x = clientX - el.offsetLeft;
  offset.y = clientY - el.offsetTop;

  // Перемещение элемента в соответствии с позицией курсора
  moveElement(clientX, clientY);

  // Добавление обработчиков событий перемещения и отпускания курсора
  document.addEventListener(dragMoveEvent, move);
  document.addEventListener(dragEndEvent, endDrag);

  isDragging = true;
}

function move(event) {
  event.preventDefault();

  if (isDragging) {
    let clientX = event.clientX || event.touches[0].clientX;
    let clientY = event.clientY || event.touches[0].clientY;

    // Перемещение элемента в соответствии с позицией курсора
    moveElement(clientX, clientY);
  }
}

function endDrag(event) {
  event.preventDefault();

  if (isDragging) {
    // Удаление копии элемента и очистка переменных
    document.body.removeChild(clone);

    clone      = null;
    isDragging = false;

    // Удаление обработчиков событий перемещения и отпускания курсора
    document.removeEventListener(dragMoveEvent, move);
    document.removeEventListener(dragEndEvent, endDrag);
  }
}

function moveElement(x, y) {
  clone.style.left = x - offset.x + 'px';
  clone.style.top  = y - offset.y + 'px';
}