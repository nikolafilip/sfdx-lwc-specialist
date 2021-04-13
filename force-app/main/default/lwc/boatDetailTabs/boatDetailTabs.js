import { LightningElement, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { NavigationMixin } from 'lightning/navigation';
import { APPLICATION_SCOPE, subscribe, MessageContext } from 'lightning/messageService';
import labelDetails from '@salesforce/label/c.Details';
import labelReviews from '@salesforce/label/c.Reviews';
import labelAddReview from '@salesforce/label/c.Add_Review';
import labelFullDetails from '@salesforce/label/c.Full_Details';
import labelPleaseSelectABoat from '@salesforce/label/c.Please_select_a_boat';
import BOAT_ID_FIELD from '@salesforce/schema/Boat__c.Id';
import BOAT_NAME_FIELD from '@salesforce/schema/Boat__c.Name';
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';

const BOAT_FIELDS = [BOAT_ID_FIELD, BOAT_NAME_FIELD];

export default class BoatDetailTabs extends NavigationMixin(LightningElement) {
	boatId;
	label = {
		labelDetails,
		labelReviews,
		labelAddReview,
		labelFullDetails,
		labelPleaseSelectABoat,
	};

	@wire(getRecord, { recordId: '$boatId', fields: BOAT_FIELDS })
	wiredRecord;

	@wire(MessageContext)
	messageContext;

	get detailsTabIconName() {
		return this.wiredRecord ? 'utility:anchor' : null;
	}

	get boatName() {
		return getFieldValue(this.wiredRecord, BOAT_FIELDS.BOAT_NAME_FIELD);
	}

	subscription = null;

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

	navigateToRecordViewPage() {
		this[NavigationMixin.Navigate]({
			type: 'standard__recordPage',
			attributes: {
				recordId: this.boatId,
				actionName: 'view'
			}
		});
	}

	handleReviewCreated() {
		this.template.querySelector('lightning-tabset').activeTabValue = 'reviews';
		this.template.querySelector('c-boat-reviews').refresh();
	}
}