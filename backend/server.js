const app = require("./app");
const debug = require("debug")("node-angular");
const http = require("http");

const normalizePort = val => {
  var port = parseInt(val, 10); //Base 10 Port Number

  if (isNaN(port)) { //Is Not A Number
    return val;
  }

  if (port >= 0) { //Port Number
    return port;
  }

  return false;
};

const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? "pipe " + port : "port " + port; //If A String The Set As A Pipe, Otherwise Is A Port?
  switch (error.code) {
    case "EACCES": //EACCES Is A Port Lower Than 1024 Which Is Reserved In The Operating System
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE": //Port That Is Already In Sure
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address(); //Address Of Running Server
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  debug("Listening on " + bind); //Port Listening On
};

const port = normalizePort(process.env.PORT || "3000"); //Port Provided, Or Default Of 3000
app.set("port", port);

const server = http.createServer(app); //Create The HTTP Server Passed On The App
server.on("error", onError); //Error Thrown
server.on("listening", onListening); //Provide The Port
server.listen(port); //Listen On The Port Provided
