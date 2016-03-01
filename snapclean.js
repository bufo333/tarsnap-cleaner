'use strict';
let cmd = "tarsnap";
let listOpt = ["--list-archives"];
let spawn = require('child_process').spawn;
let delOpt1 = "-d";
let delOpt2 = "-f";
let maxAge;
let result;
let args;

/**
 * converts backup name to date to be used in calculating age of backup
 * @param Array
 * @param Callback function
 */
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

/**
 * Deletes backups older than 30 days.
 * @param Array
 * @param Callback function
 * Function is recursive, and has 2 inner functions used as callbacks
 * CB and makeDecision with the latter wrapping CB
 */
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
            makeDecision(CB, callback); //recursive call of makedecision
        }
    }
    function CB(res, callback) {
        count++;
        if (count - 1 === result.length) {
            callback();
            return
        } else {
            makeDecision(CB, callback); //recursive call of makedecision
        }
    }
}

/**
 * Pulls latest updates from tarsnap and cleans up results
 * @param Callback function
 */
function getListOfBackups(callback) {
    runProcess(listOpt, function(results) {
        result = results.split('\n');
        if (result[-1] === undefined) {
            result.pop();
        }
        result[0] = result[0].slice(9);
        callback();
    });

}

/**
 * Finds the user enterred max backup age and converts to ms
 * @param integer
 */
function ageToMS(age) {
    maxAge = age * 86400000
    return;
}

/**
 * Calculates if backup is older than 30 days
 * @param Object
 * @param Callback function
 */
function timeToDelete(obj, callback) {
    let backupDate;
    let year = obj.year;
    let month = obj.month;
    let day = obj.day;
    let currentDate;
    backupDate = new Date(year, month, day);
    currentDate = new Date();
    let ageInMs = currentDate - backupDate;

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
function runProcess(cmdArguments, callback) {

    let child = spawn(cmd, cmdArguments);
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

process.argv.forEach(function(val, index, array) {
    args = array;
});

if (args.length!>2){
  console.log("\nThe first argument should be the length of time in days \n");
  console.log("of the oldest backup. If an argument is not entered a\n");
  console.log("default of 30 days will be used. All backups older than\n");
  console.log("30 days will be deleted!");
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
