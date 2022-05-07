"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.limit_with_cursor = void 0;
function limit_with_cursor(cursor, limit, array, userId) {
    const new_res = [];
    let cursor_index;
    array.map((post, value) => {
        if (cursor !== undefined) {
            if (cursor === post._id.toString())
                cursor_index = value;
            new_res.push(post);
        }
        else {
            if (value < limit)
                new_res.push(post);
        }
    });
    const res = (cursor_index - limit) < 0 ? 0 : cursor_index - limit;
    return (cursor === undefined || cursor === null) ? array.slice(array.length - limit, array.length).reverse() : new_res.slice(res, cursor_index).reverse();
}
exports.limit_with_cursor = limit_with_cursor;
//
