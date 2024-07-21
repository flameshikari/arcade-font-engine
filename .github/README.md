<img src="./.github/logo.png">

## ℹ️ Description

The backend was coded in PHP by <a href="https://nfgworld.com/">NFG</a> (you can the original source code from <a href="https://nfggames.com/system/arcade/builder.php">here</a>). I only remade the frontend based on <a href="https://nfggames.com/games/fontmaker/">the original website</a> with my own vision and containerized the app.


## 🐳 Docker

Available in <a href="https://github.com/flameshikari/arcade-font-engine/pkgs/container/arcade-font-engine">GHCR</a> and <a href="https://hub.docker.com/r/flameshikari/arcade-font-engine">Docker Hub</a> for multiple platforms.

```yaml
version: '3'

services:
  arcade-font-engine:
    image: flameshikari/arcade-font-engine
    container_name: arcade-font-engine
    ports:
      - 8080:8080
```