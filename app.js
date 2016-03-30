#! /usr/local/bin/node
'use strict';
/**
 * Hello world
 * @param Object object
 * @return String
 */

/*
if(process.argv.indexOf("-h") != -1){ //does our flag exist?
    city = process.argv[process.argv.indexOf("-c") + 1]; //grab the next item
}
*/

if((process.argv.indexOf("-h") != -1) || process.argv.length <3)
{
  cliHelp();
}
else if (process.argv.indexOf("-m") != -1) {
  if (process.argv[process.argv.indexOf("-m") + 1] >= 1 && process.argv[process.argv.indexOf("-m") + 1] <= 12)
  {

  }
  else { cliHelp(); }
}
else if (process.argv.indexOf("-d") != -1){
  if (process.argv[process.argv.indexOf("-d") + 1] >= 1 && process.argv[process.argv.indexOf("-d") + 1] <= 365)
   {

   }
    else { cliHelp(); }
 }
 else if (process.argv.indexOf("-y") != -1) {
    if (process.argv[process.argv.indexOf("-y") + 1] >= 1 && process.argv[process.argv.indexOf("-y") + 1] <= 10)
    {

    }
    else { cliHelp(); }
  }

function cliHelp(){
  console.log('Usage:');
  console.log('\ntsclean <command>\n');
  console.log("-m:\t Monthly valid input in months 1-12.\n\t Delete backups older than specified number.\n");
  console.log("-d:\t Daily valid input in days valid input 1-365.\n\t Deletes backups older than specified number.\n");
  console.log("-y:\t Yearly valid input in years 1-10.\n\t Deletes backups older than specified number.\n");
  console.log("\nAll archives should have the naming format: Monthly|Daily|Yearly -mm-dd-yy\n");
}
//console.log(process.argv);
