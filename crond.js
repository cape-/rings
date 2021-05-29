/**
 * Cron daemon that picks up tasks from: 
 * crontab.json (_defaultFilename)
 * every minute (_defaultRefreshRate)
 * @author Lautaro Capella <laucape@gmail.com>
 * @version 1.0.1 (2021-05-24)
 */
'use strict';
const cron = require('node-cron');
const path = require('path');
const fs = require('fs');

(function() {
    const _defaultFilename = 'crontab.json';
    const _defaultRefreshRate = '* * * * *';

    const _loadJobsTab = () => JSON.parse(fs.readFileSync(path.join(__dirname, _defaultFilename)) || '');

    var _procsArr = [];

    const refreshProcess = () => {
        var jobsTab = _loadJobsTab() || [];
        console.log(`${(new Date()).toLocaleString()} TAB LOADED: ${jobsTab.length} JOBS`);
        if (jobsTab.length) {
            _procsArr.forEach(p => p.stop());
            /** @todo change what-to-do with payload cronFunc (actual console-logging) */
            _procsArr = jobsTab.map(job => cron.schedule(job.cronExp, () => console.log(job.cronFunc)));
        }
    };
    // Entry point
    cron.schedule(_defaultRefreshRate, refreshProcess);
    refreshProcess();
})();