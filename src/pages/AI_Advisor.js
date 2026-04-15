import { getTechnicalAdvice } from 'backend/aiAdvisor.jsw';

// מערך לניהול הודעות הצ'אט
let chatMessages = [];

$w.onReady(function () {
    // הודעת פתיחה אוטומטית
    addMessageToChat("ai", "שלום! אני היועץ הטכני של סבן. איך אוכל לעזור לך היום?");

    // הגדרת ה-Repeater - וודא שה-ID של הריפיטר הוא chatRepeater
    $w("#chatRepeater").onItemReady(($item, itemData) => {
        // התאמה ל-IDs שראיתי בתמונות שלך
        if ($item("#messageText")) $item("#messageText").text = itemData.text;
        if ($item("#roleText")) $item("#roleText").text = itemData.role === "user" ? "אתה" : "יועץ טכני";
        if ($item("#timestampText")) $item("#timestampText").text = itemData.time;

        // עיצוב לפי צד השולח
        if ($item("#messageContainer")) {
            if (itemData.role === "user") {
                $item("#messageContainer").style.backgroundColor = "#F0F0F0";
                $item("#messageContainer").style.borderColor = "#0078FF";
            } else {
                $item("#messageContainer").style.backgroundColor = "#E8F4FF";
                $item("#messageContainer").style.borderColor = "#28A745";
            }
        }
    });

    // אירוע לחיצה על כפתור השליחה
    $w("#sendButton").onClick(async () => {
        await handleUserRequest();
    });

    // שליחה ב-Enter
    $w("#userInput").onKeyPress((event) => {
        if (event.key === "Enter") {
            handleUserRequest();
        }
    });
});

async function handleUserRequest() {
    const query = $w("#userInput").value;
    if (!query || query.trim() === "") return;

    // הצגת הודעת המשתמש
    addMessageToChat("user", query);
    $w("#userInput").value = ""; // ניקוי השדה
    
    // הצגת מצב טעינה (אם יש לך אלמנט כזה)
    if ($w("#loadingGif")) $w("#loadingGif").show();

    try {
        const answer = await getTechnicalAdvice(query);
        addMessageToChat("ai", answer);
    } catch (err) {
        addMessageToChat("ai", "אופס, חלה שגיאה בחיבור ליועץ. נסה שוב.");
    } finally {
        if ($w("#loadingGif")) $w("#loadingGif").hide();
        // גלילה אוטומטית לסוף (אם יש אלמנט בתחתית בשם bottomAnchor)
        if ($w("#bottomAnchor")) $w("#bottomAnchor").scrollTo();
    }
}

function addMessageToChat(role, text) {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    chatMessages.push({
        "_id": Date.now().toString(),
        "role": role,
        "text": text,
        "time": timestamp
    });

    // עדכון הנתונים בריפיטר
    $w("#chatRepeater").data = chatMessages;
}
