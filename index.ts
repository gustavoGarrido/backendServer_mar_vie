import Server from './class/server';
import userRoutes from './routes/usuarios';
import connection from './bin/conectionMySql';
import mongoose from 'mongoose';
import bodyPaser from 'body-parser';
import userSQLRoutes from './routes/userSQL';
import postRouter from './routes/post';
import fileUpload from 'express-fileupload';
import FileSystem from './class/file-system';


//Creando servidor web
const server = new Server();

server.start(()=>{
    console.log(`Servidor corriendo en puerto ${server.puerto} y en host ${server.host}`);
});


//upload
const crearFolder = new FileSystem();
crearFolder.createCarpetaUploads();
server.app.use(fileUpload());

// body parser
server.app.use(bodyPaser.urlencoded({extended:true}));
server.app.use(bodyPaser.json());


//Rutas aplicacion
server.app.use('/users', userRoutes);
server.app.use('/userSQL', userSQLRoutes);
server.app.use('/post', postRouter);

//Conexión dataBase MySQL
connection.connect((error)=>{
    if(error){
        throw error
    }
    else{
        console.log("Aplicacion conectada a base de datos MySql")
    }
})

// Conexion moongosee
mongoose.connect('mongodb://localhost:27017/appCurso_mar_vie',
                    {useNewUrlParser:true, useCreateIndex:true},
                    (error)=>{
                        if(error){
                            throw error
                        }
                        else{
                            console.log("Aplicación conectada a base de datos Mongo")
                        }
                    }

)
