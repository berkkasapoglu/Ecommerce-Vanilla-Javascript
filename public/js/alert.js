class AlertMessage {

    set status(status) {
        const availableStatus = ['success', 'warning', 'danger', 'update'];
        if(availableStatus.includes(status)) {
            this._status = status;
        } else this._status = 'success';
    }

    get status() {
        return this._status
    }

    showAlert(message, status = 'success') {
        this.message = message;
        this.status = status;
        let alertContainerEl = document.querySelector('.alert-container');
        if(!alertContainerEl) {
            alertContainerEl = document.createElement('div');
            alertContainerEl.classList.add('alert-container');
            document.body.appendChild(alertContainerEl);
        }
        const alertEl = document.createElement('div');
        alertEl.classList.add('alert');
        alertEl.classList.add(`alert-${this.status}`);

        const alertMessageEl = document.createElement('div');
        alertMessageEl.classList.add('alert-message');
        alertMessageEl.textContent = `${this.message}`
        alertEl.appendChild(alertMessageEl);
        alertContainerEl.appendChild(alertEl);

        setTimeout(() => {
            alertContainerEl.removeChild(alertEl);
        }, 2000)
    }
}

export default AlertMessage;