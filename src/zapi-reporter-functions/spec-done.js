
module.exports = function(spec) {

    if (this.disabled) {
        return;
    }
    if (spec.status === 'disabled') {
        this.specPromisesResolve[spec.id]();
        return;
    }
    const order = spec.description.split('@')[1] - 1;

    const specDonePromises = [];

    let specStatus = '1';
    if (spec.status !== 'passed') {
        specStatus = '2';
        this.globals.status = '2';
    }

    const selectedStep = this.globals.steps[spec.description.split('@')[1] - 1];
    // console.log('Updating step: ', selectedStep.id, result.stepResults[0].id, result.stepResults[1].id)
    this.zapiService.updateTestStep(selectedStep.id, selectedStep.stepId, specStatus, this.globals.executionId, this.globals.issueKey)
    .then(() => {
        this.specPromisesResolve[spec.id]();
    }, (error) => this.specPromisesResolve[spec.id]()) 
    // this.zapiService.getAllsteps(this.globals.issueKey, this.globals.executionId).then((result) => {
    //     const selectedStep = result.stepResults[spec.description.split('@')[1] - 1];
    //     // console.log('Updating step: ', selectedStep.id, result.stepResults[0].id, result.stepResults[1].id)
    //     this.zapiService.updateTestStep(selectedStep.id, selectedStep.stepId, specStatus, this.globals.executionId, this.globals.issueKey)
    //     .then(() => {
    //         this.specPromisesResolve[spec.id]();
    //         //resolve();
    //     }, (error) => this.specPromisesResolve[spec.id]()) 
    // });
    
    // Promise.all(specDonePromises).then(() => {
    //     this.specPromisesResolve[spec.id]();
    //  });
}
