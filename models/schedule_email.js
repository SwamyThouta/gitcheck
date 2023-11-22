let pool = require("../database/connections").getMysqlPool();
module.exports = {
    /**
        * @param {Object} data
        * @return {Promise<{success:boolean,message:string,message_id:number}>}
        */
    savecheduledEmailData: async function (data) {
        return new Promise(async (resolve, reject) => {
            pool.query("INSERT INTO schedule_email (" + Object.keys(data).join(",") + ") VALUES (?)", [Object.values(data)])
                .then(async result => {
                    resolve({ success: true, message: "Scheduled Email successfully" });
                })
                .catch(err => {
                    console.log(err.message);
                    reject({ success: false, message: "something went wrong try again" });
                });
        })
    },

    updateUserData: async function (data, userId) {
        return new Promise(async (resolve, reject) => {
            pool.query("UPDATE schedule_email SET ? where id = ?", [data, userId])
                .then(result => {
                    resolve({ success: true, message: "Rescheduled Email sucessfully" });
                })
                .catch(err => {
                    console.log(err);
                    reject({ success: false, message: "something went wrong try again" });
                });
        })
    },  

    getScheduledEmailRecords: async function () {
        return new Promise(async (resolve) => {
            pool.query("SELECT * from schedule_email where status=1 order by id desc")
                .then(async result => {
                    resolve(result);
                })
                .catch(err => {                   
                    resolve([]);
                });
        })
    },
    getSendEmailRecords: async function (date) {
        return new Promise(async (resolve) => {
            pool.query("SELECT * FROM schedule_email WHERE status = 1 AND scheduled_date <= ? ORDER BY id DESC", [date])
                .then(async result => {
                    resolve(result);
                })
                .catch(err => {
                    console.error(err);
                    resolve([]);
                });
        });
    },
    getPendingEmailRecords: async function (date) {
        return new Promise(async (resolve) => {
            pool.query("SELECT * FROM schedule_email WHERE status = 1 AND scheduled_date > ? ORDER BY id DESC", [date])
                .then(async result => {
                    resolve(result);
                })
                .catch(err => {
                    console.error(err);
                    resolve([]);
                });
        });
    },
    currentDateScheduledEmailRecords: async function (currentDate) {
        return new Promise(async (resolve) => {
            pool.query("SELECT * from schedule_email where status=1 and scheduled_date=? order by id desc",[currentDate])
                .then(async result => {
                    resolve(result);
                })
                .catch(err => {                   
                    resolve([]);
                });
        })
    },

    getScheduledEmailById: async function (id) {
        return new Promise(async (resolve) => {
            pool.query("select * from schedule_email where id =? and status=1", [id])
                .then(async result => {
                    if (result.length !== 0) {
                        resolve(result[0]);
                    } else {
                        resolve(null)
                    }
                })
                .catch(err => {                   
                    resolve(null);
                });
        })
    } 
        
    }

