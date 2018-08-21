<template>
    <div class='step4'>
        <el-form v-model='form' label-width='200px'>
            <el-form-item label='portfolio_config' v-if='portfolio_configs.length !== 0'>
                <el-select v-model='form.portfolio_config'>
                    <el-option
                        v-for='(item, index) in portfolio_configs'
                        :key='index'
                        :label='item.name'
                        :value='index'
                        >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label='robo_config' v-if='robo_configs.length !== 0'>
                <el-select v-model='form.robo_config'>
                    <el-option
                        v-for='(item, index) in robo_configs'
                        :key='index'
                        :label='item.name'
                        :value='index'
                        >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label='请选择起止日期'>
                <el-date-picker
                    v-model='form.date'
                    type='daterange'
                    range-separator='-'
                    start-placeholder='开始日期'
                    end-placeholder='结束日期'>
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type='primary' @click='submit'>提交</el-button>
            </el-form-item>
        </el-form>
        <div id='chart' v-loading='loadingStatus' element-loading-text='正在加载中'></div>
    </div>
</template>

<script>
    import axios from 'axios';
    import highcharts from 'highcharts/highstock';
    import moment from 'moment';

    export default {
        name: 'step4',
        data() {
            return {
                form: {
                    date: '',
                    portfolio_config: '',
                    robo_config: '',
                },
                loadingStatus: false,
                portfolio_configs: [],
                robo_configs: [],
            }
        },
        created() {
            axios.get(`http://173.82.232.228:443/api/temp`).then(res => {
                let { portfolio_config, robo_config, } = res.data;
                this.portfolio_configs = portfolio_config;
                this.robo_configs = robo_config;
            })
        },
        methods: {
            submit() {
                axios.post(`http://173.82.232.228:443/api/task`, {}).then(res => {
                    if(res.data.submission_state === 'success') {
                        let { task_id } = res.data;
                        this.loadingStatus = true;
                        setTimeout(() => {
                            this.queryStatus(task_id);
                        }, 5000)
                    }
                })
            },
            queryStatus(task_id) {
                axios.get(`http://173.82.232.228:443/api/task/${task_id}`).then(res => {
                    if(res.data.status !== 'SUCCESS') {
                        setTimeout(() => {
                            this.queryStatus(task_id);
                        }, 5000)
                    } else {
                        this.loadingStatus = false;
                        axios.get(`http://173.82.232.228:443/api/result/${task_id}`).then(res => {
                            this.drawChart(res.data.result);
                        })
                    }
                })
            },
            drawChart(data) {
                highcharts.chart('chart', {
                    credits: false,
                    height: '100%',
                    annotations: [
                        {
                            labelOptions: {
                                allowOverlap: true,
                                crop: true,
                            },
                        },
                    ],
                    chart: {
                        spacing: [20, 20, 20, 20],
                    },
                    title: {
                        text: null,
                    },
                    xAxis: {
                        type: 'datetime',
                        labels: {
                            formatter: function() {
                                return moment(this.value).format('YYYY-MM-DD');
                            },
                            overflow: 'justify',
                            distance: 30,
                        },
                    },
                    yAxis: {
                        title: {
                            text: null,
                        },
                    },
                    legend: {
                        enabled: false,
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'middle',
                    },
                    series: [{
                        data: data.map(i => [Date.UTC(i.date.substr(0, 4) - 0, i.date.substr(5, 2) - 1, i.date.substr(8, 2) - 0), i.net_value]),
                        states: {
                            hover: {
                                enabled: false,
                            },
                        },
                        color: '#66b1ff',
                    }],
                    responsive: {
                        rules: [
                            {
                                condition: {
                                    maxWidth: 500,
                                },
                                chartOptions: {
                                    legend: {
                                        layout: 'horizontal',
                                        align: 'center',
                                        verticalAlign: 'bottom',
                                    },
                                },
                            },
                        ],
                    },
                })
            },
        }
    }
</script>

<style lang='less' scoped>
    .step4 {
        padding: 40px 20px;
    }
    #chart {
        width: 100%;
        height: 500px;
    }
</style>
