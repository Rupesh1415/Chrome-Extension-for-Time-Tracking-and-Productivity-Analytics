document.getElementById("showData").addEventListener("click", () => {
  chrome.storage.local.get(["data"], (result) => {
    let data = result.data || [];

    let productive = 0;
    let unproductive = 0;

    data.forEach(item => {
      if (item.category === "productive")
        productive += item.timeSpent;
      else if (item.category === "unproductive")
        unproductive += item.timeSpent;
    });

    document.getElementById("output").innerHTML = `
      <p>🟢 Productive Time: ${Math.round(productive/1000)} sec</p>
      <p>🔴 Unproductive Time: ${Math.round(unproductive/1000)} sec</p>
    `;
  });
});