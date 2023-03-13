// let permitedRoles = []

const authorize = (permitedRoles)=>{
    return (req,res,next)=>{
        if (permitedRoles.includes(req.body.role)){
            next()
        }
        else {
            res.send({"msg":"Don't have Access"})
        }
    }
}

module.exports = {
    authorize
}