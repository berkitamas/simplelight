#! /bin/bash

curl -i -X POST \
  http://localhost:8001/upstreams \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'name=simplelight-api&healthchecks.active.http_path=/&healthchecks.active.timeout=5&healthchecks.active.concurrency=10&healthchecks.active.healthy.interval=30&healthchecks.active.unhealthy.interval=30&healthchecks.active.healthy.successes=10&healthchecks.active.unhealthy.tcp_failures=5&healthchecks.active.unhealthy.timeouts=10&healthchecks.active.unhealthy.http_failures=5'

curl -i -X POST \
  --url http://127.0.0.1:8001/upstreams/simplelight-api/targets \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'target=simplelight-api-1:10010&weight=100'

curl -i -X POST \
  --url http://127.0.0.1:8001/upstreams/simplelight-api/targets \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'target=simplelight-api-2:10010&weight=100'

curl -i -X POST \
  --url http://localhost:8001/services/ \
  --data 'name=simplelight-api' \
  --data 'url=http://simplelight-api/'

curl -X POST \
  --url http://127.0.0.1:8001/services/simplelight-api/routes \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'hosts[]=localhost'

curl -X POST http://127.0.0.1:8001/plugins \
    --data "name=rate-limiting"  \
    --data "config.second=5" \
    --data "config.hour=10000"

curl -i -X POST \
  --url http://localhost:8001/consumers/ \
  --data "username=mobile"

curl -i -X POST \
  --url http://localhost:8001/consumers/ \
  --data "username=web"

curl -i -X POST \
  --url http://localhost:8001/consumers/web/key-auth/ \
  --data 'key=5A87D5CDBB8A44B6A8A2BAB93495E6E1'

curl -i -X POST \
  --url http://localhost:8001/consumers/mobile/key-auth/ \
  --data 'key=2376300E4F4E4FBE816C0102C6F6FADB'

curl -i -X POST http://localhost:8001/consumers/mobile/plugins \
--data "name=rate-limiting" \
--data "config.minute=5"

curl -i -X POST http://localhost:8001/consumers/web/plugins \
--data "name=rate-limiting" \
--data "config.minute=5"