const options1 = {
    tooltip: {
        trigger: "axis",
        axisPointer: { type: "cross", crossStyle: { color: "#999" } },
    },
    grid: {
        left: "0%",
        right: "2%",
        top: "9%",
        bottom: "0%",
        containLabel: true,
    },
    xAxis: [
        {
            type: "category",
            axisPointer: { type: "shadow" },
            data: ["淘汰供应商", "潜在供应商", "合格供应商"],
        },
    ],
    yAxis: [
        { type: "value", name: "" },
    ],
    series: [
        {
            name: "供应商编号",
            type: "bar",
            itemStyle: { color: "#EB633A" },
            barGap: 0,
            yAxisIndex: 0,
            data: [1, 2, 3],
        }
    ],
};
const options2 = {
    tooltip: {
        trigger: 'item',
        formatter: '{b} <br/> {c} <br/> {d}%'
    },
    legend: {
        orient: 'vertical',
        top: '20%',
        right: 'right'
    },
    series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: false,
              fontSize: 40,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
                { value: 4, name: '主材',itemStyle:{color: '#FF9246'} },
                { value: 1, name: '辅材',itemStyle:{color: '#FFC884'} },
                { value: 1, name: '成品电缆',itemStyle:{color: '#EB633A'} },
            ].sort((a, b) => {
                return a.value - b.value;
            }),
        }
    ]
};
const options3 = {
    tooltip: {
        trigger: "axis",
        axisPointer: { type: "cross", crossStyle: { color: "#999" } },
    },
    grid: {
        left: "0",
        right: "5%",
        top: "9%",
        bottom: "0%",
        containLabel: true,
    },
    xAxis: [
        {
            type: "value",
            name: "",
        },
    ],
    yAxis: [
        {
            type: "category",
            data: ['安徽金缆', '上海缆新'],
            axisLabel: {
                align: "right",
                lineHeight: 16,
                // margin: 80,
                formatter: (val) => {
                    let c = document.createElement("canvas");
                    const ctx = c.getContext("2d");
                    const arr = val.split("");
                    ctx.font = "16px normal";
                    arr.map((item) => ctx.measureText(item).width)
                        .reduce((pre, next, index) => {
                            const nLen = pre + next;
                            if (nLen > 120) {
                                arr[index - 1] += "\n";
                                return next;
                            } else {
                                return nLen;
                            }
                        });
                    c = null;
                    return arr.join("");
                }
            }
        },
    ],
    series: [
        {
            name: "含税总金额",
            type: "bar",
            itemStyle: { color: "#FF9E43" },
            barGap: 0,
            yAxisIndex: 0,
            data: [0,0],
        }
    ],
};
const options4 = {
    tooltip: {
        trigger: "axis",
        axisPointer: { type: "cross", crossStyle: { color: "#999" } },
    },
    grid: {
        left: "0%",
        right: "2%",
        top: "9%",
        bottom: "0%",
        containLabel: true,
    },
    xAxis: [
        {
            type: "category",
            axisPointer: { type: "shadow" },
            data: ["2024年07", "2024年08", "2024年09"],
        },
    ],
    yAxis: [
        { type: "value", name: "" },
    ],
    legend: {},
    series: [
        {
            name: "合同金额",
            type: "bar",
            itemStyle: { color: "#6A8DFF" },
            data: [0, 0, 0],
        },
        {
            name: "订单金额",
            type: "bar",
            itemStyle: { color: "#FF9E43" },
            data: [0, 0, 0],
        }
    ],
};
const options2Color = {
    '国有企业': '#5EA5F5',
    '成品电缆': '#FF9E43',
    '主材': '#26E036',
    '辅材': '#1AC5B5',
    '其他': '#FE5968',
};
export { options1, options2, options3, options4, options2Color };
