const popsicle = require('popsicle');
const auth = require('popsicle-basic-auth');

const JiraService = (options) => {
    
    this.getIssueIdByKey = (issueKey) => {
        return popsicle.request({
            method: 'GET',
            url: `${options.host}/rest/agile/1.0` + '/issue/' + issueKey,
            body: {},
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).use(auth(options.jiraApi.username, options.jiraApi.apiToken))
        .use(popsicle.plugins.parse('json'))
        .then((res) => {
            if (res.body.id) {
                return res.body.id;
            } else {
                console.error('no issue found');
                return '-1';
            }
        }).catch((error) => {
            console.error(error);
            return '-1';
        });

    };

    this.getVersionId = () => {
        return popsicle.request({
            method: 'GET',
            url: options.jiraUrl + '/board/' + options.boardId + '/version',
            body: {},
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .use(popsicle.plugins.parse('json'))
            .use(auth(options.jiraUser, options.jiraPassword))
            .then((res) => {
                for (let i = 0; i < res.body.values.length; i++) {
                    if (res.body.values[i].name === options.version) {
                        return res.body.values[i].id;
                    }
                }
                console.error('no version ID found.');
                return '-1';
            })
            .catch((error) => {
                console.error(error);
                return '-1';
            });
    };

    return this;

};

module.exports = JiraService;

