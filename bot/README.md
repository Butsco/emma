
```
docker build -t lukin0110/emma .
```


##################################################################
# Build, ... just build the Dockerfile
##################################################################
build:
	docker build -t triled/triremote .

##################################################################
# Build, kill & restart the sshd docker service
##################################################################
restart:
	docker build -t triled/triremote .
	docker rm -f triremote
	docker run -d -P -p 2222:22 -p 80:80 -v /Users/maartenhuijsmans/GitProjects/triremote/server/scripts:/triremote/scripts --name triremote triled/triremote
