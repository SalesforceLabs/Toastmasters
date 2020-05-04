import { LightningElement, wire } from "lwc";
import getSchedules from "@salesforce/apex/ScheduleController.getSchedules";
import { refreshApex } from "@salesforce/apex";

export default class MeetingSchedules extends LightningElement {
    showForm = true;
    labels = {
        scheduleOfRoles: "Schedule of Roles",
    };

    @wire(getSchedules)
    schedules;

    handleSuccess() {
        this.handleRefreshApex();
    }

    async handleRefreshApex() {
        this.showForm = false;
        await refreshApex(this.schedules);
        this.showForm = true;
    }
}
