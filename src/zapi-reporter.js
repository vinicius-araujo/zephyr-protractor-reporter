const ZapiReporter = (onPrepareDefer, onCompleteDefer, browser, options) => {
    options = {
        executionId: '',
        cycleId: '',
        status: '1',
        projectId: 11547,
        cycleName: '',
        host: 'https://exscribe.atlassian.net',
        steps: true,
        jiraApi : {
            username : 'vinicius.dearaujo@bairesdev.com',
            apiToken : '2vhBgoJDZf4mkyivgbI8A7A3'
        },
        ZApi : {
            username : 'vinicius.dearaujo@bairesdev.com',
            accessKey : 'NjRlYWE5NTItODFlZS0zY2FkLWIzZTEtMmRkODE2M2ViODQ5IDViOGZiMDAxYTlmZDZkMmM4MzRiM2I5ZCBVU0VSX0RFRkFVTFRfTkFNRQ',
            secretKey : 'yz0MlfVddw71vlSU-NpT_6Zs1Fvl9hK_dAq3gYuA5iU'
        },
      }
    this.fs = require('fs');
    this.globals = {...options, steps: []}
    global.__ZAPIcreds = [options.ZApi.accessKey, options.ZApi.secretKey, options.ZApi.username]

    console.log('initializing ZAPI reporter')

    this.disabled = false

    this.onPrepareDefer = onPrepareDefer;
    this.onCompleteDefer = onCompleteDefer;
    this.browser = browser;

    this.specPromises = [];
    this.specPromisesResolve = {};

    this.suitePromises = [];

    this.zapiService = require('./zapi-service');
    this.jiraService = require('./jira-service').bind(this, options);

    if (this.disabled) {
        console.info('ZAPI Reporter is disabled, not doing anything.');
        if (this.onPrepareDefer.resolve) {
            this.onPrepareDefer.resolve();
        } else {
            this.onPrepareDefer.fulfill();
        }

        if (this.onCompleteDefer.resolve) {
            this.onCompleteDefer.resolve();
        } else {
            this.onCompleteDefer.fulfill();
        }
        return;
    }


    this.suiteStarted = require('./zapi-reporter-functions/suite-started').bind(this);


    require('./zapi-reporter-functions/init').bind(this)();

    this.specStarted = require('./zapi-reporter-functions/spec-started').bind(this);
    this.specDone = require('./zapi-reporter-functions/spec-done').bind(this);
    this.suiteDone = require('./zapi-reporter-functions/suite-done').bind(this);

    return this

};

module.exports = ZapiReporter;