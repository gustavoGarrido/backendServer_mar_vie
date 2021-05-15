import { Schema, Document, model } from 'mongoose';

const postShema = new Schema({

    created:{
        type: Date
    },
    mensaje:{
        type:String
    },
    img:[
        {
            type:String
        }
    ],
    coords:{
        type: String
    },
    usuario:{
        type:Schema.Types.ObjectId,
        ref:'Usuario',
        require:[true, 'Debe completar el usuario']
    }
})

postShema.pre<Ipost>('save', function(next){
    this.created = new Date()  
    next();
});

interface Ipost extends Document{
    created: Date,
    mensaje: string,
    img:string[],
    coords:string,
    usuario:string
}

export const Post = model<Ipost>('Post',postShema);