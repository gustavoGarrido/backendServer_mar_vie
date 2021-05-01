import { Router , Response } from 'express';
import { verificarToken } from '../middlewares/authentication';
import { Post } from '../models/post.models';
import { IfileUpload } from '../interfaces/file-upload';


const postRouter = Router();

postRouter.get('/', async (req:any, res:Response)=>{

    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1
    skip = skip * 10 //le decimos que comience a partir del registro skip ejemplo si skip es 20 nos va a devolver el registro 21
    
    const post = await Post.find()
                                .sort({_id:-1}) //Ordena de forma descendente
                                .skip(skip) //Saltar pagina 
                                .limit(10) // limitar a 10 registros por peticion
                                .populate('usuario', '-password') //Agregar propiedades del objeto usuarios
                                .exec()
   
    res.json({
        estado:"success",
        pagina: pagina,
        data: post
    })
})

postRouter.post('/', verificarToken, (req:any, res:Response)=>{

    const body = req.body;
    body.usuario = req.usuario._id

    //Primero crear el metodo create
    //Luego implementar el metodo populate

    Post.create(body)
        .then(async postDb=>{

            await postDb.populate('usuario', '-password').execPopulate();

            res.json({
                estado:"success",
                data: postDb
            })

        })
        .catch(error=>{
            res.json({error: error})
        })

})

postRouter.post('/upload', verificarToken, (req:any, res:Response)=>{
    
    if(!req.files){
        return res.status(400).json({
            estado: "error",
            mensaje: "no se subió archivo"
        })
    }

    const imagen: IfileUpload = req.files.image;

    if(!imagen){
        return res.status(400).json({
            estado: "error",
            mensaje: "error en nombre atributo imagen"
        })
    }

    if(!imagen.mimetype.includes('image')){
        return res.status(400).json({
            estado: "error",
            mensaje: "El archivo subido no es una imagen"
        })
    }

    res.json({
        estado: "success",
        data: imagen.mimetype
    })
})

export default postRouter;