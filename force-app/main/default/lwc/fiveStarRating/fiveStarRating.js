import { LightningElement, api } from 'lwc';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import fivestar from '@salesforce/resourceUrl/fivestar';

const ERROR_TITLE = 'Error loading five-star';
const ERROR_VARIANT = 'error';
const EDITABLE_CLASS = 'c-rating';
const READ_ONLY_CLASS = 'readonly c-rating';

export default class FiveStarRating extends LightningElement {

  @api readOnly;
  @api value;

  editedValue;
  isRendered;

  get starClass() {
    return this.readOnly ? READ_ONLY_CLASS : EDITABLE_CLASS;
  }

  renderedCallback() {
    if (this.isRendered) {
      return;
    }
    this.loadScript();
    this.isRendered = true;
  }

  loadScript() {
    loadScript(this, fivestar + '/rating.js').then(() => {
      this.initializeRating();
      return loadStyle(this, fivestar + '/rating.css');
    })
      .catch((error) => {
        const toastEvent = new ShowToastEvent({
          title: ERROR_TITLE,
          message: error.message,
          variant: ERROR_VARIANT
        });
        this.dispatchEvent(toastEvent)
      });
  }

  initializeRating() {
    let domEl = this.template.querySelector('ul');
    let maxRating = 5;
    let self = this;
    let callback = function (rating) {
      self.editedValue = rating;
      self.ratingChanged(rating);
    };
    this.ratingObj = window.rating(
      domEl,
      this.value,
      maxRating,
      callback,
      this.readOnly
    );
  }

  ratingChanged(rating) {
    const ratingChangeEvent = new CustomEvent('ratingchange', {
      detail: {
        rating: rating
      }
    });
    this.dispatchEvent(ratingChangeEvent);
  }
}