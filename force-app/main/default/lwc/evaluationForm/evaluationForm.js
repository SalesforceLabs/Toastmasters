import { LightningElement } from "lwc";
import EVALUATION_OBJECT from "@salesforce/schema/Evaluation__c";

export default class EvaluationForm extends LightningElement {
    objectApiName = EVALUATION_OBJECT.objectApiName;

    handleSuccess() {
        this.handleHide();
    }

    handleHide() {
        this.dispatchEvent(new CustomEvent("hide"));
    }
}
