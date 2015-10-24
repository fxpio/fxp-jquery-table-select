/*
 * This file is part of the Sonatra package.
 *
 * (c) François Pluchino <francois.pluchino@sonatra.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/*global define*/
/*global jQuery*/
/*global window*/
/*global TableSelect*/

/**
 * @param {jQuery} $
 *
 * @typedef {object}      define.amd
 * @typedef {TableSelect} TableSelect
 */
(function (factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery', 'sonatra-jquery-table-pager'], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    'use strict';

    /**
     * Action on all selector changed.
     *
     * @param {jQuery.Event|Event} event
     *
     * @typedef {TableSelect} Event.data The table select instance
     *
     * @private
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
     *
     * @private
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
     *
     * @private
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
     *
     * @private
     */
    function onPagerRefreshed(event) {
        event.data.refresh();
    }

    // TABLE SELECT CLASS DEFINITION
    // =============================

    /**
     * @constructor
     *
     * @param {string|elements|object|jQuery} element
     * @param {object}                        options
     *
     * @this TableSelect
     */
    var TableSelect = function (element, options) {
        this.guid         = jQuery.guid;
        this.options      = $.extend(true, {}, TableSelect.DEFAULTS, options);
        this.$element     = $(element);
        this.$wrapper     = $('[data-table-id=' + this.$element.attr('id') + ']');
        this.$count       = $(this.options.countSelector, this.$wrapper);
        this.items        = [];
        this.multiple     = false;
        this.allSelector  = this.options.allSelector.replace('%COL_NAME%', this.options.colSelectable);
        this.rowSelector  = this.options.rowSelector.replace('%COL_NAME%', this.options.colSelectable);
        this.setMaxSelection(this.options.maxSelection);

        if (this.$element.find(this.allSelector).size() > 0) {
            this.multiple = true;
        }

        this.$element
            .on('change.st.tableselect', this.allSelector, this, onAllChanged)
            .on('change.st.tableselect', this.rowSelector, this, onRowChanged)
            .on('table-pager-refreshed.st.tableselect', null, this, onPagerRefreshed);

        this.$wrapper
            .on('click.st.tableselect', this.options.clearSelector, this, onClearAllSelection);

        this.refresh();
    },
        old;

    /**
     * Defaults options.
     *
     * @type {object}
     */
    TableSelect.DEFAULTS = {
        colSelectable: 'table-selector',
        allSelector:   'th[data-col-name=%COL_NAME%] input',
        rowSelector:   'td[data-col-name=%COL_NAME%] input',
        countSelector: '.table-select-count',
        clearSelector: '.table-select-clear',
        textSelection: '<i class="fa fa-check-circle"></i>',
        maxSelection:  0
    };

    /**
     * Check if item is selected.
     *
     * @param {string} item The item id
     *
     * @returns {boolean}
     *
     * @this TableSelect
     */
    TableSelect.prototype.has = function (item) {
        return $.inArray(item, this.items) >= 0;
    };

    /**
     * Adds item.
     *
     * @param {string|Array} item The item id or the list of item id
     *
     * @this TableSelect
     */
    TableSelect.prototype.add = function (item) {
        var id,
            event,
            i;

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
                event = $.Event('table-select-max-selection', {'tableSelect': this});
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
    };

    /**
     * Removes item.
     *
     * @param {string|Array} item The item id or the list of item id
     *
     * @this TableSelect
     */
    TableSelect.prototype.remove = function (item) {
        var id,
            pos,
            i;

        if (typeof item === 'string') {
            item = [item];
        }

        for (i = 0; i < item.length; i += 1) {
            id = item[i];

            if (!this.multiple) {
                this.items = [];
                break;
            }

            pos = $.inArray(id, this.items);

            if (pos > -1) {
                this.items.splice(pos, 1);
            }
        }

        this.refresh();
    };

    /**
     * Adds all item ids in DOM table.
     *
     * @this TableSelect
     */
    TableSelect.prototype.all = function () {
        var $items = this.$element.find('> tbody > tr'),
            ids = [],
            id,
            i;

        for (i = 0; i < $items.size(); i += 1) {
            id = $items.eq(i).attr('data-row-id');

            if (undefined !== id) {
                ids.push(id);
            }
        }

        this.add(ids);
    };

    /**
     * Removes all item ids in DOM table.
     *
     * @this TableSelect
     */
    TableSelect.prototype.clean = function () {
        var $items = this.$element.find('> tbody > tr'),
            ids = [],
            id,
            i;

        for (i = 0; i < $items.size(); i += 1) {
            id = $items.eq(i).attr('data-row-id');

            if (undefined !== id) {
                ids.push(id);
            }
        }

        this.remove(ids);
    };

    /**
     * Removes all items.
     *
     * @this TableSelect
     */
    TableSelect.prototype.clear = function () {
        this.items = [];
        this.refresh();
    };

    /**
     * Get all item ids.
     *
     * @returns Array
     *
     * @this TableSelect
     */
    TableSelect.prototype.getItems = function () {
        return this.items;
    };

    /**
     * Counts items.
     *
     * @returns {number}
     *
     * @this TableSelect
     */
    TableSelect.prototype.count = function () {
        return this.getItems().length;
    };

    /**
     * Get max selection.
     *
     * @returns {number}
     * 
     * @this TableSelect
     */
    TableSelect.prototype.getMaxSelection = function () {
        return this.maxSelection;
    };

    /**
     * Set max selection.
     *
     * @param {number} max
     *
     * @this TableSelect
     */
    TableSelect.prototype.setMaxSelection = function (max) {
        this.maxSelection = max;
    };

    /**
     * Refresh DOM.
     *
     * @this TableSelect
     */
    TableSelect.prototype.refresh = function () {
        var event = $.Event('table-select-refreshed', {'tableSelect': this}),
            $items = this.$element.find('> tbody > tr'),
            allSelected = true,
            id,
            $checkbox,
            cSelected,
            i;

        for (i = 0; i < $items.size(); i += 1) {
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
    };

    /**
     * Destroy instance.
     *
     * @this TableSelect
     */
    TableSelect.prototype.destroy = function () {
        this.clear();
        this.refresh();
        this.$wrapper
            .off('click.st.tableselect', this.options.clearSelector, onClearAllSelection);
        this.$element
            .off('change.st.tableselect', this.options.allSelector, onAllChanged)
            .off('change.st.tableselect', this.options.rowSelector, onRowChanged)
            .off('table-pager-refreshed.st.tableselect', onPagerRefreshed)
            .removeData('st.tableselect');
    };


    // TABLE SELECT PLUGIN DEFINITION
    // ==============================

    function Plugin(option, value) {
        var ret;

        this.each(function () {
            var $this   = $(this),
                data    = $this.data('st.tableselect'),
                options = typeof option === 'object' && option;

            if (!data && option === 'destroy') {
                return;
            }

            if (!data) {
                data = new TableSelect(this, options);
                $this.data('st.tableselect', data);
            }

            if (typeof option === 'string') {
                ret = data[option](value);
            }
        });

        return undefined === ret ? this : ret;
    }

    old = $.fn.tableSelect;

    $.fn.tableSelect             = Plugin;
    $.fn.tableSelect.Constructor = TableSelect;


    // TABLE SELECT NO CONFLICT
    // ========================

    $.fn.tableSelect.noConflict = function () {
        $.fn.tableSelect = old;

        return this;
    };


    // TABLE SELECT DATA-API
    // =====================

    $(window).on('load', function () {
        $('[data-table-select="true"]').each(function () {
            var $this = $(this);
            Plugin.call($this, $this.data());
        });
    });

}));
