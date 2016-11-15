const Express = require('express')
    , App = Express()
    , BodyParser = require('body-parser')

    , WriteFile = require('fs').createWriteStream
    , Request = require('request')

const downloadDir = 'download'
    , tempDir = 'temp'
    , uploadDir = 'uploads'

const imageSizes = [30]

const Gm = require('gm')

App
.use(BodyParser.json())
// validate payload
.use((req, res, next) => {

  // check payload
  if (!req.body.hasOwnProperty('url')) {
    return res.status(422).send('payload missing key: url')
  }

  // pattern match for filename including file type extension
  let pattern = req.body.url.match(/([\w+\.]+)(\.\w+)$/)

  if (!pattern) {
    return res.status(422).send('no extension found in url')
  }

  let [ fileNameAndExtension
  , filename
  , extension
  ] = pattern

  // check if valid file type
  let validFileTypes = ['.jpg', '.gif', '.jpeg', '.png']

  if (!validFileTypes.includes(extension)) {
    return res.status(422).send('not a supported file type')
  }

  // yay \o/
  req.body.filename = `${filename}.png`
  req.body.filepath = `${downloadDir}/${req.body.filename}`

  return next()
})
.use((req, res, next) => {
  Gm(Request.get(req.body.url))
    .stream('png')
    .pipe(WriteFile(`${downloadDir}/${req.body.filename}`))
    .on('error', (error) => handleError(res, error))
    .on('finish', _ => next())
})
.use((req, res, next) => {
  let CircleImage = require('circle-image')({
    tempDir,
    outputDir: uploadDir,
    filename: req.body.filename
  })
  CircleImage(`${downloadDir}/${req.body.filename}`, '', [120]).then(function (paths) {
    console.log(paths);
  })
  .catch((error) => console.error(error))
})
.post('/', (req, res) => {
  res.send('although we\'ve come to the end of the road')
})
.listen(6565)

function handleError(res, error){
  return res.status(500).send(error)
}