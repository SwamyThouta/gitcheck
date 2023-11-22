var jwt = require('jsonwebtoken');
const { checkToken } = require('../models/admin');
const secretkey = "109156be-c4fb-41ea-b1b4-efe1671c5836";
module.exports = {
    getJWTToken: async function (userData) {      
        let data = { user_id: userData.user_id, name:userData.name, email: userData.email, role: userData.role }  
        // console.log(data) ;return;     
        token = jwt.sign(data, secretkey, { expiresIn: "1 days" });
        return token;
    },
    veryfyToken: function (token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, secretkey, function (err, tokendata) {
                if (err) {
                    reject({ success: false, message: "invalid token" });
                }
                resolve(tokendata);
            })
        })
    },
    verifyMobileToken: async function (token) {        
        let tokenData = await checkToken(token);
        return new Promise((resolve, reject) => {
            if (tokenData == null) {
                reject({ success: false, message: "invalid token" });
            } else {
                resolve(tokenData)
            }
        })
    },
}