const { authLimiter } = require("../config/redis");

const authRateLimiter = async (req, res, next) => {
  try{
    await authLimiter.consume(`auth-${req.ip}`);
    next();
  }catch(err){
    return res.status(429).json({
      message : "Too many authentication requests. Please try again later."
    });
  }
};

module.exports = authRateLimiter;