function yearGraphs(category, year = moment().startOf('year').format('YYYY')) {
  axios.get(`/api/category/${category}/items?year=${year}`)
    .then(res => {
      const data = res.data;
      const valuesObj = Object.values(data['sumByMonth'][year]);
      const labelsObj = Object.keys(data['sumByMonth'][year]);
      const labels = labelsObj.map((label) => {return label});
      const items = valuesObj.map((value) => {
        const valueItems = value.items;
        const arr = [];
        valueItems.forEach((item) => {
          arr.push(item.amount);
        });
        return arr;
      });

      const sum = valuesObj.map((value) => {return value.sum});
      const budgeted = (data['sumByMonth']['budgeted'].toFixed(2));
      const label = `Amount Spent Per Month — Budget: $${budgeted}`;
      const ctx = document.getElementById("categoryChart");
      const largestSum = sum.reduce((a,b) => Math.max(a,b));

      let axisValue = "";
      if (largestSum > Number(budgeted)) {
        axisValue = Math.ceil(largestSum / 10) * 10;
      } else {
        axisValue = Math.ceil(Number(budgeted) / 10) * 10;
      }

      const backgroundColor = [];

      sum.map((value) => {
        if (value <= budgeted) {
          backgroundColor.push('#17B890');
        } else {
          backgroundColor.push('#DB504A')
        }
      });

      const barData = {
        labels,
        datasets: [{
          label,
          data: sum,
          backgroundColor,
          borderColor: backgroundColor,
          borderWidth: 1,
          fill: false
        }]
      }

      const lineData = {
        labels,
        datasets: [{
          label,
          data: sum,
          borderColor: '#748386',
          pointBackgroundColor: backgroundColor,
          pointBorderColor: backgroundColor,
          borderWidth: 2,
          fill: false
        }]
      }

      const options = {
        title: {
          display: true,
          fontSize: 18,
          text: `${category.charAt(0).toUpperCase() + category.slice(1)} Spending for ${year}`
        },
        legend: {
          labels: {
            boxWidth: 0,
          }
        },
        scales: {
          xAxes: [{
            stacked: true,
            ticks: {
              callback: function(tick) {
                return moment(tick, 'MM').format('MMM');
              }
            }
          }],
          yAxes: [{
            stacked: true,
            ticks: {
              beginAtZero: true,
              max: axisValue,
              type: 'linear',
              callback: function(value, index, values) {
                  return '$' + value;
              }
            }
          }]
        },
        tooltips: {
            enabled: true,
            mode: 'single',
            displayColors: false,
            backgroundColor: '#FAFFFD',
            titleFontFamily: "'Lora', serif",
            titleFontSize: 16,
            titleFontColor: '#252323',
            titleMarginBottom: 8,
            bodyFontFamily: "'Lora', serif",
            bodyFontSize: 12,
            bodyFontColor: '#252323',
            bodySpacing: 10,
            callbacks: {
                title: function(tooltipItem) { 
                  return moment(this._data.labels[tooltipItem[0].index], 'MM').format('MMMM');
                },
                label: function(tooltipItems, data) { 
                  return `$${(tooltipItems.yLabel.toFixed(2))}`;
                }
            }
        },
        hover: {
          onHover: function(e) {
            ctx.style.cursor = e[0] ? "pointer" : "default";
          }
        }
      }

      let categoryChart = new Chart(ctx, {
        type: 'bar',
        data: barData,
        options
      });

      const chartBtns = [...document.querySelectorAll('button.chartBtn')];
      let chartBtnVal = 'bar';
      if (chartBtns) {
        for (const chartBtn of chartBtns) {
          chartBtn.addEventListener('click', function(e) {
            chartBtnVal = this.value;
            categoryChart.destroy();
            if (chartBtnVal === 'line') {
              categoryChart = new Chart(ctx, {
                type: 'line',
                data: lineData,
                options
              });
            } else if (chartBtnVal === 'bar') {
              categoryChart = new Chart(ctx, {
                type: 'bar',
                data: barData,
                options
              });
            }
          });
        }
      }

      ctx.onclick = function(evt){
        const activePoints = categoryChart.getElementsAtEvent(evt);
        const firstPoint = activePoints[0];
        const label = categoryChart.data.labels[firstPoint._index];
        const value = categoryChart.data.datasets[firstPoint._datasetIndex].data[firstPoint._index];
        if (firstPoint !== undefined)
          window.location.href = `${window.location.href.split('?')[0]}?month=${label}&year=${year}`
      };
    })
  }

