import { Request } from 'express';

export interface IrequestExpress extends Request {
    usuario:{
        id:string,
        nombre:string,
        email:string,
        avatar:string
    }
}