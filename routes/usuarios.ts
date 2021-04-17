import {Router, Response, Request} from 'express';
import Usuario from '../models/usuarios.model';
import bcrypt from 'bcrypt';




const userRoutes = Router();


userRoutes.post('/login', (req:Request, res:Response)=>{

    Usuario.findOne({email: req.body.email} ,null, null, (error, result)=>{
        if(error){
            throw error
        }
        if(!result){
            return res.json({
                estado: "success",
                mensaje: "usuario no encontrado en base de datos",
                data: result
            })
        }

        if(result.compararPassword(req.body.password)){
            return res.json({
                estado:"success",
                mensaje: "usuario encontrado",
                data: result,
                token: "daksduiyauidhl45274574564f65sdfd"
            })
        }
        else{
            return res.json({
                estado: "success",
                mensaje: "usuario no encontrado en base de datos",
                data: result
            })
        }
    })

})

userRoutes.post('/create', (req:Request, res:Response)=>{

    const user = {
        nombre: req.body.nombre,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        avatar: req.body.avatar
    }

    Usuario.create(user)
        .then(result=>{
            res.json({
                estado:"success",
                mensaje: result 
            })
        })
        .catch(error=>{
            res.json({
                estado: "error",
                mensaje: error
            })
        })

})


export default userRoutes;