
import moment from "moment";
import XEUtils from 'xe-utils'
import * as echarts from "echarts";
import "../../../../node_modules/echarts/map/js/china.js";
import { MaximizeTable } from '@/utils/vxe-table'
import { mapState } from 'vuex'
import { options1, options2, options3, options4, options2Color } from './scripts/chart-options.js'
import { ApiBasic } from "@/apis/index.js";

const apiBasic = new ApiBasic()
export default {
    name: 'supplier_supplierNotice',
    components: {},
    computed: {
        ...mapState({
            userInfo: state => state.User.userInfo ?? {},
        }),
    },
    data() {
        const dict = this.$store.state.Common.dict
        return {
            dict,
            form: {},
            sumList: [
                { label: '供应商总数', field: 'num', icon: 'gys' },
                { label: '合格供应商', field: 'qualifiedNum', icon: 'hggys' },
                { label: '潜在供应商', field: 'potentialNum', icon: 'qzgys' },
                { label: '淘汰供应商', field: 'eliminateNum', icon: 'ttgys' },
            ],
            chart1: null,
            chart2: null,
            chart3: null,
            chart4: null,
            chinaMap: null, // 地图
            options1,
            options2,
            options3,
            options4,
            chinaMapList: [
                { id: '', name: "南海诸岛", value: 0 },
                { id: 110000, name: "北京", value: 0 },
                { id: 120000, name: "天津", value: 0 },
                { id: 310000, name: "上海", value: 0 },
                { id: 500000, name: "重庆", value: 0 },
                { id: 130000, name: "河北", value: 0 },
                { id: 410000, name: "河南", value: 0 },
                { id: 530000, name: "云南", value: 0 },
                { id: 210000, name: "辽宁", value: 0 },
                { id: 230000, name: "黑龙江", value: 0 },
                { id: 430000, name: "湖南", value: 0 },
                { id: 340000, name: "安徽", value: 0 },
                { id: 370000, name: "山东", value: 0 },
                { id: 650000, name: "新疆", value: 0 },
                { id: 320000, name: "江苏", value: 0 },
                { id: 330000, name: "浙江", value: 0 },
                { id: 360000, name: "江西", value: 0 },
                { id: 420000, name: "湖北", value: 0 },
                { id: 450000, name: "广西", value: 0 },
                { id: 620000, name: "甘肃", value: 0 },
                { id: 140000, name: "山西", value: 0 },
                { id: 150000, name: "内蒙古", value: 0 },
                { id: 610000, name: "陕西", value: 0 },
                { id: 220000, name: "吉林", value: 0 },
                { id: 350000, name: "福建", value: 0 },
                { id: 520000, name: "贵州", value: 0 },
                { id: 440000, name: "广东", value: 0 },
                { id: 630000, name: "青海", value: 0 },
                { id: 540000, name: "西藏", value: 0 },
                { id: 510000, name: "四川", value: 0 },
                { id: 640000, name: "宁夏", value: 0 },
                { id: 460000, name: "海南", value: 0 },
                { id: 710000, name: "台湾", value: 0 },
                { id: 810000, name: "香港", value: 0 },
                { id: 820000, name: "澳门", value: 0 },
            ],
        }
    },
    created() { },
    mounted() {
        window.onresize = () => {
            //动态改变图表尺寸
            this.chinaMap.resize();
            // this.chart1.resize();
            this.chart2.resize();
            this.chart3.resize();
            this.chart4.resize();
        };
        this.$nextTick(() => {
            this.chart4 = echarts.init(this.$refs.charts4);
            this.chart4.setOption(this.options4);
        })
    },
    activated() {
        this.init();
    },
    methods: {
        getNotice(){
            const loading = this.loading('加载中...')
            apiBasic.getNoticeBoard().then(res => {
                if(res.code == 200 && res.data){
                    this.form = res.data;
                    this.options1.series[0].data = [res.data.eliminateNum, res.data.potentialNum, res.data.qualifiedNum];
                    const color = {}
                    const supplierTypeMap = (res.data?.supplierTypeMap??[]).map(x=>{
                        return { value: x.num, name: x.supplierTypeName, itemStyle:{"color": options2Color[x.supplierTypeName]} }
                    })
                    const enterpriseTypeMap = (res.data?.enterpriseTypeMap??[]).map(x=>{
                        return { value: x.num, name: x.enterpriseTypeName, itemStyle:{"color": options2Color[x.enterpriseTypeName]} }
                    })
                    this.options2.series[0].data = [ ...supplierTypeMap, ...enterpriseTypeMap ].sort((a, b) => {
                        return a.value - b.value;
                    })
                    // this.options2.series[0].data = (res.data?.enterpriseTypeMap??[]).map(x=>{
                    //     return { value: x.num, name: x.enterpriseTypeName }
                    // }).sort((a, b) => {
                    //     return a.value - b.value;
                    // })
                    this.options3.yAxis[0].data = (res.data?.supplierNameAmountMap??[]).map(x=>{
                        return x.businessLicense
                    })
                    this.options3.series[0].data = (res.data?.supplierNameAmountMap??[]).map(x=>{
                        return x.amount
                    })
                    const chinaMapList = [...this.chinaMapList]
                    this.chinaMapList = chinaMapList.map(x=>{
                        const find = (res.data?.citySpreadMap??[]).find(y=>y.name.includes(x.name));
                        return { ...x, value: find?.num??0 };
                    })
                    this.getMap();
                    this.$nextTick(() => {
                        // this.chart1 = echarts.init(this.$refs.charts1);
                        this.chart2 = echarts.init(this.$refs.charts2);
                        this.chart3 = echarts.init(this.$refs.charts3);
                        // this.chart1.setOption(this.options1, true);
                        this.chart2.setOption(this.options2, true);
                        this.chart3.setOption(this.options3, true);
                    })
                }else{
                    this.$message.error(res?.message??'获取异常');
                }
            }).catch(err=>{
                this.$message.error(err?.message??'请求失败');
            }).finally(()=>{
                loading.close()
            })
        },
        init() {
            this.getNotice();
        },
        // 地图
        getMap() {
            this.chinaMap = echarts.init(this.$refs.chinaMap);
            let option = {
                tooltip: {
                    triggerOn: "mousemove",
                    formatter: (data) => {
                        if (data.value) return `${data.name} <br /> ${data.value}`
                        return `${data.name}`
                    },
                },
                // 设置地图样式
                geo: {
                    map: "china",
                    zoom: 1.2,
                    roam: true, // 开启鼠标缩放和平移漫游
                    scaleLimit: {
                        min: 1.2,
                        max: 10,
                    },
                    layoutSize: "100%", //保持地图宽高比
                    // 设置图块颜色，
                    regions: this.getRegions(),
                    label: {
                        // 默认样式
                        normal: {
                            show: true,
                            fontSize: "12",
                            color: "rgba(0,0,0,.9)",
                        },
                        // 高亮样式
                        emphasis: {
                            show: true,
                            textStyle: {
                                color: "#333",
                            },
                        },
                    },

                    itemStyle: {
                        // 默认样式，图块没数据时，会取默认颜色
                        normal: {
                            borderColor: "#e69b81",
                            areaColor: "#8ec5fc",
                        },
                        // 高亮样式
                        emphasis: {
                            areaColor: "#f1ccbf",
                        },
                        areaColor: ["red", "blue"],
                    },
                    data: this.chinaMapList,
                },
                series: [
                    {
                        name: "",
                        type: "map",
                        geoIndex: 0,
                        data: this.chinaMapList,
                    },
                ],
            };
            this.$nextTick(() => {
                this.chinaMap.setOption(option, true);
            });
        },
        // 设置颜色
        getRegions() {
            let chinaMapList = this.chinaMapList;
            return chinaMapList.map((i, j) => {
                return {
                    name: i.name,
                    itemStyle: {
                        areaColor: i.value > 0 ? "#8ec5fc" : "#fffaf5",
                    },
                    label: {
                        normal: {
                            show: i.value > 0,
                        },
                    },
                };
            });
        },
        // 加载组件功能
        loading(text) {
            const loading = this.$loading({
                lock: true,
                text,
                spinner: 'el-icon-loading',
            })
            return loading
        },
    }
}
