import { LightningElement, wire, api } from 'lwc';
import { APPLICATION_SCOPE, MessageContext, subscribe, unsubscribe } from 'lightning/messageService';
import { getRecord } from 'lightning/uiRecordApi';
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';

const LONGITUDE_FIELD = 'Boat__c.Geolocation__Longitude__s';
const LATITUDE_FIELD = 'Boat__c.Geolocation__Latitude__s';
const BOAT_FIELDS = [LONGITUDE_FIELD, LATITUDE_FIELD];

export default class BoatMap extends LightningElement {

    subscription = null;
    boatId;

    @api get recordId() {
        return this.boatId;
    }
    set recordId(value) {
        this.setAttribute('boatId', value);
        this.boatId = value;
    }

    error = undefined;
    mapMarkers = [];

    @wire(MessageContext)
    messageContext;

    @wire(getRecord, { recordId: '$boatId', fields: BOAT_FIELDS })
    wiredRecord({ error, data }) {
        if (data) {
            this.error = undefined;
            const longitude = data.fields.Geolocation__Longitude__s.value;
            const latitude = data.fields.Geolocation__Latitude__s.value;
            this.updateMap(longitude, latitude);
        } else if (error) {
            this.error = error;
            this.boatId = undefined;
            this.mapMarkers = [];
        }
    }

    subscribeMC() {
        if (this.subscription || this.recordId) {
            return;
        }
        this.subscription = subscribe(
            this.messageContext,
            BOATMC,
            (message) => { this.boatId = message.recordId }, { scope: APPLICATION_SCOPE }
        );
    }

    connectedCallback() {
        this.subscribeMC();
    }

    updateMap(Longitude, Latitude) {
        mapMarker = {
            location: {
                Latitude: Latitude,
                Longitude: Longitude
            }
        };
        this.mapMarkers.push(mapMarker);
    }

    get showMap() {
        return this.mapMarkers.length > 0;
    }
}