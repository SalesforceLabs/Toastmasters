public with sharing class ScheduleController {
    @TestVisible
    private static final Integer LIMIT_TO = 25; //TODO: make this dynamic
    @TestVisible
    private static Boolean isObjectAccessible {
        get {
            if (isObjectAccessible == null) {
                isObjectAccessible = Schema.SObjectType.Schedule__c.isAccessible();
            }
            return isObjectAccessible;
        }
        set;
    }

    @AuraEnabled(cacheable=true)
    public static List<Schedule__c> getSchedules() {
        List<Schedule__c> schedules = new List<Schedule__c>();
        if (!isObjectAccessible) {
            return schedules;
        }

        return [SELECT Id FROM Schedule__c ORDER BY MeetingDate__c DESC LIMIT :LIMIT_TO];
    }
}
