# tarsnap-cleaner
Node.js application to manage tarsnap backups

### Usage.
Backups using tarsnap should take the following format for the naming convention. daily/monthly/yearly ending with  a 4 digit year 2 digit month and 2 digit day. For example backup-20101123 which is backup for November 23 2010 in this case. the following command line tarsnap argument should serve as an example.

```tarsnap --keyfile /path/to/tarsnap.key  -c -f daily-`date +\%Y\%m\%d` /```

A best practice would be to schedule your crontab as follows:
// Daily backups     //Scheduled to run every day but one.
````tarsnap --keyfile /path/to/tarsnap.key  -c -f daily-`date +\%Y\%m\%d` /   ````

//Yearly backups, set to run once a year on the same day
```tarsnap --keyfile /path/to/tarsnap.key  -c -f yearly-`date +\%Y\%m\%d` /```

//Monthly backups set to run on the same date every month e.g. the first of the month
```tarsnap --keyfile /path/to/tarsnap.key  -c -f monthly-`date +\%Y\%m\%d` /```

####Examples

#####Monthly Backups:
`node snapclean.js -m 5`

#####Daily Backups:
`node snapclean.js -d 30`

#####Yearly Backups:
`node snapclean.js -y 3`

Omitting the prefix will result in tarsnap-cleaner deleting all backups older than entered value which defaults to 30 days if not specified.

