

const nodemailer  = require("nodemailer");
const smtpTransport = nodemailer.createTransport({
    host: 'smtp.qq.com',
    secureConnection:true,
    port:465,
    auth: {
        user: '360842060@qq.com',
        pass: 'zmyzjlaqbvxxbhcg'//注：此处为授权码，并非邮箱密码
    }
});

let sendMail = (data)=>{
    return new Promise(( resolve, reject )=>{
        smtpTransport.sendMail({
            from    : '360842060@qq.com',//发件人邮箱
            to      : data.toAddress,//收件人邮箱，多个邮箱地址间用','隔开
            subject : 'Hello !',//邮件主题
            // text: 'Hi!'//text和html两者只支持一种
            html    : `
                <h3>文章录用</h3>
                <p>您好！您于 ${data.date} 投稿的 题为 <i>《${data.articleTitle}》</i>已被xx系统录用</p>
                <p>详情请到该系统的文章状态查询出了解详情！</p>
                <p>或浏览 ${data.url} 查看详情！</p>
            `
        }, function(err, res) {
            console.log(err, res);
        });
    });
};

exports.sendMail = async (data)=>{
    return sendMail(data);
};