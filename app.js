'use strict';
/**
 * Hello world
 * @param Object object
 * @return String
 */
let args =[];

 // print process.argv
 process.argv.forEach(function(val, index, array) {
     args = array;
 });

/*
if(process.argv.indexOf("-h") != -1){ //does our flag exist?
    city = process.argv[process.argv.indexOf("-c") + 1]; //grab the next item
}
*/

if((process.argv.indexOf("-h") != -1) || args.length <3){
   console.log('Usage:');
   console.log('\ntsclean <command>\n');
   console.log("-m:\t Monthly valid input in months 1-12.\n\t Delete backups older than specified number.\n");
   console.log("-d:\t Daily valid input in days valid input 1-365.\n\t Deletes backups older than specified number.\n");
   console.log("-y:\t Yearly valid input in years 1-10.\n\t Deletes backups older than specified number.");
 };
 console.log(args.slice(2));
 console.log(process.argv);
