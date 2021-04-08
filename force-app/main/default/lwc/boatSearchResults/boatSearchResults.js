// ...
import { LightningElement, wire, api } from 'lwc';
import { MessageContext, publish } from 'lightning/messageService';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import getBoats from '@salesforce/apex/BoatDataService.getBoats';
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';
import updateBoatList from '@salesforce/apex/BoatDataService.updateBoatList';


const SUCCESS_TITLE = 'Success';
const MESSAGE_SHIP_IT = 'Ship it!';
const SUCCESS_VARIANT = 'success';
const ERROR_TITLE = 'Error';
const ERROR_VARIANT = 'error';

export default class BoatSearchResults extends LightningElement {
    selectedBoatId;

    columns = [
        { label: 'Name', fieldName: 'Name', type: 'text', editable: 'true' },
        { label: 'Length', fieldName: 'Length__c', type: 'number', editable: 'true' },
        { label: 'Price', fieldName: 'Price__c', type: 'currency', editable: 'true' },
        { label: 'Description', fieldName: 'Description__c', type: 'text', editable: 'true' }
    ];

    boatTypeId = '';
    boats;
    isLoading = false;

    @wire(MessageContext)
    messageContext;

    @wire(getBoats, { boatTypeId: '$boatTypeId' })
    wiredBoats(result) {
        if (result.data) {
            this.boats = result.data;
        }
    }

    @api searchBoats(boatTypeId) {
        this.isLoading = true;
        this.notifyLoading(this.isLoading);
        this.boatTypeId = boatTypeId;
        this.isLoading = false;
        this.notifyLoading(this.isLoading);
    }

    @api async refresh() {
        this.isLoading = true;
        this.notifyLoading(this.isLoading);
        await refreshApex(this.boats);
        this.isLoading = false;
        this.notifyLoading(this.isLoading);
    }

    updateSelectedTile(event) {
        this.selectedBoatId = event.detail.boatId;
        this.sendMessageService(this.selectedBoatId);
    }

    sendMessageService(boatId) {
        publish(this.messageContext, BOATMC, {
            recordId: boatId
        });
    }

    handleSave(event) {
        this.isLoading = true;
        this.notifyLoading(this.isLoading);
        const updatedFields = event.detail.draftValues;
        updateBoatList({ data: updatedFields })
            .then(() => {
                const toastEvent = new ShowToastEvent({
                    title: SUCCESS_TITLE,
                    message: MESSAGE_SHIP_IT,
                    variant: SUCCESS_VARIANT
                });
                this.dispatchEvent(toastEvent);
                return this.refresh();
            })
            .catch(error => {
                const toastEvent = new ShowToastEvent({
                    title: ERROR_TITLE,
                    message: error.message,
                    variant: ERROR_VARIANT
                });
                this.dispatchEvent(toastEvent);
            })
            .finally(() => {
                this.isLoading = false;
                this.notifyLoading(this.isLoading);
                event.detail.draftValues = [];
            });
    }

    notifyLoading(isLoading) {
        if (isLoading) {
            this.dispatchEvent(new CustomEvent('loading'));
        } else {
            this.dispatchEvent(new CustomEvent('doneloading'));
        }
    }
}
