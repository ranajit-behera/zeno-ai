import { genToken } from "../Configs/token.js";
import User from "../Models/user.model.js";

// Login or SignUp Controller
export const googleAuth = async (req, res) => {
    try {
        const { name, email } = req.body;
        if (!name || !email) {
            return res.status(400).json({ message: "Name and Email are required" });
        }

        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({
                name,
                email,
            });
        }

        // Generating the JWT token
        const token = genToken(user._id);

        // Sending cookie to browser
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        // Return the user
        return res.status(200).json({ user });
    } catch (error) {
        console.error("Google Auth Error:", error);

        return res.status(500).json({
            message: error.message,
        });
    }
}

// Logout Controller
export const logout = async (req, res) => {
    try {
        // Clear browes cookies when logout
        await res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
        })
        res.status(200).json({ message: "Logout successfully" });

    } catch (error) {
        return res.status(500).json({ message: `Logout failed ${error}` })
    }
} 