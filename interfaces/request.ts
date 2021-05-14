import { Request } from 'express';

export interface Irequest extends Request {
    usuario:{
        id:string,
        nombre:string,
        email:string,
        avatar:string
    }
}