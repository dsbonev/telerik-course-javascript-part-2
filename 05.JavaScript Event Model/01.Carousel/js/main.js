(function () {
  'use strict';

  function addEventListener(selector, eventType, listener) {
    document.querySelector(selector).addEventListener(eventType, listener, false);
  }

  function Carousel(itemCount) {
    this.items = [];

    for (var i = 0; i < itemCount; i += 1) {
      this.items.push(this.createItem('http://lorempixel.com/640/480/technics/' + (i + 1) + '/'));
    }
  }

  Carousel.prototype = {
    render: function (el) {
      var currentItem = this.items[0];

      currentItem.classList.add('current');

      el.appendChild(currentItem);

      for (var i = 1, length = this.items.length; i < length; i += 1) {
        el.appendChild(this.items[i]);
      }

      var prevButton = document.createElement('a');
      prevButton.id = 'previous';
      prevButton.className = 'button';
      prevButton.href = '#';
      prevButton.title = 'previous';
      el.appendChild(prevButton);
      prevButton.addEventListener('click', function (event) {
        event.preventDefault();
        this.transition(this.currentIndex, this.getPreviousIndex());
      }.bind(this), false);

      var nextButton = document.createElement('a');
      nextButton.id = 'next';
      nextButton.className = 'button';
      nextButton.href = '#';
      nextButton.title = 'next';
      el.appendChild(nextButton);
      nextButton.addEventListener('click', function (event) {
        event.preventDefault();
        this.transition(this.currentIndex, this.getNextIndex());
      }.bind(this), false);

      return this;
    },
    start: function () {
      this.currentIndex = 0;

      this.transition(this.getPreviousIndex(), this.currentIndex);
    },
    createItem: function (url) {
      var result = document.createElement('img');
      result.src = url;
      return result;
    },
    transition: function (fromIndex, toIndex) {
      var fromEl = this.items[fromIndex],
        toEl = this.items[toIndex];

      fromEl.classList.remove('current');
      toEl.classList.add('current');

      this.currentIndex = toIndex;

      this.timeout && window.clearTimeout(this.timeout);
      this.timeout = setTimeout(function () {
        this.transition(this.currentIndex, this.getNextIndex());
      }.bind(this), 3000);
    },
    getNextIndex: function () {
      return (this.currentIndex + 1) % this.items.length;
    },
    getPreviousIndex: function () {
      return this.currentIndex > 0 ?
        this.currentIndex - 1 :
        this.items.length - 1;
    }
  };

  addEventListener('form', 'submit', function (event) {
    event.preventDefault();

    var count = event.target.item_count.valueAsNumber || 2;

    if (count > 10) {
      count = 10;
    } else if (count < 2) {
      count = 2;
    }

    event.target.item_count.value = count;

    var carouselEl = document.querySelector('#carousel');
    carouselEl.innerHTML = '';

    new Carousel(count)
      .render(carouselEl)
      .start();
  });
})();
