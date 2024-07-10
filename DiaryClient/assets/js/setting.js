$(document).ready(function () {
    var token = localStorage.getItem("token");
    var username = localStorage.getItem("username");
    loadUserInfo();

    $(document).on('click', '#changeAvatar', function () {
        UploadAvatar();
    });

    $(document).on('click', '#btnUpdateProfile', function () {
        UpdateUserProfile();
    });

    // Load user information
    function loadUserInfo() {
        $.ajax({
            url: `http://localhost:5109/api/User/GetProfile`,
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            success: function (userInfo) {

                var table = `
                                <table>
                        <tr>
                            <td><b>User name: </b></td>
                            <td>
                                <input type="text" value="${userInfo.userName}"/>
                            </td>
                        </tr>
                        <tr>
                            <td><b>Full name: </b></td>
                            <td>
                                <input type="text" value="${userInfo.fullName}" id="userInfoFullname"/>
                            </td>
                        </tr>
                        <tr>
                            <td><b>Email: </b></td>
                            <td>
                                <input type="text" value="${userInfo.email}" id="userInfoEmail"/>
                            </td>
                        </tr>
                        <tr>
                            <td><b>Phone Number: </b></td>
                            <td>
                                <input type="text" value="${userInfo.phoneNumber}" id="userInfoPhoneNumber"/>
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>
                                <button class="btn" id="btnUpdateProfile">Update Profile</button>
                            </td>
                        </tr>
                    </table>
                            `;
                console.log(userInfo);
                $(".userDetailInfo").append(table);
            },
            error: function (err) {
                console.log('Error:', err);
            }
        });
    }



    // Upload Avatar
    function UploadAvatar() {
        var fileInput = document.getElementById('avatarFile');
        var file = fileInput.files[0];
        var formData = new FormData();
        formData.append('avatar', file);

        $.ajax({
            url: `http://localhost:5109/api/User/UpdateAvatar`,
            type: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                alert("Upload avatar successfully");
                window.location.href = "setting.html"; 
            },
            error: function (err) {
                console.log('Error:', err);
            }
        });
    }

    // Update User Profile
    function UpdateUserProfile() {
        var Fullname = $("#userInfoFullname").val();
        var Email = $("#userInfoEmail").val();
        var PhoneNumber = $("#userInfoPhoneNumber").val();
        $.ajax({
            url: `http://localhost:5109/api/User/UpdateProfile`,
            type: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                fullname: Fullname,
                email: Email,
                phoneNumber: PhoneNumber
            }),
            success: function () {
                alert("Update profile successfully");
                window.location.href = "setting.html"; 
            },
            error: function (err) {
                alert(`Error: ${err.responseJSON.title}`);
                console.log('Error:', err);
            }
        });
    }
});