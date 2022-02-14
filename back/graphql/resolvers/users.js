const User = require('../../Models/user');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {validateRegisterInput, validateLoginInput} = require('../../utils/validation');
const {UserInputError} = require('apollo-server');
const generateToken = (user) =>{
    return jwt.sign({
        id: user._id,
        email: user.email,
        username: user.username
    }, process.env.SEC_KEY);
}
module.exports = {
    Mutation :{
        async login(_, {username,password}){
             const {valid, errors} = validateLoginInput(username,password);
             if(!valid){
                throw new UserInputError('Errors', {errors});
            }
             const user = await User.findOne({username});
             if(!user){
                 errors.general = "user not Found";
                 throw new UserInputError('User not Found', {errors});
             }   
             const match = await bcrypt.compare(password,user.password);
             if(!match){
                errors.general = "Wrong Credentials";
                throw new UserInputError('Wrong credentitals', {errors});
             }
             const token = generateToken(user);

             return {
                ...user._doc,
                id:user._id,
                token
            }

        },

        async register(parent, {registerInput:{username, email, password, confirmPassword}}, context, info){
            //validate user data
            const {valid, errors} = validateRegisterInput(username,password,confirmPassword,email)
            if(!valid){
                throw new UserInputError('Errors', {errors});
            }
            // hash password
            const res = await User.findOne({username})
            if(res){
                throw new UserInputError('username is already taken', {errors: {
                    username: "This username is taken"}
                })
            }
            password= await bcrypt.hash(password,12);
            const newUser = new User({
                email,password, username,createdAt: new Date().toISOString()
            });
            const user= await newUser.save();
            //auth token
            const token = generateToken(user)

            return {
                ...user._doc,
                id:user._id,
                token
            }

        }
    }
}