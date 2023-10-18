const { CronJob } = require("cron");

const testCron = new CronJob("0 */1 * * * *", () => {
  console.log(`running a task every minute ${new Date().toLocaleTimeString()}`);
});

testCron.start();
