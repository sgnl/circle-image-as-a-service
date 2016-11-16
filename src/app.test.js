
import test from 'ava';
import {default as req} from 'supertest';

import app from './app';

test.beforeEach(t => {
  t.context.agent = req.agent(app.listen());
});

test('/version route', async t => {
  t.plan(2);

  const res = await t.context.agent
    .get('/version')
  ;

  t.is(res.status, 200);
  t.is(res.text, `version: ${process.env.npm_package_version}`);
});

test('/', async t => {
  t.plan(1);

  const res = await t.context.agent
    .get('/')
    .query({url: 'https://scontent.cdninstagram.com/t51.2885-19/s150x150/11821951_1170504889633180_1587357723_a.jpg'})
  ;
  console.log('res.text: ', res.text);
  t.is(res.status, 200);
});
