public with sharing class MeetingAgendaController {
    @TestVisible
    private static Boolean isMeetingDateAccessible {
        get {
            if (isMeetingDateAccessible == null) {
                isMeetingDateAccessible =
                    Schema.SObjectType.Schedule__c.isAccessible() &&
                    Schedule__c.MeetingDate__c.getDescribe().isAccessible();
            }
            return isMeetingDateAccessible;
        }
        set;
    }

    @TestVisible
    private static Boolean isAccountAccessible {
        get {
            if (isAccountAccessible == null) {
                isAccountAccessible = Schema.SObjectType.Account.isAccessible();
            }
            return isAccountAccessible;
        }
        set;
    }

    @AuraEnabled(cacheable=true)
    public static Account getAccount(Id recordId) {
        if (recordId == null) {
            return null;
        }

        SObjectAccessDecision securityDecision = Security.stripInaccessible(
            AccessType.READABLE,
            [
                SELECT
                    Name,
                    Description,
                    Website,
                    Parent.Name,
                    Facebook__c,
                    Meetup__c,
                    LinkedIn__c,
                    Parent.Website,
                    Parent.Parent.Name,
                    Parent.Parent.Website
                FROM Account
                WHERE Id = :recordId
            ]
        );

        return (Account) securityDecision.getRecords()[0];
    }

    // TODO: Come up with a logical/dynamic filter.
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts() {
        if (!isAccountAccessible) {
            return new List<Account>();
        }

        return [SELECT Id, Name FROM Account];
    }

    @AuraEnabled(cacheable=true)
    public static List<Schedule__c> getUpcomingMeetings(Id accountId) {
        if (accountId == null || !isMeetingDateAccessible) {
            return new List<Schedule__c>();
        }

        return [
            SELECT Id, MeetingDate__c
            FROM Schedule__c
            WHERE Club__c = :accountId AND MeetingDate__c >= :System.today()
            ORDER BY MeetingDate__c DESC
        ];
    }
}
