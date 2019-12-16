/*
 * Primary file api
 *
 */ 

 // Dependencies
 var http = require("http");

 // server should response to all the request with valid string
var server = http.createServer(function(req,res){
    res.end("Server created\n");
})
 // start the server and run on port 3000
server.listen(3000, function(){
    console.log("Server is running on port 3000");
});