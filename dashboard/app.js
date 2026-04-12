fetch("http://localhost:5000/report")
  .then(res => res.json())
  .then(data => {
    let html = "";

    data.forEach(item => {
      html += `
        <p>${item.url} - ${item.category} - ${item.timeSpent}s</p>
      `;
    });

    document.getElementById("report").innerHTML = html;
  });