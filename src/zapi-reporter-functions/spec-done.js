
module.exports = function(spec) {

    if (this.disabled) {
        return;
    }
    if (spec.status === 'disabled' || spec.status === 'pending') {
        this.specPromisesResolve[spec.id]();
        return;
    }

    let specStatus = '1';
    if (spec.status !== 'passed') {
        specStatus = '2';
        this.globals.status = '2';
    }
    if (spec.description.indexOf('@') == -1) {
        this.specPromisesResolve[spec.id]();
        if(this.globals.feedback) {
            if(spec.status == 'passed') {
                console.log("\x1b[32m%s\x1b[0m" ,` ✓  ${spec.description}`);
            } else {
                console.log("\x1b[31m%s\x1b[0m" ,` X  ${spec.description}`);
            }
        }
        return;
    }

    const issueKey = spec.description.split('@')[1];
    this.globals.issueKey = issueKey;

    if(this.globals.feedback) {
        if(spec.status == 'passed') {
            console.log("\x1b[32m%s\x1b[0m" ,` ✓  ${spec.description.split('@')[0]}`);
        } else {
            console.log("\x1b[31m%s\x1b[0m" ,` X  ${spec.description.split('@')[0]}`);
        }
    }

    this.zapiService.getExecutionsForIssue(issueKey).then((list) => {
        if(list.tests.length > 0) {
            this.jiraService().getIssueIdByKey(issueKey).then((issueId) => {
                this.zapiService.updateExecutionStatus(
                list.tests[0].executionId,
                issueId,
                this.globals.projectId,
                specStatus)
                .then(() => {
                    this.specPromisesResolve[spec.id]()
                }, (error) => this.specPromisesResolve[spec.id]())
            }, (error) => this.specPromisesResolve[spec.id]())
        } else {
            createNewTestExecution.call(this);
        }
    })

    function createNewTestExecution () {        
        this.jiraService().getIssueIdByKey(issueKey).then((issueId) => {
            this.zapiService.createAdHocExecutionById(issueId, this.globals.projectId).then((executionId) => {
                this.globals.executionId = executionId;
                this.zapiService.updateExecutionStatus(
                    this.globals.executionId,
                    issueId,
                    this.globals.projectId,
                    specStatus)
                    .then(() => {
                        this.specPromisesResolve[spec.id]();
                    }, (error) => this.specPromisesResolve[spec.id]())
            }, (error) => this.specPromisesResolve[spec.id]());
        }, (error) => this.specPromisesResolve[spec.id]());
    }


}
