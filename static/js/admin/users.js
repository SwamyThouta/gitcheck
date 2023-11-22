$(document).ready(function(){
    $('#userTable').DataTable({
        paging: true,       
        searching: false,    
        ordering: false,   
        lengthChange: false  
    });
    const axiosInstance = axios.create({
        baseURL: '/',
        timeout: 1000
    });
    let userId = "";
    $("body").on('click', '.delete_user', function () {
        userId = $(this).attr('data-id');
        if (!userId) {
            return showAlert("Invalid request")
        }
        $("#deleteModal").modal('toggle');
    }).on("click","#delete",function(){
        let element = $(this);
        let data = {
            user_id: userId
        }
        $("#deleteModal").modal('toggle');
        axiosInstance.post('/admin/delete-user', data).then(function (response) {
            if (response.data.success == true) {
                showAlert("Scheduled Email Deleted sucessfully", "success");
                setTimeout(function () {
                    location.reload();
                }, 1000)
            } else {
                showAlert(response.data.message, "error");
            }
        }).catch(function (error) {
            return showAlert(error.message);
        });
    })     
});