import { createElement } from "lwc";
import Ballot from "c/ballot";

describe("c-ballot", () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it("loads with lightning record edit form, schedule field and buttons", () => {
        const element = createElement("c-ballot", {
            is: Ballot,
        });
        document.body.appendChild(element);
        const card = element.shadowRoot.querySelector("lightning-card");
        expect(card).not.toBeNull();

        const editForm = element.shadowRoot.querySelector("lightning-record-edit-form");
        expect(editForm).not.toBeNull();
        expect(editForm.objectApiName).toBe("Ballot__c");

        const fields = element.shadowRoot.querySelectorAll("lightning-input-field");
        expect(fields.length).toBe(2);
        expect(fields[0].fieldName).toBe("Category__c");
        expect(fields[1].fieldName).toBe("Member__c");

        const buttons = element.shadowRoot.querySelectorAll("lightning-button");
        expect(buttons.length).toBe(2);
        expect(buttons[0].label).toBe("Cancel");
        expect(buttons[1].label).toBe("Vote");
    });

    it("loads with lightning record edit form and best speaker field", () => {
        const element = createElement("c-ballot", {
            is: Ballot,
        });
        element.type = "bestSpeaker";
        document.body.appendChild(element);

        const fields = element.shadowRoot.querySelectorAll("lightning-input-field");
        expect(fields.length).toBe(2);
        expect(fields[0].value).toBe("Best Speaker");
    });

    it("loads with lightning record edit form and best evaluator category", () => {
        const element = createElement("c-ballot", {
            is: Ballot,
        });
        element.type = "bestEvaluator";
        document.body.appendChild(element);

        const fields = element.shadowRoot.querySelectorAll("lightning-input-field");
        expect(fields.length).toBe(2);
        expect(fields[0].value).toBe("Best Evaluator");
    });

    it("loads with lightning record edit form and best table topics category", () => {
        const element = createElement("c-ballot", {
            is: Ballot,
        });
        element.type = "bestTableTopics";
        document.body.appendChild(element);

        const fields = element.shadowRoot.querySelectorAll("lightning-input-field");
        expect(fields.length).toBe(2);
        expect(fields[0].value).toBe("Best Table Topics");
    });

    it("dispatches hide event on cancel", () => {
        const element = createElement("c-ballot", {
            is: Ballot,
        });
        document.body.appendChild(element);

        const handlerHide = jest.fn();
        element.addEventListener("hide", handlerHide);

        const buttons = element.shadowRoot.querySelectorAll("lightning-button");
        buttons[0].click();
        expect(handlerHide).toHaveBeenCalled();
    });

    it("dispatches hide event on lightning record edit success", () => {
        const element = createElement("c-ballot", {
            is: Ballot,
        });
        document.body.appendChild(element);

        const handlerHide = jest.fn();
        element.addEventListener("hide", handlerHide);

        const editForm = element.shadowRoot.querySelector("lightning-record-edit-form");
        editForm.dispatchEvent(new CustomEvent("success"));
        expect(handlerHide).toHaveBeenCalled();
    });
});
