(function () {
  'use strict';

  function createDiv() {
    var result = document.createElement('div'),
      style = result.style;

    style.width = '50px';
    style.height = '50px';

    style.backgroundColor = getRandomColor();

    style.color = getRandomColor();
    style.textAlign = 'center';

    style.position = 'absolute';
    style.top = getRandomInt(0, 75) + '%';
    style.left = getRandomInt(0, 75) + '%';

    style.borderRadius = '50%';
    style.borderColor = getRandomColor();
    style.borderWidth = '2px';
    style.borderStyle = 'solid';

    result.textContent = 'div';

    return result;
  }

  function getRandomColor() {
    return 'rgba(' + [
        getRandomInt(0, 255),
        getRandomInt(0, 255),
        getRandomInt(0, 255),
        getRandomInt(0, 255)
      ].join(', ') + ')';
  }

  function Circle(x, y, r) {
    this.x = x;
    this.y = y;
    this.radius = r;
    this.elements = [];
    this.el = document.createElement('div');

    var style = this.el.style;

    style.width =  r * 2 + 'px';
    style.height = r * 2 + 'px';

    style.position = 'absolute';
    style.top = x - r + 'px';
    style.left = y - r + 'px';

    style.borderRadius = '50%';
    style.borderColor = 'black';
    style.borderWidth = '1px';
    style.borderStyle = 'solid';
  }

  Circle.prototype = {
    constructor: Circle,
    addElement: function (el) {
      this.el.appendChild(el);
      this.elements.push(el);
      el.setAttribute('data-degrees', 0);
      return this;
    },
    moveElements: function () {
      for (var i = 0, length = this.elements.length; i < length; i += 1) {
        var element = this.elements[i],
          degrees = (parseFloat(element.getAttribute('data-degrees')) + 1) % 360;

        element.setAttribute('data-degrees', degrees);

        var x = this.radius * Math.cos(degrees * Math.PI / 180),
          y = this.radius * Math.sin(degrees * Math.PI / 180);

        element.style.left = x - parseInt(element.style.width, 10) / 2 + this.radius + 'px';
        element.style.top = y - parseInt(element.style.height, 10) / 2 + this.radius + 'px';
      }
    },
    render: function () {
      document.body.appendChild(this.el);
      return this;
    }
  };

  function Rectangle(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.perimeter = width * 2 + height * 2;
    this.elements = [];
    this.el = document.createElement('div');

    var style = this.el.style;

    style.width = width + 'px';
    style.height = height + 'px';

    style.position = 'absolute';
    style.left = x + 'px';
    style.top = y + 'px';

    style.borderColor = 'black';
    style.borderWidth = '1px';
    style.borderStyle = 'solid';
  }

  Rectangle.prototype = {
    constructor: Rectangle,
    addElement: function (el) {
      this.el.appendChild(el);
      this.elements.push(el);
      el.setAttribute('data-atPerimeter', 0);
      return this;
    },
    moveElements: function () {
      for (var i = 0, length = this.elements.length; i < length; i += 1) {
        var element = this.elements[i],
          atPerimeter = (parseFloat(element.getAttribute('data-atPerimeter')) + 1) % this.perimeter;

        element.setAttribute('data-atPerimeter', atPerimeter);

        var x, y;

        if (atPerimeter < this.width) {
          x = atPerimeter;
          y = 0;

        } else if (atPerimeter < this.width + this.height) {
          x = this.width;
          y = atPerimeter - this.width;

        } else if (atPerimeter < this.width * 2 + this.height) {
          x = this.width - (atPerimeter - this.width - this.height);
          y = this.height;

        } else if (atPerimeter < this.width * 2 + this.height * 2) {
          x = 0;
          y = this.height - (atPerimeter - this.width * 2 - this.height);

        } else {
          x = 0;
          y = 0;

        }

        element.style.left = x - parseInt(element.style.width, 10) / 2 + 'px';
        element.style.top = y - parseInt(element.style.height, 10) / 2 + 'px';
      }
    },
    render: function () {
      document.body.appendChild(this.el);
      return this;
    }
  };

  var circle = new Circle(200, 200, 100).addElement(createDiv()).render(),
    rectangle = new Rectangle(400, 100, 200, 300).addElement(createDiv()).render();

  window.requestAnimFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame;

  (function animloop() {
    window.requestAnimFrame(animloop);
    render();
  })();

  function render() {
    circle.moveElements();
    rectangle.moveElements();
  }

  document.querySelector('#add-circular').addEventListener('click', function () {
    circle.addElement(createDiv());
  });

  document.querySelector('#add-rectangular').addEventListener('click', function () {
    rectangle.addElement(createDiv());
  });

  //https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Math/random
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
})();
