// src/pages/AI_Advisor.js

async function handleUserRequest() {
    const query = $w("#userInput").value;
    if (!query || query.trim() === "") return;

    addMessageToChat("user", query);
    $w("#userInput").value = ""; 
    
    // הנפשת רקע בזמן טעינה - מעבר לכחול יוקרתי עדין
    $w("#pageBackground").style.backgroundColor = "#E8F4FF"; 
    
    if ($w("#loadingGif")) $w("#loadingGif").show();

    try {
        const answer = await getTechnicalAdvice(query);
        addMessageToChat("ai", answer);
        
        // החזרת הרקע לצבע רגוע כשהתשובה מתקבלת
        $w("#pageBackground").style.backgroundColor = "#FFFFFF"; 
        
    } catch (err) {
        console.error("Error in AI Advisor request:", err);
        addMessageToChat("ai", "אופס, חלה שגיאה בחיבור.");
    } finally {
        if ($w("#loadingGif")) $w("#loadingGif").hide();
        if ($w("#bottomAnchor")) $w("#bottomAnchor").scrollTo();
    }
}
