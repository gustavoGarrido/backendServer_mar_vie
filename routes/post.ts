import {Router, Response} from 'express';
import { verificarToken } from '../middlewares/authentication';
import { Post } from '../models/post.models';
import { IfileUpload } from '../interfaces/file-upload';
import FileSystem from '../class/file-system';


const fileSystem = new FileSystem();
const postRouter = Router();

postRouter.post('/', verificarToken, (req:any, res:Response)=>{
    
    let body = req.body;

    body.usuario = req.usuario.id;

    Post.create(body)
        .then(async postDb=>{

            await postDb.populate('usuario').execPopulate()
        
            res.json({
                estado:"success",
                data:postDb
            });
        })
        .catch(error =>console.log("error"))
});

postRouter.get('/', async (req:any, res:Response)=>{

    let pagina = Number(req.query.pagina) || 1;
    let ctd = Number(req.query.ctd)
    let skip = pagina -1;
    skip = skip*ctd;
    
    const post = await Post.find()
                                .sort({id:-1})
                                .skip(skip)
                                .limit(ctd)
                                .populate('usuario')
                                .exec()

    res.json({
        estado:"success",
        data:post
    })


})

postRouter.post('/upload', verificarToken, async (req:any, res:Response)=>{

    const imag:IfileUpload = req.files.imag

    if(!req.files){
        return res.status(400).json({
            estado:"error",
            mensaje: "no se subio archivo"
        })
    }
 
    const validacionTipoImagen = imag.mimetype.includes('image');

    if(!validacionTipoImagen){
        return res.status(400).json({
            estado:"error",
            mensaje: "formato incorrecto"
        })
    }

    await fileSystem.guardarImagenTemporal(req.usuario.id, imag)

   
    res.json({
        estado:"success",
        data: imag
    })

})

export default postRouter;