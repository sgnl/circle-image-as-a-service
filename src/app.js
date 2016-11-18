
import path from 'path';
import {
  createWriteStream as writeFile,
  unlink as deleteFile
} from 'fs';

import express from 'express';
import request from 'request';
import gm from 'gm';

const app = express();

const downloadDir = 'download';
const tempDir = 'temp';
const uploadDir = 'uploads';
const imageSizes = [75];

app.get('/version', (_, res) => {
  res.send(`version: ${process.env.npm_package_version}`);
});

// :sparkles:
app.use('/',

  // validate payload
  (req, res, next) => {
    if (!req.query.url) {
      return res.status(422).send('missing url query parameter: url');
    }

    // pattern match for filename including file type extension
    // eslint-disable-next-line no-useless-escape
    const pattern = req.query.url.match(/([\w+\.\-]+)(\.\w+)$/);

    if (!pattern) {
      return res.status(422).send('no extension found in url');
    }

    const [filename, _, extension] = pattern;

    // check if valid file type
    const validFileTypes = ['.jpg', '.gif', '.jpeg', '.png'];

    if (!validFileTypes.includes(extension)) {
      return res.status(422).send('not a supported file type');
    }

    // yay \o/
    req.filename = `${filename}.png`;
    req.filepath = `${downloadDir}/${req.filename}`;

    return next();
  },

  // download image, change to png
  (req, res, next) => {
    gm(request.get(req.query.url))
      .stream('png')
      .pipe(writeFile(`${downloadDir}/${req.filename}`))
      .on('error', error => handleError(res, error))
      .on('finish', () => next())
    ;
  },

  // finally, make it a circle, send it back, and clean up.
  (req, res) => {
    const circleImage = require('@sgnl/circle-image')({
      tempDir,
      outputDir: uploadDir,
      filename: req.filename
    });

    const fileLocation = `${downloadDir}/${req.filename}`;
    const tempFileLocation = `${tempDir}/${req.filename}`;

    circleImage(fileLocation, '', imageSizes).then(() => {
      res.sendFile(path.resolve(fileLocation), err => {
        if (err) {
          console.error(err);
          res.status(err.status).end();
        } else {
          deleteFile(fileLocation);
          deleteFile(tempFileLocation);
        }
      });
    })
    .catch(err => console.error(err));
  })
;

function handleError(res, error) {
  return res.status(500).send(error);
}

export default app;
