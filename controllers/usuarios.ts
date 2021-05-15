import {Router, Request, Response} from 'express';
import { IrequestExpress } from '../interfaces/requetsExpress';


export = {
    token: (req:any, res:Response, next:any)=>{
        
        const request: IrequestExpress = req;
        
        const usuario = request.usuario.id;

        console.log("request", req)

        res.json({
            estado:"success",
            mensaje: usuario
        })
    }
}
