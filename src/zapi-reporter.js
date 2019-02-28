const ZapiReporter = (onPrepareDefer, onCompleteDefer, browser, options) => {
    this.fs = require('fs');
    this.globals = {
        executionId: '',
        cycleId: '',
        status: '1',
        cycleName: '',
        associateIt : false,
        ...options, steps: [], stepsOrdered: []
    }
    global.__ZAPIcreds = [options.ZApi.accessKey, options.ZApi.secretKey, options.ZApi.username]

    console.log('initializing ZAPI reporter')

    this.disabled = false

    this.onPrepareDefer = onPrepareDefer;
    this.onCompleteDefer = onCompleteDefer;
    this.browser = browser;

    this.specPromises = [];
    this.specPromisesResolve = {};

    // this.suitePromises = [];

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