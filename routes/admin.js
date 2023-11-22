let express = require('express');
const Admin = require('../controllers/Admin');
const { basicRequestAuth } = require('../utills/auth');
let router = express.Router();


router.get("/logout", basicRequestAuth, Admin.logout);

//User
router.get("/users-list", basicRequestAuth, Admin.userslist);
router.get("/add-user", basicRequestAuth, Admin.adduser);
router.post("/save-user", basicRequestAuth, Admin.saveUser);
router.get("/edit-user/:id", basicRequestAuth, Admin.editUser);
router.post("/update-user", basicRequestAuth, Admin.updateUser);
router.post("/delete-user", basicRequestAuth, Admin.deleteUser);

router.get("/send-email", basicRequestAuth, Admin.sendEmail);
router.get("/pending-email", basicRequestAuth, Admin.pendingEmail);

module.exports = router;