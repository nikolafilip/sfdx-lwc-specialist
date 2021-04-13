import { LightningElement, api, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getSimilarBoats from '@salesforce/apex/BoatDataService.getSimilarBoats';

export default class SimilarBoats extends NavigationMixin(LightningElement) {
	currentBoat;
	relatedBoats;
	boatId;
	error;

	@api get recordId() {
		// returns the boatId
		return this.boatId;
	}
	set recordId(value) {
		this.setAttribute('boatId', value);
		this.boatId = value;
	}

	@api similarBy;

	@wire(getSimilarBoats, { boatId: '$boatId', similarBy: '$similarBy' })
	similarBoats({ error, data }) {
		if (data) {
			this.relatedBoats = data;
		}
		if (error) {
			this.error = error;
		}
	}

	get getTitle() {
		return 'Similar boats by ' + this.similarBy;
	}
	get noBoats() {
		return !(this.relatedBoats && this.relatedBoats.length > 0);
	}

	openBoatDetailPage(event) {
		this[NavigationMixin.Navigate]({
			type: 'standard__recordPage',
			attributes: {
				recordId: event.detail.boatId,
				actionName: 'view'
			}
		});
	}
}