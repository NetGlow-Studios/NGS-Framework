class AjaxRequest {
    constructor(url, event = null) {
        this.url = url;
        this.data = null;
        this.submitButton = null;
        this.processData = true;
        this.contentType = 'application/x-www-form-urlencoded';
        
        if (event != null) {
            event.preventDefault();
        }
    }

    SetData(data) {
        this.data = data;
    }

    SetSubmitButton(submitButton) {
        this.submitButton = submitButton;
    }

    SetProcessData(processData) {
        this.processData = processData;
    }

    SetContentType(contentType) {
        this.contentType = contentType;
    }

    SendPost() {
        return new Promise((resolve, reject) => {
            let ref = this;

            if (this.submitButton != null) {
                this.submitButton.append('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>');
                this.submitButton.addClass('disabled');
            }

            $.ajax({
                url: this.url,
                type: 'POST',
                data: this.data,
                processData: this.processData,
                contentType: this.contentType,
                success: function (response) {
                    ref.submitButton?.removeClass('disabled');
                    ref.submitButton?.find('.spinner-border').remove();
                    const ajaxResponse = new AjaxResponse(response);
                    resolve(ajaxResponse);
                },
                error: function (xhr, status, error) {
                    ref.submitButton?.removeClass('disabled');
                    ref.submitButton?.find('.spinner-border').remove();
                    reject(error);
                }
            });
        });
    }

    SendRawPost() {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: this.url,
                type: 'POST',
                data: this.data,
                processData: this.processData,
                contentType: this.contentType,
                success: function (response) {
                    resolve(response);
                },
                error: function (xhr, status, error) {
                    reject(error);
                }
            });
        });
    }
    
    
    SendGet() {
        return new Promise((resolve, reject) => {
            let ref = this;

            if (this.submitButton != null) {
                this.submitButton.append('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>');
                this.submitButton.addClass('disabled');
            }

            $.ajax({
                url: this.url,
                type: 'GET',
                success: function (response) {
                    ref.submitButton?.removeClass('disabled');
                    ref.submitButton?.find('.spinner-border').remove();
                    const ajaxResponse = new AjaxResponse(response);
                    resolve(ajaxResponse);
                },
                error: function (xhr, status, error) {
                    ref.submitButton?.removeClass('disabled');
                    ref.submitButton?.find('.spinner-border').remove();
                    reject(error);
                }
            });
        });
    }
}


class InternalError {
    constructor(response) {
        this.title = response.Title;
        this.message = response.Message;
        this.statusCode = response.StatusCode;
    }

    showInternalErrorModal() {
        $('#internal-error-modal-title').html(this.title + ' (statusCode: ' + this.statusCode + ')');
        $('#internal-error-modal-content').html(this.message);
        modalManage('internal-error-modal', 'show', true);
    }
}

class AjaxResponse {
    constructor(response) {
        if (response.HasInternalError === true) {
            this.isSuccess = false;
            this.errors = [];
            this.redirectToAction = null;
            this.modalId = null;
            this.modalBody = null;

            this.internalError = new InternalError(response);
            this.internalError.showInternalErrorModal();
            
            return;
        }

        this.isSuccess = response.isSuccess;
        this.redirectToAction = response.redirectToAction;
        this.errors = response.errors;
        this.modalId = response.modalId;
        this.modalBody = response.modalBody;
        
        if (this.hasModalBody()) {
            $('#modal-handler').html(this.modalBody);
        }
    }

    isSucceeded() {
        if(this.isSuccess === undefined) {
            return true;
        }
        
        return this.isSuccess;
    }

    hasRedirect() {
        return this.redirectToAction !== null && this.redirectToAction !== '';
    }

    hasFormErrors() {
        return $.isArray(this.errors) && this.errors.length > 0;
    }

    hasModalBody() {
        return this.modalBody !== null && this.modalBody !== '';
    }

    hasModal() {
        return this.modalId !== null && this.modalId !== '';
    }

    handleFormErrors(formRef = null, hasClassReferences = false) {
        const clearErrors = (ref) => {
            const selector = ref ? ref.find('.error') : $('.error');
            selector.each((index, element) => $(element).html(''));
        };

        const handleErrors = (ref, hasClassReferences) => {
            if (!this.hasFormErrors()) return;

            $.each(this.errors, (index, element) => {
                const selector = hasClassReferences ? `.${element.id}` : `#${element.id}`;
                const elem = ref ? ref.find(selector) : $(selector);
                if (elem.length) elem.html(element.content);
            });
        };

        clearErrors(formRef);
        handleErrors(formRef, hasClassReferences);
    }

    openModalIfSucceeded() {
        if (this.isSucceeded()) {
            this.openModal();
        }
    }

    openModal(asStatic = false) {
        if (this.hasModal()) {
            modalManage(this.modalId, 'show', asStatic);
        }
    }

    hideModal() {
        if (this.hasModal()) {
            modalManage(this.modalId, 'hide');
        }
    }

    RedirectIfSucceeded(target = '_self') {
        if (this.isSucceeded()) {
            this.Redirect(target);
        }
    }

    Redirect(target = '_self') {
        if (this.hasRedirect()) {
            window.open(this.redirectToAction, target);
        }
    }
    
    GetErrors() {
        return this.errors;
    }
}