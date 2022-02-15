const postResolvers = require('./posts');
const usersResolver = require('./users')
const commentsResolver= require('./comments') 
module.exports = {
    Query :{
        ...postResolvers.Query
    },
    Mutation :{
        ...usersResolver.Mutation,
        ...postResolvers.Mutation,
        ...commentsResolver.Mutation
    }
}