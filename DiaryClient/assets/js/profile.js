$(document).ready(function () {
    var token = localStorage.getItem("token");
    var username = localStorage.getItem("username");

    var avatarUrl = `http://localhost:5109/api/User/GetAvatar/${username}`;
    if (avatarUrl == `http://localhost:5109/api/User/GetAvatar/null`)
        avatarUrl = `https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg`

    
    


    // Lấy ra tất cả các post của tôi (cả public và private)
    $.ajax({
        url: 'http://localhost:5109/api/Post/MyPosts',
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        success: function (data) {
            data.forEach(function (post) {
                var currentPostAvatarUrl = `http://localhost:5109/api/User/GetAvatar/${post.author}`;

                var postElement = `
                            <div class="post" id="post-${post.id}">
                                <div class="post-content-section">
                                    <div class="post-header">
                                        <div class="post-header-info">
                                            <div>
                                                <img src="${currentPostAvatarUrl}" width="40" style="object-fit: cover; border-radius: 50%"
                                                    height="40" alt="User Picture" class="useravatar">
                                            </div>
                                            <div class="post-info">
                                                <span class="fullname" name="Author">${post.authorFullname}</span><br>
                                                <span class="post-privary" name="isPublic">
                                                    ${post.isPublic
                                                        ? `<img src="https://cdn-icons-png.flaticon.com/512/44/44386.png" width="12" height="12" style="border-radius: 0; vertical-align: middle"/> public`
                                                        : `<img src="https://cdn-icons-png.flaticon.com/512/61/61457.png" width="12" height="12" style="border-radius: 0; vertical-align: middle"/> private`
                                                    }
                                                </span>
                                                <span class="post-time" name="updatedAt" style="margin-left: 1em">${new Date(post.updatedAt).toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <div class="more-btn">
                                                <button id="btnMore-${post.id}">⋮</button>
                                            </div>
                                        </div>
                                        
                                        
                                    </div>
                                    <div class="post-body">
                                        <h3 class="post-title" name="title">${post.title}</h3>
                                        <p class="post-content" name="content">${post.content}</p>
                                    </div>
                                </div>
                                <div class="comment-section" id="comments-${post.id}">
                                    <h4 style="margin: 0.75em 0;">Comments</h4>
                                    <!-- Comments will be loaded here -->
                                </div>
                                <div class="add-comment">
                                    <div style="display: flex; align-items: center;">
                                        <img src="${avatarUrl}" width="40"
                                            height="40" alt="Commenter Picture" class="avatar">
                                        <input type="text" placeholder=" Add a comment..." class="add-comment-input" id="add-comment-input-${post.id}">
                                    </div>
                                    <div>
                                        <button class="add-comment-button" data-postid="${post.id}">Add Comment</button>
                                    </div>
                                </div>
                            </div>
                        `;
                $('#mypostSection').append(postElement);
                popup(post.id)
                loadComments(post.id);
            });
        },
        error: function (err) {
            console.log('Error:', err);
        }
    });


    // Lấy ra tất cả comments từ postid cho trước
    function loadComments(postId) {
        $.ajax({
            url: `http://localhost:5109/api/Comment/MyPost/ByPostId/${postId}`,
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            success: function (comments) {
                comments.forEach(async function (comment) {
                    try {
                        var fullname = await GetFullname(comment.author);
                        var commentElement = `
                                    <div class="comment">
                                        <div class="comment-header">
                                            <div>
                                                <img src="http://localhost:5109/api/User/GetAvatar/${comment.author}"
                                                    height="40" width="40" alt="Commenter Picture" class="comment-profile-pic">
                                            </div>
                                            <div class="comment-body">
                                                <span class="comment-username">${fullname}</span><br>
                                                <span class="comment-time">${new Date(comment.updatedAt).toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <div class="comment-body">
                                            <p class="comment-content">${comment.content}</p>
                                        </div>
                                    </div>
                                `;
                        $(`#comments-${postId}`).append(commentElement);
                    } catch (error) {
                        console.log('Error:', error);
                    }
                });
            },
            error: function (err) {
                console.log('Error:', err);
            }
        });
    }
    function GetFullname(commentorUsername) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: `http://localhost:5109/api/User/GetFullname/${commentorUsername}`,
                type: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                success: function (cmtfullname) {
                    resolve(cmtfullname);
                },
                error: function (err) {
                    console.log('Error:', err);
                    reject(err);
                }
            });
        });
    }

    function popup(id) {
        $(document).on('click', `#btnMore-${id}`, function () {
            // Tạo popup menu nếu chưa tồn tại
            if ($(`#dropdownMenuBtnMore-${id}`).length === 0) {
                var popup = `
                    <div class="dropdown-menu-btn-more" id="dropdownMenuBtnMore-${id}" style="display: block; position: absolute; width: fit-content">
                        <a href="profile.html">Edit</a>
                        <a href="setting.html">Delete</a>
                    </div>
                `;
                $(this).append(popup);
    
                // Cập nhật vị trí của popup menu để nó nằm ngay bên cạnh nút "More"
                var offset = $(this).offset();
                $(`#dropdownMenuBtnMore-${id}`).css({
                    top: offset.top - $(this).outerHeight(),
                    left: offset.left
                });
            } else {
                $(`#dropdownMenuBtnMore-${id}`).toggle();
            }
        });
    
        $(document).on('mouseleave', `#btnMore-${id}, #dropdownMenuBtnMore-${id}`, function (event) {
            // Kiểm tra nếu chuột không nằm trên nút hoặc menu thì ẩn menu đi
            if (!$(event.relatedTarget).closest(`#btnMore-${id}`).length && !$(event.relatedTarget).closest(`#dropdownMenuBtnMore-${id}`).length) {
                $(`#dropdownMenuBtnMore-${id}`).hide();
            }
        });
    }
});