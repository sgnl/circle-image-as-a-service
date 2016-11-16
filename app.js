'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _gm = require('gm');

var _gm2 = _interopRequireDefault(_gm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

var _fs = 'fs',
    writeFile = _fs.createWriteStream,
    deleteFile = _fs.unlink;


var downloadDir = 'download';
var tempDir = 'temp';
var uploadDir = 'uploads';
var imageSizes = [120];

app.get('/version', function (_, res) {
  res.send('version: ' + process.env.npm_package_version);
});

// :sparkles:
app.use('/',

// validate payload
function (req, res, next) {
  if (!req.query.url) {
    return res.status(422).send('missing url query parameter: url');
  }

  // pattern match for filename including file type extension
  var pattern = req.query.url.match(/([\w+.-]+)(\.\w+)$/);

  if (!pattern) {
    return res.status(422).send('no extension found in url');
  }

  var _pattern = _slicedToArray(pattern, 4),
      _ = _pattern[0],
      filename = _pattern[2],
      extension = _pattern[3];

  // check if valid file type


  var validFileTypes = ['.jpg', '.gif', '.jpeg', '.png'];

  if (!validFileTypes.includes(extension)) {
    return res.status(422).send('not a supported file type');
  }

  // yay \o/
  req.filename = filename + '.png';
  req.filepath = downloadDir + '/' + req.filename;

  return next();
},

// download image, change to png
function (req, res, next) {
  (0, _gm2.default)(_request2.default.get(req.query.url)).stream('png').pipe(writeFile(downloadDir + '/' + req.filename)).on('error', function (error) {
    return handleError(res, error);
  }).on('finish', function () {
    return next();
  });
},

// finally, make it a circle, send it back, and clean up.
function (req, res) {
  var circleImage = require('@sgnl/circle-image')({
    tempDir: tempDir,
    outputDir: uploadDir,
    filename: req.filename
  });

  var fileLocation = downloadDir + '/' + req.filename;
  var tempFileLocation = tempDir + '/' + req.filename;

  circleImage(fileLocation, '', imageSizes).then(function () {
    res.sendFile(_path2.default.resolve(fileLocation), function (err) {
      if (err) {
        console.error(err);
        res.status(err.status).end();
      } else {
        deleteFile(fileLocation);
        deleteFile(tempFileLocation);
      }
    });
  }).catch(function (err) {
    return console.error(err);
  });
});

app.listen(process.env.PORT || 8181);

function handleError(res, error) {
  return res.status(500).send(error);
}