import {Router, Response, Request} from 'express';
import { Irequest } from '../interfaces/request';


export = {
    token: (req:any, res: Response)=>{
        let request: Irequest = req

        const usuario = request.usuario;

        console.log(req)

        res.json({
            estado:"success",
            usuario: usuario,
            // request: req
        })
    }
}