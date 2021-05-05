import {Router, Response, Request, query} from 'express';
import {Token} from '../class/token';
import { verificarToken } from '../middlewares/authentication';
import jwt from 'jsonwebtoken';
import connection from '../bin/conectionMySql';
import { json } from 'body-parser';

// INSERT INTO PERSONAS(NOMBRE,APELLIDO, TIPO_DOCUMENTO, NUMERO_DOCUMENTO) VALUES()
    //INSERT INTO USUARIOS (...)VALUES(...)

    //"INSERT INTO PERSONAS(NOMBRE, APELLIDO, TIPO_DOCUMENTO, NUMERO_DOCUMENTO)VALUES('"+nombre+"','"+apellido+"','"+tipo_documento+"', '"+numero_documento+"')" //Forma diferente de agregar variables en un query

const userSQLRoutes = Router();

userSQLRoutes.post('/createUser',(req:any, res:Response)=>{

    const body = req.body;

    const nombre = body.nombre;
    const apellido = body.apellido;
    const tipo_documento = body.tipo_documento;
    const numero_documento = body.numero_documento;
    const nombre_usuario = body.nombre_usuario;
    const password = body.password;


    function query(query:string, variables:any){
        return new Promise((resolve,reject)=>{
            connection.query(query,variables,(error,result:any)=>{
                if(error){
                    return reject(error)
                }
                else{
                    return resolve(result)
                }
            })
        })
    }

    
    query("start transaction",[])
        .then(resultTransaction => 
            query("INSERT INTO PERSONAS(NOMBRE, APELLIDO, TIPO_DOCUMENTO, NUMERO_DOCUMENTO)VALUES(?,?,?,?)",[nombre, apellido, tipo_documento, numero_documento])
        )
        .then(resultPersona => 
            query("INSERT INTO USUARIOS(ID_USUARIO, NOMBRE_USUARIO,PASSWORD)VALUES(?,?,?)",[resulPersona.insertId, nombre_usuario, password])
        )
        .then(resultUsuarios =>
            query("commit",[])
        )
        .then(resultCommit => 
            res.json({estado: "success", data:resultCommit})
        )
        .catch(error=>{
            query("rollback",[])
            res.json({estado:"error", data:error})
        })

    
        // .then(resultQuery=>{
        //     query("INSERT INTO USUARIOS(ID_USUARIO, NOMBRE_USUARIO,PASSWORD)VALUES(?,?,?)",[resultQuery.insertId, nombre_usuario, password])
        // .then(resultUsuarios =>res.json({estado: "success", data:resultUsuarios}))
        // })
        // .catch(error=>res.json({estado:"error", data:error}))

        



    // connection.query("INSERT INTO PERSONAS(NOMBRE, APELLIDO, TIPO_DOCUMENTO, NUMERO_DOCUMENTO)VALUES(?,?,?,?)",[nombre, apellido, tipo_documento, numero_documento],(error,result)=>{
    //     if(error){
    //         console.log(error)
    //     }
    //     else{
    //         connection.query("INSERT INTO USUARIOS(ID_USUARIO, NOMBRE_USUARIO,PASSWORD)VALUES(?,?,?)",[result.insertId, nombre_usuario, password],(error,resultUsuarios)=>{
    //             if(error){
    //                 console.log(error)
    //             }
    //             else{
    //                 res.json({
    //                     estado:"success",
    //                     data: resultUsuarios
    //                 })
    //             }
    //         })
    //     }
    // })

})

export default userSQLRoutes;

