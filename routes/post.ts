import {Router, Response} from 'express';
import { verificarToken } from '../middlewares/authentication';
import { Post } from '../models/post.models';

const postRouter = Router();

postRouter.post('/', verificarToken, (req:any, res:Response)=>{
    
    let body = req.body;

    body.usuario = req.usuario._id;

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
                                .sort({_id:-1})
                                .skip(skip)
                                .limit(ctd)
                                .populate('usuario')
                                .exec()

    res.json({
        estado:"success",
        data:post
    })


})

export default postRouter;