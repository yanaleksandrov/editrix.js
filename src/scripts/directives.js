import { editrix } from '../scripts/index';

const prefix = 'x-';

export function directive(name, callback) {
  name = `${prefix}${name}`;
  if (!editrix.directives[name]) {
    editrix.directives[name] = callback;
  } else {
    console.warn(`X.js: directive '${name}' is already exists.`);
  }
}
