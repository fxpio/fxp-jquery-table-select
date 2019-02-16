var FxpTableSelect = (function (exports, $$1) {
  'use strict';

  $$1 = $$1 && $$1.hasOwnProperty('default') ? $$1['default'] : $$1;

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _superPropBase(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = _getPrototypeOf(object);
      if (object === null) break;
    }

    return object;
  }

  function _get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
      _get = Reflect.get;
    } else {
      _get = function _get(target, property, receiver) {
        var base = _superPropBase(target, property);

        if (!base) return;
        var desc = Object.getOwnPropertyDescriptor(base, property);

        if (desc.get) {
          return desc.get.call(receiver);
        }

        return desc.value;
      };
    }

    return _get(target, property, receiver || target);
  }

  /**
   * Define the class as Jquery plugin.
   *
   * @param {String}      pluginName  The name of jquery plugin defined in $.fn
   * @param {String}      dataName    The key name of jquery data
   * @param {function}    ClassName   The class name
   * @param {boolean}     [shorthand] Check if the shorthand of jquery plugin must be added
   * @param {String|null} dataApiAttr The DOM data attribute selector name to init the jquery plugin with Data API, NULL to disable
   * @param {String}      removeName  The method name to remove the plugin data
   */

  function pluginify (pluginName, dataName, ClassName) {
    var shorthand = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var dataApiAttr = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
    var removeName = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 'destroy';
    var old = $$1.fn[pluginName];

    $$1.fn[pluginName] = function () {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var resFunc, resList;
      resList = this.each(function (i, element) {
        var $this = $$1(element),
            data = $this.data(dataName);

        if (!data) {
          data = new ClassName(element, _typeof(options) === 'object' ? options : {});
          $this.data(dataName, data);
        }

        if (typeof options === 'string' && data) {
          if (data[options]) {
            resFunc = data[options].apply(data, args);
            resFunc = resFunc !== data ? resFunc : undefined;
          } else if (data.constructor[options]) {
            resFunc = data.constructor[options].apply(data, args);
            resFunc = resFunc !== data ? resFunc : undefined;
          }

          if (options === removeName) {
            $this.removeData(dataName);
          }
        }
      });
      return 1 === resList.length && undefined !== resFunc ? resFunc : resList;
    };

    $$1.fn[pluginName].Constructor = ClassName; // Shorthand

    if (shorthand) {
      $$1[pluginName] = function (options) {
        return $$1({})[pluginName](options);
      };
    } // No conflict


    $$1.fn[pluginName].noConflict = function () {
      return $$1.fn[pluginName] = old;
    }; // Data API


    if (null !== dataApiAttr) {
      $$1(window).on('load', function () {
        $$1(dataApiAttr).each(function () {
          var $this = $$1(this);
          $$1.fn[pluginName].call($this, $this.data());
        });
      });
    }
  }

  var DEFAULT_OPTIONS = {};
  /**
   * Base class for plugin.
   */

  var BasePlugin =
  /*#__PURE__*/
  function () {
    /**
     * Constructor.
     *
     * @param {HTMLElement} element The DOM element
     * @param {object}      options The options
     */
    function BasePlugin(element) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, BasePlugin);

      this.guid = $$1.guid;
      this.options = $$1.extend(true, {}, this.constructor.defaultOptions, options);
      this.$element = $$1(element);
    }
    /**
     * Destroy the instance.
     */


    _createClass(BasePlugin, [{
      key: "destroy",
      value: function destroy() {
        var self = this;
        Object.keys(self).forEach(function (key) {
          delete self[key];
        });
      }
      /**
       * Set the default options.
       * The new values are merged with the existing values.
       *
       * @param {object} options
       */

    }], [{
      key: "defaultOptions",
      set: function set(options) {
        DEFAULT_OPTIONS[this.name] = $$1.extend(true, {}, DEFAULT_OPTIONS[this.name], options);
      }
      /**
       * Get the default options.
       *
       * @return {object}
       */
      ,
      get: function get() {
        if (undefined === DEFAULT_OPTIONS[this.name]) {
          DEFAULT_OPTIONS[this.name] = {};
        }

        return DEFAULT_OPTIONS[this.name];
      }
    }]);

    return BasePlugin;
  }();

  /*
   * This file is part of the Fxp package.
   *
   * (c) François Pluchino <francois.pluchino@gmail.com>
   *
   * For the full copyright and license information, please view the LICENSE
   * file that was distributed with this source code.
   */

  /**
   * Action on all selector changed.
   *
   * @param {jQuery.Event|Event} event
   *
   * @typedef {TableSelect} Event.data The table select instance
   */
  function onAllChanged(event) {
    if ($(event.target).is(':checked')) {
      event.data.all();
    } else {
      event.data.clean();
    }
  }
  /**
   * Action on row selector changed.
   *
   * @param {jQuery.Event|Event} event
   *
   * @typedef {TableSelect} Event.data The table select instance
   */

  function onRowChanged(event) {
    var $item = $(event.target),
        id = $item.parents('tr:first').attr('data-row-id');

    if ($item.is(':checked')) {
      event.data.add(id);
    } else {
      event.data.remove(id);
    }
  }
  /**
   * Action on clear all selection.
   *
   * @param {jQuery.Event|Event} event
   *
   * @typedef {TableSelect} Event.data The table select instance
   */

  function onClearAllSelection(event) {
    event.data.clear();
  }
  /**
   * Action on pager loaded.
   *
   * @param {jQuery.Event|Event} event
   *
   * @typedef {TableSelect} Event.data The table select instance
   */

  function onPagerRefreshed(event) {
    event.data.refresh();
  }

  /**
   * Table Select class.
   */

  var TableSelect =
  /*#__PURE__*/
  function (_BasePlugin) {
    _inherits(TableSelect, _BasePlugin);

    /**
     * Constructor.
     *
     * @param {HTMLElement} element The DOM element
     * @param {object}      options The options
     */
    function TableSelect(element) {
      var _this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, TableSelect);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(TableSelect).call(this, element, options));
      _this.$wrapper = $$1('[data-table-id=' + _this.$element.attr('id') + ']');
      _this.$count = $$1(_this.options.countSelector, _this.$wrapper);
      _this.items = [];
      _this.multiple = false;
      _this.allSelector = _this.options.allSelector.replace('%COL_NAME%', _this.options.colSelectable);
      _this.rowSelector = _this.options.rowSelector.replace('%COL_NAME%', _this.options.colSelectable);

      _this.setMaxSelection(_this.options.maxSelection);

      if (_this.$element.find(_this.allSelector).length > 0) {
        _this.multiple = true;
      }

      _this.$element.on('change.fxp.tableselect', _this.allSelector, _assertThisInitialized(_this), onAllChanged).on('change.fxp.tableselect', _this.rowSelector, _assertThisInitialized(_this), onRowChanged).on('table-pager-refreshed.fxp.tableselect', null, _assertThisInitialized(_this), onPagerRefreshed);

      _this.$wrapper.on('click.fxp.tableselect', _this.options.clearSelector, _assertThisInitialized(_this), onClearAllSelection);

      _this.refresh();

      return _this;
    }
    /**
     * Check if item is selected.
     *
     * @param {string} item The item id
     *
     * @returns {boolean}
     */


    _createClass(TableSelect, [{
      key: "has",
      value: function has(item) {
        return $$1.inArray(item, this.items) >= 0;
      }
      /**
       * Adds item.
       *
       * @param {string|Array} item The item id or the list of item id
       */

    }, {
      key: "add",
      value: function add(item) {
        var id, event, i;

        if (typeof item === 'string') {
          item = [item];
        }

        for (i = 0; i < item.length; i += 1) {
          id = item[i];

          if (!this.multiple) {
            this.items = [id];
            break;
          }

          if (this.getMaxSelection() > 0 && this.count() >= this.maxSelection) {
            event = $$1.Event('table-select-max-selection', {
              'tableSelect': this
            });
            this.$element.trigger(event);
            break;
          }

          if (!this.has(id)) {
            this.items.push(id);
          }
        }

        this.items.sort(function (a, b) {
          return a - b;
        });
        this.refresh();
      }
      /**
       * Removes item.
       *
       * @param {string|Array} item The item id or the list of item id
       */

    }, {
      key: "remove",
      value: function remove(item) {
        var id, pos, i;

        if (typeof item === 'string') {
          item = [item];
        }

        for (i = 0; i < item.length; i += 1) {
          id = item[i];

          if (!this.multiple) {
            this.items = [];
            break;
          }

          pos = $$1.inArray(id, this.items);

          if (pos > -1) {
            this.items.splice(pos, 1);
          }
        }

        this.refresh();
      }
      /**
       * Adds all item ids in DOM table.
       */

    }, {
      key: "all",
      value: function all() {
        var $items = this.$element.find('> tbody > tr'),
            ids = [],
            id,
            i;

        for (i = 0; i < $items.length; i += 1) {
          id = $items.eq(i).attr('data-row-id');

          if (undefined !== id) {
            ids.push(id);
          }
        }

        this.add(ids);
      }
      /**
       * Removes all item ids in DOM table.
       */

    }, {
      key: "clean",
      value: function clean() {
        var $items = this.$element.find('> tbody > tr'),
            ids = [],
            id,
            i;

        for (i = 0; i < $items.length; i += 1) {
          id = $items.eq(i).attr('data-row-id');

          if (undefined !== id) {
            ids.push(id);
          }
        }

        this.remove(ids);
      }
      /**
       * Removes all items.
       */

    }, {
      key: "clear",
      value: function clear() {
        this.items = [];
        this.refresh();
      }
      /**
       * Get all item ids.
       *
       * @returns Array
       */

    }, {
      key: "getItems",
      value: function getItems() {
        return this.items;
      }
      /**
       * Counts items.
       *
       * @returns {number}
       */

    }, {
      key: "count",
      value: function count() {
        return this.getItems().length;
      }
      /**
       * Get max selection.
       *
       * @returns {number}
       */

    }, {
      key: "getMaxSelection",
      value: function getMaxSelection() {
        return this.maxSelection;
      }
      /**
       * Set max selection.
       *
       * @param {number} max
       */

    }, {
      key: "setMaxSelection",
      value: function setMaxSelection(max) {
        this.maxSelection = max;
      }
      /**
       * Refresh DOM.
       */

    }, {
      key: "refresh",
      value: function refresh() {
        var event = $$1.Event('table-select-refreshed', {
          'tableSelect': this
        }),
            $items = this.$element.find('> tbody > tr'),
            allSelected = true,
            id,
            $checkbox,
            cSelected,
            i;

        for (i = 0; i < $items.length; i += 1) {
          id = $items.eq(i).attr('data-row-id');

          if (undefined !== id) {
            $checkbox = $items.eq(i).find('> ' + this.rowSelector);
            cSelected = this.has(id);

            if (allSelected && !cSelected) {
              allSelected = false;
            }

            $checkbox.prop('checked', cSelected);
          }
        }

        this.$count.empty();

        if (this.count() >= 1) {
          this.$count.text(this.count() + ' ');
          this.$count.append(this.options.textSelection);
          this.$count.removeClass('not-selection');
        } else {
          this.$count.addClass('not-selection');
        }

        this.$element.find(this.allSelector).prop('checked', allSelected);
        this.$element.trigger(event);
      }
      /**
       * Destroy the instance.
       */

    }, {
      key: "destroy",
      value: function destroy() {
        this.clear();
        this.refresh();
        this.$wrapper.off('click.fxp.tableselect', this.options.clearSelector, onClearAllSelection);
        this.$element.off('change.fxp.tableselect', this.options.allSelector, onAllChanged).off('change.fxp.tableselect', this.options.rowSelector, onRowChanged).off('table-pager-refreshed.fxp.tableselect', onPagerRefreshed);

        _get(_getPrototypeOf(TableSelect.prototype), "destroy", this).call(this);
      }
    }]);

    return TableSelect;
  }(BasePlugin);
  TableSelect.defaultOptions = {
    colSelectable: 'table-selector',
    allSelector: 'th[data-col-name=%COL_NAME%] input',
    rowSelector: 'td[data-col-name=%COL_NAME%] input',
    countSelector: '.table-select-count',
    clearSelector: '.table-select-clear',
    textSelection: '<i class="fa fa-check-circle"></i>',
    maxSelection: 0
  };
  pluginify('tableSelect', 'fxp.tableselect', TableSelect, true, '[data-table-select="true"]');

  exports.default = TableSelect;

  return exports;

}({}, jQuery));
