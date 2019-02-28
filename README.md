# zephyr-protractor-reporter

Create a Zephyr tests for your Jira project.

Given a project Key, this library will create a test case for each it you have on your spec file.

## Dependencies

You must have your Jira token generated, if you don't have it you can create one accessing [Jira's webpage](https://id.atlassian.com/manage/api-tokens).

You must have your Zephyr token generated, if you don't have it you can create one accessing the Dashboard of your project, clicking on tests and then API keys.

## Installation

```
npm i zephyr-protractor-reporter-rc
```

## How to use

You will have to create a separated file in order to put your credentials and options for using it.

### Options

> Creating your options in zephyr.conf.js.

```js
const options = {
    //your project Id number
    projectId: 8888,
    //host of your project
    host: 'https://your.host.net',
    //Jira username and token
    jiraApi : {
        username : 'your.username@jira.com',
        apiToken : 'yourtoken'
    },
    //Zapi username and token
    ZApi : {
        username : 'your.username@jira.com',
        accessKey : 'yourZapiAccessKey',
        secretKey : 'yourZapiSecretKey'
    }
}

module.exports = options;
```

### Protractor configuration
> Configuration for your protractor file

```js
const options = require('./zephyr.conf');
const ZapiReporter = require('zephyr-protractor-reporter-rc');

let onPrepareDefer;
let onCompleteDefer;

exports.config = {
  allScriptsTimeout: 11000,
  specs: [
    './src/specs/**/*.spec.ts'
  ],
  capabilities: {
    'browserName': 'chrome',
    'chromeOptions': {
      'args': ['--start-maximized']
    }
  },
  directConnect: true,
  baseUrl: 'http://localhost:4200/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function() {}
  },
  onPrepare() {
    browser.ignoreSynchronization = true;
    require('ts-node').register({
      project: require('path').join(__dirname, './tsconfig.e2e.json')
    });

    onPrepareDefer = protractor.promise.defer();
    onCompleteDefer = protractor.promise.defer();
      try {
        jasmine.getEnv().addReporter(ZapiReporter(onPrepareDefer, onCompleteDefer, browser, options));
      }
      catch(err) {
          console.log(err)
      }
      return onPrepareDefer.promise;
      //You can unactive jasmine reporter
    // jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
  },
  'onComplete': function() {
    return onCompleteDefer.promise;
  },
  useAllAngular2AppRoots: true
};
```

### Spec
Inside of your spec file you should create an association between your it and your issue key using the @ symbol

> Given 'web-feature-22' as issue key, your spec file should look like this.

```js
describe('Your describe here', () => {
    // it will create an Ad hoc execution.
    it('should create an Ad hoc execution@web-feature-22', async () => {
      expect(2).toEqual(2);
    });
    // it will not affect zephyr.
    it('should do something...', async () => {
      expect(2).toEqual(2);
    });
}
```
### Result

Inside of your terminal you will have a colorful feedback step.

![Terminal Result](https://github.com/vinicius-araujo/zephyr-protractor-reporter/raw/master/screenshots/terminal_result.png)

Inside of your Jira project you will have an execution with your username and the expected result.

![Jira Result](https://github.com/vinicius-araujo/zephyr-protractor-reporter/raw/master/screenshots/jira_result.png)

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/vinicius-araujo/zephyr-protractor-reporter/tags).

## Authors

[Vinicius Araujo](https://github.com/vinicius-araujo/)

See also the list of [contributors](https://github.com/vinicius-araujo/zephyr-protractor-reporter/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details