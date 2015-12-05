##################################################################
# Build, ... just build the Dockerfile
##################################################################
build:
	docker build -t lukin0110/emma .

##################################################################
# Build, kill & restart
##################################################################
restart:
	docker build -t lukin0110/emma .
	docker rm -f emma
	docker run -d -P -p 80:5001 --name emma lukin0110/emma
