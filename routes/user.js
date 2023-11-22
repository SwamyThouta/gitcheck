let express = require('express');
const Admin = require('../controllers/Admin');
let router = express.Router();

router.get("/", Admin.login);
router.post("/login",Admin.adminLogin);
router.get("/forgot-password", Admin.forgotPasswordpage);
router.post("/forgot-password",Admin.forgotPassword);
router.get("/reset-password", Admin.resetpasswordpage);
router.post("/reset-password",Admin.resetPassword);
router.post("/verify-otp",Admin.verifyOtp);

module.exports = router;