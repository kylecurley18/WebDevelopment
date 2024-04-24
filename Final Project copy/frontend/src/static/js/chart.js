// Bar chart
const dataBar = {
    type: 'bar',
    data: {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'Traffic',
          data: [30, 15, 62, 65, 61, 65, 40],
  
        },
      ],
    },
  };
  
  new mdb.Chart(document.getElementById('bar-chart'), dataBar);