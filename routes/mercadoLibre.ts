import {Router, Response} from 'express';
import mercadopago from 'mercadopago';



const mlRouter = Router();



mlRouter.post('/',(req:any,res:any)=>{


    mercadopago.configure({
        access_token: 'APP_USR-6623451607855904-111502-1f258ab308efb0fb26345a2912a3cfa5-672708410'
    });

    let preference = {
        items: [
          {
            title: req.body.title,
            unit_price: parseInt(req.body.price),
            quantity: 1,
          }
        ]
      };


      mercadopago.preferences.create(preference)
        .then(function (response) {
          res.json({link:response.body.init_point});
        }).catch(function (error) {
          console.log(error);
        });

})

export default mlRouter;

