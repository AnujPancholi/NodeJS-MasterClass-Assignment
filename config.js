//creating and exporting configuration variables

//container for all environments:
var environments = {};

//for this environment, 2 environments will be defined - staging(default) and production.

environments.staging = {
	envName: 'staging',
	httpPort: 3000,
	//httpsPort: 3001

};

environments.production = {
	envName: 'production',
	httpPort: 5000,
	//httpsPort: 5001

};

//determine which environment should be exported out

var currentEnvironment = typeof(process.env.NODE_ENV)=='string' ? process.env.NODE_ENV.toLowerCase() : '';

var environmentToPush = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

module.exports = environmentToPush;