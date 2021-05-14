import path from 'path';
import fs from 'fs';
import unidid from 'uniqid';
import { IfileUpload } from '../interfaces/file-upload';

export default class FileSystem{
    
    constructor(){}

    private crearCarpetaUsuario(userId:string){
        const pathUser = path.resolve(__dirname, '../uploads', userId);
        const pathUserTemp = pathUser+"/temp";
        console.log("ruta pathUser", pathUser);

        const existe:boolean = fs.existsSync(pathUser);

        if(!existe){
            fs.mkdirSync(pathUser);
            fs.mkdirSync(pathUserTemp);
        }

        return pathUserTemp
    }

    private generarNombreUnico(nombreOriginal:string):string{
        
        const nombreArr = nombreOriginal.split('.');  //[1,2,8]
        const extension = nombreArr[nombreArr.length-1];
        const idUnico = unidid();

        return `${idUnico}.${extension}`;

    }

    guardarImagenTemporal(userId:string, file:IfileUpload):Promise<any>{

        return new Promise((resolve,reject)=>{
            const path = this.crearCarpetaUsuario(userId);//donde la voy a guardar
            console.log("path",path)
            const nombreArchivo:string = this.generarNombreUnico(file.name); //con que nombre la voy a guardar
    
            file.mv(`${path}/${nombreArchivo}`, (error:any)=>{
                if(error){
                    return reject(error)
                }
                else{
                    return resolve(true)
                }
            })
        })
    }

    private obtenerImagenesTemp(userId:string):Array<string>{

        const pathTemp = path.resolve(__dirname, '../uploads', userId, "temp");
        return fs.readdirSync(pathTemp);

    }

    imagenesDeTempHaciaPost(userId:string):Array<string>{
        const pathUserTemp = path.resolve(__dirname, '../uploads', userId, "temp");//De donde voy a mover la imagen -- origen
        const pathUserPost = path.resolve(__dirname, '../uploads', userId, "post")// Hacia donde lo voy a mover -- destino

        if(!fs.existsSync(pathUserTemp)){
            return []
        }

        if(!fs.existsSync(pathUserPost)){
            fs.mkdirSync(pathUserPost)
        }

        const imagenesTemp:Array<string> = this.obtenerImagenesTemp(userId);

        imagenesTemp.forEach(imagenes=>{
            fs.renameSync(`${pathUserTemp}/${imagenes}` , `${pathUserPost}/${imagenes}`);
        })
        
        return imagenesTemp;
    }

}