# X265 Encoder API

API to encode your videos to x265 / HEVC

## Description

This API use ffmeg binary to encode video to HEVC format.

## Documentation
- [postman-documentation](https://web.postman.co/documentation/5721530-31a344f0-5cbc-4022-99d1-3ff04a1541ef/publish?workspaceId=3b1475b7-8a1f-41c0-b9b4-d74e00d1ab4a#url)
- [postman-collection](https://github.com/brilliantDjaka/x265encode-api/raw/master/postman-collection.json)
## Getting Started

### Dependencies

- ffmpeg
- redis
- node.js >= v16.17.1

### Executing program

- Clone the repo

```
git clone git@github.com:brilliantDjaka/x265encode-api.git && cd x265encode-api
```

- Install dependency

```
npm i
```

- Run redis instance via docker

```
docker run --rm -p 6379:6379 -d docker.io/library/redis
```

- Run the service

```
npm run start:dev
```

## Todo
- [x] Direct file upload
- [ ] Upload by URL
    - [x] General URLs (need improvement)
    - [ ] Google Drive Support
    - [ ] Mega.nz Support
    - [ ] Other Provider Support
- [ ] Batch / compressed file support