const Gemini_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent"


// Generate Gemini response
export const generateGeminiResponse = async ({
    prompt,
    apikey,
    user
}) => {
    try {
        // Validate API key
        if (!apikey) {
            throw new Error("Gemini API key missing");
        }

         // Send request to Gemini
        const response = await fetch(`${Gemini_URL}?key=${apikey}`, {
            method: "POST",

            // Request headers
            headers: {
                "Content-Type": "application/json",
            },

            // Request body
            body: JSON.stringify({

                // Gemini conversation
                contents: [
                    // User message
                    {parts: [
                        // Prompt text
                        {
                            text: prompt
                        }
                    ]}
                ]
            })
        });

        // 
        if(!response.ok){
            
            // Invalid API key or bad request
            if(response.status === 400 || response.status === 401){
                user.geminiStatus = "invalid";
                await user.save();
            }

            // Quota exceeded / rate limit
            if(response.status === 429){
                user.geminiStatus = "quota_exceeded";
                await user.save();
            }

            // Throw Error
            const err = await response.text();
            throw new Error(err);
        }

        //==============================
        // Success Status
        // =============================

        user.geminiStatus = "active";
        await user.save();

        // Parse response
        const data = await response.json();

        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if(!text){
            throw new Error("No text returned from Gemini");
        }

        // Return text 
        return text.trim();

    } catch (error) {
        console.error("Gemini Fetch Error: ", error.message);

        throw new Error("Gemini API fetch failed");
    }
}