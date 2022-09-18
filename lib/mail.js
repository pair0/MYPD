const nodemailer = require("nodemailer");

module.exports = {
    findaccount_sendmail: async function () {
        let authNum = Math.random().toString().substring(2, 8);
        let text = "아래의 인증 번호를 입력하여 인증을 완료해주세요.";

        let transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: "dbzl159753@gmail.com",
            pass: "fjhaofyosyhuozgc",
        },
        });
        
        // send mail with defined transport object
        let mailOptions = await transporter.sendMail({
        from: `"스키보드 렌탈 플랫폼" <'cstonefg@gmail.com'>`,
        to: toEmail,
        subject: "회원가입을 위한 인증번호를 입력해주세요.",
        text: text,
        html: `<p style='color:black'><b>${text}</b></p>
                <h2>${authNum}</h2>`,
        });
        
        return authNum;
    },  
}