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
                                        <h3 class="post-title" name="title" id="title-post-${post.id}">${post.title}</h3>
                                        <p class="post-content" name="content" id="content-post-${post.id}">${post.content}</p>
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
                popup(post)
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

    function popup(post) {
        $(document).on('click', `#btnMore-${post.id}`, function () {
            // Tạo popup menu nếu chưa tồn tại
            if ($(`#dropdownMenuBtnMore-${post.id}`).length === 0) {
                var popup = `
                    <div class="dropdown-menu-btn-more" id="dropdownMenuBtnMore-${post.id}" style="display: block; position: absolute; width: fit-content">
                        <a id="edit-post-${post.id}">Edit</a>
                        <a id="delete-post-${post.id}">Delete</a>
                    </div>
                `;
                $(this).append(popup);

                // Cập nhật vị trí của popup menu để nó nằm ngay bên cạnh nút "More"
                var offset = $(this).offset();
                $(`#dropdownMenuBtnMore-${post.id}`).css({
                    top: offset.top - $(this).outerHeight(),
                    left: offset.left
                });

                // Bắt sự kiện click btn-edit của post này
                $(document).on('click', `#edit-post-${post.id}`, function () {
                    var popupEdit = `
                        <div id="editPostDialog" style="display: block;">
                            <div>
                                <form id="editPostForm">
                                    <label for="postTitle">Title</label>
                                    <input type="text" id="postTitleEdit" value="${post.title}"><br>
                                    <label for="postContent">Content</label>
                                    <textarea id="postContentEdit" placeholder="${post.content}"></textarea><br>
                                    <label for="postIsPublic">Is Public</label>
                                    <select id="postIsPublicEdit" value="${post.isPublic}">
                                        <option value="true">Public</option>
                                        <option value="false">Private</option>
                                    </select><br>
                                    <button type="button" id="savePostChanges">Save changes</button>
                                    <button type="button" id="cancelChanges">Cancel</button>
                                </form>
                            </div>
                        </div>
                    `; 
                    $("#mypostSection").append(popupEdit);
                    
                    // Nếu ấn Save changes thì sẽ gọi api
                    $(document).on('click', `#savePostChanges`, function () {
                        var updateTitle = $("#postTitleEdit").val();
                        var updateContent = $("#postContentEdit").val();
                        updateIsPublic = ($("#postIsPublicEdit").val() == "true")?true:false;

                        if(updateContent.length == 0) 
                            updateContent = post.content;
                        $.ajax({
                            url: `http://localhost:5109/api/Post/UpdatePost`,
                            type: 'PUT',
                            headers: {
                                'Authorization': 'Bearer ' + token,
                                'Content-Type': 'application/json'
                            },
                            data: JSON.stringify({
                                id: post.id,
                                title: updateTitle,
                                content: updateContent,
                                isPublic: updateIsPublic
                            }),
                            success: function (responsePostEdit) {
                                alert(`Update post with id ${responsePostEdit.id} successfully`)
                                $(`#title-post-${post.id}`).html(responsePostEdit.title) 
                                $(`#content-post-${post.id}`).html(responsePostEdit.content) 
                                $("#editPostDialog").remove();
                                var audio = document.getElementById('tengSound');
                                audio.play();
                            },
                            error: function (err) {
                                console.log('Error:', err);
                                reject(err);
                            }
                        })
                    });
                    // Nếu ấn Cancel thì remove popup
                    $(document).on('click', `#cancelChanges`, function () {
                        alert('There are no changes to this article');
                        $("#editPostDialog").remove();
                    });
                })

                // Bắt sự kiện click btn-delete của post này
                $(document).on('click', `#delete-post-${post.id}`, function () {
                    var isDelete = confirm('Are you sure to delete this post');
                    // Nếu người dùng bấm ok thì mới call api
                    if (isDelete) {
                        $.ajax({
                            url: `http://localhost:5109/api/Post/DeletePost/${post.id}`,
                            type: 'DELETE',
                            headers: {
                                'Authorization': 'Bearer ' + token
                            },
                            success: function (responsePostDelete) {
                                alert(`Delete post with id ${post.id} successfully`)
                                var audio = document.getElementById('tengSound');
                                audio.play();
                                $(`#post-${post.id}`).remove();
                            },
                            error: function (err) {
                                console.log('Error:', err);
                                reject(err);
                            }
                        })
                    }
                })

            } else {
                $(`#dropdownMenuBtnMore-${post.id}`).toggle();
            }
        });

        $(document).on('mouseleave', `#btnMore-${post.id}, #dropdownMenuBtnMore-${post.id}`, function (event) {
            // Kiểm tra nếu chuột không nằm trên nút hoặc menu thì ẩn menu đi
            if (!$(event.relatedTarget).closest(`#btnMore-${post.id}`).length && !$(event.relatedTarget).closest(`#dropdownMenuBtnMore-${post.id}`).length) {
                $(`#dropdownMenuBtnMore-${post.id}`).hide();
            }
        });
    }
});