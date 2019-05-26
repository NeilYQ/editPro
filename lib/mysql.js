/**
 * 
 * @authors ${ Neil-YQ } 
 * @email ${ 360842060@qq.com }
 * @date    2018-11-21 13:59:57
 * @version $Id$
 */

const mysql = require('mysql');

const pool  = mysql.createPool({
  host     : "localhost",
  port     : "3306",
  user     : "root",
  password : "123456",
  database : "editpro"
});

let query = ( sql, values ) => {
  return new Promise(( resolve, reject ) => {
    pool.getConnection( (err, connection) => {
      if (err) {
        reject( err )
      } else {
        connection.query(sql, values, ( err, rows) => { 
          if ( err ) {
            reject( err )
          } else {
            resolve( rows )
          }
          connection.release(); // 把连接放回连接池，等待其它使用者使用
        });
      }
    });
  });
}

// let article = `
//   CREATE TABLE article (
//     articleId int(11) NOT NULL AUTO_INCREMENT,
//     title varchar(30) NOT NULL,
//     author varchar(20) NOT NULL,
//     date varchar(20) NOT NULL DEFAULT '',
//     phone varchar(20) NOT NULL,
//     address varchar(255) NOT NULL,
//     qq int(15) DEFAULT NULL,
//     email varchar(20) NOT NULL,
//     content longtext NOT NULL,
//     stateId varchar(255) NOT NULL,
//     PRIMARY KEY (articleId,stateId)
//   ) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=gb18030;`
// ;
// let editor = `
//   CREATE TABLE editor (
//     editorId int(10) NOT NULL,
//     editorName varchar(20) NOT NULL,
//     loginName varchar(20) NOT NULL,
//     password varchar(60) NOT NULL,
//     email varchar(20) NOT NULL,
//     PRIMARY KEY (editorId,loginName)
//   ) ENGINE=InnoDB DEFAULT CHARSET=gb18030;`
// ;
// let state = `
//   CREATE TABLE state (
//     stateId varchar(255) NOT NULL,
//     state varchar(10) NOT NULL,
//     editorId int(10) DEFAULT NULL,
//     date varchar(20) NOT NULL,
//     comment varchar(255) DEFAULT NULL,
//     PRIMARY KEY (stateId)
//   ) ENGINE=InnoDB DEFAULT CHARSET=gb18030;`
// ;

// let createTable = ( sql ) => {
//   return query( sql, [] )
// }

// // 建表
// createTable(article)
// createTable(editor)
// createTable(state)


//注册编辑用户
exports.regEditor = async (val)=>{
	let sql = `insert into editor set editorId=?,editorName=?,loginName=?,password=?,email=?;`;
	return query(sql,val);
}
//编辑用户名登录登录
exports.findLoginName = async (name)=>{
	let sql = `select * from editor where loginName=?;`;
	return query(sql,name);
}
//稿件信息
exports.setArticle = async (val)=>{
	let sql = `insert into article set title=?,author=?,date=?,phone=?,address=?,qq=?,email=?,content=?,stateId=?;`;
	return query(sql,val);
}
//通过稿件id获取稿件信息
exports.findArticleById = async (val)=>{
	let sql = `select * from article where articleId=?;`;
	return query(sql,val);
}
//通过文章名获取稿件信息
exports.findArticleByTitle = async (val)=>{
  let sql = `select * from article where title=?;`;
  return query(sql,val);
}
//通过状态id获取稿件信息
exports.findArticleByStateId = async (val)=>{
  let sql = `select * from article where stateId=?;`;
  return query(sql,val);
}
//通过作者名获取稿件信息
exports.findArticleByAuthor = async (val)=>{
	let sql = `select * from article where author=?;`;
	return query(sql,val);
}
//查询所有文章关键信息
exports.findAllArticleMain = async ()=>{
  let sql = `SELECT state.stateId,state.state,state.comment,editor.editorName,article.title,article.author,article.date articleDate,state.date stateDate from state left join editor on editor.editorId=state.editorId left join article ON article.stateId = state.stateId order by articleDate desc,stateDate desc;`;
  return query(sql);
}
//通过状态id查询所有文章所有信息
exports.findAllArticleAllByStateId = async (val)=>{
  let sql = `SELECT state.stateId,state.state,state.comment,editor.editorName,article.title,article.author,article.date articleDate,state.date stateDate,article.content from state left join editor on editor.editorId=state.editorId left join article ON article.stateId = state.stateId where state.stateId=?;`;
  return query(sql,val);
}
//新增文章审阅状态
exports.setArticleState = async (val)=>{
	let sql = `insert into state set stateId=?,state=?,editorId=?,date=?,comment=?;`;
	return query(sql,val);
}
//查询文章的审阅状态信息
exports.findArticleState = async (val)=>{
  let sql = `SELECT state.state,state.comment,editor.editorName,article.title,article.author,article.date from state left join editor on editor.editorId=state.editorId left join article ON article.stateId = state.stateId where state.stateId=?;`
  return query(sql,val);
}
// 提交评论
exports.setComment = async (val)=>{
  let sql = `update state set state=?,editorId=?,date=?,comment=? where stateId=?;`;
  return query(sql,val);
}






