import {Router, Response, Request} from 'express';


const userRoutes = Router();

userRoutes.get('/prueba', (req:Request, res:Response)=>{

    res.json({
        estado: "success",
        mensaje: "ok"
    })
    
})


export default userRoutes;