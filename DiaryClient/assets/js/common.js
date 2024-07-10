$(document).ready(function () {
    var token = localStorage.getItem("token");
    var user = userInfoFromToken();
    localStorage.setItem("username", user.username); 
    const logout = document.getElementById('logout');

    logout.addEventListener('click', () => {
        localStorage.setItem("token", null);
        localStorage.setItem("username", null);
        window.location.href = "../";
    });

    // Avatar
    if (user) {
        var avatarUrl = `http://localhost:5109/api/User/GetAvatar/${user.username}`;        
        $('#avatar').attr('src', avatarUrl);
        $('.avatar').attr('src', avatarUrl);
        $('#avatar').attr('title', user.fullname);
        $('.userFullName').text(user.fullname)
    }

    if(token == null){
        console.log("token null")
        const auth = document.getElementById('auth');
        auth.style.display = 'block';
    }else{
        const auth = document.getElementById('auth');
        auth.style.display = 'none';
    }

    // Avatar dropdown menu
    const avatar = document.getElementById('avatar');
    const dropdownMenu = document.getElementById('dropdownMenu');

    avatar.addEventListener('click', () => {
        console.log("click avatar");
        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    });

    window.addEventListener('click', (event) => {
        if (event.target !== avatar && !avatar.contains(event.target)) {
            dropdownMenu.style.display = 'none';
        }
    });


    // Get User info from token
    function userInfoFromToken() {
        if (token) {
            var decoded = jwt_decode(token);
            var user = {
                username: decoded.name,
                fullname: decoded.fullname
            };
            console.log(user);
            return user;
        } else {
            console.log("No token found in localStorage.");
            return null;
        }
    }
});
