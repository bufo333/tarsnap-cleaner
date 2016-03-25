/**
 * Hello world
 * @param Object object
 * @return String
 */


 // print process.argv
 process.argv.forEach(function(val, index, array) {
     args = array;
     if (args.length!>2){
       console.log("\nThe first argument should be the length of time in days \n");
       console.log("of the oldest backup. If an argument is not entered a\n");
       console.log("default of 30 days will be used. All backups older than\n");
       console.log("30 days will be deleted!");
     }
 });

 console.log(args.slice(2));
