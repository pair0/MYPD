const nodemailer = require("nodemailer");
require("dotenv").config();
module.exports = {
    sendmail: async function () {
        let authNum = Math.random().toString().substring(2, 8);
        let text = "아래의 인증 번호를 입력하여 인증을 완료해주세요.";
        let transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        requireTLS: true ,
        secure: false,
        auth: {
            user: process.env.Email,
            pass: process.env.MailPass
        }
        });
        
        // send mail with defined transport object
       await transporter.sendMail({
        from: `"MYPD" <'dbzl159753@gmail.com'>`,
        to: toEmail,
        subject: "회원가입을 위한 인증번호를 입력해주세요.",
        text: text,
        html: `<p style='color:black'><b>${text}</b></p>
                <h2>${authNum}</h2>`,
        });
        return authNum;
    },  
}

