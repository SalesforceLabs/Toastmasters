const { jestConfig } = require("@salesforce/sfdx-lwc-jest/config");
module.exports = {
  ...jestConfig,
  testPathIgnorePatterns: ["force-app/main/default/lwc/__tests__/"],
};
