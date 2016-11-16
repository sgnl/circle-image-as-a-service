
'use strict';

const Express = require('express')
    , App = Express()

    , { createWriteStream: WriteFile
      , unlink: DeleteFile
    } = require('fs')
    , Path = require('path')
    , Request = require('request')

const downloadDir = 'download'
    , tempDir = 'temp'
    , uploadDir = 'uploads'

const imageSizes = [120]

const Gm = require('gm')

App

// validate payload
.use((req, res, next) => {

  // check payload
  if (!req.query.url) {
    return res.status(422).send('missing url query parameter: url')
  }

  // pattern match for filename including file type extension
  let pattern = req.query.url.match(/([\w+\.\-]+)(\.\w+)$/)
  console.log('pattern: ', pattern);
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
  req.filename = `${filename}.png`
  req.filepath = `${downloadDir}/${req.filename}`

  return next()
})

.use((req, res, next) => {
  Gm(Request.get(req.query.url))
    .stream('png')
    .pipe(WriteFile(`${downloadDir}/${req.filename}`))
    .on('error', (error) => handleError(res, error))
    .on('finish', _ => next())
})

.use((req, res, next) => {
  let CircleImage = require('@sgnl/circle-image')({
    tempDir,
    outputDir: uploadDir,
    filename: req.filename
  })

  let fileLocation = `${downloadDir}/${req.filename}`
  let tempFileLocation = `${tempDir}/${req.filename}`

  CircleImage(fileLocation, '', imageSizes).then(_ => {
    res.sendFile(Path.resolve(fileLocation), (err) => {
      if (err) {
        console.error(err)
        res.status(err.status).end()
      } else {
        DeleteFile(fileLocation)
        DeleteFile(tempFileLocation)
      }
    })
  })
  .catch((error) => console.error(error))
})

.post('/', (req, res) => {
  res.send('although we\'ve come to the end of the road')
})

.listen(process.env.PORT || 8181)

function handleError(res, error){
  return res.status(500).send(error)
}
