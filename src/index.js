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

window.editrix.start();
