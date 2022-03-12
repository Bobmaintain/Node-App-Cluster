# Node-App-Cluster


Node App Cluster.

Having more servers than the number of cores will not improve the performance of your app. But with app clusters, you can create an independent server for each core (CPU) on the system.

App clusters are good for two reasons: first, they can help maximize the performance of a given server (the hardware, or virtual machine), and second, it's a low overhead way to test app under parallel conditions.

Node itself supports app clusters, a simple, single-server form of scaling out. Make good use of it.
