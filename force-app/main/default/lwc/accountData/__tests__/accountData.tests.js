import { createElement } from "lwc";
import AccountData from "c/accountData";

const MOCK_ACCOUNT = {
    Name: "Toastmaster Club 1234",
    Description: "Toastmaster Description",
    Website: "1234@example.com",
    Facebook__c: "https://www.facebook.com",
    Meetup__c: "https://www.metup.com",
    LinkedIn__c: "http://www.linkedin.com",
};

describe("c-account-data", () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it("loads without an account", () => {
        const element = createElement("c-account-data", {
            is: AccountData,
        });
        document.body.appendChild(element);

        const tile = element.shadowRoot.querySelector("lightning-tile");
        expect(tile).toBeNull();
    });

    it("loads a badge for every populated field except the description", () => {
        const element = createElement("c-account-data", {
            is: AccountData,
        });
        element.account = MOCK_ACCOUNT;
        document.body.appendChild(element);

        const tile = element.shadowRoot.querySelector("lightning-tile");
        expect(tile).not.toBeNull();

        const badges = element.shadowRoot.querySelectorAll("lightning-badge");
        expect(badges.length).toBe(Object.keys(MOCK_ACCOUNT).length - 1);
    });

    it("does not load a badge when field value is not provided", () => {
        const element = createElement("c-account-data", {
            is: AccountData,
        });
        MOCK_ACCOUNT.Facebook__c = null;
        element.account = MOCK_ACCOUNT;
        document.body.appendChild(element);

        const tile = element.shadowRoot.querySelector("lightning-tile");
        expect(tile).not.toBeNull();

        const badges = element.shadowRoot.querySelectorAll("lightning-badge");
        expect(badges.length).toBe(Object.keys(MOCK_ACCOUNT).length - 2);
    });
});
