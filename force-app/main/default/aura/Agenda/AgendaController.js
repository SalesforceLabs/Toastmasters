({
    handleMeetingSelected: function(component, event, helper) {
        let meetingId = event.getParam("meetingId");
        if (!meetingId) {
            return;
        }

        component.set("v.meetingId", meetingId);
    },

    handleAccountSelected: function(component, event, helper) {
        let accountId = event.getParam("accountId");
        if (!accountId || accountId === component.get("v.accountId")) {
            return;
        }

        component.set("v.accountId", accountId);
        component.set("v.meetingId", "");
    }
});
