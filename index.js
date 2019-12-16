/*
 * Primary file api
 *
 */ 

 // Dependencies
 var http = require("http");
 var url = require("url");
 // server should response to all the request with valid string
var server = http.createServer(function(req,res){
    // get the url and parse it
    var parsedUrl = url.parse(req.url, true); 
    // get the path
    var path = parsedUrl.pathname;
    // console.log("path is " ,parsedUrl.path); this also can be used insted of trimmedPath
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');           
    // get the http method
    var method = req.method.toLowerCase();
    // send the response
    res.end("Server created\n");
    // Log the request/response
    console.log('Request received on path: '+trimmedPath + ' with method', method);
})

 // start the server and run on port 3000
server.listen(3000, function(){
    console.log("Server is running on port 3000");
});