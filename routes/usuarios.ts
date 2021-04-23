import {Router, Response, Request} from 'express';
import Usuario from '../models/usuarios.model';
import bcrypt from 'bcrypt';
import {Token} from '../class/token';
import { verificarToken } from '../middlewares/authentication';
import jwt from 'jsonwebtoken';




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

            const tokenJwt = Token.getToken({
                _id: result.id,
                nombre: result.nombre,
                email: result.email,
                avatar: result.avatar
            })

            return res.json({
                estado:"success",
                mensaje: "usuario encontrado",
                data: result,
                token: tokenJwt
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

userRoutes.put('/update', verificarToken, (req:any, res:Response)=>{
   
    // const user = {
    //     nombre: req.body.nombre,
    //     email: req.body.email,
    //     avatar: req.body.avatar,
    //     password: bcrypt.hashSync(req.body.password, 10)
    // }
    console.log("token",req.token)

    // console.log(req.usuario)

    let user:any = {};
    const atributos = ["nombre", "email", "avatar", "password"];

    atributos.forEach(item=>{
        if(req.body[item] != null){
            if(item == 'password'){
                user[item] = bcrypt.hashSync(req.body[item], 10)
            }
            else{
                user[item] = req.body[item]
            }
        }
    });


    Usuario.findByIdAndUpdate(req.usuario._id, user,{new:true},(error, result)=>{     
        if(error){
            throw error
        }
        if(!result){
            res.json({
                estado: "success",
                mensaje: "usuario no existe en la base"
            })
        }

        if(result){

            res.json({
                estado: "success",
                data: result,
                refreshToken: req.token
            })

        }
    })
   
})



export default userRoutes;