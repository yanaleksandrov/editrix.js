import { directive } from '../directives';
import { Dragon } from '../dragon';
import dragula from 'dragula';

// directive('dropzone', (el, expression, attribute, x, component) => {
//   const dragon = new Dragon('.editrix-container');
//   console.log(dragon)
//
//   // const elements = document.querySelector('#editrix-preview');
//   // const preview  = document.querySelector('#editrix-elements');
//   // const drake    = dragula([elements, preview], {
//   //   copy: function (el, source) {
//   //     return source === document.querySelector('#editrix-elements')
//   //   },
//   //   accepts: function (el, target) {
//   //     return target !== document.querySelector('#editrix-elements')
//   //   }
//   // });
//   //
//   // drake.on('out', (el, container) => {
//   //   if (container === elements) {
//   //     el.innerHTML = getTpl('editrix-button');
//   //     el.className = 'drop-element';
//   //   }
//   // });
// });

/**
 * Gets the tpl.
 *
 * @param  {string}  element  The element
 * @return {string}  The tpl.
 */
const getTpl = (element) => {
  const tpl = {
    'editrix-text': '<h1>I am text</h1>',
    'editrix-button': '<pre>function button(name){\n return name;\n}</pre>'
  }

  return tpl[element];
}