# NodeJS + Express + Vue.js + Webpack + LowDB + Docker boilerplate

I use this template all the time to simplify development of quick & dirty tools.

## Getting Started

Just clone to a local directory and get cracking.

### Installing

Clone to a local folder.

```bash
yarn install; yarn run dev
```

### Building

To build client-side for production:
```bash
yarn run build
```

To compile the docker image:

```bash
docker build -t {username}/{reponame} .
```


## Deployment

The docker image automatically exposes port 3000.