import os

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from google import genai

load_dotenv()

app = FastAPI()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


@app.get("/api/health")
def health():
    return {"status": "FitBuddy Python API is running!"}


@app.post("/api/generate-plan")
async def generate_plan(data: dict):

    name = data.get("name")
    age = data.get("age")
    height = data.get("height")
    weight = data.get("weight")
    level = data.get("level")
    goal = data.get("goal")
    bmi = data.get("bmi")
    bmi_status = data.get("bmiStatus")

    prompt = f"""
Create a personalized 7-day fitness workout plan.

User Details:
Name: {name}
Age: {age}
Height: {height} cm
Weight: {weight} kg
Fitness Level: {level}
Fitness Goal: {goal}
BMI: {bmi}
BMI Status: {bmi_status}

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
"""

    try:
        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt
        )

        return {
            "success": True,
            "plan": response.text
        }

    except Exception as error:
        return {
            "success": False,
            "error": str(error)
        }


# Serve the existing FitBuddy frontend
app.mount(
    "/",
    StaticFiles(directory="public", html=True),
    name="public"
)