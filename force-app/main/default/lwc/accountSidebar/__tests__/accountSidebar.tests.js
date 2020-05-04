import { createElement } from "lwc";
import AccountSidebar from "c/accountSidebar";
import { registerApexTestWireAdapter } from "@salesforce/sfdx-lwc-jest";
import getAccount from "@salesforce/apex/MeetingAgendaController.getAccount";

const MOCK_ACCOUNT = {
    Id: "0011700000pJRRXAA4",
    Name: "Toastmaster Club 1234",
    Parent: {
        Name: "Parents Just Don't Understand",
        Parent: {
            Name: "Grandforce",
        },
    },
};

const getAccountAdapter = registerApexTestWireAdapter(getAccount);

describe("c-account-sidebar", () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it("loads with a card and without data elements or error when recordId is not provided", () => {
        const element = createElement("c-account-sidebar", {
            is: AccountSidebar,
        });
        document.body.appendChild(element);

        const card = element.shadowRoot.querySelector("lightning-card");
        expect(card).not.toBeNull();

        const showDetailsButton = element.shadowRoot.querySelector("lightning-button");
        expect(showDetailsButton.label).toBe("Show Details");
    });

    it("toggles show and hide details", () => {
        const element = createElement("c-account-sidebar", {
            is: AccountSidebar,
        });
        element.recordId = MOCK_ACCOUNT.Id;
        document.body.appendChild(element);
        getAccountAdapter.emit(MOCK_ACCOUNT);

        const card = element.shadowRoot.querySelector("lightning-card");
        expect(card).not.toBeNull();

        const showDetailsButton = element.shadowRoot.querySelector("lightning-button");
        expect(showDetailsButton.label).toBe("Show Details");
        showDetailsButton.click();
        return Promise.resolve()
            .then(() => {
                const accountData = element.shadowRoot.querySelectorAll("c-account-data");
                expect(accountData.length).toBe(3);
                const hideDetailsButton = element.shadowRoot.querySelector("lightning-button");
                expect(hideDetailsButton.label).toBe("Hide Details");
                hideDetailsButton.click();
            })
            .then(() => {
                const accountData = element.shadowRoot.querySelectorAll("c-account-data");
                expect(accountData.length).toBe(0);
            });
    });

    it("loads with a card and a data per account when a recordId is provided", () => {
        const element = createElement("c-account-sidebar", {
            is: AccountSidebar,
        });
        element.recordId = MOCK_ACCOUNT.Id;
        document.body.appendChild(element);
        getAccountAdapter.emit(MOCK_ACCOUNT);

        return Promise.resolve()
            .then(() => {
                const card = element.shadowRoot.querySelector("lightning-card");
                expect(card).not.toBeNull();

                const showDetailsButton = element.shadowRoot.querySelector("lightning-button");
                showDetailsButton.click();
            })
            .then(() => {
                const accountData = element.shadowRoot.querySelectorAll("c-account-data");
                expect(accountData.length).toBe(3);
            });
    });

    it("loads with a card and a data for primary account when without parent", () => {
        const element = createElement("c-account-sidebar", {
            is: AccountSidebar,
        });
        element.recordId = MOCK_ACCOUNT.Id;
        document.body.appendChild(element);
        let accountWithoutParent = Object.assign({}, MOCK_ACCOUNT);
        accountWithoutParent.Parent = null;
        getAccountAdapter.emit(accountWithoutParent);

        return Promise.resolve()
            .then(() => {
                const card = element.shadowRoot.querySelector("lightning-card");
                expect(card).not.toBeNull();

                const showDetailsButton = element.shadowRoot.querySelector("lightning-button");
                showDetailsButton.click();
            })
            .then(() => {
                const accountData = element.shadowRoot.querySelectorAll("c-account-data");
                expect(accountData.length).toBe(1);
            });
    });

    it("loads with a card and a data for primary account with parent when without grandparent", () => {
        const element = createElement("c-account-sidebar", {
            is: AccountSidebar,
        });
        element.recordId = MOCK_ACCOUNT.Id;
        document.body.appendChild(element);
        let accountWithoutParent = Object.assign({}, MOCK_ACCOUNT);
        accountWithoutParent.Parent.Parent = null;
        getAccountAdapter.emit(accountWithoutParent);

        return Promise.resolve()
            .then(() => {
                const card = element.shadowRoot.querySelector("lightning-card");
                expect(card).not.toBeNull();

                const showDetailsButton = element.shadowRoot.querySelector("lightning-button");
                showDetailsButton.click();
            })
            .then(() => {
                const accountData = element.shadowRoot.querySelectorAll("c-account-data");
                expect(accountData.length).toBe(2);
            });
    });
});

describe("getAccount @wire error", () => {
    it("shows error panel element", () => {
        const element = createElement("c-account-selector", {
            is: AccountSidebar,
        });
        document.body.appendChild(element);

        getAccountAdapter.error();

        return Promise.resolve().then(() => {
            const card = element.shadowRoot.querySelector("lightning-card");
            expect(card).toBeNull();

            const errorPanelEl = element.shadowRoot.querySelector("c-error-panel");
            expect(errorPanelEl).not.toBeNull();
        });
    });
});
