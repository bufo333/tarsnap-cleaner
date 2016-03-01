# tarsnap-cleaner
Node.js application to manage tarsnap backups

Usage.
<WARNING> Right now the app, will look at all backups on tarsnap for a given host, the prefix functionality is not yet implemented </WARNING>

Backups using tarsnap should take the following format for the naming convention. some_random_length ending with 4 digit year 2 digit month and 2 digit day. For example backup-20101123 which is backup for November 23 2010 in this case. the following command line tarsnap argument should serve as an example.

tarsnap --keyfile /path/to/tarsnap.key  -c -f backup-`date +\%Y\%m\%d` /

A best practice would be to schedule your crontab as follows:
// Daily backups     //Scheduled to run every day but one.
tarsnap --keyfile /path/to/tarsnap.key  -c -f daily-`date +\%Y\%m\%d` /   

//weekly backups, set to run once a week on the same day
tarsnap --keyfile /path/to/tarsnap.key  -c -f weekly-`date +\%Y\%m\%d` /

//Monthly backups set to run on the same date every month e.g. the first of the month
tarsnap --keyfile /path/to/tarsnap.key  -c -f monthly-`date +\%Y\%m\%d` /


Tarsnap-cleaner should be used as follows:

node snapclean.js <max age of backup>  <prefix> defaults to 30 days

Examples
node snapclean.js 30 weekly    // This command will delete any weekly backups older than 30 days
node snapclean.js 360 monthly  // This command will delete any monthly backups older than 30 days
node snapclean.js 14 daily  // This command will delete any daily backups older than 14 days

Omitting the prefix will result in tarsnap-cleaner deleting all backups older than entered value which defaults to 30 days if not specified.

