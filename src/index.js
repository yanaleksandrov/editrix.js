//import Sortable from 'sortablejs';

/**
 * Let's build X together. For starters, we'll import Editrix core.
 * This is the object that will expose all of Editrix public API.
 */
import { editrix } from './scripts/index';

window.editrix = editrix;

/**
 * The Directives
 *
 * Now that the core is all set up, we can register Editrix directives like x-text or
 * x-html that form the basis of how Editrix adds behavior to an app's static markup.
 */
import './scripts/directives/x-bind';
import './scripts/directives/x-html';
import './scripts/directives/x-text';
import './scripts/directives/x-show';
import './scripts/directives/x-drag';
import './scripts/directives/x-drop';
import './scripts/directives/x-cloak';

window.editrix.start();

// new Sortable(document.querySelector('#editrix-elements'), {
//   group: {
//     name: 'shared',
//     pull: 'clone',
//     put: false // Do not allow items to be put into this list
//   },
//   animation: 150,
//   sort: false // To disable sorting: set sort to false
// });
//
// new Sortable(document.querySelector('#editrix-preview'), {
//   group: 'shared',
//   animation: 150
// });