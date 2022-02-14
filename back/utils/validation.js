module.exports.validateRegisterInput = (username, password, confirmPassword,email) =>{
    const errors = {}
    if(username.trim()==="") errors.username= 'Username must not be empty';
    if(email.trim()==='') errors.email="email must not be empty"
    else{
        const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
        if(!email.match(regEx)){
            errors.email= "invalid email address"
        }
    }
    if(password === "") errors.password="password can not be empty";
    else if(password !== confirmPassword) errors.confirmPassword= "passwords do not match"

    return {
        errors,
        valid: Object.keys(errors).length < 1
    }

}
module.exports.validateLoginInput =(username, password) =>{
    const errors = {}
    if(username.trim()==="") errors.username= 'Username must not be empty';
    if(password === "") errors.password="password can not be empty";
    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}