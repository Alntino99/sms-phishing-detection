fetch('/dashboard/data')
  .then(response => response.json())
  .then(data => {
    // Update badges dynamically
    const badgeInfo = document.getElementById('badgeInfo');
    data.badges.forEach(badge => {
      badgeInfo.innerHTML += `<p>${badge.name}: ${badge.achieved ? 'Achieved' : 'Not yet'}</p>`;
    });

    // Update trends chart
    const ctx = document.getElementById('analysisChart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.trends.labels,
        datasets: [{
          label: 'Number of Analyses',
          data: data.trends.data,
          borderColor: 'rgba(255, 165, 0, 1)',
          backgroundColor: 'rgba(255, 165, 0, 0.2)'
        }]
      },
      options: { responsive: true }
    });
  });
// Show badge information when clicked
function showBadgeInfo(badgeName) {
  const badgeDescriptions = {
    "Beginner Analyst": "Awarded for performing your first phishing analysis.",
    "Advanced Analyst": "Awarded for analyzing 10+ messages.",
    "Phishing Master": "Awarded for identifying over 50 phishing attempts."
  };
  const badgeInfo = document.getElementById('badgeInfo');
  badgeInfo.innerHTML = `<p><strong>${badgeName}</strong>: ${badgeDescriptions[badgeName]}</p>`;
}


// Display analysis trends using Chart.js
const ctx = document.getElementById('analysisChart').getContext('2d');
new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['January', 'February', 'March', 'April', 'May','June','July','August'], // Example months
    datasets: [{
      label: 'Number of Analyses',
      data: [48, 87, 15, 27, 39,30,103,33,45,77], // Example data
      borderColor: 'rgba(255, 165, 0, 1)',
      backgroundColor: 'rgba(255, 165, 0, 0.2)'
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});





