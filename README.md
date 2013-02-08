Gopher.js
=========

Gopher server for node.js

Very simple and basic implementation that just exposes a file system via Gopher protocol.

To run it from command prompt follow next steps.

* Because you need a 'mime' module to sniff file types.

        npm install [-g] mime

* (Optional) If ROOT_DIR isn't set, then current directory will be used.

        SET ROOT_DIR=/path/to/directory/to/expose

* (Optional) System hostname will be used as reported by OS.

        SET SERVER=hostname

* (Optional) Default Gopher port is 70.

        SET PORT=port#

* And finally
 
        node Gopher.js 

Server will output log to a console.
