<br><br>
<p align="center">
  <img src="./.github/logo.png" alt="">
<br>

## ℹ️ Description

Arcade Font Engine made by <a href="https://nfgworld.com/">NFG</a>, containerized and restyled by me.

## 🐳 Docker

Available in <a href="../../pkgs/container/arcade-font-engine">GHCR</a> and <a href="https://hub.docker.com/r/flameshikari/arcade-font-engine">Docker Hub</a> for multiple platforms.

```yaml
version: '3'

services:
  arcade-font-engine:
    image: flameshikari/arcade-font-engine
    container_name: arcade-font-engine
    # build: .
    ports:
      - 8080:8080
```