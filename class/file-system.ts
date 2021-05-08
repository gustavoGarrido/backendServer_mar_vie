import { IfileUpload } from '../interfaces/file-upload';
import path from 'path';
import fs from 'fs';
import uniqid from 'uniqid'

export default class FileSystem {

    constructor(){};

    private crearCarpetaUsuario(userId:string){
        const pathUser = path.resolve(__dirname, '../uploads', userId) // Con este metodo unimos varios string para crear un path
        const pathUserTemp = pathUser+'/temp'
        console.log("ruta pathUser",pathUser)

        const existe:boolean = fs.existsSync(pathUser) //Con este metodo validamos si existe esta ruta

        if(!existe){
            fs.mkdirSync(pathUser);
            fs.mkdirSync(pathUserTemp);
        }

        return pathUserTemp
    }

    private generarNombreUnico(nombreOriginal:string):string{
        
        const nombreArr = nombreOriginal.split('.') //Crea un array separando el string por puntos
        const extencion = nombreArr[nombreArr.length-1]; //ultima posicion de arreglo
        const idUnico = uniqid();

        return `${idUnico}.${extencion}`

    }

    guardarImagenTemporar(file:IfileUpload, userId:string){

        return new Promise( (resolve,reject)=>{
            const path = this.crearCarpetaUsuario(userId) //Explicar y mostrar hasta este punto
            const nombreArchivo = this.generarNombreUnico(file.name) // Probar y explicar hasta aqui
    
            console.log("nombreUnico",nombreArchivo)
            
            //Este es un metodo nativo de fileUpload con el cual indicamos en donde queremos guardar el archivo
            file.mv(`${path}/${nombreArchivo}`, (error:any)=>{
                if(error){
                    return reject(error);
                }
                else{
                   return resolve(true);
                }
            })

        })
    }

    private obtenerImagenesEnTemp(userId:string){
        const pathTemp = path.resolve(__dirname, '../uploads', userId, 'temp');
        return fs.readdirSync(pathTemp) || [] // Lee todas las imagenes de la ruta y las almacena en un array
    }

    imagenesDeTempHaciaPost(userId:string){

        const pathUserTemp = path.resolve(__dirname, '../uploads', userId, 'temp') //Aqui están guardadas las imagenes
        const pathUserPost = path.resolve(__dirname, '../uploads', userId, 'posts')
        
        if(!fs.existsSync(pathUserTemp)){
            return []
        }

        if(!fs.existsSync(pathUserPost)){
            fs.mkdirSync(pathUserPost);
        }

        const imagenesTemp = this.obtenerImagenesEnTemp(userId);

        imagenesTemp.forEach(imagen=>{
            fs.renameSync(`${pathUserTemp}/${imagen}`, `${pathUserPost}/${imagen}`);
        })

        return imagenesTemp;

    }

    getFotoUrl(userId:string, img:string){

        const pathFoto:string = path.resolve(__dirname, '../uploads', userId, 'posts', img)

        if(fs.existsSync(pathFoto)){
            return pathFoto;
        }
        else{
            return path.resolve(__dirname, '../assets/imagen_default.jpg')
        }
    }
}