import { getAttributes, isInputField, saferEval, isEmpty } from './utils';
import { domWalk } from './dom';

export function fetchProps(rootElement, data) {
  let fetched = [];
  domWalk(rootElement, el => {
    getAttributes(el).forEach(attribute => {
      let {modifiers, prop, name} = attribute;

      if (prop) {
        // try fetch multiple checkboxes with same prop
        if (el.type === 'checkbox' && data[prop] === undefined) {
          data[prop] = (rootElement.querySelectorAll(`[${CSS.escape(name)}]`)).length > 1 ? [] : '';
        }

        // just for input form fields
        if (isInputField(el)) {
          let modelExpression = generateExpressionForProp(el, data, prop, modifiers);

          let oldValue = data[prop] !== undefined ? data[prop] : null,
              newValue = saferEval(modelExpression, data, {'$el': el});

          data[prop] = oldValue && isEmpty( newValue ) ? oldValue : newValue;
        }
        // TODO: what we do for none input fields, like "div" etc?

        fetched.push({el, attribute});
      }
    })
  })

  return data;
}

export function generateExpressionForProp(el, data, prop, modifiers) {
  let rightSideOfExpression, tag = el.tagName.toLowerCase();
  if (el.type === 'checkbox') {
    // If the data we are binding to is an array, toggle it's value inside the array.
    if (Array.isArray(data[prop])) {
      rightSideOfExpression = `$el.checked ? ${prop}.concat([$el.value]) : [...${prop}.splice(0, ${prop}.indexOf($el.value)), ...${prop}.splice(${prop}.indexOf($el.value)+1)]`
    } else {
      rightSideOfExpression = `$el.checked`
    }
  } else if (el.type === 'radio') {
    rightSideOfExpression = `$el.checked ? $el.value : (typeof ${prop} !== 'undefined' ? ${prop} : '')`
  } else if (tag === 'select' && el.multiple) {
    rightSideOfExpression = `Array.from($el.selectedOptions).map(option => ${modifiers.includes('number')
      ? 'parseFloat(option.value || option.text)'
      : 'option.value || option.text'})`
  } else {
    rightSideOfExpression = modifiers.includes('number')
      ? 'parseFloat($el.value)'
      : (modifiers.includes('trim') ? '$el.value.trim()' : '$el.value')
  }

  // People might assume we take care of that for them, because they already set a shared "x.[prop]" attribute.
  if (!el.hasAttribute('name')) {
    el.setAttribute('name', prop)
  }

  return `$data['${prop}'] = ${rightSideOfExpression}`
}
