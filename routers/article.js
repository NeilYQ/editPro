/**
 * 
 * @authors ${ Neil-YQ } 
 * @email ${ 360842060@qq.com }
 * @date    2018-11-28 21:22:14
 * @version $Id$
 */

const fs = require('fs');
const db = require('../lib/mysql');
const sd = require('silly-datetime');
const md5 = require('md5');

exports.contribute = async (ctx)=>{
  ctx.body = fs.readFileSync("./public/contribute.html", 'utf8');
}

exports.polling = async (ctx)=>{
  ctx.body = fs.readFileSync("./public/polling.html", 'utf8');
}
// 提交文章
exports.contributePost = async (ctx,err)=>{
	// 获取前端传来的数据
	let mArticle = ctx.request.body ;
	// 获取当前时间
	let time=sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
	// 状态id 由文章标题和时间戳组合的字符串并加密而得
	let stateId = md5(mArticle.title+mArticle.author+time);
	// 新增文章
	await db.setArticle([ 
		mArticle.title, 
		mArticle.author, 
		time, mArticle.phone, 
		mArticle.address, 
		(mArticle.qq-0), 
		mArticle.email, 
		mArticle.article, 
		stateId 
	]).then(res=>{
		if(res.affectedRows===1){
	    console.log('提交成功');
		}else{
	    console.log('提交失败');
		}
	}).catch(err=>{
		console.log(err);
	});
	// 新增文章状态
	await db.setArticleState([stateId, '未审阅', , time, '']).then(res=>{
		if(res.affectedRows===1){ 
			// 状态添加成功并返回信息
			ctx.body = { code: 200, stateId, message: '提交成功' }; 
		}else{
			// 状态添加失败并返回错误信息
			ctx.body = { code:500, message: '提交失败' };
		}
	}).catch(err=>{
		console.log(err);
	});
}
// 查询文章状态
exports.searchArticlePost = async (ctx,err)=>{
	let {stateId} = ctx.request.body ;
	await db.findArticleState(stateId).then(res=>{
		if(res[0]){
			ctx.body = {
				code:200,
				data:res[0],
				message:'文章状态查询成功！'
			};
		}else{
			ctx.body = {
				code:500,
				message:'文章状态查询失败！'
			};
		}
	}).catch(err=>{
		console.log(err);
	});
}
// 查阅文章
exports.article = async (ctx)=>{
  ctx.body = fs.readFileSync("./public/article.html", 'utf8');
}




