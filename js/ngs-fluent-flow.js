/**
 * Class representing a fluent request.
 */
class fluentRequest {
    /**
     * Create a fluent request.
     */
    constructor(event = null) {
        event?.preventDefault();
        this._url = '';
        this._method = 'GET';
        this._data = null;
        this._contentType = 'application/x-www-form-urlencoded; charset=UTF-8';
        this._dataType = '';
        this._cache = false;
        this._headers = {};
        this._button = null;
    }

    /**
     * Send the request and return a promise with the response.
     * @return {Promise} A promise that resolves with the response.
     */
    send() {
        $(this._button).addClass('disabled');
        
        return new Promise((resolve) => {
            $.ajax({
                url: this._url,
                type: this._method,
                data: this._data,
                contentType: this._contentType,
                dataType: this._dataType,
                cache: this._cache,
                headers: this._headers
            }).then(function (response) {
                $(this._button).removeClass('disabled');
                resolve(fluentResponse.parse(response));
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

    sendPost() {
        this._method = 'POST';
        return this.send();
    }

    sendGet() {
        this._method = 'GET';
        return this.send();
    }

    sendPut() {
        this._method = 'PUT';
        return this.send();
    }

    sendDelete() {
        this._method = 'DELETE';
        return this.send();
    }

    sendPatch() {
        this._method = 'PATCH';
        return this.send();
    }

    sendHead() {
        this._method = 'HEAD';
        return this.send();
    }

    sendOptions() {
        this._method = 'OPTIONS';
        return this.send();
    }

    sendTrace() {
        this._method = 'TRACE';
        return this.send();
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
     * @return {fluentResponse|fluentErrorResponse} The parsed response.
     */
    static parse(jsonString) {
        const responseObj = JSON.parse(JSON.stringify(jsonString));
        if (responseObj.statusCode === 200) {
            let res = new fluentResponse(responseObj);
            res.handleAction();
            return res;
        } else if (responseObj.statusCode === 400) {
            let res = new fluentErrorResponse(responseObj);
            res.handleAction();
            return res;
        }
    }

    /**
     * Handle the required action of the response.
     */
    handleAction() {
        switch (this.requiredAction) {
            case 1 || 2: // RedirectToAction
                if (this.content) {
                    window.location.href = this.content;
                }
                break;
            case 3: // Modal
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
                        
                        if($(this).data('ngs-reload') === true){
                            window.location.reload();
                        }
                    });
                }
                break;
            case 4: // Refresh
                window.location.reload();
                break;
            case 5: //Close
                window.close();
                break;
            case 6: // HandleError
                if (this instanceof fluentErrorResponse) {
                    this.handleErrorResponse();
                }
        }
    }

    /**
     * Handle the error response.
     */
    handleErrorResponse() {
        this.errorMessages.forEach(item => {
            let errorhandler = $(`span[id=${item.id}]`);

            if (errorhandler) {
                errorhandler.text(item.content);
            } else {
                console.error(`Element with id ${item.key} not found. For error message: ${item.content}`);
            }
        });
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