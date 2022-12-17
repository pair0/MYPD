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
            html: `<table
            cellspacing="0"
            cellpadding="0"
            border="0"
            style="border: 2px solid #000;width:100%;">
            <tbody>
                <tr>
                    <td valign="middle" style="padding: 26px 0;">
                        <table cellspacing="0" cellpadding="0" border="0" style="width:100%">
                            <tbody>
                                <tr>
                                    <td width="219" align="center" style="padding-right:7px;">
                                        <p>
                                        <img src = "https://user-images.githubusercontent.com/79035672/208195352-f61dbd78-498d-4d1a-bb33-f28accbc926c.png" width="230px" height="100%" alt="MYPD" class="logo">
                                            <td valign="top" style="padding-left:21px;border-left:1px solid #e0e0e0">
                                                <table cellspacing="0" cellpadding="0" border="0" style="width:100%">
                                                    <tbody>
                                                        <tr>
                                                            <td
                                                                style="position: relative; top: -3px; padding-bottom: 8px; font-weight: bold; font-family: &quot;맑은 고딕&quot;, &quot;Malgun Gothic&quot;, 돋움, dotum, sans-serif;">
                                                                <p>${text}<br></p>
                                                                    <p>
                                                                        <span style="font-size: 14pt;">${authNum}</span>
                                                                    </p>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td
                                                                    style="font-size: 12px; font-family: &quot;맑은 고딕&quot;, &quot;Malgun Gothic&quot;, 돋움, dotum, sans-serif; line-height: 17px;">
                                                                    <p>
                                                                        <br></p>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        style="font-size:12px;font-family:'맑은 고딕','Malgun Gothic','돋움',dotum,sans-serif;line-height:17px;color:#888">
                                                                        <p>
                                                                            <span style="font-weight:bold;color:#111">m</span>&nbsp;010-9659-3000<span style="position:relative;top:-1px;padding:0 6px;color:#d7d7d7">|</span>
                                                                            <span style="font-weight:bold;color:#111">e</span>&nbsp;securityteam@kakao.com</p>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        style="font-size:12px;font-family:'맑은 고딕','Malgun Gothic','돋움',dotum,sans-serif;line-height:17px;color:#888">
                                                                        <p>
                                                                            <span style="font-weight:bold;color:#111">
                                                                                <br></span>
                                                                            </p>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <p>
                                <br></p>`,
        });
        return authNum;
    },  
}

