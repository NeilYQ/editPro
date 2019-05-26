/**
 * 
 * @authors ${ Neil-YQ } 
 * @email ${ 360842060@qq.com }
 * @date    2018-11-21 13:25:00
 * @version $Id$
 */

const fs = require('fs');
const db = require('../lib/mysql');
const sd = require('silly-datetime');
const md5 = require('md5');
const mEmail = require('../util/mail');

// 主页
exports.root = async (ctx) => {
  ctx.body = fs.readFileSync("./public/index.html", 'utf8'); 
}
// 注册
exports.register = async (ctx) => {
  ctx.body = fs.readFileSync("./public/register.html", 'utf8');
}
// 关于页面
exports.about = async (ctx) => {
  ctx.body = fs.readFileSync("./public/about.html", 'utf8'); 
}
// 用户登录
exports.login = async (ctx) => {
  ctx.body = fs.readFileSync("./public/login.html", 'utf8');
}
exports.loginPost = async (ctx,err)=>{
  let { loginName,password } = ctx.request.body;
  await db.findLoginName(loginName).then(res=>{
    if (res.length && loginName === res[0]['loginName'] && md5(password) === res[0]['password']) {
      ctx.session = {
        userId: res[0]['editorId'],
        user: res[0]['loginName'],
        pwd: res[0]['password']
      };
      ctx.body = {
        code: 200,
        message: '登录成功'
      };
      console.log('session', ctx.session);
    }else {
      ctx.body = {
        code: 500,
        message: '用户名或密码错误'
      }
      console.log('用户名或密码错误!');
    }
  }).catch(err => {
      console.log(err);
  });
}
// 用户退出
exports.loginout = async (ctx) => {
  ctx.session = null;
  console.log('登出成功');
  ctx.body = true;
}
// 编辑主页 
exports.editor = async (ctx) => {
  if (!ctx.session || !ctx.session.user) {     
    ctx.redirect('./editor/login');
  }else{
    ctx.body = fs.readFileSync("./public/editor.html", 'utf8');
  }
}
exports.editorPost = async (ctx) => {
  let user = { loginName:"", editorName:"", email:"" },
      loginName = ctx.session.user
  ;
  await db.findLoginName(loginName).then(res=>{
    if(res.length>0){
      user.loginName = res[0].loginName;
      user.editorName = res[0].editorName;
      user.email = res[0].email;

      ctx.body = {
        user
      }
    }
  }).catch(err=>{
    console.log(err);
  });
}
exports.articlePost = async (ctx)=>{
  await db.findAllArticleMain().then(res=>{
    let _i=0,
        _j=0,
        _k=0,
        len=res.length,
        sortRes = { notReview:[], improved:[], take:[] }
    ;
    if(len>0){
      for(i=0; i<len; i++){
        /^未审阅$/.test(res[i]["state"]) && ( sortRes.notReview[_i]=res[i] ) && ( _i++ );
        /^待改进$/.test(res[i]["state"]) && ( sortRes.improved[_j]=res[i] ) && ( _j++ );
        /^录用$/.test(res[i]["state"]) && ( sortRes.take[_k]=res[i] ) && ( _k++ );
      }
      ctx.body = {
        code: 200,
        articleData: sortRes
      };
    }else{
      ctx.body = {
        code: 500,
        articleData: null
      };
    }
  }).catch(err=>{
    console.log(err);
  });
}

// 详细文章查阅
exports.articleMain = async (ctx)=>{
  if (!ctx.session || !ctx.session.user) {     
    ctx.body = fs.readFileSync("./public/article.html", 'utf8');
  }else{
    ctx.body = fs.readFileSync("./public/review.html", 'utf8');
  }
}
exports.articleAllPost = async (ctx)=>{
  let stateId = ctx.params.stateId;
  await db.findAllArticleAllByStateId(stateId).then(res=>{
    ctx.body = {
      code: 200,
      articleData: res[0]
    }
  }).catch(err=>{
    console.log(err);
  });
}
//提交评论
exports.commentPost = async (ctx)=>{
  let stateId = ctx.params.stateId,
      state = ctx.request.body.state,
      comment = ctx.request.body.comment,
      editorId = ctx.session.userId,
      date = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss')
  ;
  //提交评论
  await db.setComment([ state, editorId, date, comment, stateId ]).then(res=>{
    if(res.affectedRows===1){
      ctx.body = {
        code: 200,
        message: "提交成功"
      }
      console.log('评论提交成功');
    }else{
      ctx.body = {
        code: 500,
        message: "提交失败"
      }
      console.log('评论提交失败');
    }
  }).catch(err=>{
    console.log(err);
  });
  //发送邮件
  if(/^录用$/.test(state)){
    await db.findArticleByStateId(stateId).then(res=>{
      mEmail.sendMail({ 
        toAddress : res[0].email, 
        date : date, 
        articleTitle : res[0].title, 
        url : "https://localhost:6062/article/"+stateId 
      }).then(res=>{
        console.log(res);
        console.log('邮件已发送');
      }).catch(err=>{
        console.log(err);
      });
    }).catch(err=>{
      console.log(err);
    });
  }
}







