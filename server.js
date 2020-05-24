const koa = require('koa');
const app = new koa();
const bodyParser = require('koa-bodyparser');
const router = require('@koa/router')();
const views = require('koa-views');
const static = require('koa-static');
const path = require('path');

const { sign } = require('jsonwebtoken');
const secret = 'demo';
const jwt = require('koa-jwt')({ secret });

app.use(bodyParser());
app.use(views(__dirname + '/views', {
  map: { html: 'ejs' }
}));

app.use(static(path.join(__dirname, '/static')));

router.get('/', ctx => ctx.render('index'));

router.post('/login', ctx => {
  const { user } = ctx.request.body;
  if (user && user.username === 'vip') {
    let { username } = user;
    const token = sign({ username }, secret, { expiresIn: '1h' });
    ctx.body = {
      message: 'GET TOKEN SUCCESS',
      status: 200,
      token
    }
  } else {
    ctx.body = {
      message: 'GET TOKEN FAILED',
      status: 500
    }
  }
});

router.get('/info', jwt, ctx => {
  ctx.body = { message: `Welcome ${ctx.state.user.username}!`};
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(8080, () => {
  console.log('server is running at port 8080');
});