import { LightningElement, api } from "lwc";
import FACEBOOK_FIELD from "@salesforce/schema/Account.Facebook__c";
import LINKED_IN_FIELD from "@salesforce/schema/Account.LinkedIn__c";
import MEETUP_FIELD from "@salesforce/schema/Account.Meetup__c";

export default class AccountData extends LightningElement {
    @api account;

    get facebook() {
        return this.account[FACEBOOK_FIELD.fieldApiName];
    }

    get linkedIn() {
        return this.account[LINKED_IN_FIELD.fieldApiName];
    }

    get meetup() {
        return this.account[MEETUP_FIELD.fieldApiName];
    }
}
