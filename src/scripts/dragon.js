export class Dragon {
  constructor(querySelector) {
    this.dragElement = null;

    let dragElements = document.querySelectorAll(querySelector);
    [...dragElements].forEach(element => {
      element.setAttribute('draggable', 'true');
      this.addHandlers(element, this);
    });

    return this;
  }
  handleDragStart(e, instance) {
    this.dragElement       = instance;
    this.dragElementBounds = instance.getBoundingClientRect();

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', instance.outerHTML);

    instance.classList.add('sb-dragging-start');
  }
  handleDragOver(e, instance) {
    if (e.preventDefault) {
      e.preventDefault(); // Necessary. Allows us to drop.
    }
    instance.classList.add('sb-dragging-over');

    e.dataTransfer.dropEffect = 'move'; // See the section on the DataTransfer object.

    return false;
  }
  handleDragLeave(e, instance) {
    instance.classList.remove('sb-dragging-over');
  }
  handleDrop(e, instance) {
    if (e.stopPropagation) {
      e.stopPropagation();
    }

    if (this.dragElement === null) {
      return;
    }
    // Don't do anything if dropping the same column we're dragging.
    if (this.dragElement !== instance) {
      instance.parentNode.removeChild(this.dragElement);
      //var dropHTML = e.dataTransfer.getData('text/html');
      if (this.dragElementBounds.top > instance.getBoundingClientRect().top) {
        // Move up
        instance.insertAdjacentElement('beforebegin', this.dragElement);
      } else {
        // Move down
        instance.insertAdjacentElement('afterend', this.dragElement);
      }

      this.addHandlers(instance.previousSibling, this);
    }
    instance.classList.remove('sb-dragging-start', 'sb-dragging-over');

    return false;
  }
  handleDragEnd(e, instance) {
    instance.classList.remove('sb-dragging-start', 'sb-dragging-over');
  }
  addHandlers(element, instance) {
    if (element) {
      for (let [event, callback] of Object.entries({
        'dragstart': function(event) {instance.handleDragStart(event, this)},
        'dragover': function(event) {instance.handleDragOver(event, this)},
        'dragleave': function(event) {instance.handleDragLeave(event, this)},
        'drop': function(event) {instance.handleDrop(event, this)},
        'dragend': function(event) {instance.handleDragEnd(event, this)},
      })) {
        element.addEventListener(event, callback, false);
      }
    }
  }
}