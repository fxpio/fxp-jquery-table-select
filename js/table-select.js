/*
 * This file is part of the Sonatra package.
 *
 * (c) François Pluchino <francois.pluchino@sonatra.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

+function ($) {
    'use strict';

    // TABLE SELECT CLASS DEFINITION
    // =============================

    /**
     * @constructor
     *
     * @param htmlString|Element|Array|jQuery element
     * @param Array                           options
     *
     * @this
     */
    var TableSelect = function (element, options) {
        this.guid         = jQuery.guid;
        this.options      = $.extend({}, TableSelect.DEFAULTS, options);
        this.$element     = $(element);
        this.$wrapper     = $('[data-table-id=' + this.$element.attr('id') + ']');
        this.$count       = $(this.options.countSelector, this.$wrapper);
        this.items        = new Array();
        this.multiple     = false;
        this.maxSelection = this.options.maxSelection;
        this.allSelector  = this.options.allSelector.replace('%COL_NAME%', this.options.colSelectable);
        this.rowSelector  = this.options.rowSelector.replace('%COL_NAME%', this.options.colSelectable);

        if (this.$element.find(this.allSelector).size() > 0) {
            this.multiple = true;
        }

        this.$element
            .on('change.st.tableselect', this.allSelector, $.proxy(onAllChanged, this))
            .on('change.st.tableselect', this.rowSelector, $.proxy(onRowChanged, this))
            .on('table-pager-refreshed.st.tableselect', $.proxy(onPagerRefreshed, this))
        ;

        this.$wrapper
            .on('click.st.tableselect', this.options.clearSelector, $.proxy(onClearAllSelection, this))
        ;

        this.refresh();
    };

    /**
     * Defaults options.
     *
     * @type Array
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
     * @param string item The item id
     *
     * @return Boolean
     *
     * @this
     */
    TableSelect.prototype.has = function (item) {
        return $.inArray(item, this.items) >= 0;
    };

    /**
     * Adds item.
     *
     * @param string|Array item The item id or the list of item id
     *
     * @this
     */
    TableSelect.prototype.add = function (item) {
        if (typeof item === 'string') {
            item = new Array(item);
        }

        for (var index in item) {
            var id = isNaN(item[index]) ? item[index] : item[index];

            if (!this.multiple) {
                this.items = new Array(id);
                break;
            }

            if (this.maxSelection > 0 && this.count() >= this.maxSelection) {
                var event = $.Event('table-select-max-selection', {'tableSelect': this});
                this.$element.trigger(event);
                break;
            }

            if (!this.has(id)) {
                this.items.push(id);
            }
        }

        this.items.sort(function(a,b){return a - b});
        this.refresh();
    };

    /**
     * Removes item.
     *
     * @param string|Array item The item id or the list of item id
     *
     * @this
     */
    TableSelect.prototype.remove = function (item) {
        if (typeof item === 'string') {
            item = new Array(item);
        }

        for (var index in item) {
            var id = isNaN(item[index]) ? item[index] : item[index];

            if (!this.multiple) {
                this.items = new Array();
                break;
            }

            var pos = $.inArray(id, this.items);

            if (pos > -1) {
                this.items.splice(pos, 1);
            }
        }

        this.refresh();
    };

    /**
     * Adds all item ids in DOM table.
     *
     * @this
     */
    TableSelect.prototype.all = function () {
        var $items = this.$element.find('> tbody > tr');
        var ids = new Array();

        for (var i = 0; i < $items.size(); i++) {
            var id = $items.eq(i).attr('data-row-id');

            if (undefined != id) {
                ids.push(id);
            }
        }

        this.add(ids);
    };

    /**
     * Removes all item ids in DOM table.
     *
     * @this
     */
    TableSelect.prototype.clean = function () {
        var $items = this.$element.find('> tbody > tr');
        var ids = new Array();

        for (var i = 0; i < $items.size(); i++) {
            var id = $items.eq(i).attr('data-row-id');

            if (undefined != id) {
                ids.push(id);
            }
        }

        this.remove(ids);
    };

    /**
     * Removes all items.
     *
     * @this
     */
    TableSelect.prototype.clear = function () {
        this.items = new Array();
        this.refresh();
    };

    /**
     * Get all item ids.
     *
     * @this
     */
    TableSelect.prototype.getItems = function () {
        return this.items;
    };

    /**
     * Counts items.
     *
     * @return Integer
     *
     * @this
     */
    TableSelect.prototype.count = function () {
        return this.items.length;
    };

    /**
     * Get max selection.
     *
     * @return Number
     * 
     * @this
     */
    TableSelect.prototype.getMaxSelection= function () {
        return this.maxSelection;
    };

    /**
     * Set max selection.
     *
     * @param Number max
     *
     * @this
     */
    TableSelect.prototype.setMaxSelection= function (max) {
        this.maxSelection = max;
    };

    /**
     * Refresh DOM.
     *
     * @this
     */
    TableSelect.prototype.refresh = function () {
        var event = $.Event('table-select-refreshed', {'tableSelect': this});
        var $items = this.$element.find('> tbody > tr');
        var allSelected = true;

        for (var i = 0; i < $items.size(); i++) {
            var id = $items.eq(i).attr('data-row-id');

            if (undefined != id) {
                var $checkbox = $items.eq(i).find('> ' + this.rowSelector);
                var cSelected = this.has(id);

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
        }

        this.$element.find(this.allSelector).prop('checked', allSelected);
        this.$element.trigger(event);
    };

    /**
     * Destroy instance.
     *
     * @this
     */
    TableSelect.prototype.destroy = function () {
        this.clear();
        this.refresh();
        this.$wrapper
            .off('click.st.tableselect', this.options.clearSelector, $.proxy(onClearAllSelection, this))
        ;
        this.$element
            .off('change.st.tableselect', allSelector, $.proxy(onAllChanged, this))
            .off('change.st.tableselect', rowSelector, $.proxy(onRowChanged, this))
            .off('table-pager-refreshed.st.tableselect', $.proxy(onPagerRefreshed, this))
            .$element.removeData('st.tableselect')
        ;
    };

    /**
     * Action on all selector changed.
     *
     * @param jQuery.Event event
     *
     * @this
     * @private
     */
    function onAllChanged (event) {
        if ($(event.target).is(':checked')) {
            this.all();

        } else {
            this.clean();
        }
    }

    /**
     * Action on clear all selection.
     *
     * @param jQuery.Event event
     *
     * @this
     * @private
     */
    function onClearAllSelection (event) {
        this.clear();
    }

    /**
     * Action on row selector changed.
     *
     * @param jQuery.Event event
     *
     * @this
     * @private
     */
    function onRowChanged (event) {
        var $item = $(event.target);
        var id = $item.parents('tr:first').attr('data-row-id');

        if ($item.is(':checked')) {
            this.add(id);

        } else {
            this.remove(id);
        }
    }

    /**
     * Action on pager loaded.
     *
     * @param jQuery.Event event
     *
     * @this
     * @private
     */
    function onPagerRefreshed (event) {
        this.refresh();
    }


    // TABLE SELECT PLUGIN DEFINITION
    // ==============================

    var old = $.fn.tableSelect;

    $.fn.tableSelect = function (option, _relatedTarget) {
        return this.each(function () {
            var $this   = $(this);
            var data    = $this.data('st.tableselect');
            var options = typeof option == 'object' && option;

            if (!data && option == 'destroy') {
                return;
            }

            if (!data) {
                $this.data('st.tableselect', (data = new TableSelect(this, options)));
            }

            if (typeof option == 'string') {
                data[option]();
            }
        });
    };

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
            $this.tableSelect($this.data());
        });
    });

}(jQuery);
