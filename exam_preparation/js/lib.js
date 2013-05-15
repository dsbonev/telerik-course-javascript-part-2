
window.Component = (function () {
  'use strict';

  function Accordion(selector) {
    this.boundingElement(document.querySelector(selector))
      .element(document.createElement('ul'))
      .items([])
      .rendered(false);
  }

  Accordion.prototype = {
    add: function (item) {
      this.items().push(item);
    },
    boundingElement: function (/* element */) {
      if (arguments.length > 0) {
        this._boundingElement = arguments[0];
        return this;

      } else {
        return this._boundingElement;

      }
    },
    element: function (/* element */) {
      if (arguments.length > 0) {
        this._element = arguments[0];
        return this;

      } else {
        return this._element;

      }
    },
    rendered: function (/* isRendered */) {
      if (arguments.length > 0) {
        this._rendered = !!arguments[0];
        return this;

      } else {
        return this._rendered;

      }
    },
    items: function () {
      if (arguments.length > 0) {
        this._items = arguments[0];
        return this;

      } else {
        return this._items;

      }
    },
    render: function () {
      this.items().forEach(function (item) {
        this.element().appendChild(item.render());
      }.bind(this));

      if (!this.rendered()) {
        this.boundingElement().appendChild(this.element());
        this.rendered(true);
      }
    },
    constructor: Accordion
  };

  function Item(title) {
    this.title(title);
    this.rendered
  }

  Item.prototype = {
    title: function (/* text */) {
      if (arguments.length > 0) {
        this._title = arguments[0];
        return this;

      } else {
        return this._title;

      }
    },
    constructor: Item
  };

  function Base() {

  }fds

  return {
    getAccordion: function (selector) {
      return new Accordion(selector);
    }
  };
})();
