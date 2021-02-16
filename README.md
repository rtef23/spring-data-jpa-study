#### required
* docker
* docker-compose

#### mysql docker-compose
* mysql port는 3309로 뜨도록 되어 있음(Host pc에서 3309, container 내부 port로는 3306)
* docker를 이용하여 mysql 실행
  ```shell script
  $ cd  %PROJECT_DIRECTORY%/src/docker
  $ docker-compose up
  ```
