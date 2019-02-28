module.exports = function() {

    this.browser.getProcessedConfig()
        .then((config) => {
            if (this.onPrepareDefer.resolve) {
                this.onPrepareDefer.resolve();
            } else {
                this.onPrepareDefer.fulfill();
            }


        })
        .catch((error) => {
            console.error(error);
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
            this.disabled = true;
        });

}