import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.post("/api/generate-plan", async (req, res) => {
    try {
        const {
            name,
            age,
            height,
            weight,
            level,
            goal,
            bmi,
            bmiStatus
        } = req.body;

        if (!name || !age || !height || !weight || !level || !goal) {
            return res.status(400).json({
                success: false,
                error: "Please provide all required details."
            });
        }

        const prompt = `
Create a personalized 7-day fitness workout plan.

User Details:
Name: ${name}
Age: ${age}
Height: ${height} cm
Weight: ${weight} kg
Fitness Level: ${level}
Fitness Goal: ${goal}
BMI: ${bmi}
BMI Status: ${bmiStatus}

Create the plan with these sections:

1. FITNESS SUMMARY
2. 7-DAY WORKOUT PLAN
3. DAILY WARM-UP
4. DAILY COOL-DOWN
5. HYDRATION TIPS
6. NUTRITION SUGGESTIONS
7. SAFETY TIPS

Make the plan simple, practical and suitable for the user's fitness level.
Use clear headings and bullet points.
`;

        console.log("Sending request to Gemini...");

       const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt
});

        console.log("Gemini response received.");

        res.json({
            success: true,
            plan: response.text
        });

    } catch (error) {

        console.error("========== GEMINI ERROR ==========");
        console.error(error);
        console.error("===================================");

        res.status(500).json({
            success: false,
            error: error.message || "Gemini API error"
        });
    }
});

app.listen(PORT, () => {
    console.log(`FitBuddy running at http://localhost:${PORT}`);
});