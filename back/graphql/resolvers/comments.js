const Post = require('../../Models/post');
const checkAuth = require('../../utils/check-auth')

module.exports = {

    Mutation:{
        async createComment(_,{postId, body}, context){
            const {username } = checkAuth(context);
            if(body.trim() === ''){
                throw new Error('comment must not be empty')
            }

            try{
                const post = await Post.findById(postId);
                if(post){
                    post.comments.unshift({
                        body,
                        username,
                        createdAt : new Date().toISOString()

                    })
                    await post.save();
                    return post;
                }else{
                    throw new Error('post does not exist');
                }

            }catch(err){
                throw new Error(err);
            }

        }
        ,
        async deleteComment(_,{postId, commentId},context){
            const user = checkAuth(context);
            try{
                const post = await Post.findById(postId);
                if(post){
                    const commentIndex = post.comments.findIndex(c => c.id === commentId);
                    if(post.comments[commentIndex].username === user.username || user.username === post.username){

                        post.comments.splice(commentIndex,1);
                        await post.save()
                        return post;
                    }else{
                        throw new Error("you are not allowed");
                    }
                 }else{
                     throw new Error("post not found");
                 }

            }catch(err){
                throw new Error(err)
            }

        }
    }

}