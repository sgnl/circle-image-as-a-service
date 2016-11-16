# circle image as a service

**send this**

![eva-green-backgrounds-150x150](https://cloud.githubusercontent.com/assets/3915598/20328161/04450b9c-ab35-11e6-9c4c-188c862573a7.jpg)

**get this**

![150x150](https://cloud.githubusercontent.com/assets/3915598/20328187/371ce06c-ab35-11e6-9720-adfbce08755b.png)

**curently deployed at:** `https://circle-image-as-a-service-vyovctikeu.now.sh`

`POST` a url to the server, get a rounded image back.

Powered by [now](https://zeit.co/now).

## caveats
Only images 150x150 will work. Any higher is at your own risk. if nothing works, make an issue!

## usage of service

**jquery**

```javascript
var request = require("request");

var options = { method: 'GET',
  url: 'https://circle-image-as-a-service-vyovctikeu.now.sh',
  qs: { url: 'https://cloud.githubusercontent.com/assets/3915598/20328161/04450b9c-ab35-11e6-9c4c-188c862573a7.jpg' },
  headers: { 'cache-control': 'no-cache' }
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});

```

**node.js**

```javascript

const Request = require('request')
const WriteFile = require('fs').createWriteStream

Request({
  url: 'https://circle-image-as-a-service-vyovctikeu.now.sh',
  method: 'POST',
  json: {
    url: 'https://cloud.githubusercontent.com/assets/3915598/20328161/04450b9c-ab35-11e6-9c4c-188c862573a7.jpg'
  }
})
.pipe(WriteFile('download/rounded-image.png'))

```

**curl**

```bash

curl -X GET -H "Cache-Control: no-cache" "http://localhost:8080/?url=https://cloud.githubusercontent.com/assets/3915598/20328161/04450b9c-ab35-11e6-9c4c-188c862573a7.jpg"

```

## usage of this repo
I dont know - clone it and host it for your private needs? :sparkles:
