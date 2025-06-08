chrome.storage.local.get(["gemini_query"], (result: { [key: string]: any }) => {
  const query = result.gemini_query;
  if (!query) return;

  const interval = setInterval(() => {
    const editor = document.querySelector(".ql-editor[contenteditable='true']") as HTMLElement | null;

    if (editor) {
      editor.focus();
      editor.innerHTML = query.replace(/\n/g, "<br>");

      editor.dispatchEvent(new InputEvent("input", { bubbles: true }));

      setTimeout(() => {
        try {
          const enterEvent = new KeyboardEvent("keydown", {
            bubbles: true,
            cancelable: true,
            key: "Enter",
            code: "Enter"
          });
          editor.dispatchEvent(enterEvent);
        } catch (err) {
          console.error("Failed to dispatch Enter key event:", err);
        }

        chrome.storage.local.remove("gemini_query");
      }, 400);

      clearInterval(interval);
    }
  }, 250);
});
