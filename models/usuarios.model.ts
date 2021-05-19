import {Schema, model, Document} from 'mongoose';
import bcrypt from 'bcrypt';


const usuarioSchema = new Schema<Iusuario>({

    nombre:{
        type:String,
        required:[true, "El nombre es necesario"]
    },
    email:{
        type:String,
        unique: true,
        required:[true, "El email es requerido"]
    },
    password:{
        type: String,
        required:[true, "La clave es requerida"]
    },
    avatar:{
        type:String,
        default: 'av-1.png'
    }

});

usuarioSchema.method('compararPassword', function(password:string = ""):boolean{
    if(bcrypt.compareSync(password, this.password)){
        return true
    }
    else{
        return false
    }
})

interface Iusuario extends Document {
    nombre:string,
    email:string,
    avatar:string,
    password:string,

    compararPassword(password:string):boolean

}

const Usuario = model<Iusuario>('Usuario', usuarioSchema);

export default Usuario;
