
module.exports = function(spec) {

    if (this.disabled) {
        return;
    }

    this.specPromises.push(new Promise((resolve) => {
        this.specPromisesResolve[spec.id] = resolve;
    }));


}

