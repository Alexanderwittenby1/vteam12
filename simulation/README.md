To run the ors docker api for an functioning simulation.
1
 firstly download the data file "sweden-latest.osm.pbf" and put in /simulation/ors-docker/files NOTE use cp or mv dont just drag and drop the file it will probably corrupt. If you dont fave /file just mkdir file in ors-docker

https://download.geofabrik.de/europe/sweden.html

2
run "docker compose up -d in" /simulation.


first time starting the ors will take some extra time.
When this comes back as "status ready" ors is finished use postman to test:
GET http://localhost:8082/ors/v2/health

3
dont forget if you havent rebuilt since the latest changes for db and backend run
docker compose down --volumes --rmi all
docker compose up --build

container may crash when running for --build just do then
docker compose down
docker compose up db -d
docker compose up backend
4
create a trip folder
run mkdir trips
in /simulation
run "npm i"  in /simulation

5
Run node processInput.js in /simulation then type help

order of commands
start
set cities
initiate bikes
generate trips
start bikes

reset when needed

Dont go higher then 3 on generate trips more is unecessary
initiate Bikes is max 1000