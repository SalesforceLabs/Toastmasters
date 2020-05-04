import { LightningElement, api } from "lwc";

export default class MeetingSchedule extends LightningElement {
    @api recordId;
    @api showActionMenu;
}
