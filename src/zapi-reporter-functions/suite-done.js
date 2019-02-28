module.exports = function() {

    if (this.disabled) {
        if (this.onCompleteDefer.resolve) {
            this.onCompleteDefer.resolve();
        } else {
            this.onCompleteDefer.fulfill();
        }
        return;
    }

    Promise.all(this.specPromises).then(() => {
        this.zapiService.updateExecutionStatus(
                this.globals.executionId,
                this.globals.issueKey,
                this.globals.projectId,
                this.globals.status)
            .then(() => {
                    if (this.onCompleteDefer.resolve) {
                        this.onCompleteDefer.resolve();
                    } else {
                        this.onCompleteDefer.fulfill();
                    }
                },

            );
    });

}