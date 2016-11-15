const Express = require('express')
    , App = Express()
    , BodyParser = require('body-parser')

    , WriteFile = require('fs').createWriteStream
    , Request = require('request')
    , CircleImage = require('circle-image')

const uploadDir = 'uploads'

App
.use(BodyParser.json())
// validate payload
.use((req, res, next) => {

  // check payload
  if (!req.body.hasOwnProperty('url')) {
    return res.send(422, 'payload missing key: url')
  }

  // pattern match for filename including file type extension
  let pattern = req.body.url.match(/([\w+\.]+)(\.\w+)$/)

  if (!pattern) {
    return res.send(422, 'no extension found in url')
  }

  let [ filename
  , _
  , extension
  ] = pattern

  // check if valid file type
  let validFileTypes = ['.jpg', '.gif', '.jpeg', '.png']

  if (!!~validFileTypes.indexOf(extension)) {
    return res.send(422, 'not a supported file type')
  }

  // yay \o/
  req.body.filename = filename
  req.body.extension = extension
  return next()
})
.use((req, res, next) => {
  Request
    .get(req.body.url)
    .on('response', (response) => {
      console.log(response.statusCode) // 200
      console.log(response.headers['content-type']) // 'image/png'
    })
    .on('error', (error) => handleError(error))
    .pipe(WriteFile(`${uploadDir}/${req.body.filename}`))
    .on('error', (error) => handleError(error))
    .on('finish', _ => next())
})
.use((req, res, next) => {

})
.post('/', (req, res) => {
  res.send('although we\'ve come to the end of the road')
})
.listen(6565)

const handError = function handleError(error){
  return res.send(500, error)
}