const bangRedirects: Record<string, string> = {
  "!g": "https://www.google.com/search?q=",
  "!b": "https://www.bing.com/search?q=",
  "!yt": "https://www.youtube.com/results?search_query=",
  "!ddg": "https://duckduckgo.com/?q=",
  "!ch": "https://chatgpt.com/?q=",
  "!gr": "https://grok.com/?q=",
  "!pr": "https://www.perplexity.ai/search?q=",
};

// Setup URL pattern matching and handler for omnibox
chrome.omnibox.onInputEntered.addListener((text) => {
  handleSearch(text);
});

// Handle navigation events via tabs API
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Only process complete loads with URLs
  if (changeInfo.status === "complete" && tab.url) {
    try {
      const url = new URL(tab.url);

      // Check if this is a Gemini URL with a query
      if (
        url.hostname === "gemini.google.com" &&
        url.pathname.startsWith("/app") &&
        url.searchParams.has("q")
      ) {
        const query = url.searchParams.get("q")!;
        processQuery(query, tabId);
      }
    } catch (e) {
      console.error("Error processing URL", e);
    }
  }
});

// Process queries from URL parameters or omnibox
function processQuery(query: string, tabId: number): void {
  const parts = query.trim().split(" ");
  const bang = parts[0].toLowerCase();
  const actualQuery = parts.slice(1).join(" ").trim();

  if (bangRedirects[bang]) {
    // Redirect to appropriate search engine
    const redirectTarget =
      actualQuery.length > 0
        ? bangRedirects[bang] + encodeURIComponent(actualQuery)
        : bangRedirects[bang];

    chrome.tabs.update(tabId, { url: redirectTarget });
  } else {
    // No bang: store query for Gemini autofill, then redirect to Gemini without query param
    chrome.storage.local.set({ gemini_query: query }, () => {
      // Ensure storage is set before updating the tab
      chrome.tabs.update(tabId, { url: "https://gemini.google.com/app" });
    });
  }
}

// Handle search from omnibox or programmatically
function handleSearch(query: string): void {
  if (!query.trim()) return;

  const parts = query.trim().split(" ");
  const bang = parts[0].toLowerCase();
  const actualQuery = parts.slice(1).join(" ").trim();

  if (bangRedirects[bang]) {
    // This is a bang redirect. Construct the final URL directly.
    const finalRedirectUrl =
      actualQuery.length > 0
        ? bangRedirects[bang] + encodeURIComponent(actualQuery)
        : bangRedirects[bang]; // Use base URL if no actual query part.

    chrome.tabs.create({ url: finalRedirectUrl });
  } else {
    // This is a non-bang query, intended for Gemini.
    // Store the original query for the content script to pick up.
    chrome.storage.local.set({ gemini_query: query }, () => {
      // Ensure storage is set before creating the new tab
      // Open Gemini. The content script on the Gemini page will use the stored query.
      chrome.tabs.create({ url: "https://gemini.google.com/app" });
    });
  }
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "searchWithGemini",
    title: "Search with Gemini",
    contexts: ["selection"],
  });
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "searchWithGemini" && info.selectionText) {
    handleSearch(info.selectionText);
  }
});
// Add an action listener to make the extension button do something
chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: "https://gemini.google.com/app" });
});
