/**
 * Class representing a fluent request.
 */
class fluentRequest {
    /**
     * Create a fluent request.
     */
    constructor(event = null, form = null) {
        this._url = '';
        this._method = 'GET';
        this._data = null;
        this._contentType = 'application/x-www-form-urlencoded; charset=UTF-8';
        this._processData = true;
        this._dataType = '';
        this._cache = false;
        this._headers = {};
        this._button = null;

        event?.preventDefault();
        if (form) {
            $(form).find('.error').text('');
        }
    }

    /**
     * Send the request and return a promise with the response.
     * @return {Promise} A promise that resolves with the response.
     */
    send(handleActionOnStart = true) {
        let btn = $(this._button);
        btn?.addClass('disabled');
        //check if the btn is a button or a link to append the spinner
        if(btn?.is('button') || btn?.is('input[type="submit"]')){
            btn?.append('<span class="spinner-border spinner-border-sm ms-1" role="status" aria-hidden="true"></span>');
        }

        return new Promise((resolve) => {
            $.ajax({
                url: this._url,
                type: this._method,
                data: this._data,
                contentType: this._contentType,
                processData: this._processData,
                dataType: this._dataType,
                cache: this._cache,
                headers: this._headers
            }).then(function (response) {
                btn?.removeClass('disabled');
                btn?.find('.spinner-border').remove();
                resolve(fluentResponse.parse(response, handleActionOnStart));
            });
        });
    }

    /**
     * Set the data for the request.
     * @param {Object} data - The data for the request.
     */
    setData(data) {
        this._data = new FormData(data);
    }

    // The following methods set the HTTP method and send the request.
    sendPost(handleActionOnStart = true) {
        this._method = 'POST';
        return this.send(handleActionOnStart);
    }

    sendGet(handleActionOnStart = true) {
        this._method = 'GET';
        this._url = this._url + '?' + $.param(this._data);
        this._data = null;
        return this.send(handleActionOnStart);
    }

    sendPut(handleActionOnStart = true) {
        this._method = 'PUT';
        return this.send(handleActionOnStart);
    }

    sendDelete(handleActionOnStart = true) {
        this._method = 'DELETE';
        return this.send(handleActionOnStart);
    }

    sendPatch(handleActionOnStart = true) {
        this._method = 'PATCH';
        return this.send(handleActionOnStart);
    }

    sendHead(handleActionOnStart = true) {
        this._method = 'HEAD';
        return this.send(handleActionOnStart);
    }

    sendOptions(handleActionOnStart = true) {
        this._method = 'OPTIONS';
        return this.send(handleActionOnStart);
    }

    sendTrace(handleActionOnStart = true) {
        this._method = 'TRACE';
        return this.send(handleActionOnStart);
    }
}

/**
 * Class representing a fluent response.
 */
class fluentResponse {
    /**
     * Create a fluent response.
     * @param {Object} response - The response object.
     */
    constructor(response) {
        this._response = response;
        this.contentType = response.contentType;
        this.statusCode = response.statusCode;
        this.requiredAction = response.requiredAction;
        this.content = response.content;
        this.errorMessages = [];
    }

    /**
     * Parse a JSON string into a fluent response.
     * @param {string} jsonString - The JSON string to parse.
     * @param handleAction - Handle action when the response has been received.
     * @return {fluentResponse|fluentErrorResponse} The parsed response.
     */
    static parse(jsonString, handleAction = true) {
        const responseObj = JSON.parse(JSON.stringify(jsonString));
        if (responseObj.statusCode === 200) {
            let res = new fluentResponse(responseObj);
            if (handleAction) {
                res.handleAction();
            }
            return res;
        } else if (responseObj.statusCode === 400) {
            let res = new fluentErrorResponse(responseObj);
            if (handleAction) {
                res.handleAction();
            }
            return res;
        } else if (responseObj.statusCode === 500) {
            let res = new fluentInternalServerError(responseObj);
            if (handleAction) {
                res.handleAction();
            }
        }
    }

    /**
     * Handle the required action of the response.
     */
    handleAction() {
        switch (this.requiredAction) {
            case 1 || 2: // RedirectToAction
                this.handleRedirectToAction();
                break;
            case 3: // Modal
                this.handleModal();
                break;
            case 4: // Refresh
                this.handleRefresh();
                break;
            case 5: //Close
                this.handleClose();
                break;
            case 6: // HandleError
                if (this instanceof fluentErrorResponse) {
                    this.handleErrorResponse();
                }
                break;
            case 7: // Download
                this.handleDownload();
                break;
            case 8: // Internal Error
                if (this instanceof fluentInternalServerError) {
                    this.handleInternalError();
                }
                break;
        }
    }

    handleRedirectToAction() {
        if (this.requiredAction === 0 || 1 || 2) {
            if (this.content) {
                window.open(this.content.url, this.content.target);
                // window.location.href = this.content;
            } else {
                console.warn("FluentResponse: Invalid content. Cannot handle redirect to action.");
            }
        }else{
            console.warn(`FluentResponse: Current required action: ${this.requiredAction}. Cannot handle redirect to action.`);
        }
    }

    handleModal() {
        if (this.requiredAction === 0 || 3) {
            if (this.content) {
                let handler = $('#modal-handler');
                handler.html(this.content);

                const mo = handler.find('.modal');

                let backdrop = mo.data('backdrop') === undefined ? true : mo.data('backdrop');
                let keyboard = mo.data('keyboard') === undefined ? true : mo.data('keyboard');

                mo.modal({backdrop: backdrop, keyboard: keyboard});
                mo.modal('show');

                mo.on('click', '*[data-dismiss="modal"]', function () {
                    mo.modal('hide');

                    if (mo.data('ngs-reload-on-close') === true) {
                        window.location.reload();
                    }
                });
            } else {
                console.warn("FluentResponse: Invalid content. Cannot handle modal.");
            }
        } else {
            console.warn(`FluentResponse: Current required action: ${this.requiredAction}. Cannot handle modal.`);
        }
    }

    handleRefresh() {
        if (this.requiredAction === 0 || 4) {
            window.location.reload();
        }else{
            console.warn(`FluentResponse: Current required action: ${this.requiredAction}. Cannot handle refresh.`);
        }
    }

    handleClose() {
        if (this.requiredAction === 0 || 5) {
            window.close();
        }else{
            console.warn(`FluentResponse: Current required action: ${this.requiredAction}. Cannot handle close.`);
        }
    }

    /**
     * Handle the error response.
     */
    handleErrorResponse() {
        if (this.requiredAction === 0 || 6) {
            this.errorMessages.forEach(item => {
                let errorhandler = $('body').find(`span[id=${item.id}]`);

                if (errorhandler.length > 0) {
                    errorhandler.text(item.content);
                } else {
                    console.error(`Element with id ${item.id} not found. For error message: ${item.content}`);
                }
            }); 
        }else{
            console.warn(`FluentResponse: Current required action: ${this.requiredAction}. Cannot handle error response.`);
        }
    }

    handleDownload() {
        if (this.requiredAction === 0 || 7) {
            let byte = base64ToArrayBuffer(this.content.file);
            let blob = new Blob([byte], {type: this.content.contentType});
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = this.content.fileName;
            link.click();
        }else{
            console.warn(`FluentResponse: Current required action: ${this.requiredAction}. Cannot handle download.`);
        }
    }

    handleInternalError() {
        console.error("Internal error");
        $(`#${this.content.modalId}`).modal('show');
    }

    /**
     * Get the response.
     * @return {Object} The response object.
     */
    getResponse() {
        return this._response;
    }
}

/**
 * Class representing a fluent error response.
 * @extends fluentResponse
 */
class fluentErrorResponse extends fluentResponse {
    /**
     * Create a fluent error response.
     * @param {Object} response - The response object.
     */
    constructor(response) {
        super(response);
        if (response.content && Array.isArray(response.content)) {
            this.errorMessages = response.content;
        }
    }
}

class fluentInternalServerError extends fluentResponse {
    /**
     * Create a fluent error response.
     * @param {Object} response - The response object.
     */
    constructor(response) {
        super(response);
    }
}

function base64ToArrayBuffer(base64) {
    let binaryString = window.atob(base64);
    let binaryLen = binaryString.length;
    let bytes = new Uint8Array(binaryLen);
    for (let i = 0; i < binaryLen; i++) {
        let ascii = binaryString.charCodeAt(i);
        bytes[i] = ascii;
    }
    return bytes;
}