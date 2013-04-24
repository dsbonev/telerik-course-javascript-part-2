(function () {
  'use strict';


  var Console = (function () {
    var outputEl = document.querySelector('output');

    function toString(obj) {
      switch (Object.prototype.toString.call(obj).slice(8,-1)) {
        case 'Undefined': return 'undefined';
        case 'Null': return 'null';
        case 'Object': var result = [];
          result.push('{');

          for (var p in obj) {
            result.push(p + ': ' + toString(obj[p]));
            result.push(', ');
          }

          if (result.slice(-1)[0] === ', ') {
            result.pop();
          }
          result.push('}');
          return result.join('');
        case 'Array': var result = [];
          result.push('[');

          obj.forEach(function (item) {
            result.push(toString(item));
            result.push(', ');
          });

          if (result.slice(-1)[0] === ', ') {
            result.pop();
          }

          result.push(']');
          return result.join('');
        case 'String':
        case 'Number':
        case 'Boolean':
        case 'Date':
        case 'Function': return obj.toString();
        default:
          if (obj instanceof HTMLElement) {
            return 'HTMLElement:' + obj.tagName.toLowerCase();
          }
      }
    };

    function appendLine(severity, message /*, formatValue1, formatValue2, ... */) {
      message = message || '';

      var el = document.createElement('div');

      el.classList.add('console-message');
      el.classList.add('severity-level-' + severity);

      var formatValues = Array.prototype.slice.call(arguments, 2);

      if (formatValues) {
        message = message.replace(/{(\d+)}/g, function (match, matchedNumber) {
          return toString(formatValues[matchedNumber]);
        });
      }

      el.textContent = message;

      outputEl.appendChild(el);
    }

    function toArray(list) {
      return Array.prototype.slice.call(list || []);
    }

    return {
      writeLine: function () {
        appendLine.apply(null, ['log'].concat(toArray(arguments)));
      },
      writeWarning: function () {
        appendLine.apply(null, ['warning'].concat(toArray(arguments)));
      },
      writeError: function () {
        appendLine.apply(null, ['error'].concat(toArray(arguments)));
      }
    };
  })();

  Console.writeLine('simple message');
  Console.writeWarning('long warning message: {0}', Array.apply(null, {length: 256}).map(function () {
    return String.fromCharCode(getRandomInt(
      'a'.charCodeAt(0),
      'z'.charCodeAt(0)
    ));
  }).join(' '));
  Console.writeError('parameterized error message: {0}, {1}, {2}',
    {},
    {k: 'v', nested: {k: 'v'}},
    [
      {k: 'v'},
      [0],
      5,
      new Number(5),
      'str',
      new String('str'),
      true,
      new Boolean(true),
      new Date,
      function a(b, c) {return b + c;},
      document.body.firstElementChild
    ]);

  //https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Math/random
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
})();
