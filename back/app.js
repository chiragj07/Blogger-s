const dotenv = require('dotenv');
const mongoose = require('mongoose');
const {ApolloServer} = require('apollo-server');
const gql = require('graphql-tag');
dotenv.config({path : './.env'});
const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers/index');

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) =>({req})
})


mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>console.log('connection successful to database'));



server.listen(3000).then(res=>console.log(`server is running at ${res.url}`))
