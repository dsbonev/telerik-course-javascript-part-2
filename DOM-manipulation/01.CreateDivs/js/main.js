(function () {
  'use strict';

  function createDiv() {
    var result = document.createElement('div'),
      style = result.style;

    style.width = getRandomInt(20, 100) + 'px';
    style.height = getRandomInt(20, 100) + 'px';

    style.backgroundColor = getRandomColor();

    style.color = getRandomColor();
    style.textAlign = 'center';

    style.position = 'absolute';
    style.top = getRandomInt(0, 75) + '%';
    style.left = getRandomInt(0, 75) + '%';

    style.borderRadius = getRandomInt(0, 50) + '%';
    style.borderColor = getRandomColor();
    style.borderWidth = getRandomInt(1, 20) + 'px';
    style.borderStyle = ['solid', 'dashed', 'dotted'][getRandomInt(0, 2)];

    result.appendChild(createStrong('div'));

    return result;
  }

  function createStrong(text) {
    var result = document.createElement('strong');

    result.appendChild(document.createTextNode(text));

    return result;
  }

  function getRandomColor() {
    return 'rgba(' + [
        getRandomInt(0, 255),
        getRandomInt(0, 255),
        getRandomInt(0, 255),
        getRandomInt(1, 10) / 10
      ].join(', ') + ')';
  }

  function addEventListener(selector, eventName, listener) {
    document.querySelector(selector).addEventListener(eventName, listener, false);
  }

  var timer;

  addEventListener('form', 'submit', function (event) {
    event.preventDefault();
    event.stopPropagation();

    var hasPendingJob = !!timer;

    if (hasPendingJob) {
      return;
    }

    var listTempContainer = document.createDocumentFragment(),
      divCount = event.target.querySelector('input').valueAsNumber || 5,
      resultEl = event.target.querySelector('output');

    resultEl.innerHTML = '';

    var currentCount = 0;

    timer = setInterval(function () {
      for (var i = 0; currentCount < divCount && i < 100; i += 1, currentCount += 1) {
        listTempContainer.appendChild(createDiv());
      }

      resultEl.appendChild(listTempContainer);

      var jobDone = currentCount === divCount;

      if (jobDone) {
        clearInterval(timer);
        timer = null;
      }
    }, 100);

  });

  //https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Math/random
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
})();
