# circle image as a service for images around 150x150 in size

```bash
# deployed @ https://circle-image-as-a-service-vyovctikeu.now.sh
```

`POST` a url to the server, get a rounded image back. Powered by [now](https://ziet.co/now).

Send this

![eva-green-backgrounds-150x150](https://cloud.githubusercontent.com/assets/3915598/20328161/04450b9c-ab35-11e6-9c4c-188c862573a7.jpg)

Get this

![150x150](https://cloud.githubusercontent.com/assets/3915598/20328187/371ce06c-ab35-11e6-9720-adfbce08755b.png)

## usage

Send a `POST` request to the



**curl**

```bash
curl -X POST -H "Content-Type: application/json" -d '{
  "url": "https://cloud.githubusercontent.com/assets/3915598/20328161/04450b9c-ab35-11e6-9c4c-188c862573a7.jpg"
}' "https://circle-image-as-a-service-vyovctikeu.now.sh"

```