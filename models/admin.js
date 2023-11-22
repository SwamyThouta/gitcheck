let pool = require("../database/connections").getMysqlPool();
module.exports = {
    getUserByEmail: async function (email) {
        return new Promise(async (resolve) => {           
            pool.query("select user_id, name, email, password, role, is_admin from users where email = ? and status = ?", [email,1])
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
    },
    updateUserData: async function (data, user_id) {        
        return new Promise(async (resolve, reject) => {           
            pool.query("UPDATE users SET ? where user_id = ?", [data, user_id])
                .then(result => {                  
                    resolve({ success: true, message: "User updated successfully" });
                })
                .catch(err => {
                    reject({ success: false, message: "something went wrong try again" });
                });
        })
    },
    updateToken: async function (token, userId) {
        return new Promise(async (resolve,reject) => {            
            pool.query(`UPDATE users SET token =? WHERE user_id = ?`, [token, userId])
                .then(async result => {                  
                    if (result.affectedRows > 0) {
                        resolve({ success: true, message: "Token updated successfully" });
                    } else {
                        resolve({ success: false, message: "Token not updated" });
                    }                    
                })
                .catch(err => {
                    reject({ success: false, message: "something went wrong try again" });
                })
        })
    },
    updateOTPForAdminUser: async function (email, otp) {
        return new Promise(async (resolve) => {
            pool.query(`UPDATE users SET otp =? WHERE email = ?`, [otp, email])
                .then(async result => {
                    resolve({ success: true, message: "OTP changed successfully" });
                })
                .catch(err => {
                    resolve([])
                })
        })
    },
    verifyOTPForAdminUser: async function (otp, userId) {
        return new Promise(async (resolve) => {
            pool.query(`SELECT otp FROM users WHERE user_id = ? AND otp =?`, [userId, otp])
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
    },

    resetPasswordForAdminUser: async (userId, password) => new Promise(async (resolve) => {
        pool.query("UPDATE users SET password =? WHERE user_id = ?", [password, userId])
            .then(async (result) => {
                resolve({ success: true, message: "Password changed succesfully" });
            })
            .catch(err => {
                resolve("");
            });
    }),
    checkToken: function (token) {
        return new Promise((resolve, reject) => {
            pool.query("select user_id from users where token = ? and status = ?", [token, 1])
                .then(function (results) {
                    if (results.length !== 0) {
                        resolve(results[0])
                    } else {
                        resolve(null)
                    }
                })
                .catch(function (e) {
                    console.log(e);
                    resolve(null)
                });
        })
    },

}