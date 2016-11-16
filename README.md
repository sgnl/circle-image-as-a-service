# circle image as a service

**send this**

![eva-green-backgrounds-150x150](https://cloud.githubusercontent.com/assets/3915598/20328161/04450b9c-ab35-11e6-9c4c-188c862573a7.jpg)

**get this**

![150x150](https://cloud.githubusercontent.com/assets/3915598/20328187/371ce06c-ab35-11e6-9720-adfbce08755b.png)

**curently deployed at: ** `https://circle-image-as-a-service-vyovctikeu.now.sh`

`POST` a url to the server, get a rounded image back. Powered by [now](https://zeit.co/now).

## caveats
Only images 150x150 will work. Any higher is at your own risk. if nothing works, make an issue!

## usage

Send a `POST` request to the

**javascript**

```javascript

const Request = require('request')
const WriteFile = require('fs').createWriteStream

Request.get('https://circle-image-as-a-service-vyovctikeu.now.sh')
  .pipe(WriteFile('./downloads/'))

```

**curl**

```bash
curl -X POST -H "Content-Type: application/json" -d '{
  "url": "https://cloud.githubusercontent.com/assets/3915598/20328161/04450b9c-ab35-11e6-9c4c-188c862573a7.jpg"
}' "https://circle-image-as-a-service-vyovctikeu.now.sh"

```
