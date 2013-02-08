//Very dumb Gopher server. Only types 0 1 3 4 5 6 9 h g s I supported.

var net = require('net');
var fs = require('fs');
var os = require("os");
var mime = require('mime');

var TAB = '\t';
var EOF = '.\r\n';

var server = net.createServer(function (sock) {
    var query = "";

    console.log('client connected from ' + sock.remoteAddress + ' port ' + sock.remotePort);

    sock.on('end', function () {
        console.log('client disconnected');
    });

    sock.on('data', function (buf) {
        console.log('received ' + buf.length + ' byte(s) of data');

        var r = false;
        for (var i = 0; i < buf.length; i++) {
            var b = buf.readUInt8(i);
            switch (b) {
                case 0x0:
                    r = false;
                    return;
                case 0xD:
                    r = true;
                    break;
                case 0xA:
                    if (r) {
                        handleQuery(query, sock);
                    }
                    break;
                default:
                    r = false;
                    query += String.fromCharCode(b);
            }
        }
    });
});

var ROOT_DIR = process.env.ROOT_DIR || process.cwd();

function handleQuery(query, sock) {
    var path = fs.realpathSync(query == '' ? ROOT_DIR + '/' : ROOT_DIR + query);
    
    console.log('handling path query ' + path);
    
    fs.exists(path, function (exists) {
        if (!exists) {
            answerError(sock, 'File ' + path + " doesn't exists");
            return;
        }
    });

    fs.stat(path, function (err, stats) {
        if (stats.isDirectory()) {
            answerDirList(sock, query, path);
        } else {
            fs.readFile(path, function (err, data) {
                sock.end(data);
            });
        }
    });
}

function answerError(sock, text) {
    sock.end('3' + text + EOF);
}

function answerDirList(sock, query, path) {
    fs.readdir(path, function (err, entries) {
        var answer = "";
        for (var i = 0; i < entries.length; i++) {
            var entry = entries[i];
            var stat = fs.statSync(path + '/' + entry);
            if (stat.isDirectory()) {
                answer += "1";
            } else {
                var mt = mime.lookup(entry);
                if ((mt.indexOf('text/html') == 0) || (mt.indexOf('application/xhtml+xml') == 0)) {
                    answer += 'h';
                } else if (mt.indexOf('uue') > -1) {
                    answer += '6';
                } else if (mt.indexOf('text/') == 0) {
                    answer += '0';
                } else if (mt.indexOf('image/gif') == 0) {
                    answer += 'g';
                } else if (mt.indexOf('image/') == 0) {
                    answer += 'I';
                } else if (mt.indexOf('audio/') == 0) {
                    answer += 's';
                } else if (mt.indexOf('binhex') > -1) {
                    answer += '4';
                } else if ((mt.indexOf('compressed') > -1) || (mt.indexOf('archive') > -1)) {
                    answer += '5';
                } else {
                    answer += '9';
                }
            }
            answer += entry + TAB + query + '/' + entry + TAB + SERVER + TAB + PORT + "\r\n"
        }
        answer += EOF;

        sock.end(answer);
    });
}

var PORT = process.env.PORT || 70;
var SERVER = process.env.SERVER || os.hostname();
server.listen(PORT, function () {
    console.log('server ' + SERVER + ' bound on port ' + PORT + ' with root dir ' + ROOT_DIR);
});