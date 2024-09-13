# Function Builder Backend

This is the backend server for the Function Builder game, responsible for handling multiplayer game rooms, player interactions, and game logic in real-time using `Node.js` and `Socket.IO`.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Node.js**: You can download it from [nodejs.org](https://nodejs.org/).
- **npm** (Node Package Manager): This is included with Node.js.

## Getting Started

Follow these instructions to set up and run the backend server locally.

### 1. Clone the Repository

First, clone the repository to your local machine:

git clone https://github.com/Gamify-IT/functionbuilder-backend.git
cd functionbuilder-backend

### 2. Install Dependencies
Run the following command to install the required dependencies:

npm install

3. Run the Server
To start the server, run the following command:

node server.js


You can test the backend using a tool like Postman or curl. The following endpoints are available:

GET /roomState: Fetches the current state of all game rooms.
POST /createRoom: Creates a new game room. You need to pass the roomName and mode in the request body.
POST /joinRoom: Allows a player to join a specific room. You need to pass the roomId in the request body.

The server uses Socket.IO for real-time communication between clients and the server. Once connected, clients can listen for events such as:

playerJoined: Broadcasts when a new player joins the room.
startGame: Broadcasts when the game is ready to start.
playerLeft: Broadcasts when a player leaves the room.

Project Structure
server.js: Main entry point for the server.
/node_modules: Contains all installed dependencies.
package.json: Lists the project dependencies and scripts.
