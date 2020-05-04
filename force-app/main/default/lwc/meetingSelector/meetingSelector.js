/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { LightningElement, api, wire, track } from "lwc";
import getUpcomingMeetings from "@salesforce/apex/MeetingAgendaController.getUpcomingMeetings";
import MEETING_DATE_FIELD from "@salesforce/schema/Schedule__c.MeetingDate__c";

export default class MeetingSelector extends LightningElement {
    @api accountId;
    @track schedules;
    error;

    @wire(getUpcomingMeetings, { accountId: "$accountId" })
    wiredSchedules({ error, data }) {
        if (data) {
            this.setScheduleOptions(data);
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.schedules = [];
        }
    }

    handleChange(event) {
        this.dispatchEvent(new CustomEvent("selected", { detail: { meetingId: event.detail.value } }));
    }

    setScheduleOptions(data) {
        this.schedules = [];
        data.forEach(schedule => {
            this.schedules.push({ label: schedule[MEETING_DATE_FIELD.fieldApiName], value: schedule.Id });
        });
    }
}
