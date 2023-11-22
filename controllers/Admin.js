require("dotenv").config();
var bcrypt = require('bcrypt');
const validator = require('validator');
let sendMail = require('../utills/sendMail');
const saltRounds = 10;
const { getJWTToken } = require('../utills/jwt');
const { getDateTime, getDate } = require('../utills/dateTime');
const jwt = require("jsonwebtoken");
const adminUsers = require('../models/admin');
const scheduledEmail = require('../models/schedule_email');
const cron = require('node-cron');



module.exports = {
    login: async function (req, res) {
        res.render("user/login", { layout: false });
    },
    logout: async function (req, res) {
        try {
            let token = req.token;
            res.status(200).cookie('access_token', 'Bearer ' + token, {
                expires: new Date()
            }).redirect('/');
        } catch (error) {
            res.status(200).json({ success: false, message: error.message })
        }
    },
    adminLogin: async function (req, res) {
        try {
            let email = req.body.user_name;
            let password = req.body.password;

            if (!email) {
                throw new Error("Enter email")
            }
            if (!validator.isEmail(email)) {
                throw new Error("Invalid email");
            }
            if (!password) {
                throw new Error("Enter password");
            }
            let user = await adminUsers.getUserByEmail(email);
            if (!user) {
                throw new Error("user not found");
            }
            if (user['role'] == 2 && user['is_admin'] == 0) {
                throw new Error("Invalid login request!");
            }
            const isvalid = bcrypt.compareSync(password, user.password);
            if (!isvalid) {
                throw new Error("Invalid password");
            }
            const token = await getJWTToken(user);
            res.status(200).cookie('access_token', 'Bearer ' + token, {
                expires: new Date(Date.now() + 8 * 3600000),
                signed: true,
                httpOnly: true
            }).json({ success: true, message: "Successfully loggedIn", token: token, role: user['role'] });
        } catch (error) {
            res.status(200).json({ success: false, message: error.message })
        }
    },
    forgotPasswordpage: async function (req, res) {
        res.render("user/forgot-password", { layout: false });
    },
    forgotPassword: async function (req, res) {
        try {
            const email = req.body.email;
            let otp = generateOTP();
            console.log(otp)
            if (!email) {
                throw new Error("Enter email")
            }
            if (!validator.isEmail(email)) {
                throw new Error("Invalid email");
            }
            let user = await adminUsers.getUserByEmail(email);
            let userId = user.user_id;
            if (!user || user == "") {
                throw new Error("User not found");
            }
            adminUsers.updateOTPForAdminUser(email, otp).then(response => {
                sendMail.sendMail({ 'emailTemplate': 'OTP', 'email': email, 'subject': 'OTP for reset password', otp: otp });
                res.status(200).json({ 'success': true, 'message': 'Password send to mail successfully', 'userId': userId });
            }).catch(error => {
                res.status(200).json({ success: false, message: error.message })
            })
        }
        catch (error) {
            res.status(200).json({ success: false, message: error.message })
        }
    },

    verifyOtp: async function (req, res) {
        try {
            const otp = req.body.otp;
            const userId = req.body.userId;
            if (!otp) {
                throw new Error("Enter OTP");
            }
            if (!userId) {
                throw new Error("Invalid request");
            }
            let otpVerification = await adminUsers.verifyOTPForAdminUser(otp, userId);
            if (otpVerification.otp == otp) {
                res.status(200).json({ 'success': true, 'message': "OTP verified successfully", "userId": userId });
            } else {
                res.status(200).json({ success: false, message: "Invalid OTP" });
            }
        } catch (error) {
            res.status(200).json({ success: false, message: error.message });
        }
    },

    resetpasswordpage: async function (req, res) {
        res.render("user/reset-password", { layout: false });
    },
    resetPassword: async function (req, res) {
        try {
            const userId = req.body.userId;
            const newPassword = req.body.newPassword;
            const confirmPassword = req.body.confirmPassword;
            if (!userId) {
                throw new Error("Invalid request")
            }
            if (!newPassword) {
                throw new Error("Enter new password")
            }
            if (!confirmPassword) {
                throw new Error("Enter confirm password")
            }
            if (newPassword !== confirmPassword) {
                return res.status(200).send('New password and confirm password do not match');
            }
            const hashpassword = bcrypt.hashSync(newPassword, saltRounds);
            await adminUsers.resetPasswordForAdminUser(userId, hashpassword).then(response => {
                res.status(200).json({ 'success': true, 'message': "Password updated successfully" })
            })
        }
        catch (error) {
            res.status(200).json({ success: false, message: error.message })
        }
    },


    // users
    userslist: async function (req, res) {           
        data = await scheduledEmail.getScheduledEmailRecords();
        res.render("admin/users-list", { 'data': data, page: "users-list" });
    },
    adduser: async function (req, res) {
        let user = req.user;      
        res.render("admin/add-user", { page: "users-list", user: user });
    },
    saveUser: async function (req, res) {
        try {

            let userName = req.body.user_name;
            let userEmail = req.body.user_email;
            let userMobile = req.body.user_mobile;          
            let scheduledDate = req.body.scheduledDate;
           
            if (!userName) {
                throw new Error("Enter user name");
            }
            if (!userEmail) {
                throw new Error("Enter user email");
            }
            if (!userMobile) {
                throw new Error("Enter user mobile");
            }
            if (!scheduledDate) {
                throw new Error("Select date to schedule email");
            }          
           
            let date = getDateTime();
            let userData = {
                name: userName,
                email: userEmail,               
                mobile: userMobile,          
                scheduled_date : scheduledDate,
                created_at: date,
                updated_at: date
            }          
            scheduledEmail.savecheduledEmailData(userData).then(response => {
                // sendMail.sendMail({ 'emailTemplate': 'PASSWORD', 'email': userEmail, 'subject': 'Password for login', password: password });
                res.status(200).json({ 'success': true, 'message': 'Scheduled Email successfully' });
            }).catch(error => {
                res.status(200).json({ success: false, message: error.message })
            })
        }
        catch (error) {
            res.status(200).json({ success: false, message: error.message })
        }

    },
    updateUser: async function (req, res) {
        try {
            let userId = req.body.id;
            let userName = req.body.edituser_name;
            let userEmail = req.body.edituser_email;
            let userMobile = req.body.edituser_mobile;
            let scheduledDate = req.body.scheduledDate;
           
            if (!userId) {
                throw new Error("Invalid request");
            }
            if (!userName) {
                throw new Error("Enter user name");
            }
            if (!userEmail) {
                throw new Error("Enter user email");
            }
            if (!userMobile) {
                throw new Error("Enter user mobile number");
            }
            if (!scheduledDate) {
                throw new Error("Select date to schedule email");
            }          
          
            let date = getDateTime();
            let userUpdateData = {
                name: userName,
                email: userEmail,
                mobile: userMobile,
                scheduled_date : scheduledDate,              
                updated_at: date
            }
            scheduledEmail.updateUserData(userUpdateData, userId).then(response => {
                res.json(response);
            }).catch(error => {
                res.status(200).json({ success: false, message: error.message })
            })
        } catch (error) {
            res.status(200).json({ success: false, message: error.message })
        }

    },
    editUser: async function (req, res) {
        let user = req.user;
        let user_id = Buffer.from(req.params.id, 'base64').toString();
        user_id = user_id.split('=');
        user_id = user_id[1];
        let userDetail = await scheduledEmail.getScheduledEmailById(user_id);       
        res.render("admin/edit-user", { 'user_detail': userDetail , page: "users-list" });
    },
    deleteUser: async function (req, res) {
        try {
            let userId = req.body.user_id;
            if (!userId) {
                throw new Error("Invalid request");
            }
            let date = getDateTime();
            let userDeleteData = {
                status: 0,
                updated_at: date,
            }
            scheduledEmail.updateUserData(userDeleteData, userId).then(response => {
                res.json(response)
            }).catch(error => {
                res.status(200).json({ success: false, message: error.message })
            })
        } catch (error) {
            res.status(200).json({ success: false, message: error.message })
        }
    },   

    // send emails
    sendEmail: async function (req, res) {   
        let currentDate = getDate();   
        let data = await scheduledEmail.getSendEmailRecords(currentDate);        
        res.render("admin/send-email", { 'data': data, page: "send-email" });
    },   

    // pending emails
    pendingEmail: async function (req, res) {   
        let currentDate = getDate();   
        let data = await scheduledEmail.getPendingEmailRecords(currentDate);        
        res.render("admin/pending-email", { 'data': data, page: "pending-email" });
    },    

}

cron.schedule('0 0 * * *', async () => {
    try {
        let currentDate = getDate();
        let data = await scheduledEmail.currentDateScheduledEmailRecords(currentDate);
        for (const obj of data) {
            await sendMail.sendMail({
                'emailTemplate': 'ScheduleEmail',
                'email': obj.email,
                'subject': 'Scheduled Email',
                'message': "Scheduled email for the ascent"
            });
        }
        console.log('Emails sent successfully.');
    } catch (error) {
        console.error('Error sending emails:', error);
    }
});

const generateOTP = function (otpLength = 4) {
    let baseNumber = Math.pow(10, otpLength - 1);
    let number = Math.floor(Math.random() * baseNumber);
    if (number < baseNumber) {
        number += baseNumber;
    }
    return number;
};