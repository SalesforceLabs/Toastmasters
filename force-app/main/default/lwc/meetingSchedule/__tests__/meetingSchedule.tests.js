import { createElement } from "lwc";
import MeetingSchedule from "c/meetingSchedule";
import { refreshApex } from "@salesforce/apex";

const MOCK_SCHEDULE = {
    apiName: "Schedule__c",
    id: "a003h000003XTI9AAO",
};

jest.mock(
    "@salesforce/apex",
    () => {
        return {
            refreshApex: jest.fn(),
        };
    },
    { virtual: true }
);

describe("c-meeting-schedule", () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }

        jest.clearAllMocks();
    });

    it("loads without record Id in edit mode", () => {
        const element = createElement("c-meeting-schedule", {
            is: MeetingSchedule,
        });
        document.body.appendChild(element);
        const cards = element.shadowRoot.querySelectorAll("lightning-card");
        expect(cards.length).toBe(1);
        expect(cards[0].title).toBe("New Agenda");

        const form = element.shadowRoot.querySelector("lightning-record-form");
        expect(form).not.toBeNull();
        expect(form.objectApiName).toBe("Schedule__c");
        expect(form.mode).toBe("edit");
    });

    it("dispatches success on new record save success", () => {
        const element = createElement("c-meeting-schedule", {
            is: MeetingSchedule,
        });
        document.body.appendChild(element);

        const handlerSuccess = jest.fn();
        element.addEventListener("success", handlerSuccess);

        const form = element.shadowRoot.querySelector("lightning-record-form");
        form.dispatchEvent(new CustomEvent("success"));

        expect(handlerSuccess).toHaveBeenCalled();
    });

    it("loads with record Id in view mode", () => {
        const element = createElement("c-meeting-schedule", {
            is: MeetingSchedule,
        });
        element.recordId = MOCK_SCHEDULE.id;
        document.body.appendChild(element);
        const cards = element.shadowRoot.querySelectorAll("lightning-card");
        expect(cards.length).toBe(1);
        expect(cards[0].title).toBe("Agenda");

        const form = element.shadowRoot.querySelector("lightning-record-form");
        expect(form).not.toBeNull();
        expect(form.objectApiName).toBe("Schedule__c");
        expect(form.mode).toBe("view");
    });

    it("refreshes apex when existing record saved successfully", () => {
        const element = createElement("c-meeting-schedule", {
            is: MeetingSchedule,
        });
        element.recordId = MOCK_SCHEDULE.id;
        document.body.appendChild(element);

        const form = element.shadowRoot.querySelector("lightning-record-form");
        form.dispatchEvent(new CustomEvent("success"));

        expect(refreshApex).toHaveBeenCalled();
    });
});

describe("action menu", () => {
    it("loads without an action menu", () => {
        const element = createElement("c-meeting-schedule", {
            is: MeetingSchedule,
        });
        element.showActionMenu = false;
        document.body.appendChild(element);
        const actionMenu = element.shadowRoot.querySelector("lightning-button-menu");
        expect(actionMenu).toBeNull();
    });

    it("loads with an action menu with 4 options", () => {
        const element = createElement("c-meeting-schedule", {
            is: MeetingSchedule,
        });
        element.showActionMenu = true;
        document.body.appendChild(element);
        const actionMenu = element.shadowRoot.querySelector("lightning-button-menu");
        expect(actionMenu).not.toBeNull();

        const actionItems = element.shadowRoot.querySelectorAll("lightning-menu-item");
        expect(actionItems.length).toBe(4);
    });

    it("hides agenda and shows ballot when action item with best is selected", () => {
        const element = createElement("c-meeting-schedule", {
            is: MeetingSchedule,
        });
        element.showActionMenu = true;
        document.body.appendChild(element);

        const actionMenu = element.shadowRoot.querySelector("lightning-button-menu");
        actionMenu.dispatchEvent(new CustomEvent("select", { detail: { value: "best" } }));

        return Promise.resolve()
            .then(() => {
                const cards = element.shadowRoot.querySelectorAll("lightning-card");
                expect(cards.length).toBe(1);

                const ballot = cards[0].querySelector("c-ballot");
                expect(ballot).not.toBeNull();
                ballot.dispatchEvent(new CustomEvent("hide"));
            })
            .then(() => {
                const cards = element.shadowRoot.querySelectorAll("lightning-card");
                expect(cards.length).toBe(1);
                expect(cards[0].title).toBe("New Agenda");

                const ballot = element.shadowRoot.querySelector("c-ballot");
                expect(ballot).toBeNull();
            });
    });

    it("hides agenda and shows evaluation form when action item with evaluation is selected", () => {
        const element = createElement("c-meeting-schedule", {
            is: MeetingSchedule,
        });
        element.showActionMenu = true;
        document.body.appendChild(element);

        const actionMenu = element.shadowRoot.querySelector("lightning-button-menu");
        actionMenu.dispatchEvent(new CustomEvent("select", { detail: { value: "evaluation" } }));

        return Promise.resolve()
            .then(() => {
                const cards = element.shadowRoot.querySelectorAll("lightning-card");
                expect(cards.length).toBe(1);

                const evaluation = cards[0].querySelector("c-evaluation-form");
                expect(evaluation).not.toBeNull();
                evaluation.dispatchEvent(new CustomEvent("hide"));
            })
            .then(() => {
                const cards = element.shadowRoot.querySelectorAll("lightning-card");
                expect(cards.length).toBe(1);
                expect(cards[0].title).toBe("New Agenda");

                const evaluation = element.shadowRoot.querySelector("c-evaluation-form");
                expect(evaluation).toBeNull();
            });
    });

    it("does nothing when an invalid selection is made", () => {
        const element = createElement("c-meeting-schedule", {
            is: MeetingSchedule,
        });
        element.showActionMenu = true;
        document.body.appendChild(element);

        const actionMenu = element.shadowRoot.querySelector("lightning-button-menu");
        actionMenu.dispatchEvent(new CustomEvent("select", { detail: { value: "invalid" } }));

        return Promise.resolve().then(() => {
            const cards = element.shadowRoot.querySelectorAll("lightning-card");
            expect(cards.length).toBe(1);
            expect(cards[0].title).toBe("New Agenda");
        });
    });
});
