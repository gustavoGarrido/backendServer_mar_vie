import {Router, Request, Response} from 'express';

export = {
    token: (req:any, res:Response, next:any)=>{
        const usuario = req.usuario;

        res.json({
            estado:"success",
            mensaje: usuario
        })

        next()
    }
}
