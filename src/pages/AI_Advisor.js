import { getTechnicalAdvice } from 'backend/aiAdvisor.jsw';

// מערך לניהול הודעות הצ'אט
let chatMessages = [];

$w.onReady(function () {
    console.log("Page Ready - Initializing AI Advisor");

    // הודעת פתיחה אוטומטית
    addMessageToChat("ai", "שלום! אני היועץ הטכני של סבן. איך אוכל לעזור לך היום?");

    // הגדרת ה-Repeater
    $w("#chatRepeater").onItemReady(($item, itemData) => {
        console.log("Item Ready in Repeater:", itemData);
        
        if ($item("#messageText")) $item("#messageText").text = itemData.text;
        if ($item("#roleText")) $item("#roleText").text = itemData.role === "user" ? "אתה" : "יועץ טכני";
        if ($item("#timestampText")) $item("#timestampText").text = itemData.time;

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
        console.log("Send button clicked");
        await handleUserRequest();
    });

    // שליחה ב-Enter
    $w("#userInput").onKeyPress((event) => {
        if (event.key === "Enter") {
            console.log("Enter pressed");
            handleUserRequest();
        }
    });
});

async function handleUserRequest() {
    const query = $w("#userInput").value;
    if (!query || query.trim() === "") {
        console.warn("User input is empty");
        return;
    }

    console.log("Processing request:", query);
    addMessageToChat("user", query);
    $w("#userInput").value = ""; 
    
    if ($w("#loadingGif")) $w("#loadingGif").show();

    try {
        console.log("Calling Backend function...");
        const answer = await getTechnicalAdvice(query);
        console.log("AI Response received:", answer);
        addMessageToChat("ai", answer);
    } catch (err) {
        console.error("Error in AI Advisor request:", err);
        addMessageToChat("ai", "אופס, חלה שגיאה בחיבור ליועץ. בדוק את ה-Console לפרטים.");
    } finally {
        if ($w("#loadingGif")) $w("#loadingGif").hide();
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

    console.log("Updating Repeater Data:", chatMessages);
    $w("#chatRepeater").data = chatMessages;
}
