/**
 * Hello world
 * @param Object object
 * @return String
 */


 // print process.argv
 process.argv.forEach(function(val, index, array) {
     args = array;
 });

 console.log(args.slice(2));
