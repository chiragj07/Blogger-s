const jwt = require('jsonwebtoken');
const  {AuthenticationError} = require('apollo-server')

module.exports = ({req}) =>{
    const authHeader = req.headers.authorization;
    if(authHeader){
        const token = authHeader.split(' ')[1]
        if(token){
            try{    
                const user = jwt.verify(token, process.env.SEC_KEY);
                return user;

            }catch(err){
                
                throw new AuthenticationError('Invalid/Expired Token');
            }
        }
        else{
            throw new Error("wrong format of token");
        }
    }else{
        throw new Error("Authentication header must be provided");
    }

}