let cmd = "tarsnap";
let listOpt = ["--list-archives"];
let spawn = require('child_process').spawn;
let delOpt1 = "-d";
let delOpt2 = "-f";
let result = "";
let maxAge;
let result;
// print process.argv
process.argv.forEach(function(val, index, array) {
    args = array;
});

function getDates(result, callback) {
    let year, month, day;
    for (let i = 0; i < result.length;) {
        let obj = {};
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
    let count = 0;
    makeDecision(CB, callback);

    function makeDecision(CB, callback) {
        if (count === result.length) {
            callback();
            return;
        }
        if (result[count].delete) {
            console.log('Deleting ' + result[count].name);
            runProcess([delOpt1, delOpt2, result[count].name], CB);
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
    runProcess(listOpt, function(results) {
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
    let backupDate;
    let year = obj.year;
    let month = obj.month;
    let day = obj.day;
    let currentDate;

    backupDate = new Date(year, month, day);
    currentDate = new Date();
    ageInMs = currentDate - backupDate;

    if (ageInMs > maxAge) {
        callback(true);
    } else {
        callback(false);
    }
}


/**
 * Runs an external program on the command line.
 * @param Array
 * @param Callback function
 */
function runProcess(arguments, callback) {

    let child = spawn(cmd, arguments);
    let results;
    let ee;
    child.stdout.on('data', function(chunk) {
        results += chunk;
    });

    child.stdout.on('end', function() {
        callback(results);
    });

    child.stderr.on('data', function(chunk) {
        ee += chunk;
    });
    child.stderr.on('end', function() {
      if(ee){ throw ee;}
    });
}

ageToMS(args[2]=30);
getListOfBackups(function() {
    console.log('Get List of Backups...');
    getDates(result, function() {
        console.log('Calculate Dates for Deletion...');
        deleteBackups(result, function() {
            console.log('All old backups have been deleted!');
        });
    });
});
