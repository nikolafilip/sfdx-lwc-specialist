import { LightningElement, api } from 'lwc';

const TILE_WRAPPER_SELECTED_CLASS = 'tile-wrapper selected';
const TILE_WRAPPER_UNSELECTED_CLASS = 'tile-wrapper';

export default class BoatTile extends LightningElement {

    @api boat;
    @api selectedBoatId;

    get backgroundStyle() {
        secondSlashIndex = boat.Picture__c.indexOf('/', boat.Picture__c.indexOf('/') + 1);
        url = boat.Picture__c.substring(secondSlashIndex);
        return 'background-image:url(\'' + url + '\')';
    }

    get tileClass() {
        if (this.boat.Id == this.selectedBoatId) {
            return TILE_WRAPPER_SELECTED_CLASS
        } else {
            return TILE_WRAPPER_UNSELECTED_CLASS;
        }
    }

    selectBoat() {
        const boatSelect = new CustomEvent('boatselect', {
            detail: {
                boatId: this.boat.Id
            }
        });
        this.dispatchEvent(boatSelect);
        this.selectedBoatId = this.boat.Id;
    }
}