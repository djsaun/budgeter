function generateRandomColor() {
  const digits = '0123456789ABCDEF';
  let hash = '#';
  for (let i = 0; i < 6; i++) {
    hash += digits[Math.floor(Math.random() * 16)];
  }
  return hash;
}

function monthGraphs(category, year = moment().startOf('year').format('YYYY')) {
axios.get(`/api/category/${category}/items?year=${year}`)
  .then(res => {
    const data = res.data;
    const valuesObj = Object.values(data['sumByMonth'][year]);

    const catMonth = document.querySelector('.datepicker .month').textContent;
    const catYear = document.querySelector('.datepicker .year').textContent;
    const budgeted = (data['sumByMonth']['budgeted'].toFixed(2));
    const queriedSum = data['sumByMonth'][moment().year(catYear).format("YYYY")][moment().month(catMonth).format("M")].sum;
    const queriedMonthData = data['sumByMonth'][moment().year(catYear).format("YYYY")][moment().month(catMonth).format("M")].items;
    const pieArr = [];
    queriedMonthData.map((item) => {
      pieArr.push(item.amount);
    })

    const labelArr = [];
    queriedMonthData.map((item) => {
      labelArr.push(item.title);
    })

    const ctx = document.getElementById("categoryPieChart");

    const backgroundColor = [];
    for (let i = 0; i < labelArr.length; i++) {
      const color = generateRandomColor();
      backgroundColor.push(color);
    }

    // If budget hasn't been exceeded, add in remaining section to pie chart
    const itemSum = pieArr.reduce((sum, value) => sum + value);
    const unspent = budgeted - itemSum;

    if (unspent > 0) {
      pieArr.push(unspent)
      labelArr.push('Remaining in Budget')
      backgroundColor.push('#748386');
    }

    const pieData = {
      labels: labelArr,
      datasets: [{
        data: pieArr,
        borderColor: '#748386',
        backgroundColor,
        borderWidth: 1,
        fill: false
      }]
    }

    const options = {
      title: {
        display: true,
        padding: 20,
        fontSize: 22,
        text: `${category.charAt(0).toUpperCase() + category.slice(1)} Spending for ${catMonth}${year}`
      },
      legend: {
        display: false,
        labels: {
          boxWidth: 0,
        }
      },
      tooltips: {
        enabled: true,
        mode: 'single',
        displayColors: false,
        backgroundColor: '#FAFFFD',
        titleFontFamily: "'Lora', serif",
        titleFontSize: 16,
        titleFontColor: '#252323',
        titleMarginBottom: 10,
        bodyFontFamily: "'Lora', serif",
        bodyFontSize: 12,
        bodyFontColor: '#252323',
        bodySpacing: 10,
        callbacks: {
          title: function(tooltipItem) { 
            return this._data.labels[tooltipItem[0].index];
          },
          label: function(tooltipItems, data) {
            const percent = ((Number(data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index]) / budgeted) * 100).toFixed(2);
            const cost = `$${(data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index]).toFixed(2)}`;
            const percentStatement = `${percent}% of total spending`;
            const tooltip = new Array(cost, percentStatement);
            return tooltip;
          },
        }
      },
      hover: {
        onHover: function(e) {
          ctx.style.cursor = e[0] ? "pointer" : "default";
        }
      }
    }

    let categoryChart = new Chart(ctx, {
      type: 'pie',
      data: pieData,
      options
    });
  })
}

