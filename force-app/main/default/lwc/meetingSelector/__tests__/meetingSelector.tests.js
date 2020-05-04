import { createElement } from "lwc";
import MeetingSelector from "c/meetingSelector";
import { registerApexTestWireAdapter } from "@salesforce/sfdx-lwc-jest";
import getUpcomingMeetings from "@salesforce/apex/MeetingAgendaController.getUpcomingMeetings";

const mockGetSchedules = require("./data/getUpcomingMeetings.json");
const mockGetNoRecords = require("../../__tests__/data/getSObjectsNoRecords.json");
const getUpcomingMeetingsAdapter = registerApexTestWireAdapter(getUpcomingMeetings);

describe("c-meeting-selector with data", () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        jest.clearAllMocks();
    });

    it("loads with schedules", () => {
        const element = createElement("c-meeting-selector", {
            is: MeetingSelector,
        });
        document.body.appendChild(element);
        getUpcomingMeetingsAdapter.emit(mockGetSchedules);

        return Promise.resolve().then(() => {
            const card = element.shadowRoot.querySelector("lightning-card");
            expect(card).not.toBeNull();

            const combobox = element.shadowRoot.querySelector("lightning-combobox");
            expect(combobox).not.toBeNull();
        });
    });

    it("handles a meeting selection", () => {
        const element = createElement("c-meeting-selector", {
            is: MeetingSelector,
        });
        document.body.appendChild(element);
        getUpcomingMeetingsAdapter.emit(mockGetSchedules);
        const mockSelected = jest.fn();
        element.addEventListener("selected", mockSelected);

        return Promise.resolve().then(() => {
            const combobox = element.shadowRoot.querySelector("lightning-combobox");
            combobox.dispatchEvent(new CustomEvent("change", { detail: { value: "1234" } }));

            expect(mockSelected.mock.calls.length).toBe(1);
            expect(mockSelected.mock.calls[0][0].detail).toEqual({
                meetingId: "1234",
            });
        });
    });
});

describe("c-meeting-selector without data", () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        jest.clearAllMocks();
    });

    it("loads without accounts", () => {
        const element = createElement("c-meeting-selector", {
            is: MeetingSelector,
        });
        document.body.appendChild(element);
        getUpcomingMeetingsAdapter.emit(mockGetNoRecords);

        return Promise.resolve().then(() => {
            const card = element.shadowRoot.querySelector("lightning-card");
            expect(card).not.toBeNull();

            const combobox = element.shadowRoot.querySelector("lightning-combobox");
            expect(combobox).not.toBeNull();
        });
    });
});

describe("getUpcomingMeetings @wire error", () => {
    it("shows error panel element", () => {
        const element = createElement("c-meeting-selector", {
            is: MeetingSelector,
        });
        document.body.appendChild(element);

        getUpcomingMeetingsAdapter.error();

        return Promise.resolve().then(() => {
            const card = element.shadowRoot.querySelector("lightning-card");
            expect(card).toBeNull();

            const errorPanelEl = element.shadowRoot.querySelector("c-error-panel");
            expect(errorPanelEl).not.toBeNull();
        });
    });
});
