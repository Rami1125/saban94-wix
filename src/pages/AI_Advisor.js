import { getTechnicalAdvice } from 'backend/aiAdvisor.jsw';

/**
 * דף יועץ טכני AI - ניהול ממשק המשתמש
 */
$w.onReady(function () {
    // אתחול צ'אט ריק
    $w("#chatBox").html = `<div style="font-family: Arial; direction: rtl; color: #333;">שלום! אני היועץ הטכני שלך. איך אוכל לעזור לך היום?</div>`;

    // שליחה בלחיצה על כפתור
    $w("#sendButton").onClick(async () => {
        await processUserMessage();
    });

    // שליחה בלחיצה על Enter בשדה הקלט
    $w("#userInput").onKeyPress((event) => {
        if (event.key === "Enter") {
            processUserMessage();
        }
    });
});

async function processUserMessage() {
    const userMessage = $w("#userInput").value;
    if (!userMessage || userMessage.trim() === "") return;

    // הוספת הודעת המשתמש לתצוגה
    addMessageToChat("user", userMessage);
    
    // ניקוי הקלט והצגת מצב טעינה
    $w("#userInput").value = "";
    $w("#loadingGif").show();

    try {
        const aiResponse = await getTechnicalAdvice(userMessage);
        addMessageToChat("ai", aiResponse);
    } catch (error) {
        addMessageToChat("ai", "אופס, משהו השתבש בייעוץ. נסה לשאול שוב בבקשה.");
        console.error("Advisor Error:", error);
    } finally {
        $w("#loadingGif").hide();
    }
}

/**
 * הוספת הודעה מעוצבת לתיבת הצ'אט
 */
function addMessageToChat(role, text) {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const isUser = role === "user";
    
    const containerStyle = `margin-bottom: 15px; padding: 10px; border-radius: 10px; direction: rtl; font-family: sans-serif;`;
    const userStyle = `background-color: #f0f0f0; text-align: right; border-right: 4px solid #0078FF;`;
    const aiStyle = `background-color: #E8F4FF; text-align: right; border-right: 4px solid #28A745;`;
    
    const messageHtml = `
        <div style="${containerStyle} ${isUser ? userStyle : aiStyle}">
            <span style="font-size: 12px; color: #666;">${isUser ? 'אתה' : 'יועץ טכני'} | ${timestamp}</span><br>
            <div style="margin-top: 5px; font-size: 15px; line-height: 1.4;">${text.replace(/\n/g, '<br>')}</div>
        </div>
    `;

    // עדכון ה-HTML של תיבת הצ'אט
    $w("#chatBox").html = $w("#chatBox").html + messageHtml;
    
    // גלילה אוטומטית לסוף (אם האלמנט תומך או דרך עוגן)
    $w("#chatBox").scrollTo();
}
