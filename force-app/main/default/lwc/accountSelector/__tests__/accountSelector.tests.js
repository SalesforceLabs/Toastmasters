import { createElement } from "lwc";
import AccountSelector from "c/accountSelector";
import { registerApexTestWireAdapter } from "@salesforce/sfdx-lwc-jest";
import getAccounts from "@salesforce/apex/MeetingAgendaController.getAccounts";

const mockGetAccounts = require("./data/getAccounts.json");
const mockGetNoRecords = require("../../__tests__/data/getSObjectsNoRecords.json");
const getAccountsAdapter = registerApexTestWireAdapter(getAccounts);

describe("c-account-selector with data", () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        jest.clearAllMocks();
    });

    it("loads with accounts", () => {
        const element = createElement("c-account-selector", {
            is: AccountSelector,
        });
        document.body.appendChild(element);
        getAccountsAdapter.emit(mockGetAccounts);

        return Promise.resolve().then(() => {
            const card = element.shadowRoot.querySelector("lightning-card");
            expect(card).not.toBeNull();

            const combobox = element.shadowRoot.querySelector("lightning-combobox");
            expect(combobox).not.toBeNull();
        });
    });

    it("handles an account selection", () => {
        const element = createElement("c-account-selector", {
            is: AccountSelector,
        });
        document.body.appendChild(element);
        getAccountsAdapter.emit(mockGetAccounts);
        const mockSelected = jest.fn();
        element.addEventListener("selected", mockSelected);

        return Promise.resolve().then(() => {
            const combobox = element.shadowRoot.querySelector("lightning-combobox");
            combobox.dispatchEvent(new CustomEvent("change", { detail: { value: "1234" } }));

            expect(mockSelected.mock.calls.length).toBe(1);
            expect(mockSelected.mock.calls[0][0].detail).toEqual({
                accountId: "1234",
            });
        });
    });
});

describe("c-account-selector without data", () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        jest.clearAllMocks();
    });

    it("loads without accounts", () => {
        const element = createElement("c-account-selector", {
            is: AccountSelector,
        });
        document.body.appendChild(element);
        getAccountsAdapter.emit(mockGetNoRecords);

        return Promise.resolve().then(() => {
            const card = element.shadowRoot.querySelector("lightning-card");
            expect(card).not.toBeNull();

            const combobox = element.shadowRoot.querySelector("lightning-combobox");
            expect(combobox).not.toBeNull();
        });
    });
});

describe("getAccounts @wire error", () => {
    it("shows error panel element", () => {
        const element = createElement("c-account-selector", {
            is: AccountSelector,
        });
        document.body.appendChild(element);

        getAccountsAdapter.error();

        return Promise.resolve().then(() => {
            const card = element.shadowRoot.querySelector("lightning-card");
            expect(card).toBeNull();

            const errorPanelEl = element.shadowRoot.querySelector("c-error-panel");
            expect(errorPanelEl).not.toBeNull();
        });
    });
});
