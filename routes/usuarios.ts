import {Router, Response, Request} from 'express';
import Usuario from '../models/usuarios.model';
import bcrypt from 'bcrypt';
import {Token} from '../class/token';
import { verificarToken } from '../middlewares/authentication';
import jwt from 'jsonwebtoken';
import usuarios from '../controllers/usuarios';
import emailClass from '../class/email'




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
                id: result.id,
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

userRoutes.post('/create', async (req:Request, res:Response)=>{

    const user = {
        nombre: req.body.nombre,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        avatar: req.body.avatar
    }

    const emailEnvio = new emailClass()

    const result = await Usuario.create(user);
    const envio = await emailEnvio.enviarEmail(user.email, "Creacion cuenta", "Su cuenta se ha creado con exito", "");

    res.json({
        estado:"success",
        mensaje: result, 
        emailResult: envio
    })

    // Usuario.create(user)
    //     .then(async result=>{

    //         const emailEnvio = new emailClass()

    //         await emailEnvio.enviarEmail(req.body.email,"Creacion cuenta", "Su cuenta se ha creado con exito", "")

    //         res.json({
    //             estado:"success",
    //             mensaje: result 
    //         })
    //     })
    //     .catch(error=>{
    //         res.json({
    //             estado: "error",
    //             mensaje: error
    //         })
    //     })

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


    Usuario.findByIdAndUpdate(req.usuario.id, user,{new:true},(error, result)=>{     
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


userRoutes.get('/' , verificarToken, async (req:any, res:Response)=>{

    const usuario = req.usuario;

    const email = new emailClass();

    const emailInfo = await email.enviarEmail("ingindustrial.gu", "envio_email", "",
        "<h1> cuerpo email </h1>"
    )

    res.json({
        estado:"success",
        mensaje: usuario,
        emailInfo: emailInfo
    })
})

// userRoutes.get('/', verificarToken, usuarios.token)



export default userRoutes;