
$(function () {
    const axiosInstance = axios.create({
        baseURL: '/',
        timeout: 1000
    });
    $(document).ready(function () {
        $('#forgot_password').click(function () {
            let email = $("#user_email").val();             
            if (!email) {
                return showAlert("Enter your email", "error")
            }
            $("#forgot_password").attr("data-id", "0");
            axiosInstance.post('/forgot-password', {
                email: email,
            }).then(function (response) {
                if (response.data.success == true) {               
                    $("#forgot_password").attr("data-id", response.data.userId);
                    showAlert("OTP sent to email successfully", "success");
                    setTimeout(function () {
                        $('.forgot_section').addClass('d-none');
                        $('.verify_otp_section').removeClass('d-none');
                    }, 1500)

                } else { 
                    return showAlert(response.data.message, "error");
                }
            }).catch(function (error) {
                return showAlert(error.message);
            });
        })
        $('#verify_btn').click(function () {
            let otp = $("#user_otp").val();
            var userId = $("#forgot_password").attr("data-id");             
            if (!otp) {
                return showAlert("Enter your OTP", "error")
            }
            if (userId == "") {
                return showAlert("Invalid request", "error")
            }
            axiosInstance.post('/verify-otp', {
                otp: otp,
                userId: userId,
            }).then(function (response) {             
                if (response.data.success == true) {
                    localStorage.setItem("userId", response.data.userId);
                    showAlert("OTP verified successfully", "success");
                    setTimeout(function () {
                        window.location.href = "/reset-password";
                    }, 1500)
                } else {
                    return showAlert(response.data.message, "error");
                }
            }).catch(function (error) {
                return showAlert(error.message);
            });
        })
        $('#change_password_btn').click(function () {  
            let newPassword = $("#password").val();
            let confirmPassword = $("#confirm_password").val();       
            var userId = localStorage.getItem("userId");                      
             if (!newPassword) {
                return showAlert("Enter new password", "error");
            }
            if (!confirmPassword) {
                return showAlert("Enter confirm password", "error");
            }
            if (newPassword !== confirmPassword) {
                return showAlert("Password does not match", "error");
            }
            if (!userId) {
                return showAlert("Invalid request", "error");
            }     
            axiosInstance.post('/reset-password', {
                newPassword: newPassword,
                confirmPassword: confirmPassword,
                userId: userId
            }).then(function (response) {        
                if (response.data.success == true) {
                    showAlert("Password changed successfully", "success");
                    setTimeout(function () {
                        window.location.href = "/";
                    }, 1500);
                } else {
                    return showAlert(response.data.message, "error");
                }
            }).catch(function (error) {
                return showAlert(error.message);
            });
        });
    });
})

