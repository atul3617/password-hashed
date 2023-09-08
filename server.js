const http=require("http")
const fs=require("fs")
const crypto=require("crypto")
const {parse} = require("querystring")

http.createServer((req,res)=>{
    if(req.method==="POST"){
        if(req.headers["content-type"]==="application/x-www-form-urlencoded"){
            let body=""
            req.on("data",(chunk)=>{
                body+=chunk
            })
            req.on("end",()=>{
                let finalbody=parse(body)
                let password = finalbody.password
               let hashedPassword=crypto.createHmac("sha256","secret").update(password).digest("hex")
                let newBody={
                    name:finalbody.name,
                    password:hashedPassword
                }
                res.end(JSON.stringify(newBody))
            })
        }
    }else{
        if(req.url==="/"){
            let html=fs.createReadStream("./index.html","utf-8")
            html.pipe(res)
        }else{
            res.end("Page not found")
        }
    }
})
.listen(5000,()=>{
    console.log("Server running on 5000...");
})