class fluentRequest {
    constructor() {
        this._url = '';
        this._method = 'GET';
        this._data = null;
        this._contentType = 'application/json';
        this._dataType = 'json';
        this._cache = false;
        this._headers = {};
    }

    send() {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: this._url,
                type: this._method,
                data: this._data,
                contentType: this._contentType,
                dataType: this._dataType,
                cache: this._cache,
                headers: this._headers
            }).then(function (response) {
                resolve(fluentResponse.parse(response));
            });
        });
    }
    
    setData(data){
        this._data = new FormData(data);
    }

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

class fluentResponse {
    constructor(response) {
        this._response = response;
        this.contentType = response.contentType;
        this.statusCode = response.statusCode;
        this.requiredAction = response.requiredAction;
        this.content = response.content;
        this.errorMessages = [];
        this.handleAction();
    }

    static parse(jsonString) {
        const responseObj = JSON.parse(JSON.stringify(jsonString));
        if (responseObj.statusCode === 200) {
            return new fluentResponse(responseObj);
        } else if(responseObj.statusCode === 400) {
            return new fluentErrorResponse(responseObj);
        }
    }

    handleAction() {
        switch (this.requiredAction) {
            case 1 || 2: // RedirectToAction
                if (this.content) {
                    window.location.href = this.content;
                }
                break;
            case 3: // Modal
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

    handleErrorResponse() {
        this.errorMessages.forEach(item => {
            let errorhandler = $(`span[id=${item.id}]`);
            
            if(errorhandler){
                errorhandler.text(item.content);
            }else{
                console.error(`Element with id ${item.key} not found`);
            }
        });
    }

    getResponse() {
        return this._response;
    }
}

class fluentErrorResponse extends fluentResponse {
    constructor(response) {
        super(response);
        if (response.content && Array.isArray(response.content)) {
            this.errorMessages = response.content;
        }
        this.handleAction();
    }
}