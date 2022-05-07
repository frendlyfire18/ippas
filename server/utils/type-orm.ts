import {ConnectionOptions} from "typeorm/connection/ConnectionOptions";
import {Post} from "../entities/Post";
import {User} from "../entities/User";
import {Category} from "../entities/Category";
import {Votes} from "../entities/Votes";

export default {
    "type": "mongodb",
    "url": "mongodb+srv://user:user@ippas.fgerj.mongodb.net/ippas?retryWrites=true&w=majority",
    "synchronize": true,
    "logging": true,
    "entities": [Post,User,Category,Votes]
} as ConnectionOptions;