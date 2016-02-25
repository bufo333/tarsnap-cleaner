var cmd = "tarsnap";
var listopt = ["--list-archives"];
var spawn = require('child_process').spawn;
var delopt1 = "-d";
var delopt2 = "-f";
var result = "";
var maxAge;
var go = 1;
var result;
// print process.argv
process.argv.forEach(function(val, index, array) {
    args = array;
});

function getDates(result, callback) {
    var year, month, day;
    for (var i = 0; i < result.length;) {
        var obj = {};
        obj.year = result[i].slice(7, 11);
        obj.month = result[i].slice(11, 13);
        obj.day = result[i].slice(13, 15);
        obj.name = result[i];
        timeToDelete(obj, function(res) {
            obj.delete = res;
            result[i] = obj;
            obj = {};
            i++
            if (i === result.length) {
                callback();
            }
        });
    }
}

function deleteBackups(result, callback) {
    var count = 0;
    makeDecision(CB, callback);

    function makeDecision(CB, callback) {
        if (count === result.length) {
            callback();
            return;
        }
        if (result[count].delete) {
            console.log('Deleting ' + result[count].name);
            runProcess([delopt1, delopt2, result[count].name], CB);
        } else {
            console.log('Skipping ' + result[count].name);
            count++
            if (count === result.length) {
                callback();
                return;
            }
            makeDecision(CB, callback);
        }
    }

    function CB(res, callback) {
        count++;
        if (count - 1 === result.length) {
            callback();
            return
        } else {
            makeDecision(CB, callback);
        }
    }
}


function getListOfBackups(callback) {
    runProcess(listopt, function(results) {
        result = results.split('\n');
        if (result[-1] == undefined) {
            result.pop();
        }
        result[0] = result[0].slice(9);
        callback();
    });

}


function ageToMS(age) {
    maxAge = age * 86400000
    return maxAge;
}

function timeToDelete(obj, callback) {
    var backupDate;
    var year = obj.year;
    var month = obj.month;
    var day = obj.day;
    var currentDate;

    backupDate = new Date(year, month, day);
    currentDate = new Date();
    ageInMs = currentDate - backupDate;

    if (ageInMs > maxAge) {
        callback(true);
    } else {
        callback(false);
    }
}

function runProcess(g, callback) {

    var child = spawn(cmd, g);
    var results;
    var ee;
    child.stdout.on('data', function(chunk) {
        results += chunk;
    });

    child.stdout.on('end', function() {
        callback(results);
    });

    child.stderr.on('data', function(chunk) {
        ee += chunk;
    });
    child.stderr.on('end', function() {});
}

ageToMS(30);
getListOfBackups(function() {
    console.log('Get List of Backups...');
    getDates(result, function() {
        console.log('Calculate Dates for Deletion...');
        deleteBackups(result, function() {
            console.log('All old backups have been deleted!');
        });
    });
});
