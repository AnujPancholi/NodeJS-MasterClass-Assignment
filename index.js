const http = require('http'),
//	https = require('https'),
	url = require('url'),
	stringDecoder = require('string_decoder').StringDecoder,
	config = require('./config.js'),
	fs = require('fs');
//console.log("Hello");



var httpServer = http.createServer((req,res) => {

	unifiedServer(req,res);	

});

httpServer.listen(config.httpPort, () => {
	console.log("Server (http) listening on "+String(config.httpPort)+" ("+config.envName+" environment)");
});


/*var httpsServerOptions = {
	'key': fs.readFileSync('./https/key.pem'),
	'cert': fs.readFileSync('./https/cert.pem')

};
*/
/*var httpsServer = https.createServer(httpsServerOptions, function(req,res){
	unifiedServer(req,res);
})
*/
/*httpsServer.listen(config.httpsPort, () => {
	console.log("Server (https) listening on "+String(config.httpsPort)+" ("+config.envName+" environment)");
})*/

var unifiedServer = function(req,res){
	//parse url
	var parsedUrl = url.parse(req.url,true);
	//console.log(parsedUrl);
	//get path from parsed url
	var path = parsedUrl.pathname;
	//trim the path because users are stupid and might add random slashes at the beginning and/or the end
	var trimmedPath = path.replace(/^\/+|\/+$/g,'');
	//get request method and convert to lowercase for simplicity of comparison
	var method = req.method.toLowerCase();
	//get query string (which is passed from url.parse to the built-in qs library)
	var qsObject = parsedUrl.query;
	//get request headers as an object
	var headers = req.headers;
	//get the payload of the request (if any) that comes in via a stream
	var decoder = new stringDecoder('utf-8');
	var buffer = '';
	req.on('data', (chunk) => {
		buffer+=decoder.write(chunk);
	});

	req.on('end', () => {
		buffer+= decoder.end();
		//once the request payload has loaded in the buffer, the request must be routed to the appropriate handler. If none is found, route to the "not found" handler.
		var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

		var data = {
			trimmedPath: trimmedPath,
			qsObject: qsObject,
			headers: headers,
			method: method,
			payload: buffer
		}

		//time to route the request
		chosenHandler(data, function(statusCode,payload){
			//default status code: 200, default payload: empty object
			statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
			payload = typeof(payload) == 'object' ? payload : {};

			var payloadString = JSON.stringify(payload);
			res.setHeader('Content-type','application/json');
			res.writeHead(statusCode);
			res.end(payloadString);
			console.log("Returning response: ",payloadString);
		});
	})

}




var handlers = {}

handlers.hello = function(data, callback){
	
	if(data.method!='get') {callback(400,{"message": "Sorry, we only do get requests"})
	}
	//console.log(data.qsObject[message]);

	else {
		let message = typeof(data.qsObject['message']) ? data.qsObject['message'] : "Grandma plays the cello";
		callback(200,{"message": message});
	}
	
}


//default handler for "not found"
handlers.notFound = function(data, callback){
	callback(404);
}

var router = {
	hello: handlers.hello
}



