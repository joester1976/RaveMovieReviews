var commentOpenForEdit = false;

$(function () {    

    $('#mainContent').on('click', '.pager a', function () {

        var url = $(this).attr('href');

        $('#mainContent').load(url);

        return false;
    })
});

$(document).on('click', '.edit-comment', function (evt) {    

    if (!commentOpenForEdit) {       
        var id = $(this).attr("data-id");
        editCommentObject = $(this);
        evt.stopPropagation();
        commentOpenForEdit = true;
        new MovieReview(this).editComment(id);
    }    
});

$(document).on('click', '.update-comment', function (evt) {        
    var id = $(this).attr("data-id");
    evt.stopPropagation();
    commentOpenForEdit = false;
    new MovieReview(this).updateComment(id);
    return false;
});   

$(document).on('click', '.hide-comments', function (evt) {
    $('.comments').empty();
    $('#show-hide-comments').removeClass('hide-comments');
    $('#show-hide-comments').addClass('show-comments');
    $('#show-hide-comments').html('Show Comments');
});

$(function initializeCommentComponents() {

    var editCommentObject;
    var userVote = false;     
    
    $(document).on('click', '.show-comments', function (evt) {
        evt.stopPropagation();
        new MovieReview(this).showComments();
        $('#show-hide-comments').removeClass('show-comments');
        $('#show-hide-comments').addClass('hide-comments');
        $('#show-hide-comments').html('Hide Comments')
        return false;
    });

    $(document).on('click', '.add-comment', function (evt) {
        evt.stopPropagation();
        new MovieReview(this).showAddComment();
        return false;
    });

    $(document).on('submit', '.new-comment form', function (evt) {
        evt.stopPropagation();
        new MovieReview(this).addComment();
        return false;
    });

    $(document).on('click', '.delete-comment', function (evt) {
        var id = $(this).attr("data-id");
        evt.stopPropagation();
        new MovieReview(this).deleteComment(id);
        return false;
    });        
});

function postCommentToEdit(comment) {

    var updateCommentHtml =
        $('<div class="update-comment">')
            .append($('<p> Update Comment'))
            .append($('<p class="details">')
            .append('Posted by: ' + comment.UserName || 'Anonymous').append(' at ' + new Date(comment.commentPostDate).toLocaleString()))            
            .append($('<textarea name="CommentBody" class="update-comment form-control" row="5">'))
            .append($('<button class="btn update-comment update-comment-button float-right">Update</button>').attr("data-id", comment.id));    

    $("[data-target='" + comment.id + "']").empty();

    $("[data-target='" + comment.id + "']").append(updateCommentHtml);  

    $('.update-comment').val(comment.commentBody);
}

/*  Post class as an object-oriented wrapper around DOM elements */
function MovieReview(el) {

    var $el = $(el),
        postEl = $el.hasClass('.movie-review-display') ? $el : $el.parents('.movie-review-display'),
        addCommentEl = postEl.find('.add-comment'),
        newCommentEl = postEl.find('.new-comment'),
        updateCommentEl = postEl.find('.update-comment'),
        commentUpdatedEl = updateCommentEl.find('[name=CommentBody]'),
        commentEl = newCommentEl.find('[name=CommentBody]'),
        commentsContainer = postEl.find('.comments-container'),
        movieKey = commentsContainer.data('post-key'),
        commentsEl = postEl.find('.comments'),
        showCommentsButton = postEl.find('.show-comments'),
        noCommentsEl = postEl.find('.no-comments');


    /*********  Web API Methods ***********/


    // RESTful Web API URL:  /api/posts/{postKey}/comments
    var webApiUrl = ['/api/moviereviews', movieKey, 'moviecomments'].join('/');

    function addComment() {

        var comment = { CommentBody: commentEl.val() };

        $.ajax({
            url: webApiUrl,
            type: 'POST',
            data: JSON.stringify(comment),
            contentType: 'application/json',
            success: function () {
                
            },
            error: function () {
                $('.new-comment').val('');
                showComments();
            }
        });
    }

    function editComment(id) {

        $.ajax({
            url: webApiUrl + '/' + id,
            type: 'GET',
            contentType: 'application/json',
            success: postCommentToEdit
        });
    }

    function deleteComment(id) {
        $.ajax({
            url: webApiUrl + '/' + id,
            type: 'DELETE',
            contentType: 'application/json'
        }).then(showComments);
    }

    function showComments() {
        $.ajax({
            url: webApiUrl,
            type: 'GET',
            contentType: 'application/json',
            success: function (data) {                
                $('.comments').html(data);                
            }
        });
    }

    function updateComment(id) {

        var comment = { CommentBody: commentUpdatedEl.val() };

        $.ajax({
            url: webApiUrl + '/' + id,
            type: 'PUT', 
            data: JSON.stringify(comment),
            contentType: 'application/json'
        }).then(showComments);
    }
    
    /****************************************/


    function showAddComment() {
        addCommentEl.addClass('hide');
        newCommentEl.removeClass('hide');
        commentEl.focus();
    }

    return {
        addComment: addComment,
        renderComment: renderComments,
        showAddComment: showAddComment,
        showComments: showComments,
        deleteComment: deleteComment,
        editComment: editComment,
        updateComment: updateComment

    };


    /*********  Private methods ****************/
    function createCommentElements(comments) {
        comments = [].concat(comments);

        if (!comments.length) {
            return $('<div class="no-comments">No comments</div>');
        }

        return comments.reduce(function (commentEls, comment, index) {
            var el =
                $('<div class="comment">')
                    .append($('<p class="details">')
                    .append(comment.UserName || 'Anonymous').append(' at ' + new Date(comment.commentPostDate).toLocaleString()))
                    .append($('<p class="body">').append(comment.commentBody))
                    .append($('<button class="btn delete-comment">Delete</button>').attr("data-id", comments[index].id));

            return commentEls.concat(el);
        }, []);
    }

    function renderComments(comments) {
        var commentEls = createCommentElements(comments);
        commentsEl.append(commentEls);
        commentsContainer.removeClass('hide');
        showCommentsButton.remove();
        noCommentsEl.remove();
        resetAddComment();
    }

    function resetAddComment() {
        addCommentEl.removeClass('hide');
        newCommentEl.addClass('hide');
        commentEl.val('');
    }
}

// This is the thumbs up code for the main body.






