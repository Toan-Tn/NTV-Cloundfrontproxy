const {MemberService,setCookieString} = require('ntv_module');
const { afterLogin } = require('./afterlogin');
const { RESPONSE, withMiddlewares, logwrite } = require('./ntv_module');


const login = async (event,context)=>{
    const requestJSON = JSON.parse(event.body)
    const query = {
        ...requestJSON
    }
    const data = await MemberService.login(query);
    const token = data.payload
    const options = {
        domain: 'ntv-local.com',
        sameSite:"Strict"
    }
    const cookieString = setCookieString("token-membersite",token,options)
    const response = RESPONSE(data,{
        'Set-Cookie':cookieString
    })
    return response
}

const checkLogin = async (event,context)=>{
    const user = event.user
    const data = await MemberService.checkLogin(user)
    const response = RESPONSE(data)
    return response
}

const getAppVersion = async(event,context)=>{
    const data = await MemberService.getSetting()
    const response = RESPONSE(data)
    return response
}

const logOut = async (event,context)=>{
    const options = {
        domain: 'ntv-local.com',
        sameSite:"Strict"
    }
    const data = await MemberService.logOut()
    const token
    const cookieString = setCookieString("token-membersite",token,options)
    const response = RESPONSE(data,{
        'Set-Cookie':cookieString
    })
    return response
}

exports.login = withMiddlewares(login,[logwrite()])
exports.checkLogin = withMiddlewares(checkLogin,[afterLogin('token-membersite'),logwrite()])
exports.getAppVersion = withMiddlewares(getAppVersion,[logwrite()])
exports.logOut = withMiddlewares(logOut,[afterLogin("token-membersite"),logwrite()])