import jwt from "jsonwebtoken";

// Generate JWT Token
export const genToken =  (userId) => {
    try {
        const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" })
        
        // Return Token
        return token;
    }
    catch (error) {
        console.log(error);
    }

}