/**
 * 
 * @authors ${ Neil-YQ } 
 * @email ${ 360842060@qq.com }
 * @date    2018-11-21 13:04:36
 * @version $Id$
 */


const Koa = require('koa');
const cors = require('@koa/cors');
const static = require('koa-static');
const koaBody = require('koa-body');
const views = require('koa-views');
const { join } = require('path');
const session = require('koa-session-minimal');
const MysqlStore = require('koa-mysql-session');
const router = require('./routers/router');
const config = require('./config/default');
const app = new Koa();


// session存储配置
const sessionMysqlConfig= {
  user: config.database.USERNAME,
  password: config.database.PASSWORD,
  database: config.database.DATABASE,
  host: config.database.HOST,
};

// 配置session中间件
app.use(session({
  key: 'USER_SID',
  store: new MysqlStore(sessionMysqlConfig)
}));

// 配置静态资源加载中间件
app
	.use(static(join(__dirname,"public")))
	.use(koaBody());

// 配置服务端模板渲染引擎中间件
app.use(views(join(__dirname, './views'), {
  extension: 'pug'
}));

// 路由
app
	.use(router.routes())
  .use(router.allowedMethods())
	.listen(6062);

console.log("listening on port 6062 ...");


