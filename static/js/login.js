$(document).ready(function(){    
    var loginPasswordElement= $("#password");
    loginPasswordElement.on("keypress",function(e){
        if(e.keyCode == 13 || e.which == 13){
            login();
        }
    });
    $("body").on("click","#login_btn",function(){
        login();
    });
});
function login(){
    var emailRegx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const axiosInstance = axios.create({
        baseURL: '/',
        timeout: 1000
    });
    let username = $("#user_email").val();
    let password = $("#password").val();      
    if (!username) {
        return showAlert("Please enter email")
    }
    else if (!emailRegx.test(username)) {
        return showAlert("Please enter valid email")
    }
    if (!password) {
        return showAlert("Please enter password")
    }
    else if (password.length < 6) {
        return showAlert("Please enter valid password")
    }
    axiosInstance.post('/login', {
        user_name: username,
        password: password
    }).then(function (response) {       
        if (response.data.success == true) {            
            showAlert("Sucessfully logged In", "success");
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
}
