import { generateGeminiResponse } from "../Configs/gemini.js";
import User from "../Models/user.model.js";

// Assistant Details Controller
export const getAssistantConfig = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find User, except Gemini API
        const user = await User.findById(userId).select("-geminiApiKey");

        if (!user) {
            return res.status(404).json({ message: "Failed to get user" })
        }

        return res.status(200).json({ message: "Assistant config data ", user })
    } catch (error) {
        return res.status(404).json({ message: `Assistant config failed ${error}` });
    }
}


// Assistant Response Controller 
export const askAssistant = async (req, res) => {
    try {
        const { message, userId, currentPath } = req.body;

        if (!message || !userId) {
            return res.status(400).json({ message: "Message and userId are required" })
        }

        const user = await User.findById(userId);

        // If User not found, Return
        if (!user) {
            return res.status(404).json({ message: "User is not found" });
        }

        // If invalid or no API key, Return error
        if (!user.geminiApiKey) {
            return res.status(404).json({ message: "Gemini api key is not added" });
        }

        // If free plan request-limit exceeds, Return error
        if (user?.plan === "free" && user?.totalMessages >= user?.requestLimit) {
            return res.status(400).json({ message: "Free limit reached" })
        }

        // If today's date > pro-pan expire's date, Return error
        if (user.plan === "pro" && new Date(user?.proExpiresAt) < new Date()) {
            user.plan = "free";
            user.save();

            return res.status(400).json({ message: "Pro plan expired" });
        }

        // covert message to lowerCase
        const cleanMessage = message.toLowerCase();


        if (user.enableNavigation) {
            // Navigation Commands or User start speak with these words
            const navigationWords = [
                "open",
                "go to",
                "start",
                "show",
                "navigate",
                "take me to",
            ]

            // Check navigation intent : want to 'Navigate' or 'Not'
            // (check if message starts with any of these words)
            const wantsNavigation =
                navigationWords.some((word) =>
                    cleanMessage.startsWith(word)
                );


            // If User wants navigation
            if (wantsNavigation) {

                // Find matching page
                const matchedPage =
                    user.pages.find((page) =>{
                        const matched = page.keywords.some((keyword) =>
                            //check if any keyword, include inside cleanMessage
                            cleanMessage.includes(
                                keyword.toLowerCase().trim()
                            )


                        )
                        return matched;
                    });

                // Page found
                if (matchedPage) {
                    // Already open 
                    if (req.body.currentPath === matchedPage.path) {
                        return res.json({
                            success: true,
                            response: `${matchedPage.name} already open`
                        });
                    }

                    // Navigate
                    return res.json({
                        success: true,
                        action: "navigate",
                        path: matchedPage.path,
                        response: `Opening ${matchedPage.name}`
                    })
                }
            }
        }

        //Master Prompt
        const prompt = `
            You are ${user.assistantName}.
            
            Business Name:
            ${user.businessName}

            Business Type:
            ${user.businessType}

            Business Description:
            ${user.businessDescription}

            Assistant Tone:
            ${user.tone}

            Rules:

            - Keep replies under 15 words
            - Give fast direct responses
            - Talk naturally
            - Behave like smart voice assistant
            - Avoid long explanations
            - Keep responses short for quick voice playback
            - Use simple words that are easy to pronounce naturally


            For Hindi or Hinglish:
            - response: natural Roman Hindi/Hinglish
            - Use simple, commonly spoken Hindi words
            - Avoid complex words, abbreviations, symbols, and unusual spellings

            For English:
            - response: clear, natural spoken English
            - Avoid complex words, abbreviations, and symbols

            User Question:
            ${message}


        `;

        // Fetching response from Gemini
        const aiResponse = await generateGeminiResponse(
            {
                prompt,
                apikey: user.geminiApiKey,
                user
            }
        )

        if (user.plan === "free") {
            user.totalMessages += 1;
            await user.save();
        }

        // Return Success Response
        return res.json({
            success: true,
            aiResponse
        })

    } catch (error) {
        console.error("Assistant Error:", error.message);

        return res.json({
            success: false,
            message: "Assistant AI Error",
        })

    }
}