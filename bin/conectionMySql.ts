import mysql from 'mysql';

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "appCurso_mar_vie",
    port: 3306
})

// connection.connect((error)=>{
//     if(error){
//         throw error
//     }
//     else{
//         console.log(`Aplicación conectada a base de datos MySQL`)
//     }
// });

export default connection;
