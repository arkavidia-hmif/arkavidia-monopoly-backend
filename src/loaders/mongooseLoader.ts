import { env } from '@/env';
import {connect} from 'mongoose';

export const mongooseLoader = async () => {
    try{
        await connect(`mongodb://${env.db.host}/${env.db.name}`);
        return;
    }
    catch(err) {
        console.log(err)
    }
}