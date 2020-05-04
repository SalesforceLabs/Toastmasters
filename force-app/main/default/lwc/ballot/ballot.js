import { LightningElement, api } from "lwc";
import BALLOT_OBJECT from "@salesforce/schema/Ballot__c";
import CATEGORY_FIELD from "@salesforce/schema/Ballot__c.Category__c";
import MEMBER_FIELD from "@salesforce/schema/Ballot__c.Member__c";

export default class Ballot extends LightningElement {
    @api type;
    objectApiName = BALLOT_OBJECT.objectApiName;
    categoryField = CATEGORY_FIELD.fieldApiName;
    memberField = MEMBER_FIELD.fieldApiName;

    get category() {
        let returnValue = "";
        switch (this.type) {
            case "bestSpeaker":
                returnValue = "Best Speaker";
                break;
            case "bestTableTopics":
                returnValue = "Best Table Topics";
                break;
            case "bestEvaluator":
                returnValue = "Best Evaluator";
                break;
            default:
                break;
        }
        return returnValue;
    }

    handleSuccess() {
        this.handleHide();
    }

    handleHide() {
        this.dispatchEvent(new CustomEvent("hide"));
    }
}
