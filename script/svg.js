export function progressOverTime(data) {
    const ctx = document.getElementById('progressOverTime');

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map(d => d.date),
        datasets: [{
          data: data.map(d => d.xp),
        }]
      },


      options: {
        
          
        scales: {
          y: {
            beginAtZero: true,
            grid: {
            color: 'rgba(220, 249, 0, 0.5)'
            },
            ticks: {
            color: '#dcf900'
            },
          },
          x: {
            grid: {
              color: 'rgba(220, 249, 0, 0.5)'
            },
            ticks: {
              color: '#dcf900'
            }
          }
        },


        plugins: {
          legend: {
            display: false
          },

          tooltip: {
            callbacks: {
              label: function(context) {
                return context.parsed.y + ' kB (' + data[context.dataIndex].path + ')';
              }
            }
          }
        },

        elements: {
            point: {
              backgroundColor: 'black', 
              pointRadius: 2,
            },
            line: {
                borderColor: '#dcf900',
                borderWidth: 2.5,
            }
          },
          animation: { 
            duration: 2000,
            easing: 'easeOutQuart'
          }

      }
    });
  }
  
  export function goPiscineTriesChart(data) {
    const ctx = document.getElementById('goPiscine');
  
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(data),
        datasets: [{
          data: Object.values(data),
          backgroundColor: '#00ADD8',
          borderColor: '#00ADD8',
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: 'y',
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                color: '#00ADD8'
                },
                ticks: {
                color: 'white'
                },
              },
              x: {
                grid: {
                  color: '#00ADD8'
                },
                ticks: {
                  color: 'white'
                }
              }
        },
        plugins: {
            legend: {
                display: false
              },
    
        },
        animation: { 
            duration: 2000,
            easing: 'easeOutQuart'
          }
      }
    });
  }
  
  export function jsPiscineTriesChart(data) {
    const ctx = document.getElementById('jsPiscine');
  
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(data),
        datasets: [{
          data: Object.values(data),
          backgroundColor: '#f0db4f ',
          borderColor: '#f0db4f ',
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: 'y',
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                color: '#f0db4f'
                },
                ticks: {
                color: 'black '
                },
              },
              x: {
                grid: {
                  color: '#f0db4f'
                },
                ticks: {
                  color: 'black '
                }
              }
        },
        plugins: {
            legend: {
                display: false
              },
        },
        animation: { 
            duration: 2000,
            easing: 'easeOutQuart'
          }
      }
    });
  }

export function createAuditBarDone(auditsDone, auditsReceived) {
    const svgWidth = 250;
    const svgHeight = 10;
    const maxBarWidth = 200;
    const maxAudit = Math.max(auditsDone, auditsReceived);

    // Create an SVG container
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', svgWidth);
    svg.setAttribute('height', svgHeight);

    // Create the audits done rectangle
    const auditsDoneRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    auditsDoneRect.setAttribute('x', 0);
    auditsDoneRect.setAttribute('y', 0);
    auditsDoneRect.setAttribute('width', (auditsDone / maxAudit) * maxBarWidth);
    auditsDoneRect.setAttribute('height', 10);
    auditsDoneRect.setAttribute('fill', 'rgba(0, 0, 0, 0.5)');

    // Append rectangles to the SVG container
    svg.appendChild(auditsDoneRect);

    // Append SVG container to the specified container
    const container = document.querySelector("#audit-bars");
    container.appendChild(svg);
}

export function createAuditBarRecieved(auditsDone, auditsReceived) {
    const svgWidth = 250;
    const svgHeight = 10;
    const maxBarWidth = 200;
    const maxAudit = Math.max(auditsDone, auditsReceived);

    // Create an SVG container
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', svgWidth);
    svg.setAttribute('height', svgHeight);

    // Create the audits done rectangle
    const auditsRecRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    auditsRecRect.setAttribute('x', 0);
    auditsRecRect.setAttribute('y', 0);
    auditsRecRect.setAttribute('width', (auditsReceived / maxAudit) * maxBarWidth);
    auditsRecRect.setAttribute('height', 10);
    auditsRecRect.setAttribute('fill', 'rgba(0, 0, 0, 0.5)');

    // Append rectangles to the SVG container
    svg.appendChild(auditsRecRect);

    // Append SVG container to the specified container
    const container = document.querySelector("#audit-bars");
    container.appendChild(svg);
}
