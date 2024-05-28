import { directive } from '../directives';

let dragElement       = null;
let dragElementBounds = null;

directive('drag', (el, expression, attribute, x, component) => {
  el.draggable      = true;
  el.__x_attributes = attribute.expression

  for (let [event, callback] of Object.entries({
    'dragstart': handleDragStart,
    'dragover': handleDragOver,
    'dragleave': handleDragLeave,
    'drop': handleDrop,
    'dragend': handleDragEnd,
    'mouseover': handleMouseOver,
    'mouseleave': handleMouseOut,
  })) {
    el.addEventListener(event, callback, false);
  }

  /**
   * Drag start
   *
   * @param e
   */
  function handleDragStart(e) {
    let element = el;
    if (el.__x_attributes !== '') {
      element = document.createElement('div');

      element.classList.add('editrix-container');
      element.setAttribute('x-drag', '');

      element.draggable = true;
      element.innerHTML = getTpl(el.__x_attributes);
    }

    dragElement       = element;
    dragElementBounds = element.getBoundingClientRect();

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', element.outerHTML);

    element.classList.add('sb-dragging-start');
  }

  /**
   * Drag move
   *
   * @param e
   * @returns {boolean}
   */
  function handleDragOver(e) {
    if (e.preventDefault) {
      e.preventDefault(); // Necessary. Allows us to drop.
    }
    el.classList.add('sb-dragging-over');

    e.dataTransfer.dropEffect = 'move'; // See the section on the DataTransfer object.

    return false;
  }

  /**
   * Drag leave
   *
   * @param e
   */
  function handleDragLeave(e) {
    el.classList.remove('sb-dragging-over');
  }

  /**
   * Drag drop
   *
   * @param e
   * @returns {boolean}
   */
  function handleDrop(e) {
    if (e.stopPropagation) {
      e.stopPropagation();
    }

    if (dragElement !== null) {
      if (dragElement !== el) {
        dragElement.parentNode?.removeChild(dragElement);
        const { top } = el.getBoundingClientRect(); // Destructuring assignment for cleaner code

        el.insertAdjacentElement(dragElementBounds.top > top ? 'beforebegin' : 'afterend', dragElement);
      }
      el.classList.remove('sb-dragging-start', 'sb-dragging-over');

      dragElement.classList.remove('sb-dragging-start', 'sb-dragging-over');
    }
    return false;
  }

  /**
   * Drag end
   *
   * @param e
   */
  function handleDragEnd(e) {
    el.classList.remove('sb-dragging-start', 'sb-dragging-over');
  }

  /**
   * Mouse over to draggable element
   *
   * @param e
   */
  function handleMouseOver(e) {
    if (el.__x_attributes === '') {
      let tools = el.querySelector('.editrix-container-tools');
      if (!tools) {
        el.insertAdjacentHTML('afterbegin', `
        <ul class="editrix-container-tools">
          <li class="editrix-container-tools-item" title="Edit Container">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 256 256">
              <path d="M76 92a16 16 0 1 1-16-16 16 16 0 0 1 16 16Zm52-16a16 16 0 1 0 16 16 16 16 0 0 0-16-16Zm68 32a16 16 0 1 0-16-16 16 16 0 0 0 16 16ZM60 148a16 16 0 1 0 16 16 16 16 0 0 0-16-16Zm68 0a16 16 0 1 0 16 16 16 16 0 0 0-16-16Zm68 0a16 16 0 1 0 16 16 16 16 0 0 0-16-16Z"/>
            </svg>
          </li>
          <li class="editrix-container-tools-item" title="Delete Container">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 256 256">
              <path d="M208 192a12 12 0 0 1-17 17l-63-64-64 63a12 12 0 0 1-17-17l64-63-63-64a12 12 0 0 1 17-17l63 64 64-64a12 12 0 0 1 17 17l-64 64Z"/>
            </svg>
          </li>
        </ul>
        `);
      }
    }
  }

  /**
   * Mouse out from draggable element
   *
   * @param e
   */
  function handleMouseOut(e) {
    if (el.__x_attributes === '') {
      let tools = el.querySelector('.editrix-container-tools');
      if (tools) {
        tools.remove();
      }
    }
  }
});

/**
 * Gets the tpl.
 *
 * @param  {string}  element  The element
 * @return {string}  The tpl.
 */
const getTpl = (element) => {
  let tpl = {
    'editrix-text': '<h1>I am text</h1>',
    'editrix-button': '<button type="button">Submit Now!</button>'
  }

  return tpl[element];
}
