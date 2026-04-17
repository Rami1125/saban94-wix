import { getTechnicalAdvice } from 'backend/aiAdvisor';

$w.onReady(() => {
  $w('#testButton').onClick(async () => {
    $w('#testOutput').text = 'Thinking...';

    const question = $w('#testInput').value;

    if (!question) {
      $w('#testOutput').text = 'Please enter a question';
      return;
    }

    try {
      const answer = await getTechnicalAdvice(question);
      $w('#testOutput').text = answer;
    } catch (err) {
      console.error(err);
      $w('#testOutput').text = 'Error calling AI service';
    }
  });
});
