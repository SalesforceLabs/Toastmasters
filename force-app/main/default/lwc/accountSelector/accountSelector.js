/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { LightningElement, wire } from "lwc";
import getAccounts from "@salesforce/apex/MeetingAgendaController.getAccounts";

export default class MeetingSelector extends LightningElement {
    accounts = [];
    optionsLoaded = false;
    error;

    @wire(getAccounts)
    wiredAccounts({ error, data }) {
        if (data) {
            this.setAccountOptions(data);
            this.optionsLoaded = true;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.accounts = [];
            this.optionsLoaded = false;
        }
    }

    handleChange(event) {
        this.dispatchEvent(new CustomEvent("selected", { detail: { accountId: event.detail.value } }));
    }

    setAccountOptions(data) {
        data.forEach(account => {
            this.accounts.push({ label: account.Name, value: account.Id });
        });
    }
}
