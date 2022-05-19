var graphOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{c} ({d}%)'
    },
    legend: {
      left: 'center',
      top: 'bottom',
      data: [
        '買電電力',
        '発電電力'
      ]
    },
    series: [
      {
        type: 'pie',
        radius: '60%',
        center: ['25%', '50%'],
        label: {
            position: 'inside',
            formatter: '{d}%'
        },
        emphasis: {
          label: {
            show: true
          }
        },
        data: [
          { value: 64, name: '買電電力' },
          { value: 36, name: '発電電力' }
        ]
      },
      {
        type: 'pie',
        radius: '60%',
        center: ['75%', '50%'],
        label: {
            position: 'inside',
            formatter: '{d}%'
        },
        data: [
            { value: 64, name: '買電電力' },
            { value: 36, name: '発電電力' }
        ]
      }
    ]
  };