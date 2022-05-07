import {Post} from "../entities/Post";
import {Votes} from "../entities/Votes";
import {MyContext} from "../utils/types";

export function limit_with_cursor(cursor: String, limit: number, array: Post[],userId:String): Post[] {
    const new_res: Post[] = [];
    let cursor_index;
    array.map((post, value) => {
        if (cursor !== undefined) {
            if (cursor === post._id.toString())
                cursor_index = value;
            new_res.push(post);
        } else {
            if (value < limit)
                new_res.push(post);
        }
    })
    const res = (cursor_index - limit)<0 ? 0 : cursor_index - limit;
    return (cursor === undefined||cursor === null) ? array.slice(array.length-limit,array.length).reverse() : new_res.slice(res,cursor_index).reverse();
}
//