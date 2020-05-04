@IsTest
private with sharing class MeetingAgendaController_TEST {
    private static final Integer TEST_ACCOUNTS = 10;
    private static final Integer TEST_SCHEDULES = 5;

    @TestSetup
    private static void generateExistingData() {
        List<Account> accounts = new List<Account>();
        List<Schedule__c> schedules = new List<Schedule__c>();

        for (Integer i = 0; i < TEST_ACCOUNTS; i++) {
            Account accountRecord = new Account(Name = 'Test Account: ' + i + 1);
            accounts.add(accountRecord);
        }
        insert accounts;

        for (Account currentAccount : accounts) {
            for (Integer j = 0; j < TEST_SCHEDULES; j++) {
                schedules.add(new Schedule__c(Club__c = currentAccount.Id, MeetingDate__c = System.today()));
            }
        }
        insert schedules;
    }

    @IsTest
    private static void shouldReturnMatchingAccount() {
        Account accountRecord = new Account(Name = 'Test Account');
        insert accountRecord;

        Account foundAccount = MeetingAgendaController.getAccount(accountRecord.Id);
        System.assertEquals(accountRecord.Name, foundAccount.Name, 'Expected the test account to have been returned.');
    }

    @IsTest
    private static void shouldReturnNullWhenIdNotProvided() {
        Account foundAccount = MeetingAgendaController.getAccount(null);
        System.assertEquals(null, foundAccount, 'Expected null to be returned when the Id is null.');
    }

    @IsTest
    private static void shouldReturnAllAccounts() {
        List<Account> accounts = MeetingAgendaController.getAccounts();
        System.assertEquals(TEST_ACCOUNTS, accounts.size(), 'Expected all test accounts to have been returned.');
    }

    @IsTest
    private static void shouldReturnAnEmptyListWhenIdNotProvided() {
        Account accountRecord = [SELECT Id FROM Account LIMIT 1];
        List<Schedule__c> schedules = MeetingAgendaController.getUpcomingMeetings(null);

        System.assertEquals(0, schedules.size(), 'Did not expect any accounts to be returned.');
    }

    @IsTest
    private static void shouldReturnAccountSchedules() {
        Account accountRecord = [SELECT Id FROM Account LIMIT 1];
        List<Schedule__c> schedules = MeetingAgendaController.getUpcomingMeetings(accountRecord.Id);

        System.assertEquals(TEST_SCHEDULES, schedules.size(), 'Expected all schedules for the account to be returned.');
    }

    @IsTest
    private static void shouldReturnEmptyAccountListWithoutAccess() {
        MeetingAgendaController.isAccountAccessible = false;
        List<Account> schedules = MeetingAgendaController.getAccounts();

        System.assertEquals(0, schedules.size(), 'Did not expect accounts to return without object access');
    }

    @IsTest
    private static void shouldReturnEmptyScheduleListWithoutAccess() {
        MeetingAgendaController.isMeetingDateAccessible = false;
        Account accountRecord = [SELECT Id FROM Account LIMIT 1];
        List<Schedule__c> schedules = MeetingAgendaController.getUpcomingMeetings(accountRecord.Id);

        System.assertEquals(0, schedules.size(), 'Did not expect schedules to return without object access');
    }
}
