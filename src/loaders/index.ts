import {Express} from 'express';
import { mongooseLoader } from './mongooseLoader';

export const mainLoader = async (expressApp : Express) => {
    try {
        // Define the loaders here...
        await mongooseLoader();
    }
    catch(err) {
        console.log(err)
    }
}