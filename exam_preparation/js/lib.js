
window.Component = (function () {
  'use strict';

  var extend = (function () {
    function Proxy() {}

    return function (Child, Parent, childPrototypeProps) {
      Proxy.prototype = Parent.prototype;
      Child.prototype = new Proxy();
      Child.prototype.constructor = Child;

      childPrototypeProps = childPrototypeProps || {};

      for (var prop in childPrototypeProps) {
        if (childPrototypeProps.hasOwnProperty(prop)) {
          Child.prototype[prop] = childPrototypeProps[prop];
        }
      }
    };
  })();

  function Base() {
    this.boundingElement(null)
      .element(null)
      .items([])
      .rendered(false);
  }

  extend(Base, Object, {
    add: function (title) {
      var item = new Item(title);
      this.items().push(item);
      return item;
    },
    boundingElement: function (/* element */) {
      if (arguments.length > 0) {
        this._boundingElement = arguments[0];
        return this;

      } else {
        return this._boundingElement;

      }
    },
    childrenContainerElement: function () {
      if (arguments.length > 0) {
        this._childrenContainerElement = arguments[0];
        return this;

      } else {
        return this._childrenContainerElement;

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
        item.boundingElement(this.element());
        this.childrenContainerElement().appendChild(item.render().element());
      }.bind(this));

      if (!this.rendered()) {
        this.element().appendChild(this.childrenContainerElement());
        this.boundingElement().appendChild(this.element());
        this.rendered(true);
      }

      return this;
    }
  });

  function Accordion(selector) {
    Base.apply(this, arguments);

    this.boundingElement(document.querySelector(selector))
      .element(document.createElement('div'))
      .childrenContainerElement(document.createElement('ul'));
  }

  extend(Accordion, Base);

  function Item(title) {
    Base.apply(this, arguments);

    this.element(document.createElement('li'))
      .title(title)
      .childrenContainerElement(document.createElement('ul'));
  }

  extend(Item, Base, {
    title: function (/* text */) {
      if (arguments.length > 0) {
        this._title = arguments[0];
        this.element().textContent = this.title();
        return this;

      } else {
        return this._title;

      }
    }
  });

  return {
    getAccordion: function (selector) {
      return new Accordion(selector);
    }
  };
})();
