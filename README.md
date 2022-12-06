# ping
Messaging app for Network Security Course

##To execute Server-Side application

in a terminal navigate to the ping application

run the commands: <br>
`mvn clean package` <br>
`mvn spring-boot:run`

The server should start on port `8080`

open another terminal and navigate into `/ping/auth-service`
run the command: <br>
`mvn clean package` <br>
`mvn spring-boot:run`

The server should start on port `8081`

please update the public keys path in the file 

##To execute Client-Side application

nvm use 19.2.0

yarn install <br>
yarn start

The application should start on port `3000`.

go to any local browser and open the url `http://localhost:3000`

in the given text box, enter any of the following usernames:

```
John
Srinath
Sanjana
Mathew
Aishwarya
```