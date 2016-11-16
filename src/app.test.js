
import test from 'ava';
import {default as req} from 'supertest';

import app from './app';

test.beforeEach(t => {
  t.context.agent = req.agent(app.listen());
});

test.serial('version route', async t => {
  t.plan(2);

  let res = await t.context.agent
    .get('/version');

  t.is(res.status, 200);
  t.is(res.text, `version: ${process.env.npm_package_version}`);
});
