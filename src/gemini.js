const API_KEY =
    import.meta.env.VITE_OPENROUTER_API_KEY;

export async function askAI(prompt) {
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "mistralai/mistral-7b-instruct:free",
                messages: [{
                    role: "user",
                    content: prompt,
                }, ],
            }),
        });

        const data = await response.json();

        return (
            data.choices ? .[0] ? .message ? .content ||
            JSON.stringify(data)
        );
    } catch (error) {
        return "Error connecting to AI";
    }
}