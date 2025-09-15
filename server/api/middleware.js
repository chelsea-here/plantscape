const  {
    findUserByToken
} = require('../db/authenticate')

const isLoggedIn = async (req, res, next) => {
    try {
        const user = await findUserByToken(req.headers.authorization)
        req.user = user
        next()
    } catch (error) {
        next(error)
    }    
}

const isAdmin = async (req, res, next) => {
    if (req.user.is_admin) {
        next()
    }
    else{
        const er = Error('Must be admin')
        er.status = 401 
        next(er)
    }
}

module.exports ={
    isAdmin,
    isLoggedIn
}