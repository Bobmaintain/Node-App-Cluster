const cluster = require('cluster');

function startworker() {
  const worker = cluster.fork();
  console.log('CLUSTER: Worker %d started', worker.id);
}

if (cluster.isMaster) {
  require('os')
    .cpus()
    .forEach(() => {
      startworker();
    });

  // log any workers that disconnet; if a worker disconnects, it should then exitm so we'll wait for the exit event to spawn a new worker to replace it.
  cluster.on('disconnect', (worker) => {
    console.log('CLUSTER: Worker %d disconnected from the cluster.', worker.id);
  });

  // when a worker dies(exits), create a worker to replace it.
  cluster.on('exit', (worker, code, signal) => {
    console.log(
      'CLUSTER: Worker %d died with exit code %d (%s)',
      worker.id,
      code,
      signal
    );
    startworker();
  });
} else {
  // start our app on worker;
  require('./app.js')();
}

/*
When this JavaScript is executed, it will either be in the context of master(when it is run directly, with node nodeAppCluster.js), or in the context of a worker, when Node’s cluster system executes it.The properties cluster.isMaster and cluster.isWorker determine which context you’re running in.When we run this script, it’s executing in master mode, and we start a worker using cluster.fork for each CPU in the system.Also, we respawn any dead workers by listening for exit events from workers.
    
Finally, in the else clause, we handle the worker case. You can configure your app.js to be used as a module, and simply import it and immediately invoke it. However, remember to export your app.js as a function that starts the server...like so:
*/

function startServer() {
  http.createServer(app).listen(app.get('port'), () => {
    console.log(
      'Express started in ' +
        app.get('env') +
        ' mode on http://localhost:' +
        app.get('port') +
        '; press Ctrl-C to terminate.'
    );
  });
}
if (require.main === module) {
  // application run directly; start app server
  startServer();
} else {
  // application imported as a module via "require": export function
  // to create server
  module.exports = startServer;
}

/* Now start up your our new clustered server:
node nodeAppCluster.js


N/B: If you are using virtualization (like Oracle’s VirtualBox), you may have to configure your VM to have multiple CPUs. By default, virtual machines often have a single CPU.

Assuming you’re on a multicore system, you should see some number of workers started. If you want to see evidence of different workers handling different requests, add the following middleware before your routes:
*/

app.use((req, res, next) => {
  const cluster = require('cluster');
  if (cluster.isWorker)
    console.log('Worker %d received request', cluster.worker.id);
});

// Now you can connect to your application with a browser. Reload a few times, and see how you can get a different worker out of the pool on each request.
