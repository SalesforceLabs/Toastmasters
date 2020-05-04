/* eslint-disable no-console */
import { LightningElement, wire, api } from "lwc";
import getAccount from "@salesforce/apex/MeetingAgendaController.getAccount";

export default class AccountSidebar extends LightningElement {
    @api recordId;
    showDetails = false;
    detailsButtonLabel = "Show Details";
    accountData;
    parentData;
    grandParentData;
    error;

    @wire(getAccount, { recordId: "$recordId" })
    wiredAccount({ error, data }) {
        // TODO: refactor into an array of accounts
        if (data) {
            this.accountData = data;

            if (data.Parent) {
                this.parentData = data.Parent;

                if (data.Parent.Parent) {
                    this.grandParentData = data.Parent.Parent;
                }
            }

            error = undefined;
        } else if (error) {
            this.error = error;

            this.accountData = undefined;
            this.parentData = undefined;
            this.grandParentData = undefined;
        }
    }
    toggleDetails() {
        if (!this.showDetails) {
            this.showDetails = true;
            this.detailsButtonLabel = "Hide Details";
            return;
        }

        this.showDetails = false;
        this.detailsButtonLabel = "Show Details";
    }
}
