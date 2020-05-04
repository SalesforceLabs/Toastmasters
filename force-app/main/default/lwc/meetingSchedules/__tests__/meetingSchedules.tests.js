import { createElement } from "lwc";
import MeetingSchedules from "c/meetingSchedules";
import { refreshApex } from "@salesforce/apex";
import getSchedules from "@salesforce/apex/ScheduleController.getSchedules";
import { registerApexTestWireAdapter } from "@salesforce/sfdx-lwc-jest";

const mockGetSchedules = require("./data/getSchedules.json");
const mockGetNoRecords = require("../../__tests__/data/getSObjectsNoRecords.json");
const getSchedulesAdapter = registerApexTestWireAdapter(getSchedules);

jest.mock(
    "@salesforce/apex",
    () => {
        return {
            refreshApex: jest.fn(),
        };
    },
    { virtual: true }
);

jest.mock("c/meetingSchedule");

describe("c-meeting-schedules with data", () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }

        jest.clearAllMocks();
    });

    it("loads with schedules, the first is for creating a new record", () => {
        const element = createElement("c-meeting-schedules", {
            is: MeetingSchedules,
        });
        document.body.appendChild(element);
        getSchedulesAdapter.emit(mockGetSchedules);

        return Promise.resolve().then(() => {
            const card = element.shadowRoot.querySelector("lightning-card");
            expect(card).not.toBeNull();

            const schedules = element.shadowRoot.querySelectorAll("c-meeting-schedule");
            expect(schedules.length).toBe(mockGetSchedules.length + 1);

            for (let index = 0; index < schedules.length; index++) {
                if (index === 0) {
                    expect(schedules[index].recordId).toBeUndefined();
                    continue;
                }
                expect(schedules[index].recordId).toBe(mockGetSchedules[index - 1].Id);
            }
        });
    });
});
describe("c-meeting-schedules without data", () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }

        jest.clearAllMocks();
    });
    it("loads without existing schedules, with one for creating a new record", () => {
        const element = createElement("c-meeting-schedules", {
            is: MeetingSchedules,
        });
        document.body.appendChild(element);
        getSchedulesAdapter.emit(mockGetNoRecords);

        return Promise.resolve().then(() => {
            const card = element.shadowRoot.querySelector("lightning-card");
            expect(card).not.toBeNull();

            const schedules = element.shadowRoot.querySelectorAll("c-meeting-schedule");
            expect(schedules.length).toBe(1);
            expect(schedules[0].recordId).toBeUndefined();
        });
    });
    it("displays an error when unable to retrieve schedules", () => {
        const element = createElement("c-meeting-schedules", {
            is: MeetingSchedules,
        });
        document.body.appendChild(element);
        getSchedulesAdapter.error();

        return Promise.resolve().then(() => {
            const errorPanelEl = element.shadowRoot.querySelector("c-error-panel");
            expect(errorPanelEl).not.toBeNull();
        });
    });
    it("refreshes apex when new schedule created successfully", () => {
        const element = createElement("c-meeting-schedules", {
            is: MeetingSchedules,
        });
        document.body.appendChild(element);
        getSchedulesAdapter.emit(mockGetNoRecords);

        return Promise.resolve().then(() => {
            const newSchedule = element.shadowRoot.querySelector("c-meeting-schedule");
            newSchedule.dispatchEvent(new CustomEvent("success"));
            expect(refreshApex).toHaveBeenCalled();
        });
    });
});
