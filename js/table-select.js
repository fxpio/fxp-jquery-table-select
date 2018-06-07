/*
 * This file is part of the Fxp package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import pluginify from '@fxp/jquery-pluginify';
import BasePlugin from '@fxp/jquery-pluginify/js/plugin';
import $ from "jquery";
import {onAllChanged, onClearAllSelection, onPagerRefreshed, onRowChanged} from "./utils/events";

/**
 * Table Select class.
 */
export default class TableSelect extends BasePlugin
{
    /**
     * Constructor.
     *
     * @param {HTMLElement} element The DOM element
     * @param {object}      options The options
     */
    constructor(element, options = {}) {
        super(element, options);

        this.$wrapper    = $('[data-table-id=' + this.$element.attr('id') + ']');
        this.$count      = $(this.options.countSelector, this.$wrapper);
        this.items       = [];
        this.multiple    = false;
        this.allSelector = this.options.allSelector.replace('%COL_NAME%', this.options.colSelectable);
        this.rowSelector = this.options.rowSelector.replace('%COL_NAME%', this.options.colSelectable);
        this.setMaxSelection(this.options.maxSelection);

        if (this.$element.find(this.allSelector).length > 0) {
            this.multiple = true;
        }

        this.$element
            .on('change.fxp.tableselect', this.allSelector, this, onAllChanged)
            .on('change.fxp.tableselect', this.rowSelector, this, onRowChanged)
            .on('table-pager-refreshed.fxp.tableselect', null, this, onPagerRefreshed);

        this.$wrapper
            .on('click.fxp.tableselect', this.options.clearSelector, this, onClearAllSelection);

        this.refresh();
    }

    /**
     * Check if item is selected.
     *
     * @param {string} item The item id
     *
     * @returns {boolean}
     */
    has(item) {
        return $.inArray(item, this.items) >= 0;
    }

    /**
     * Adds item.
     *
     * @param {string|Array} item The item id or the list of item id
     */
    add(item) {
        let id,
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
    }

    /**
     * Removes item.
     *
     * @param {string|Array} item The item id or the list of item id
     */
    remove(item) {
        let id,
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
    }

    /**
     * Adds all item ids in DOM table.
     */
    all() {
        let $items = this.$element.find('> tbody > tr'),
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
    clean() {
        let $items = this.$element.find('> tbody > tr'),
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
    clear() {
        this.items = [];
        this.refresh();
    }

    /**
     * Get all item ids.
     *
     * @returns Array
     */
    getItems() {
        return this.items;
    }

    /**
     * Counts items.
     *
     * @returns {number}
     */
    count() {
        return this.getItems().length;
    }

    /**
     * Get max selection.
     *
     * @returns {number}
     */
    getMaxSelection() {
        return this.maxSelection;
    }

    /**
     * Set max selection.
     *
     * @param {number} max
     */
    setMaxSelection(max) {
        this.maxSelection = max;
    }

    /**
     * Refresh DOM.
     */
    refresh() {
        let event = $.Event('table-select-refreshed', {'tableSelect': this}),
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
    destroy() {
        this.clear();
        this.refresh();
        this.$wrapper
            .off('click.fxp.tableselect', this.options.clearSelector, onClearAllSelection);
        this.$element
            .off('change.fxp.tableselect', this.options.allSelector, onAllChanged)
            .off('change.fxp.tableselect', this.options.rowSelector, onRowChanged)
            .off('table-pager-refreshed.fxp.tableselect', onPagerRefreshed);

        super.destroy();
    }
}

/**
 * Defaults options.
 */
TableSelect.defaultOptions = {
    colSelectable: 'table-selector',
    allSelector:   'th[data-col-name=%COL_NAME%] input',
    rowSelector:   'td[data-col-name=%COL_NAME%] input',
    countSelector: '.table-select-count',
    clearSelector: '.table-select-clear',
    textSelection: '<i class="fa fa-check-circle"></i>',
    maxSelection:  0
};

pluginify('tableSelect', 'fxp.tableselect', TableSelect, true, '[data-table-select="true"]');
