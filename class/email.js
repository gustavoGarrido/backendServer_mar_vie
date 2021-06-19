"use strict";
exports.__esModule = true;
var nodemailer_1 = require("nodemailer");
var path_1 = require("path");
var email = /** @class */ (function () {
    function email() {
        this.host = "smtp.gmail.com";
        this.port = 587;
        this.secure = false;
        this.tsl = false;
        this.auth = {
            user: "pruebascorreoggg123456789@gmail.com",
            pass: "zpadjcrftnmkopqm"
        };
    }
    // private consultarDatos(){
    //    const datosEmail = await query("select host, post, secure, lts, user,pass from cuentas_correo ")
    //    return datosEmail //[{host: smtp.gmail.com, port: 587}]
    // }
    email.prototype.enviarEmail = function (cuentaCorreoDestion, asunto, cuerpoEmail, html) {
        var _this = this;
        if (cuerpoEmail === void 0) { cuerpoEmail = ""; }
        if (html === void 0) { html = ""; }
        return new Promise(function (resolve, reject) {
            var transporter = nodemailer_1["default"].createTransport({
                host: _this.host,
                port: _this.port,
                secure: _this.secure,
                auth: {
                    user: _this.auth.user,
                    pass: _this.auth.pass
                },
                tls: {
                    rejectUnauthorized: _this.tsl
                }
            });
            var mailOptions = {
                from: _this.auth.user,
                to: cuentaCorreoDestion,
                subject: asunto,
                text: cuerpoEmail,
                html: html,
                attachments: [
                    {
                        path: path_1["default"].resolve(__dirname, '../assets', 'imagen_default.jpg')
                    }
                ]
            };
            nodemailer_1["default"].createTestAccount(function (error) {
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        reject(error);
                    }
                    else {
                        return resolve(info);
                        console.log(info);
                    }
                });
            });
        });
    };
    return email;
}());
exports["default"] = email;
