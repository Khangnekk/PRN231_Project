
$(document).ready(function () {
    var token = localStorage.getItem("token");
    var username = localStorage.getItem("username");
    
    var avatarUrl = `http://localhost:5109/api/User/GetAvatar/${username}`;
    if(avatarUrl == `http://localhost:5109/api/User/GetAvatar/null`)
        avatarUrl = `https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg`
    
    // Tạo nhật ký, đồng thời append vào newsfeed nếu bài đó là public
    $("#diarypostForm").submit(function (event) {
        event.preventDefault(); // Ngăn chặn form submit mặc định
        var audio = document.getElementById('tengSound');
        var title = $("#postTitle").val();
        var content = $("#Content").val();
        var isPublic = $("#IsPrivacy").val() === "public";
        var image = $("#postImage")[0].files[0]
        
        var formData = new FormData();
        formData.append("title", title)
        formData.append("content", content)
        formData.append("isPublic", isPublic)
        formData.append("image", image)

        $.ajax({
            url: 'http://localhost:5109/api/Post/CreatePost',
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            data: formData,
            processData: false,
                    contentType: false,
            success: function (response) {
                var postImage = `http://localhost:5109/api/Post/GetImage/${response.id}`
                var newPostElement = `
                    <div class="post" id="post-${response.id}">
                        <div class="post-content-section">
                            <div class="post-header">
                                <div>
                                    <img src="${avatarUrl}" width="40" style="object-fit: cover;"
                                        height="40" alt="User Picture" class="useravatar">
                                </div>
                                <div style="display: flex; justify-content: space-between; algin-items: center; width: 100%">
                                <div class="post-info">
                                    <span class="fullname" name="Author">${response.authorFullname}</span><br>
                                    <span class="post-time" name="updatedAt">${new Date(response.updatedAt).toLocaleString()}</span>
                                </div>
                                <div>
                                            <div class="more-btn">
                                                <button id="btnMore-${response.id}">⋮</button>
                                            </div>
                                        </div>
                                        </div>
                            </div>
                            <div class="post-body">
                                <h3 class="post-title" name="title">${response.title}</h3>
                                <p class="post-content" name="content">${response.content}</p>
                                <div id="post-image-${response.id}"></div>
                            </div>
                        </div>
                        <div class="comment-section" id="comments-${response.id}">
                            <h4 style="margin: 0.75em 0;">Comments</h4>
                            <!-- Comments will be loaded here -->
                        </div>
                        <div class="add-comment">
                            <div style="display: flex; align-items: center;">
                                <img src="${avatarUrl}" width="40" style="object-fit: cover;" 
                                    height="40" alt="Commenter Picture" class="avatar">
                                <input type="text" placeholder=" Add a comment..." class="add-comment-input" id="add-comment-input-${response.id}">
                            </div>
                            <div>
                                <button class="add-comment-button" data-postid="${response.id}">Add Comment</button>
                            </div>
                        </div>
                    </div>
                `;
                if (isPublic) {
                    $('#newsfeed-section').prepend(newPostElement);
                    if(response.haveImage){
                        $(`#post-image-${response.id}`).append(
        
                            `<img src="${postImage}"style="object-fit: cover;"
                                                width="100%">`
                        )
                    }
                } else {
                    alert("Post saved as private, you can see in your profile");
                }
                audio.play();
            },
            statusCode: {
                401: () =>{
                    alert('You need to "Sign In" before do this action')
                }
            },
            error: function (err) {
                console.log('Error:', err);
            }
        });
    });

    // Lấy ra tất cả các bài mà người dùng post dưới dạng public đồng thời lấy ra các comments
    $.ajax({
        url: 'http://localhost:5109/api/Post/AllPublicPost',
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        success: function (data) {
            data.forEach(function (post) {
                var currentPostAvatarUrl = `http://localhost:5109/api/User/GetAvatar/${post.author}`;
                var postImage = `http://localhost:5109/api/Post/GetImage/${post.id}`
                var postElement = `
                            <div class="post" id="post-${post.id}">
                                <div class="post-content-section">
                                    <div class="post-header">
                                        <div>
                                            <img src="${currentPostAvatarUrl}" width="40" style="object-fit: cover; border-radius: 50%"
                                                height="40" alt="User Picture" class="useravatar">
                                        </div>
                                        <div style="display: flex; justify-content: space-between; algin-items: center; width: 100%">
                                        <div class="post-info">
                                            <span class="fullname" name="Author">${post.authorFullname}</span><br>
                                            <span class="post-time" name="updatedAt">${new Date(post.updatedAt).toLocaleString()}</span>
                                        </div>
                                        <div id="display-more-btn-${post.id}">
                                            
                                        </div>
                                        </div>
                                    </div>
                                    <div class="post-body">
                                        <h3 class="post-title" name="title" id="title-post-${post.id}">${post.title}</h3>
                                        <p class="post-content" name="content" id="content-post-${post.id}">${post.content}</p>
                                        <div id="post-image-${post.id}"></div>
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
                $('#newsfeed-section').append(postElement);
                if(post.haveImage){
                    $(`#post-image-${post.id}`).append(
    
                        `<img src="${postImage}"style="object-fit: cover;"
                                            width="100%">`
                    )
                }
                console.log(username)
                if(post.author == username){
                    var btnMoredisplay = `
                    <div class="more-btn">
                                                <button id="btnMore-${post.id}">⋮</button>
                                            </div>
                    `;
                    $(`#display-more-btn-${post.id}`).append(btnMoredisplay);
                }
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
            url: `http://localhost:5109/api/Comment/PublicPost/ByPostId/${postId}`,
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
                                            <div id="comment-display-more-btn-${comment.id}">
                                    </div>
                                        </div>
                                        <div class="comment-body">
                                            <p class="comment-content">${comment.content}</p>
                                        </div>
                                    </div>
                                `;
                        $(`#comments-${postId}`).append(commentElement);
                        if (comment.author == username) {
                            var commentBtnMoreDisplay = `
                                <div class="more-btn">
                                    <button id="btnCommentMore-${comment.id}">⋮</button>
                                </div>
                            `;
                            $(`#comment-display-more-btn-${comment.id}`).append(commentBtnMoreDisplay);
                            commentPopup(comment);
                        }
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

    // thêm comment, đồng thời append vào bài post đang comment
    $(document).on('click', '.add-comment-button', function () {
        var audio = document.getElementById('clickSound');
        audio.play();
        var postId = $(this).data('postid');
        var commentContent = $(`#add-comment-input-${postId}`).val();
        if (commentContent.trim() === '') {
            alert('Comment cannot be empty');
            return;
        }

        $.ajax({
            url: 'http://localhost:5109/api/Comment/CreateComment',
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            contentType: 'application/json',
            data: JSON.stringify({ content: commentContent, postId: postId }),
            success: async function (newComment) {
                try {
                    var fullname = await GetFullname(newComment.author);
                    var commentElement = `
                                <div class="comment" id="comment${newComment.id}">
                                    <div class="comment-header">
                                        <div>
                                            <img src="${avatarUrl}" width="40" style="object-fit: cover;"
                                                height="40" alt="Commenter Picture" class="comment-profile-pic">
                                        </div>
                                        <div class="comment-body">
                                            <span class="comment-username">${fullname}</span><br>
                                            <span class="comment-time">${new Date(newComment.updatedAt).toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div class="comment-body">
                                        <p class="comment-content">${newComment.content}</p>
                                    </div>
                                </div>
                            `;
                    $(`#comments-${postId}`).append(commentElement);
                    $(`#add-comment-input-${postId}`).val('');
                } catch (error) {
                    console.log('Error:', error);
                }
            },
            error: function (err) {
                console.log('Error:', err);
            },
            statusCode: {
                401: () =>{
                    alert('You need to "Sign In" before do this action')
                }
            }
        });
    });

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

    function commentPopup(comment) {
        $(document).on('click', `#btnCommentMore-${comment.id}`, function () {
            console.log('click')
            // Tạo popup menu nếu chưa tồn tại
            if ($(`#dropdownMenuBtnMoreComment-${comment.id}`).length === 0) {
                var popup = `
                    <div class="dropdown-menu-btn-more" id="dropdownMenuBtnMoreComment-${comment.id}" style="display: block; position: absolute; width: fit-content">
                        <a id="edit-comment-${comment.id}">Edit</a>
                        <a id="delete-comment-${comment.id}">Delete</a>
                    </div>
                `;
                $(this).append(popup);

                // Cập nhật vị trí của popup menu để nó nằm ngay bên cạnh nút "More"
                var offset = $(this).offset();
                $(`#dropdownMenuBtnMoreComment-${comment.id}`).css({
                    top: offset.top - $(this).outerHeight(),
                    left: offset.left
                });

                // Bắt sự kiện click btn-edit của post này
                $(document).on('click', `#edit-comment-${comment.id}`, function () {
                    console.log('edit');
                    var popupEdit = `
                        <div id="editCommentDialog" style="display: block;">
                            <div>
                                <form id="editPostForm">
                                    <label for="postContent">Content</label>
                                    <textarea id="commentContentEdit" placeholder="${comment.content}"></textarea><br>
                                    <button type="button" id="saveCommentChanges">Save changes</button>
                                    <button type="button" id="cancelChanges">Cancel</button>
                                </form>
                            </div>
                        </div>
                    `; 
                    $(`#mypostSection`).append(popupEdit);
                    
                    // Nếu ấn Save changes thì sẽ gọi api
                    $(document).on('click', `#saveCommentChanges`, function () {
                        var updateTitle = $("#postTitleEdit").val();
                        var updateContent = $("#commentContentEdit").val();
                        updateIsPublic = ($("#postIsPublicEdit").val() == "true")?true:false;

                        if(updateContent.length == 0) 
                            updateContent = post.content;
                        $.ajax({
                            url: `http://localhost:5109/api/Comment/UpdateComment`,
                            type: 'PUT',
                            headers: {
                                'Authorization': 'Bearer ' + token,
                                'Content-Type': 'application/json'
                            },
                            data: JSON.stringify({
                                id: comment.id,
                                content: updateContent,
                                postId: comment.postId
                            }),
                            success: function (responsePostEdit) {
                                alert(`Update post with id ${responsePostEdit.id} successfully`)
                                $("#editPostForm").remove();
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
                $(document).on('click', `#delete-comment-${comment.id}`, function () {
                    var isDelete = confirm('Are you sure to delete this post');
                    // Nếu người dùng bấm ok thì mới call api
                    if (isDelete) {
                        $.ajax({
                            url: `http://localhost:5109/api/Comment/Delete/${comment.id}`,
                            type: 'DELETE',
                            headers: {
                                'Authorization': 'Bearer ' + token
                            },
                            success: function (responsePostDelete) {
                                alert(`Delete post with id ${comment.id} successfully`)
                                var audio = document.getElementById('tengSound');
                                audio.play();
                                $(`#post-${comment.id}`).remove();
                            },
                            error: function (err) {
                                console.log('Error:', err);
                                reject(err);
                            }
                        })
                    }
                })

            } else {
                $(`#dropdownMenuBtnMore-${comment.id}`).toggle();
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
