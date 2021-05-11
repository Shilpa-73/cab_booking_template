import bcrypt from 'bcryptjs'

export const generatePassword = async(password)=>{
    return new Promise((rs,rj)=>{
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(password, salt, function(err, hash) {
                if(err)
                return rj(err)
                // Store hash in your password DB.
                rs(hash)
            });
        });
    })
}

export const comparePassword = async(hash)=>{
    return new Promise((rs,rj)=>{
        bcrypt.compare("B4c0/\/", hash, function(err, res) {
            if(err) return rj(err)
            // res === true
            rs(res)
        });
    })
}

