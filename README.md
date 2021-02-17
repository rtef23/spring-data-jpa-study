#### required
* docker
* docker-compose

#### docker-compose
```bash
$ cd %PROJECT_DIRECTORY%/src/docker
$ docker-compose up
```

- mysql
> - mysql port는 3309로 뜨도록 되어 있음(Host pc에서 3309, container 내부 port로는 3306) 
> - 컨테이너 최초 구동시 %PROJECT_DIRECTORY%/src/docker/mysql/scripts/ddl.sql을 실행하도록 되어 있음

- nginx
> - nginx port는 3000으로 뜨도록 되어 있음(Host pc에서 3000, container 내부 port로는 80)
> - %PROJECT_DIRECTORY%/src/docker/nginx/static 디렉토리의 파일들을 호스팅하도록 설정되어 있음

#### spring-boot
- port는 8080(기본 포트) 고정
  - 수정시, nginx에서 proxy 설정 수정 필요
- context-path는 /api로 설정되어 있음
  - 수정시, nginx에서 proxy 설정 수정 필요
