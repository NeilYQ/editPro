/**
 * 
 * @authors ${ Neil-YQ } 
 * @email ${ 360842060@qq.com }
 * @date    2018-11-21 13:21:59
 * @version $Id$
 */

const Router = require('koa-router');
const admin = require('./admin');
const article = require('./article');
const router = new Router;

// 主页
router.get('/',admin.root);
// 注册页
router.get('/register',admin.register);
// 关于页面
router.get('/about',admin.about);

// 投稿页
router.get('/article/contribute',article.contribute);
router.post('/article/contributePost',article.contributePost);
// 查询文章页
router.get('/article/polling',article.polling);
router.post('/article/searchArticlePost',article.searchArticlePost);
// 查阅文章页
router.get('/article/:stateId',article.article);
router.post('/article/:stateId/articleAllPost',admin.articleAllPost);

// 编辑主页
router.get('/editor',admin.editor);
router.post('/editor/editorPost',admin.editorPost);
// 编辑登录
router.get('/editor/login',admin.login);
router.post('/editor/loginPost',admin.loginPost);
// 登出
router.post('/editor/loginout',admin.loginout);

// 编辑评论提交后查阅
router.post('/editor/articlePost',admin.articlePost);
// 文章详情
router.get('/editor/article/:stateId',admin.articleMain);
router.post('/editor/article/:stateId/articleAllPost',admin.articleAllPost);
// 提交评论
router.post('/editor/article/:stateId/commentPost',admin.commentPost);


module.exports = router;