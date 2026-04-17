import { getTechnicalAdvice } from 'backend/aiAdvisor.jsw';

// מערך הודעות לבדיקה
let testLog = [];

$w.onReady(function () {
    console.log("דף TEST מוכן לעבודה");

    // אתחול הריפיטר של הבדיקה
    $w("#testRepeater").onItemReady(($item, itemData) => {
        $item("#testMessage").text = itemData.text;
        $item("#testMessage").style.color = itemData.role === "ai" ? "#0056b3" : "#000000";
    });

    // כפתור שליחה רגיל
    $w("#testSendButton").onClick(async () => {
        const val = $w("#testInput").value;
        await runTest(val);
    });

    // כפתור בדיקה מהירה - שולח שאלה אוטומטית
    $w("#quickTestButton").onClick(async () => {
        await runTest("בדיקת מערכת: האם אתה מזהה את מוצרי סבן?");
    });
});

async function runTest(query) {
    if (!query) return;

    updateLog("user", `בודק: ${query}`);
    $w("#testInput").value = "";

    try {
        console.log("שולח פניה ל-Backend...");
        const response = await getTechnicalAdvice(query);
        updateLog("ai", response);
    } catch (err) {
        console.error("שגיאה בדף TEST:", err);
        updateLog("ai", "שגיאה: " + err.message);
    }
}

function updateLog(role, text) {
    testLog.push({
        "_id": Date.now().toString(),
        "role": role,
        "text": text
    });
    $w("#testRepeater").data = testLog;
}
