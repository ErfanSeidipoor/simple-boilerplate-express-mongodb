
const User = require('../models/user');
const hashPassword = require('./hashPassword');
var jwt = require('jsonwebtoken');
const config = require('../config');

const tokenForUser = user=> {
    const timestamp = new Date().getTime();
    return jwt.sign({sub: user.id, iat:timestamp}, config.secterKey);

}
const idFromToken = token=>{
    return jwt.verify(token, config.secterKey, function(err, decoded) {
        if (err) {return null}
        return decoded.sub;
    });
}

exports.singup = (req,res,next)=>{ 
    const {email,password} = req.body
    if (!email || !password) { return res.status(400).send({error:"password and email required"});}
    User.findOne({email},(err,suc)=>{
        if (err) { return next(err)}
        if (suc) { return res.status(409).send({error:"Email is in Use"}); }
        const newUser = new User({  email,password:hashPassword.doHash(password), })
        newUser.save((err)=>{
            if (err) {  return next(err); }
            return res.status(200).send({token:tokenForUser(newUser) })
        })
    })
}

exports.requireAuth = (req,res,next)=>{
let ApplyingStrategy = false
// -----------------------------------| First Strategy |-------------------- //
    const {auth} = req.headers;
    if (auth) {
        ApplyingStrategy = true;
        const id = idFromToken(auth)
        if (!id)  { return res.send({error:"token is incorrect"}) }
        User.findById(id, (err,user)=>{
            if (err) { return res.send({error:"User not found by token"}) }
            req.User = user;
            req.Token = tokenForUser(user)
            return next()
        })
    }
// -----------------------------------| Second Strategy |-------------------- //
    const {email,password} = req.body
    if (email && password) {
        ApplyingStrategy = true;
        User.findOne({email},(err,user)=>{
            if (err) { return res.send({error:"error "}) }
            if (!user) { return res.send({error:"user not found by email"}) }
            if (user && hashPassword.doCompair(password,user.password)) {
                req.User = user;
                req.Token = tokenForUser(user);
                return next();
            }
            return res.send({error:"error incorrect password"})
        })
    }
// ------------------------------------------------------------------- //
    if(!ApplyingStrategy) { return res.send({error:"authentication required"}) }
}

exports.singin = (req,res,next)=>{
    // requireAuth
    return res.send({token: req.Token})
}