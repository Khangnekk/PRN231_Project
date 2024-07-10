
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
        $.ajax({
            url: 'http://localhost:5109/api/Post/CreatePost',
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                title: title,
                content: content,
                isPublic: isPublic
            }),
            success: function (response) {
                var newPostElement = `
                    <div class="post" id="post-${response.id}">
                        <div class="post-content-section">
                            <div class="post-header">
                                <div>
                                    <img src="${avatarUrl}" width="40" style="object-fit: cover;"
                                        height="40" alt="User Picture" class="useravatar">
                                </div>
                                <div class="post-info">
                                    <span class="fullname" name="Author">${response.authorFullname}</span><br>
                                    <span class="post-time" name="updatedAt">${new Date(response.updatedAt).toLocaleString()}</span>
                                </div>
                            </div>
                            <div class="post-body">
                                <h3 class="post-title" name="title">${response.title}</h3>
                                <p class="post-content" name="content">${response.content}</p>
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
                
                var postElement = `
                            <div class="post" id="post-${post.id}">
                                <div class="post-content-section">
                                    <div class="post-header">
                                        <div>
                                            <img src="${currentPostAvatarUrl}" width="40" style="object-fit: cover; border-radius: 50%"
                                                height="40" alt="User Picture" class="useravatar">
                                        </div>
                                        <div class="post-info">
                                            <span class="fullname" name="Author">${post.authorFullname}</span><br>
                                            <span class="post-time" name="updatedAt">${new Date(post.updatedAt).toLocaleString()}</span>
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
                $('#newsfeed-section').append(postElement);
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
                                <div class="comment">
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

});
