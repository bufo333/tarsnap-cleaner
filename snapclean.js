#! /usr/local/bin/node

'use strict';
let cmd = "tarsnap";
let listOpt = ["--list-archives"];
let spawn = require('child_process').spawn;
let delOpt1 = "-d";
let delOpt2 = "-f";
let maxAge;
let result = "";
let tmpResult = [];

/**
 * converts backup name to date to be used in calculating age of backup
 * @param Array
 * @param Callback function
 */
exports.getDates = function(result, callback) {
  let year, month, day;
  for (let i = 0; i < result.length;) {
    let obj = {};
    obj.year = result[i].slice(result[i].length - 8, result[i].length - 4);
    obj.month = result[i].slice(result[i].length - 4, result[i].length - 2);
    obj.day = result[i].slice(result[i].length - 2, result[i].length);
    obj.name = result[i];
    exports.timeToDelete(obj, function(res) {
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
exports.deleteBackups = function(result, callback) {
    let count = 0;
    exports.makeDecision = function(CB, callback) {
      if (count === result.length - 1) {
        callback();
        return;
      }
      if (result[count].delete) {
        console.log('Deleting ' + result[count].name);
        count++;
        exports.runProcess([delOpt1, delOpt2, result[count].name], exports.makeDecision);
      } else {
        console.log('Skipping ' + result[count].name);
        count++
        if (count === result.length - 1) {
          console.log(result.length);
          callback();
          return;
        }
        exports.makeDecision(exports.CB, callback); //recursive call of makedecision
      }
    }
    exports.makeDecision(exports.CB, callback);
    exports.CB = function(results) {
      count++;
      if (count - 1 === result.length) {
        callback();
        return
      } else {
        exports.makeDecision(exports.CB, callback); //recursive call of makedecision
      }
    }
  }
  /**
   * Pulls latest updates from tarsnap and cleans up results
   * @param Callback function
   */
exports.getListOfBackups = function(mode, callback) {
  exports.runProcess(listOpt, function(results) {
    let index;
    result = results.split('\n');
    if (result[-1] === undefined) {
      result.pop();
    }
    console.log(results);
    result[0] = result[0].slice(9);

    if (mode.toLowerCase() === '-d') {
      for (index in result) {
        if (result[index] !== undefined && result[index].substring(0, 3) === 'dai') {
          tmpResult.push(result[index]);
        }
      }
      result = tmpResult;
    } else if (mode.toLowerCase() === '-m') {
      for (index in result) {
        if (result[index] !== undefined && result[index].substring(0, 3) === 'mon') {
          tmpResult.push(result[index]);
        }
      }
      result = tmpResult;
    } else if (mode.toLowerCase() === '-y') {
      for (index in result) {
        if (result[index] !== undefined && result[index].substring(0, 3) === 'yea') {
          tmpResult.push(result[index]);
        }
      }
      result = tmpResult;
    }

    callback();
  });

}

/**
 * Finds the user enterred max backup age and converts to ms
 * @param integer
 */
exports.ageToMS = function(mode, age) {

  if (mode.toLowerCase() === "-d") {
    maxAge = age * 86400000;
  } else if (mode.toLowerCase() === "-m") {
    maxAge = age * 30 * 86400000;
  } else if (mode.toLowerCase() === "-y") {
    maxAge = age * 365 * 86400000;
  }
  return;
}

/**
 * Calculates if backup is older than 30 days
 * @param Object
 * @param Callback function
 */
exports.timeToDelete = function(obj, callback) {
  let backupDate;
  let year = obj.year;
  let month = obj.month;
  let day = obj.day;
  let currentDate;
  backupDate = new Date(year, month - 1, day);
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
exports.runProcess = function(cmdArguments, callback) {

  let child = spawn(cmd, cmdArguments);
  let results = "";
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
    if (ee) {
      console.log("\n" + ee + "\n");

    }
  });
}


exports.cliHelp = function() {
  console.log('Usage:');
  console.log('\ntsclean <command>\n');
  console.log("-m:\t Monthly valid input in months 1-12.\n\t Delete backups older than specified number.\n");
  console.log("-d:\t Daily valid input in days valid input 1-365.\n\t Deletes backups older than specified number.\n");
  console.log("-y:\t Yearly valid input in years 1-10.\n\t Deletes backups older than specified number.\n");
  console.log("\nAll archives should have the naming format: Monthly|Daily|Yearly -mmddyy\n");
}
exports.main = function(mode, value) {
  exports.ageToMS(mode, value);
  exports.getListOfBackups(mode, function() {
    console.log('Get List of Backups...');
    exports.getDates(result, function() {
      console.log('Calculate Dates for Deletion...');
      exports.deleteBackups(result, function() {
        console.log('All old backups have been deleted!');
      });
    });
  });
};


if ((process.argv.indexOf("-h") != -1) || process.argv.length < 3) {
  exports.cliHelp();
} else if (process.argv.indexOf("-m") != -1) {
  if (process.argv[process.argv.indexOf("-m") + 1] >= 1 && process.argv[process.argv.indexOf("-m") + 1] <= 12) {
    exports.main(process.argv[process.argv.indexOf("-m")], process.argv[process.argv.indexOf("-m") + 1]);
  } else {
    exports.cliHelp();
  }
} else if (process.argv.indexOf("-d") != -1) {
  if (process.argv[process.argv.indexOf("-d") + 1] >= 1 && process.argv[process.argv.indexOf("-d") + 1] <= 365) {
    exports.main(process.argv[process.argv.indexOf("-d")], process.argv[process.argv.indexOf("-d") + 1]);
  } else {
    exports.cliHelp();
  }
} else if (process.argv.indexOf("-y") != -1) {
  if (process.argv[process.argv.indexOf("-y") + 1] >= 1 && process.argv[process.argv.indexOf("-y") + 1] <= 10) {
    exports.main(process.argv[process.argv.indexOf("-y")], process.argv[process.argv.indexOf("-y") + 1]);
  } else {
    exports.cliHelp();
  }
}