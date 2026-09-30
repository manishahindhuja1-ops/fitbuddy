let generatedData = {};

function generatePlan() {

    const name = document.getElementById("name").value.trim();
    const age = Number(document.getElementById("age").value);
    const height = Number(document.getElementById("height").value);
    const weight = Number(document.getElementById("weight").value);
    const level = document.getElementById("level").value;

    if (!name || !age || !height || !weight || !level) {
        alert("Please fill all the details.");
        return;
    }

    if (age < 10 || age > 100) {
        alert("Please enter a valid age.");
        return;
    }

    if (height <= 0 || weight <= 0) {
        alert("Please enter valid height and weight.");
        return;
    }

    // BMI calculation
    const heightMeter = height / 100;
    const bmi = weight / (heightMeter * heightMeter);

    let bmiStatus = "";

    if (bmi < 18.5) {
        bmiStatus = "Underweight";
    } else if (bmi < 25) {
        bmiStatus = "Normal";
    } else if (bmi < 30) {
        bmiStatus = "Overweight";
    } else {
        bmiStatus = "Obesity range";
    }

    generatedData = {
        name,
        age,
        height,
        weight,
        level,
        bmi: bmi.toFixed(1),
        bmiStatus
    };

    document.getElementById("userInfo").innerHTML = `
        <div class="user-info">
            <strong>Name:</strong> ${name}<br>
            <strong>Age:</strong> ${age} years<br>
            <strong>Height:</strong> ${height} cm<br>
            <strong>Weight:</strong> ${weight} kg<br>
            <strong>Fitness Level:</strong> ${level}
        </div>
    `;

    document.getElementById("bmiBox").innerHTML = `
        <div class="bmi">
            <strong>BMI:</strong> ${bmi.toFixed(1)}
            <br>
            <strong>Status:</strong> ${bmiStatus}
        </div>
    `;

    createWorkout(level);

    document.getElementById("result").style.display = "block";

    document.getElementById("result").scrollIntoView({
        behavior: "smooth"
    });
}


function createWorkout(level) {

    let plans = {};

    if (level === "Beginner") {

        plans = {
            "Day 1 - Full Body": "Squats 3×10, Wall Push-ups 3×10, Glute Bridges 3×12, Plank 3×20 sec",
            "Day 2 - Cardio": "Brisk Walking 20 min, Jumping Jacks 3×15, High Knees 3×20",
            "Day 3 - Upper Body": "Wall Push-ups 3×10, Shoulder Taps 3×10, Arm Circles 3×20 sec",
            "Day 4 - Rest": "Light walking and gentle stretching",
            "Day 5 - Lower Body": "Squats 3×12, Lunges 3×8 each leg, Calf Raises 3×15",
            "Day 6 - Core": "Plank 3×20 sec, Crunches 3×10, Bird Dog 3×10",
            "Day 7 - Active Recovery": "Easy walking 20–30 minutes and stretching"
        };

    } else if (level === "Intermediate") {

        plans = {
            "Day 1 - Chest & Triceps": "Push-ups 4×12, Incline Push-ups 3×12, Triceps Dips 3×10",
            "Day 2 - Legs": "Squats 4×15, Lunges 3×12, Glute Bridges 3×15, Calf Raises 4×15",
            "Day 3 - Cardio": "Jogging 30 min, Jumping Jacks 4×20, Mountain Climbers 3×20",
            "Day 4 - Back & Biceps": "Superman 3×15, Reverse Snow Angels 3×12, Backpack Rows 3×12",
            "Day 5 - Shoulders & Core": "Pike Push-ups 3×10, Plank 3×40 sec, Crunches 3×15",
            "Day 6 - Full Body": "Burpees 3×10, Squats 3×15, Push-ups 3×12, Mountain Climbers 3×20",
            "Day 7 - Recovery": "Walking 30 minutes and full-body stretching"
        };

    } else {

        plans = {
            "Day 1 - Chest & Triceps": "Push-ups 4×20, Diamond Push-ups 4×12, Dips 4×15",
            "Day 2 - Back & Biceps": "Pull-ups 4×8, Rows 4×12, Superman 4×15",
            "Day 3 - Legs": "Squats 5×15, Lunges 4×12, Bulgarian Split Squats 3×10",
            "Day 4 - HIIT": "Burpees 5×15, Mountain Climbers 5×20, High Knees 5×30 sec",
            "Day 5 - Shoulders": "Pike Push-ups 4×12, Shoulder Taps 4×20, Plank 4×45 sec",
            "Day 6 - Full Body": "Burpees, Push-ups, Squats and Mountain Climbers — 4 rounds",
            "Day 7 - Recovery": "Light cardio, mobility work and stretching"
        };
    }

    let html = "";

    for (const day in plans) {

        html += `
            <div class="day">
                <h4>${day}</h4>
                <p>${plans[day]}</p>
            </div>
        `;
    }

    document.getElementById("workoutPlan").innerHTML = html;
}


function downloadPDF() {

    if (!window.jspdf) {
        alert("jsPDF library not found.");
        return;
    }

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    let y = 20;

    doc.setFontSize(20);
    doc.text("Workout Plan Generator", 20, y);

    y += 15;

    doc.setFontSize(12);

    doc.text(`Name: ${generatedData.name}`, 20, y);
    y += 8;

    doc.text(`Age: ${generatedData.age} years`, 20, y);
    y += 8;

    doc.text(`Height: ${generatedData.height} cm`, 20, y);
    y += 8;

    doc.text(`Weight: ${generatedData.weight} kg`, 20, y);
    y += 8;

    doc.text(`Fitness Level: ${generatedData.level}`, 20, y);
    y += 8;

    doc.text(
        `BMI: ${generatedData.bmi} (${generatedData.bmiStatus})`,
        20,
        y
    );

    y += 15;

    doc.setFontSize(15);
    doc.text("7-Day Workout Plan", 20, y);

    y += 10;

    doc.setFontSize(10);

    const workoutText = document
        .getElementById("workoutPlan")
        .innerText;

    const lines = doc.splitTextToSize(workoutText, 170);

    lines.forEach(line => {

        if (y > 275) {
            doc.addPage();
            y = 20;
        }

        doc.text(line, 20, y);

        y += 6;
    });

    y += 10;

    if (y > 270) {
        doc.addPage();
        y = 20;
    }

    doc.setFontSize(10);

    doc.text(
        "Warm-up: 5–10 minutes before exercise.",
        20,
        y
    );

    y += 7;

    doc.text(
        "Cool-down: 5–10 minutes after exercise.",
        20,
        y
    );

    y += 12;

    doc.text(
        "Note: Exercise according to your fitness level and ability.",
        20,
        y
    );

    doc.save(
        `${generatedData.name}-Workout-Plan.pdf`
    );
}