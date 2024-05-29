import { directive } from '../directives';

let dragElements          = [],
    dragElement           = null,
    dragElementStartIndex = null,
    dragElementOverIndex  = null,
    dragElementBounds     = null;

let draggingStartClass  = 'editrix-dragging-start',
    draggingOverClass   = 'editrix-dragging-over',
    draggingTopClass    = 'editrix-dragging-top',
    draggingBottomClass = 'editrix-dragging-bottom';

directive('drag', (el, expression, attribute, x, component) => {
  el.draggable    = true;
  el.__x_block_id = attribute.expression

  for (let [event, callback] of Object.entries({
    'dragstart': handleDragStart,
    'dragover': handleDragOver,
    'dragleave': handleDragLeave,
    'drop': handleDrop,
    'dragend': handleDragEnd,
    'mouseenter': handleMouseEnter,
    'mouseleave': handleMouseLeave,
  })) {
    el.addEventListener(event, callback, false);
  }

  if (el.__x_block_id === '') {
    dragElements.push(el);
  }

  /**
   * Drag start
   *
   * @param e
   */
  function handleDragStart(e) {
    let element = el;
    if (el.__x_block_id !== '') {
      element = document.createElement('div');

      element.classList.add('editrix-container');
      element.setAttribute('x-drag', '');

      element.draggable    = true;
      element.innerHTML    = getTpl(el.__x_block_id);
      element.__x_block_id = '';

      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);
    }

    dragElement           = element;
    dragElementStartIndex = dragElements.indexOf(element);
    dragElementBounds     = element.getBoundingClientRect();

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', element.outerHTML);

    element.classList.add(draggingStartClass);
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
    el.classList.add(draggingOverClass);

    dragElementOverIndex = dragElements.indexOf(el);

    e.dataTransfer.dropEffect = 'move'; // See the section on the DataTransfer object.

    if (dragElementStartIndex !== null && dragElementOverIndex !== null) {
      el.classList.toggle(draggingTopClass, dragElementStartIndex > dragElementOverIndex);
      el.classList.toggle(draggingBottomClass, dragElementStartIndex < dragElementOverIndex);

      if (dragElementStartIndex === dragElementOverIndex) {
        el.classList.remove(draggingTopClass, draggingBottomClass);
      }
    }

    return false;
  }

  /**
   * Drag leave
   *
   * @param e
   */
  function handleDragLeave(e) {
    el.classList.remove(draggingOverClass, draggingTopClass, draggingBottomClass);
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
      el.classList.remove(draggingStartClass, draggingOverClass, draggingTopClass, draggingBottomClass);

      dragElement.classList.remove(draggingStartClass, draggingOverClass, draggingTopClass, draggingBottomClass);
    }
    return false;
  }

  /**
   * Drag end
   *
   * @param e
   */
  function handleDragEnd(e) {
    el.classList.remove(draggingStartClass, draggingOverClass);
  }

  /**
   * Mouse over to draggable element
   *
   * @param e
   */
  function handleMouseEnter({target}) {
    if (target.__x_block_id === '') {
      let tools = target.querySelector('.editrix-container-tools');
      if (!tools) {
        target.insertAdjacentHTML('afterbegin', `
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
  function handleMouseLeave({target}) {
    if (target.__x_block_id === '') {
      let tools = target.querySelector('.editrix-container-tools');
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
