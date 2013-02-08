Gopher.js
=========

Gopher server for node.js

Very simple and basic implementation that just exposes a file system via Gopher protocol.

To run it from command prompt follow next steps.
0. npm install [-g] mime
   Because you need a 'mime' module to sniff file types.
1. SET ROOT_DIR=/path/to/directory/to/expose
   Optional. If ROOT_DIR isn't set, then current directory will be used.
2. SET SERVER=hostname
   Optional. System hostname will be used as reported by OS.
3. SET PORT=port#
   Optional. Default Gopher port is 70.
4. node Gopher.js

Server will output log to a console.
