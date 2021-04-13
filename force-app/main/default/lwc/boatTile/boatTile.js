import { LightningElement, api } from 'lwc';

const TILE_WRAPPER_SELECTED_CLASS = 'tile-wrapper selected';
const TILE_WRAPPER_UNSELECTED_CLASS = 'tile-wrapper';

export default class BoatTile extends LightningElement {

    @api boat;
    @api selectedBoatId;

    get backgroundStyle() {
        if (this.boat.Picture__c) {
            return 'background-image:url(\'' + this.boat.Picture__c + '\')';
        } else {
            return '';
        }
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
        // this.selectedBoatId = this.boat.Id;
    }
}