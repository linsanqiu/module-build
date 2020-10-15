<template>
    <section>
        <h-row class-name="common-handle-padding">
            <h-col span="24">
                <span style="padding-left: 10px;">标签分类: </span>
                <h-select-tree
                    v-model="labelCategoryModal"
                    ref="labelCategoryModal"
                    aria-placeholder="标签分类"
                    placeholder="标签分类(默认值: 文本标签)"
                    style="width: 70%"
                    :data="labelCategories"
                    @on-click="shitClearableSelect(`labelCategoryModal`)"
                    icon="android-close"
                    @on-select-change="onSelectTreeChange"
                    :expandLevel="expandLevel"
                    :clearable="false">
                </h-select-tree>
            </h-col>
        </h-row>
        <div>
            <h-select-tree
                v-model="val1"
                style="width:200px"
                :data="baseData1"
                :expanLevel="expandLevel"
                :showCheckbox="true">
            </h-select-tree>
            <!-- <h-select-tree
                v-model="val1"
                style="width:200px"
                :data="baseData1"
                :expandLevel="expandLevel"
                :showCheckbox="true">
            </h-select-tree> -->
        </div>
        <div>
            <h-select-tree
                v-model="val2"
                style="width:200px"
                :data="baseData2"
                :expanLevel="expandLevel"
                :showCheckbox="false">
            </h-select-tree>
            <!-- <h-select-tree
                v-model="val2"
                style="width:200px"
                :data="baseData2"
                :expandLevel="expandLevel"
                :showCheckbox="false">
            </h-select-tree> -->
            <!-- <span data-alink="router" data-uid="202019022501012077714983">202019022501012077714983</span> -->
        </div>
        <h-row class-name="audit-common-row-padding">
            <h-col span="24">
                <h-table
                    :columns="commonTableCols"
                    :data="commonTableDatas"
                    :loading="tableLoading"
                    size="small"
                    border>
                </h-table>
            </h-col>
        </h-row>
        <section data-dom="body">
            <!-- svg -->
        </section>
       <div id="container" style="width: 800px; height: 600px;"></div>
    </section>
</template>

<script>
    /**
     *
     * @author xiagq
     * @copyright gildata
     *
     * @created 2019.02.21
     * @modified 2019.02.21
     *
     * @description select tree
     * @augments
     * @example
     *
     */
    const tree = [
        {
            "id": "101",
            "title": "文本标签",
            "expand": true,
            "children": [
                {
                    "id": "101106",
                    "title": "事件",
                    "expand": false,
                    "children": [
                        {

                            "id": "101106101",
                            "title": "工商信息",
                            "expand": false,
                            "children": [
                                {
                                    "id": "101106101101",
                                    "title": "事件",
                                    // "expand": false,
                                }
                            ],
                        },
                        {

                            "id": "101106102",
                            "title": "企业发展",
                            "expand": false,
                            "children": [
                                {
                                    "id": "101106102101",
                                    "title": "test",
                                    // "expand": false,
                                }
                            ],
                        },
                        // {
                        //     "id": "101106103",
                        //     "title": "司法风险"
                        // },
                    ],
                },
                {
                    "id": "101105",
                    "title": "电商渠道",
                    "expand": false,
                    "children": [
                        {
                            "expand": false,
                            "children": [
                                {
                                    "id": "101105101101",
                                    "title": "事件",
                                    "expand": false,
                                }
                            ],
                            "id": "101105101",
                            "title": "工商信息"
                        },
                        {
                            "id": "101105102",
                            "title": "司法风险"
                        },
                    ],
                },
                {
                    "expand": false,
                    "children": [
                        {
                            "expand": false,
                            "children": [
                                {
                                    "id": "101107101101",
                                    "title": "企业董事长"
                                },
                                {
                                    "id": "101107101102",
                                    "title": "行业大V"
                                },
                                {
                                    "id": "101107101103",
                                    "title": "企业总经理"
                                },
                            ],
                            "id": "101107101",
                            "title": "企业类"
                        }
                    ],
                    "id": "101107",
                    "title": "人物"
                },
                {
                    "expand": false,
                    "children": [
                        {
                            "id": "101108101",
                            "title": "电商产品"
                        }
                    ],
                    "id": "101108",
                    "title": "产品"
                }
            ],
        },
    ];
    // import Code from '../../code/selectTree';
    // import Code from 'h_ui/src/components/SelectTree/index';
    // console.log(`code =`, Code);
    export default {
        data () {
            return {
                tableLoading: false,
                commonTableCols: [
                    // {
                    //     type: "selection",
                    //     width: 60,
                    //     align: "center",
                    //     fixed: "left",
                    // },
                    // {
                    //     key: "index",
                    //     title: "序号",
                    //     width: 60,
                    //     align: "center",
                    // },
                    {
                        key: "allCount",
                        title: "数据总计",
                        width: 150,
                        align: "center",
                        className: "disabled-user-selection",
                    },
                    {
                        key: "today",
                        title: "今日",
                        width: 150,
                        align: "center",
                        className: "disabled-user-selection",
                    },
                    {
                        key: "yesterday",
                        title: "昨日",
                        width: 150,
                        align: "center",
                        className: "disabled-user-selection",
                    },
                    {
                        key: "accountedFor",// proportion
                        title: "占比",
                        width: 150,
                        align: "center",
                        className: "disabled-user-selection",
                    },
                    {
                        key: "annulus",// chain
                        title: "环比",
                        width: 150,
                        align: "center",
                        className: "disabled-user-selection",
                    },
                    {
                        key: "ringIncAndDec",// Ring increase and decrease
                        title: "环比增减",
                        // width: 150,
                        align: "center",
                        className: "disabled-user-selection",
                    },
                ],
                commonTableDatas: [],
                // code: Code,
                // expandLevel: 0,
                expandLevel: 1,
                labelCategoryAlias: "",
                labelAddType: "文本标签",
                labelAddName: "",
                labelCategories: [],
                labelCategoryModal: "",// 101
                labelCategorySelect: "",
                labelCategoryId: "101",
                // shit
                val1:[],
                val2:[],
                baseData1: [
                    {
                        title: 'parent',
                        id: '1-0',
                        expand: true,
                        children: [
                            {
                                title: 'child1',
                                id: '1-1',
                                expand: true,
                                children: [
                                    {
                                        title: 'child1-1-1',
                                        id: '1-1-1'
                                    },
                                    {
                                        title: 'child1-1-2',
                                        id: '1-1-2'
                                    },
                                ],
                            },
                            {
                                title: 'child2',
                                id: '1-2',
                                children: [],
                            },
                        ],
                    },
                ],
                baseData2: [
                    {
                        title: 'parent',
                        id: '1-0',
                        expand: false,
                        children: [
                            {
                                title: 'child1',
                                id: '1-1',
                                expand: false,
                                children: [
                                    {
                                        title: 'child1-1-1',
                                        id: '1-1-1'
                                    },
                                    {
                                        title: 'child1-1-2',
                                        id: '1-1-2'
                                    },
                                ],
                            },
                            {
                                title: 'child2',
                                id: '1-2',
                                children: [],
                            },
                        ],
                    },
                ],
            }
        },
        methods: {
            onSelectTreeChange (value) {
                let obj = value[0] || {};
                // console.log(`obj`, JSON.stringify(obj, null, 4));
                let isSelected = obj.selected;
                let {
                    id,
                    title,
                } = obj;
                if (id) {
                    this.labelCategoryId = id;
                    this.labelAddType = title || "文本标签";
                } else {
                    this.labelCategoryId = "101";
                    this.labelAddType = "文本标签";
                }
            },
            shitClearableSelect(type = ``) {
                this[type] = `101`;
                this.$refs[type].focus();
            },
            init() {
                this.labelCategories = tree;
            },
            showD3BarChart() {
                // 数据 dataset
                let data = [
                    {
                        key: "a",
                        value: 32
                    },
                    {
                        key: "b",
                        value: 26
                    },
                    {
                        key: "c",
                        value: 45
                    },
                    {
                        key: "d",
                        value: 38
                    },
                    {
                        key: "e",
                        value: 52
                    },
                    {
                        key: "f",
                        value: 48
                    },
                    {
                        key: "g",
                        value: 50
                    },
                    {
                        key: "h",
                        value: 34
                    },
                    {
                        key: "i",
                        value: 37
                    },
                    {
                        key: "j",
                        value: 36
                    },
                    {
                        key: "k",
                        value: 40
                    },
                ];

                // d[0] & d[1]
                // d.key & d.value
                let Xdatas = data.map(d => d.key),
                    Ydatas = data.map(d => d.value);

                let width = 800,
                    height = 500;

                // x-Axis 轴 scale range
                let x = d3.scaleBand()
                        .domain(Xdatas)
                        .rangeRound([0, width])
                        .padding(0.1);

                // y-Axis 轴 scale range
                let y = d3.scaleLinear()
                        .domain([0, d3.max(Ydatas)])
                        .rangeRound([height, 0]);

                let padding = {
                    left: 50,
                    top: 20,
                    right: 50,
                    bottom: 50
                };

                // select root DOM & 设置 svg size
                let svg = d3.select(`[data-dom="body"]`)
                            .append("svg")
                            .attr("style", `border: 1px solid red;`)
                            .attr("width", `${width + padding.left}px`)
                            // .attr("width", width + padding.left)
                            .attr("height", height + padding.bottom * 2);
                // group box
                let g = svg.append("g")
                            // .attr("transform", "translate(" + padding.left + "," + padding.top + ")");
                            .attr("transform", `translate(${padding.left}, ${padding.left + padding.top})`);

                // title
                g.append("text")
                    // .attr("transform", "translate(" + (width/2 - padding.left) + ",0)")
                    .attr("transform", `translate(${width / 2 - padding.left}, -30)`)
                    .attr("font-weight", 600)
                    .attr("margin-bottom", 80)
                    .text("D3.js Bar Chart");

                // x轴  & rotate
                g.append("g")
                    // .attr("transform", "translate(0," + height + ")")
                    .attr("transform", `translate(0, ${height})`)
                    .call(d3.axisBottom(x));

                // y轴 & ticks(10)
                g.append("g")
                    .call(d3.axisLeft(y).ticks(10));


                let chart = g.selectAll(".bar")
                        .data(data)
                        .enter()
                        .append("g");

                // // 矩形
                // chart.append("rect")
                //     .attr("x", d => d.value)
                //     .attr("cursor", "pointer")
                //     // ???
                //     .attr("y", d => y(y.domain()[0]))
                //     // RGB color & 16777215 === 0xffffff
                //     .attr("fill", d => `#${Math.floor(Math.random() * 0xffffff).toString(16)}`)
                //     .transition().delay(function(d, i) {return (i + 1) * 50}).duration(2000).ease(d3.easeBounceIn)
                //     .attr("y", function(d) {return y(d.value);})
                //     .attr("width", x.bandwidth()).attr("height", function(d) {return height - y(d.value)});

                // rect
                chart.append("rect")
                    .attr("x", d => x(d.key))
                    .attr("cursor", "pointer")
                    .attr("y", d => y(y.domain()[0]))
                    .attr("fill", d => `#${Math.floor(Math.random() * 0xffffff).toString(16)}`)
                    // .transition()
                    // .delay((d, i) => (i + 1) * 50)
                    // .duration(2000)
                    // .ease(d3.easeBounceIn)
                    .attr("y", d => y(d.value))
                    .attr("width", x.bandwidth())
                    .attr("height", d => height - y(d.value));

                // text
                chart.append("text")
                    .attr("fill", "#FFF")
                    .attr("x", d => x(d.key) + 14)
                    .attr("y", d => y(y.domain()[0]))
                    // .transition()
                    // .delay((d, i) => (i + 1) * 100)
                    // .duration(2000)
                    // .ease(d3.easeBounceIn)
                    .attr("y", d => y(d.value))
                    .attr("dx", d => (x.bandwidth() - padding.left) / 2)
                    .attr("dy", 20)
                    .text(d => d.value);

                // tooltip
                let tooltip = d3.select("body").append("div");

                // mouse event
                chart
                    .on("mouseover", function() {
                        d3.select(this)
                            .attr("opacity", 0.5);
                        // 悬浮在直方图上时，显示提示框
                        tooltip.html("我是提示框")
                            .transition()
                            .duration(500)
                            .style("left", d3.event.pageX - 20)
                            .style("top", d3.event.pageY + 20)
                            .style("opacity", 1.0);
                    })
                    .on("mouseout", function() {
                        d3.select(this)
                            .transition()
                            .delay(100)
                            .duration(500)
                            .attr("opacity", 1.0);
                    });

                // 当鼠标移出svg画布时，就将提示框隐藏掉，考虑到鼠标移出时显示的动画还未完成，需要加transition()过滤
                svg
                    .on("mouseout", function() {
                        tooltip.transition()
                            .style("opacity", 0);
                    });
            },
            showEchartMultiChart() {
                let dom = document.getElementById("container");
                let myChart = echarts.init(dom);
                let app = {};
                let option = null;
                // https://www.echartsjs.com/examples/data/asset/img/weather/sunny_128.png
                let weatherIcons = {
                    "Sunny": "https://www.echartsjs.com/examples/data/asset/img/weather/sunny_128.png",
                    "Cloudy": "https://www.echartsjs.com/examples/data/asset/img/weather/cloudy_128.png",
                    "Showers": "https://www.echartsjs.com/examples/data/asset/img/weather/showers_128.png"
                };
                option = {
                    title: {
                        text: "天气情况统计",
                        subtext: "虚构数据",
                        left: "center"
                    },
                    tooltip : {
                        trigger: "item",
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        // orient: "vertical",
                        // top: "middle",
                        bottom: 10,
                        left: "center",
                        data: ["西凉", "益州","兖州","荆州","幽州"]
                    },
                    series : [
                        {
                            type: "pie",
                            radius : "65%",
                            center: ["50%", "50%"],
                            selectedMode: "single",
                            data:[
                                {
                                    value:1548,
                                    name: "幽州",
                                    label: {
                                        normal: {
                                            formatter: [
                                                "{title|{b}}{abg|}",
                                                "  {weatherHead|天气}{valueHead|天数}{rateHead|占比}",
                                                "{hr|}",
                                                "  {Sunny|}{value|202}{rate|55.3%}",
                                                "  {Cloudy|}{value|142}{rate|38.9%}",
                                                "  {Showers|}{value|21}{rate|5.8%}"
                                            ].join("\n"),
                                            backgroundColor: "#eee",
                                            borderColor: "#777",
                                            borderWidth: 1,
                                            borderRadius: 4,
                                            rich: {
                                                title: {
                                                    color: "#eee",
                                                    align: "center"
                                                },
                                                abg: {
                                                    backgroundColor: "#333",
                                                    width: "100%",
                                                    align: "right",
                                                    height: 25,
                                                    borderRadius: [4, 4, 0, 0]
                                                },
                                                Sunny: {
                                                    height: 30,
                                                    align: "left",
                                                    backgroundColor: {
                                                        image: weatherIcons.Sunny
                                                    }
                                                },
                                                Cloudy: {
                                                    height: 30,
                                                    align: "left",
                                                    backgroundColor: {
                                                        image: weatherIcons.Cloudy
                                                    }
                                                },
                                                Showers: {
                                                    height: 30,
                                                    align: "left",
                                                    backgroundColor: {
                                                        image: weatherIcons.Showers
                                                    }
                                                },
                                                weatherHead: {
                                                    color: "#333",
                                                    height: 24,
                                                    align: "left"
                                                },
                                                hr: {
                                                    borderColor: "#777",
                                                    width: "100%",
                                                    borderWidth: 0.5,
                                                    height: 0
                                                },
                                                value: {
                                                    width: 20,
                                                    padding: [0, 20, 0, 30],
                                                    align: "left"
                                                },
                                                valueHead: {
                                                    color: "#333",
                                                    width: 20,
                                                    padding: [0, 20, 0, 30],
                                                    align: "center"
                                                },
                                                rate: {
                                                    width: 40,
                                                    align: "right",
                                                    padding: [0, 10, 0, 0]
                                                },
                                                rateHead: {
                                                    color: "#333",
                                                    width: 40,
                                                    align: "center",
                                                    padding: [0, 10, 0, 0]
                                                }
                                            }
                                        }
                                    }
                                },
                                {value:535, name: "荆州"},
                                {value:510, name: "兖州"},
                                {value:634, name: "益州"},
                                {value:735, name: "西凉"}
                            ],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: "rgba(0, 0, 0, 0.5)"
                                }
                            }
                        }
                    ]
                };
                if (option && typeof option === "object") {
                    myChart.setOption(option, true);
                }
            },
        },
        mounted() {
            this.init();
            setTimeout(() => {
                this.showD3BarChart();
                this.showEchartMultiChart();
            }, 3000);
        },
    }
</script>

