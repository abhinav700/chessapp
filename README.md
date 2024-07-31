# Description
A simple chess application build using chess.js API for validation logic and reactjs for frontend components.


# Setting up Locally
## Docker

1) clone the repository 
    ```
    git clone https://github.com/abhinav700/chessapp.git
    ```
2) cd ./chessapp
3) run `docker-compose up` in `/backend` to directory to start the server at `localhost:8080`
4) run `docker-compose up` in `/client` directory  to start the frontend at `localhost:3000`

(NOTE: Use `docker compose` instead of `docker-compose` if you are using docker compose V2)

Source code changes are automatically reflected in the running Docker containers without requiring a restart. This means any modifications made to the project's source code will be immediately visible within the application running inside the container.

## Manually
1) clone the repository 
    ```
    git clone https://github.com/abhinav700/chessapp.git
    ```
2) cd ./chessapp
3) run `npm install` command in `/client` and `/backend` directories to install the dependencies
3) run `npm run dev` in `/backend` to directory to start the nodemon server at `localhost:8080`
4) run `npm run start` in `client` directory  to start the frontend at `localhost:3000`