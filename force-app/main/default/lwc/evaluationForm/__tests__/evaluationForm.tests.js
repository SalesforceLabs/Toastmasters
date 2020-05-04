import { createElement } from "lwc";
import EvaluationForm from "c/evaluationForm";

describe("c-evaluation-form", () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it("loads with lightning record form", () => {
        const element = createElement("c-evaluation-form", {
            is: EvaluationForm,
        });
        document.body.appendChild(element);
        const card = element.shadowRoot.querySelector("lightning-card");
        expect(card).not.toBeNull();

        const form = element.shadowRoot.querySelector("lightning-record-form");
        expect(form).not.toBeNull();
        expect(form.objectApiName).toBe("Evaluation__c");
    });

    it("dispatches hide event on lightning record cancel", () => {
        const element = createElement("c-evaluation-form", {
            is: EvaluationForm,
        });
        document.body.appendChild(element);

        const handlerHide = jest.fn();
        element.addEventListener("hide", handlerHide);

        const form = element.shadowRoot.querySelector("lightning-record-form");
        form.dispatchEvent(new CustomEvent("cancel"));
        expect(handlerHide).toHaveBeenCalled();
    });

    it("dispatches hide event on lightning record success", () => {
        const element = createElement("c-evaluation-form", {
            is: EvaluationForm,
        });
        document.body.appendChild(element);

        const handlerHide = jest.fn();
        element.addEventListener("hide", handlerHide);

        const form = element.shadowRoot.querySelector("lightning-record-form");
        form.dispatchEvent(new CustomEvent("success"));
        expect(handlerHide).toHaveBeenCalled();
    });
});
