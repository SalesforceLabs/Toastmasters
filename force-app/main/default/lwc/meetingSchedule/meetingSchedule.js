/* eslint-disable no-console */
import { LightningElement, api, wire } from "lwc";
import SCHEDULE_OBJECT from "@salesforce/schema/Schedule__c";
import { getRecord } from "lightning/uiRecordApi";
import { refreshApex } from "@salesforce/apex";
import ID_FIELD from "@salesforce/schema/Schedule__c.Id";

export default class MeetingSchedule extends LightningElement {
    @api recordId;
    @api showActionMenu = false;
    objectApiName = SCHEDULE_OBJECT.objectApiName;
    showBallot = false;
    showEvaluation = false;
    hideAgenda = false;
    ballotType;

    @wire(getRecord, { recordId: "$recordId", fields: [ID_FIELD] }) wiredRecord;

    actionItems = [
        {
            label: "Vote for Best Speaker",
            value: "bestSpeaker",
        },
        {
            label: "Vote for Best Table Topics",
            value: "bestTableTopics",
        },
        {
            label: "Vote for Best Evaluator",
            value: "bestEvaluator",
        },
        {
            label: "New Evaluation Form",
            value: "evaluation",
        },
    ];

    get title() {
        if (this.recordId) {
            return "Agenda";
        }

        return "New Agenda";
    }

    handleSelect(event) {
        let selection = event.detail.value;

        if (selection.includes("best")) {
            this.ballotType = selection;
            this.hideAgenda = true;
            this.showBallot = true;
            return;
        }

        if (selection === "evaluation") {
            this.showEvaluation = true;
            this.hideAgenda = true;
        }
    }

    handleSuccess() {
        if (this.recordId) {
            this.handleRefreshApex(this.wiredRecord);
        } else {
            this.dispatchEvent(new CustomEvent("success"));
        }
    }

    async handleRefreshApex() {
        this.hideAgenda = true;
        await refreshApex(this.wiredRecord);
        this.hideAgenda = false;
    }

    hideBallot() {
        this.showBallot = false;
        this.hideAgenda = false;
        this.ballotType = undefined;
    }

    hideEvaluation() {
        this.showEvaluation = false;
        this.hideAgenda = false;
    }

    get mode() {
        return this.recordId ? "view" : "edit";
    }
}
