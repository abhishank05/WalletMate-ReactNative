import ratelimit from "../config/upstash.js";

const rateLimiter=async(req,res,next)=>{
    try{
        //in a real worl application we can put the userID or ipAddress as key
        const{success}=await ratelimit.limit("my-rate-limit");

        if(!success){
            return res.status(429).json({
                message:"Too many requests,please try again later!!"
            });
        }

        next();
    }catch(error){
        console.log("Rate limit errror",error);
        next(error);
    }
}

export default rateLimiter;