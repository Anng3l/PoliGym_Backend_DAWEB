import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config();

let transporter = nodemailer.createTransport({
    service: "gmail",
    host: process.env.HOST_MAILTRAP,
    port: process.env.PORT_MAILTRAP,
    auth: {
        user: process.env.USER_MAILTRAP,
        pass: process.env.PASS_MAILTRAP
    }
});

const nodemailerMethods = {
    sendMailToUser: (userMail, token) => {
        let mailOptions = {
            from: process.env.USER_MAILTRAP,
            to: userMail,
            subject: "Verificar cuenta",
            html: `<p>Hola, haz clic <a href="${process.env.URL_BACKEND}auth/confirm/${encodeURIComponent(token)}">aquí</a> para confirmar tu cuenta.</p>`
        };
    
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            }
            else {
                console.log("Correo enviado" + info.response);
            }
        });
    },
    
    sendMailToUserLogin: (userMail) => {
        let mailOptions = {
            from: process.env.USER_MAILTRAP,
            to: userMail,
            subject: "Acceso a la cuenta",
            html: `<p>Hola, haz ingresado a tu cuenta desde .</p>`
        };
    
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            }
            else {
                console.log("Correo enviado" + info.response);
            }
        });
    }
}


export default nodemailerMethods;