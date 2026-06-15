FROM mysql:oraclelinux9
COPY ./database/ /docker-entrypoint-initdb.d/
EXPOSE 3306