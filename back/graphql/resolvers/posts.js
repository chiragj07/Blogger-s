const Post = require('../../Models/post');
const checkAuth = require('../../utils/check-auth')
const  {AuthenticationError} = require('apollo-server')

module.exports = {
    Query: {
        async getPosts() {
            try {
                const posts = await Post.find().sort({createdAt:-1});
                return posts;
            } catch (err) {
                console.log(err.messsage)
            }
        },
        async getPost(_, {postId}) {
            try {
                const post = await Post.findById(postId)
                if (post) {
                    return post
                } else {
                    throw new Error('no post found');
                }
            } catch (err) {
                throw new Error(err);
            }
        }
    },
    Mutation: {
        async createPost(_, {
            body
        }, context) {
            const user = checkAuth(context);
            const newPost = new Post({
                body,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString()

            });

            const post = await newPost.save();
            return post;
        },
        async deletePost(_, {postId}, context){
            const user = checkAuth(context);
            try{
                const post = await Post.findById(postId);
                if(post.username === user.username){
                    await post.delete();
                    return "post deleted Successfully";
                }
                else{
                    throw new AuthenticationError("You are not allowed to delete this post")
                }

            }catch(err){
                throw new Error(err)
            }
        }
        ,
        async createLike(_,{postId},context){
            const {username} = checkAuth(context);
            try{
                const post = await Post.findById(postId);
                if(post){
                    if(post.likes.find(like => like.username === username)){
                       post.likes= post.likes.filter(like => like.username !== username);
                    }
                    else{
                        post.likes.push({
                            username,
                            createdAt: new Date().toISOString()
                        })
                    }

                    await post.save();
                    return post;
                }else{
                    throw new Error("post not found");
                }

            }catch(err){
                throw new Error("error occured")
            }
        }
    }
}