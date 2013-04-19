(function () {
  'use strict';

  var controls = (function () {
    //classical inheritance
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

    function toArray(list) {
      return Array.prototype.slice.call(list || []);
    }

    function BaseComponent() {
    }

    BaseComponent.prototype = {
      constructor: BaseComponent,
      getElement: function () {
        return this.el;
      },
      setElement: function (el) {
        this.el = el;
        return this;
      }
    };

    function TreeView() {
      this.setElement(document.createElement('ul'));

      this.getElement().addEventListener('click', function (event) {
        if (event.target.classList.contains('has-children')) {
          new TreeItem().setElement(event.target).toggleCollapsed();
        }
      }, false);
    }

    extend(TreeView, BaseComponent, {
      addNode: function () {
        var node = new TreeItem();
        this.getElement().appendChild(node.getElement());
        return node;
      },
      render: function (element) {
        element = element || document.body;
        element.appendChild(this.getElement());
        return this;
      }
    });

    function TreeItem(name) {
      this.setElement(document.createElement('li'));
      this.content(name);
      this.toggleCollapsed();
    }

    extend(TreeItem, BaseComponent, {
      content: function (name) {
        this.getOrCreateContentElement().textContent = name || '';
        return this;
      },
      addNode: function () {
        var node = new TreeItem();
        this.getOrCreateChildrenContainer().appendChild(node.getElement());
        this.getElement().classList.add('has-children');
        return node;
      },
      getOrCreateChildrenContainer: function () {
        var result = this.childrenContainer;

        if (!result) {
          this.childrenContainer = document.createElement('ul');
          this.getElement().appendChild(this.childrenContainer);
          result = this.childrenContainer;
        }

        return result;
      },
      getOrCreateContentElement: function () {
        var result = this.contentElement;

        if (!result) {
          this.contentElement = document.createElement('a');
          this.contentElement.href = '#';
          this.getElement().appendChild(this.contentElement);
          result = this.contentElement;
        }

        return result;
      },
      toggleCollapsed: function () {
        var isCollapsed = this.getElement().classList.toggle('collapsed');

        if (isCollapsed) {
          var collapsibleItems = toArray(this.getElement().querySelectorAll('.has-children'));

          collapsibleItems.forEach(function (item) {
            item.classList.add('collapsed');
          });
        }
      }
    });

    var treeView;

    return {
      treeView: function (renderEl) {
        treeView = new TreeView().render(document.querySelector(renderEl));
        return treeView;
      }
    };
  })();


  var treeView = controls.treeView('div.tree-view');

  var htmlNode = treeView.addNode();
  htmlNode.content('HTML');

  var cssNode = treeView.addNode();
  cssNode.content('CSS');

  var jsnode = treeView.addNode();
  jsnode.content('JavaScript');

  var js1subnode = jsnode.addNode();
  js1subnode.content('JavaScript - part 1');

  var js2subnode = jsnode.addNode();
  js2subnode.content('JavaScript - part 2');

  var jslibssubnode = jsnode.addNode();
  jslibssubnode.content('JS Libraries');

  var jqueryNode = jslibssubnode.addNode();
  jqueryNode.content('jQuery');

  var jsframeworksnode = jsnode.addNode();
  jsframeworksnode.content('JS Frameworks and UI');

  var webnode = treeView.addNode();
  webnode.content('Web');
})();
