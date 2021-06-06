/**
 * Cron daemon that picks up tasks from: 
 * crontab.json (_defaultFilename)
 * every minute (_defaultRefreshRate)
 * @author Lautaro Capella <laucape@gmail.com>
 * @version 1.0.1 (2021-05-24)
 */
'use strict';
const { parseArgv } = require('./util.js');
const cron = require('node-cron');
const path = require('path');

(function() {
    "use strict";

    const _printHelp = () => console.log(`Usage: crond.js [options] [ cronTabFile.js ]

Options:

  --tab-file <CRONTAB_FILE>                 set <CRONTAB_FILE> as jobs table source.
  --refresh-rate <RATE>                     Time to wait before update <CRONTAB_FILE>. 
                                            Accepted values: '1s','10s', '1m','5m','1h','2h'. 
                                            Default '1m'. 
  --help                                    Prints this help
    
  Note: Run as \`crond.js myCronTab.js\` or \`crond.js --tab-file myCronTab.js\` have the same effect`);

    const _loadJobsTab = () => require(path.join(__dirname, _tabFile));

    var _tabFile = 'crontab.js';
    var _refreshRate = '* * * * *';

    const params = parseArgv(process.argv);
    if (params.help)
        return _printHelp();

    if (params.tabFile)
        _tabFile = params.tabFile;

    if (params.refreshRate)
        _refreshRate = params.refreshRate === '1s' ? '* * * * * *' :
        params.refreshRate === '10s' ? '*/10 * * * *' :
        params.refreshRate === '1m' ? '* * * * *' :
        params.refreshRate === '5m' ? '*/5 * * * *' :
        params.refreshRate === '1h' ? '0 * * * *' :
        params.refreshRate === '2h' ? '0 */2 * * *' :
        _refreshRate;

    var _procsArr = [];

    const _refreshProcess = () => {
        var jobsTab = _loadJobsTab() || [];
        console.log(`${(new Date()).toLocaleString()} TAB LOADED: ${jobsTab.length} JOBS`);
        if (jobsTab.length) {
            _procsArr.forEach(p => p.stop());
            _procsArr = jobsTab.map(job => cron.schedule(job.cronExp, job.cronFunc.bind(this, (new Date()))));
        }
    };
    // Entry point
    cron.schedule(_refreshRate, _refreshProcess);
    _refreshProcess();
})();