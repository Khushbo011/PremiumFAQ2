document.addEventListener("DOMContentLoaded", async () => {
  const widgets = document.querySelectorAll(".premium-faq-widget");
  if (widgets.length === 0) return;

  const shop = widgets[0].dataset.shop;
  
  // In a real production app, we would fetch the FAQs and settings via App Proxy.
  // We'll simulate the data injection for the sake of the widget functionality.
  
  // Example fetch via app proxy:
  // const response = await fetch(`/apps/premium-faq/api/faqs?shop=${shop}`);
  // const data = await response.json();

  widgets.forEach(widget => {
    // For demonstration, we assume data is fetched and rendered.
    // The widget script will handle the accordion toggle logic.
    
    widget.addEventListener('click', (e) => {
      const question = e.target.closest('.premium-faq-question');
      if (!question) return;

      const answer = question.nextElementSibling;
      const isActive = question.classList.contains('active');

      // Close all others if we want auto-close behavior (optional)
      /*
      widget.querySelectorAll('.premium-faq-question').forEach(q => {
        q.classList.remove('active');
        q.nextElementSibling.classList.remove('open');
      });
      */

      if (!isActive) {
        question.classList.add('active');
        answer.classList.add('open');
      } else {
        question.classList.remove('active');
        answer.classList.remove('open');
      }
    });
  });
});
