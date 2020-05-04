@IsTest
private with sharing class ScheduleController_TEST {
    private static final Integer testSchedules = ScheduleController.LIMIT_TO + 1;

    @TestSetup
    private static void generateExistingData() {
        List<Schedule__c> schedules = new List<Schedule__c>();

        for (Integer i = 0; i < testSchedules; i++) {
            schedules.add(new Schedule__c(MeetingDate__c = System.today()));
        }

        insert schedules;
    }

    @IsTest
    private static void shouldReturnLimitedSchedules() {
        List<Schedule__c> schedules = ScheduleController.getSchedules();

        System.assertEquals(
            testSchedules - 1,
            schedules.size(),
            'Expected a limited number of schedules to be returned.'
        );
    }

    @IsTest
    private static void shouldReturnEmptyListWithoutAccess() {
        ScheduleController.isObjectAccessible = false;
        List<Schedule__c> schedules = ScheduleController.getSchedules();

        System.assertEquals(
            0,
            schedules.size(),
            'Did not expect schedules to return without object access'
        );
    }
}
