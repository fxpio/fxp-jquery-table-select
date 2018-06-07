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
export function onAllChanged(event) {
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
export function onRowChanged(event) {
    let $item = $(event.target),
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
export function onClearAllSelection(event) {
    event.data.clear();
}

/**
 * Action on pager loaded.
 *
 * @param {jQuery.Event|Event} event
 *
 * @typedef {TableSelect} Event.data The table select instance
 */
export function onPagerRefreshed(event) {
    event.data.refresh();
}
