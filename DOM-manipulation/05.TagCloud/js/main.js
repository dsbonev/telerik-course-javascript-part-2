(function () {
  'use strict';

  function addEventListener(selector, eventName, listener) {
    document.querySelector(selector).addEventListener(eventName, listener, false);
  }

  function createTagEl(text) {
    var result = document.createElement('span');

    result.appendChild(document.createTextNode(text));

    result.classList.add('tag');

    return result;
  }

  function TagCloud(el) {
    this.el = el;
  }

  TagCloud.prototype.setTags = function (tagText) {
    this.tagToCount = {};

    var tags = tagText.match(/"[^"]+"|[\w-]+/g) || [];

    for (var i = 0, length = tags.length; i < length; i += 1) {
      this.addTag(tags[i].toLowerCase());
    }
  };

  TagCloud.prototype.showTags = function () {
    this.el.innerHTML = '';

    var minCount = this.getMinCount(),
      maxCount = this.getMaxCount(),
      countDiff = maxCount - minCount,
      minFontSize = this.getMinFontSize(),
      maxFontSize = this.getMaxFontSize(),
      fontSizeDiff = maxFontSize - minFontSize;

    for (var tag in this.tagToCount) {
      var tagEl = createTagEl(tag),
        count = this.tagToCount[tag],
        relativeCount = (count - minCount) / countDiff,
        relativeFontSize = minFontSize + relativeCount * fontSizeDiff;

      tagEl.style.fontSize = relativeFontSize + 'px';

      this.el.appendChild(tagEl);
    }
  };

  TagCloud.prototype.addTag = function (tag) {
    var count = this.tagToCount[tag] || 0;
    count += 1;
    this.tagToCount[tag] = count;
  };

  TagCloud.prototype.getMinCount = function () {
    var result = 0;

    for (var tag in this.tagToCount) {
      var count = this.tagToCount[tag];

      if (count < result || result === 0) {
        result = count;
      }
    }

    return result;
  };

  TagCloud.prototype.getMaxCount = function () {
    var result = 0;

    for (var tag in this.tagToCount) {
      var count = this.tagToCount[tag];

      if (count > result) {
        result = count;
      }
    }

    return result;
  };

  TagCloud.prototype.getMinFontSize = function () {
    return this.minFontSize;
  };

  TagCloud.prototype.setMinFontSize = function (size) {
    this.minFontSize = size;
    return this;
  };

  TagCloud.prototype.getMaxFontSize = function () {
    return this.maxFontSize;
  };

  TagCloud.prototype.setMaxFontSize = function (size) {
    this.maxFontSize = size;
    return this;
  };

  var tagInputEl = document.querySelector('#tag-input'),
    tagCloud = new TagCloud(document.querySelector('output'));

  tagCloud.setTags(tagInputEl.value);

  addEventListener('form', 'submit', function (event) {
    event.preventDefault();
    event.stopPropagation();

    tagCloud.setTags(tagInputEl.value);
    tagCloud.showTags();
  });

  addEventListener('#min-font-size', 'change', function (event) {
    tagCloud.setMinFontSize(event.target.valueAsNumber);
    tagCloud.showTags();
  });

  tagCloud.setMinFontSize(document.querySelector('#min-font-size').valueAsNumber);

  addEventListener('#max-font-size', 'change', function (event) {
    tagCloud.setMaxFontSize(event.target.valueAsNumber);
    tagCloud.showTags();
  });

  tagCloud.setMaxFontSize(document.querySelector('#max-font-size').valueAsNumber);

  tagCloud.showTags();
})();
