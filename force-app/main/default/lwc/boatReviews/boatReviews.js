import { LightningElement, api } from 'lwc';
import getAllReviews from '@salesforce/apex/BoatDataService.getAllReviews';
import { refreshApex } from '@salesforce/apex';
import { NavigationMixin } from 'lightning/navigation';

export default class BoatReviews extends NavigationMixin(LightningElement) {
	boatId;
	error;
	boatReviews;
	isLoading = true;

	@api get recordId() {
		return this.boatId;
	}
	set recordId(value) {
		this.boatId = value;
		this.setAttribute('boatId', value);
		this.getReviews();
	}

	get reviewsToShow() {
		return (!!this.boatReviews);
	}

	@api refresh() {
		this.isLoading = true;
		refreshApex(this.boatReviews);
		this.isLoading = false;
	}


	getReviews() {
		if (!this.boatId) {
			return;
		}
		this.isLoading = true;
		getAllReviews({ boatId: this.boatId })
			.then((res) => {
				this.boatReviews = res;
			})
			.catch((error) => {

			})
			.finally(() => {
				this.isLoading = false;
			});
	}

	navigateToRecord(event) {
		this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: event.detail.dataRecordId,
                actionName: 'view'
            }
        });
	}
}