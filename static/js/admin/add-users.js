var  selectedDate = "";
$(document).ready(function() {   
    $('#editselect_project').attr("disabled", true);  
    flatpickr("#datepicker", {
        dateFormat: "Y-m-d",   
        onChange: function (selectedDates, dateStr, instance) {
           selectedDate = dateStr;           
          },    
      });        
});
$(function () {
    var emailRegx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var mobileRegx = /^(\+\d{1,3}[- ]?)?\d{10}$/;
    const axiosInstance = axios.create({
        baseURL: '/',
        timeout: 1000
    });
    $('#saveUser').click(function () {
        let userName = $('#user_name').val().trim();
        let userEmail = $('#user_email').val().trim();
        let userMobile = $('#user_mobile').val().trim();
        let scheduledDate = selectedDate;        
       
        if (!userName) {
            return showAlert("Enter user name")
        }
        if (!userEmail) {
            return showAlert("Enter user email")
        }
         if (!emailRegx.test(userEmail)) {
            return showAlert("Enter valid email")
        }
        if (!userMobile) {
            return showAlert("Enter user mobile number")
        }
         if (!mobileRegx.test(userMobile)) {
            return showAlert("Enter valid mobile number")
        } 
        if (!scheduledDate) {         
          return showAlert("Select date to schedule email")
        }
        axiosInstance.post('/admin/save-user', {
            user_name: userName,
            user_email: userEmail,
            user_mobile: userMobile,           
            scheduledDate: scheduledDate,
        }).then(function (response) {   
            if (response.data.success == true) {
                showAlert("Scheduled Email sucessfully", "success");
                setTimeout(function () {
                    window.location.href = "/admin/users-list";
                }, 1000)
            }
            else {
                return showAlert(response.data.message);
            }
        }).catch(function (error) {
            return showAlert(error.message);
        });
    })
    $('#updateUser').click(function () {
        let editUserId = $(this).attr('data-id');
        let edituserName = $('#edituser_name').val().trim();
        let edituserEmail = $('#edituser_email').val().trim();
        let edituserMobile = $('#edituser_mobile').val().trim();
        let scheduledDate = selectedDate;      
       
        if (!edituserName) {
            return showAlert("Enter user name")
        }
        if (!edituserEmail) {
            return showAlert("Enter user email")
        }
        else if (!emailRegx.test(edituserEmail)) {
            return showAlert("Enter valid email")
        }
        if (!edituserMobile) {
            return showAlert("Enter user mobile number")
        }
        else if (!mobileRegx.test(edituserMobile)) {
            return showAlert("Enter valid mobile number")
        }
        if (!scheduledDate) {         
            return showAlert("Select date to schedule email")
        }      
        axiosInstance.post('/admin/update-user', {
            edituser_name: edituserName,
            edituser_email: edituserEmail,
            edituser_mobile: edituserMobile,
            scheduledDate: scheduledDate,       
            id: editUserId,
        }).then(function (response) {
            if (response.data.success == true) {
                showAlert("Rescheduled Email sucessfully", "success");
                setTimeout(function () {
                    window.location.href = "/admin/users-list";
                }, 1000)
            }
            else {
                return showAlert(response.data.message);
            }
        }).catch(function (error) {
            return showAlert(error.message);
        });
    })
    $("#user_mobile,#edituser_mobile").on("input", function () {
        var inputValue = $(this).val();
        var sanitizedValue = inputValue.replace(/[^0-9]/g, '');
        $(this).val(sanitizedValue);
    }) 
})

