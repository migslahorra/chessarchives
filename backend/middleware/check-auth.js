const jwt = require("jsonwebtoken");  

module.exports = (req, res, next) => {  
    try {
        // Extract the token from the Authorization header (Bearer <token>)
        const token = req.headers.authorization.split(" ")[1];  
        
        // Verify the token and decode it
        const decodedToken = jwt.verify(token, "A_very_long_string_for_our_secret"); 
        
        // Attach decoded token data to the request object
        req.userData = { email: decodedToken.email, userId: decodedToken.userId };   
        
        // Proceed to the next middleware or route handler
        next();   
    } catch (error) {  
        res.status(401).json({ message: "Auth Failed" });  
    }  
};
