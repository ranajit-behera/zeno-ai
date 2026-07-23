import User from "../Models/user.model.js";

export const getCurrentUser = async (req, res) => {
    try {
        // Find current user
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ message: "Failed to get current user" });
        }

        // Send the current user
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: `getCurrentUser error ${error}` });
    }


}

// Assistant Controller
export const saveAssistant = async (req, res) => {
    try {
        const {
            assistantName,
            businessName,
            businessType,
            businessDescription,
            tone,
            theme,
            geminiApiKey,
            pages
        } = req.body;

        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ message: "Failed to get current user" });
        }

        user.assistantName = assistantName;
        user.businessName = businessName;
        user.businessType = businessType;
        user.businessDescription = businessDescription;
        user.tone = tone;
        user.theme = theme;
 
        if(geminiApiKey){
            user.geminiApiKey = geminiApiKey;
        }

        user.geminiStatus = "active";
        user.pages = pages || [];
        user.isSetupComplete = true;

        // Save the updated user
        await user.save();

        res.status(200).json({message: "Assistant saved successfully", user});

    } catch (error) {
        return res.status(500).json({ message: `Failed to update assistant ${error}` });

    }
}