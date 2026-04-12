let activeTab = "";
let startTime = Date.now();

// Website lists
const productiveSites = [
  "github.com",
  "stackoverflow.com",
  "leetcode.com",
  "geeksforgeeks.org"
];

const unproductiveSites = [
  "facebook.com",
  "instagram.com",
  "youtube.com",
  "twitter.com"
];

// 🔥 When user switches tab
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  let tab = await chrome.tabs.get(activeInfo.tabId);
  handleTabChange(tab.url);
});

// 🔥 When URL changes in same tab
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.active) {
    handleTabChange(tab.url);
  }
});

// 🔥 Handle tab change logic
function handleTabChange(newUrl) {
  let now = Date.now();
  let timeSpent = now - startTime;

  if (activeTab && activeTab !== newUrl) {
    saveTime(activeTab, timeSpent);
  }

  activeTab = newUrl;
  startTime = now;
}

// 🔥 Improved classification
function classifySite(url) {
  if (!url || url.startsWith("chrome://")) return "neutral";

  let domain;

  try {
    domain = new URL(url).hostname;
  } catch {
    return "neutral";
  }

  if (productiveSites.some(site => domain.includes(site))) {
    return "productive";
  }

  if (unproductiveSites.some(site => domain.includes(site))) {
    return "unproductive";
  }

  return "neutral";
}

// 🔥 Save data
function saveTime(url, timeSpent) {
  if (!url || timeSpent < 1000) return; // ignore very small time

  let category = classifySite(url);

  let record = {
    url,
    timeSpent,
    category,
    date: new Date().toDateString()
  };

  // Save locally
  chrome.storage.local.get(["data"], (result) => {
    let data = result.data || [];
    data.push(record);
    chrome.storage.local.set({ data });
  });

  // Send to backend
  fetch("http://localhost:5000/save", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(record)
  })
    .then(res => res.json())
    .then(data => console.log("Saved to backend:", data))
    .catch(err => console.error("Error:", err));
}