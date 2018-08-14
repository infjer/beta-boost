<template>
    <div>
        <div>
            <div>请选择模板</div>
            <el-select v-if='templates.length > 0' v-model='template_name'>
                <el-option
                    v-for='(template, index) in templates'
                    :key='index'
                    :value='template.template_name'
                    :label='template.template_display_name'
                    >
                </el-option>
            </el-select>
        </div>
        <el-collapse v-model='activeCollapse' v-if='task_list.length !== 0' @change='preventCollapse'>
            <el-collapse-item
                v-for='(item, index) in task_list'
                :key='index'
                :title='item.task_display_name'
                :name='item.task_algo'
                >
                <div>task_algo={{ item.task_algo }}</div>
                <div>task_type={{ item.task_type }}</div>
                <div class='main'>
                    <div class='schedule'>
                        <span>设置schedule</span>
                        <el-select v-model='selectSchedules[item.task_algo]' placeholder='请选择schedule'>
                            <el-option
                                v-for='(item, index) in schedules'
                                :key='index'
                                :value='index'
                                :label='item.name'
                                >
                            </el-option>
                        </el-select>
                        <template v-if='schedules[selectSchedules[item.task_algo]]'>
                            <div>schedule template</div>
                            <div v-if='schedules[selectSchedules[item.task_algo]].variables.length === 0'>{{ schedules[selectSchedules[item.task_algo]].template }}</div>
                            <div v-else>{{ getTemplate(schedules[selectSchedules[item.task_algo]]) }}</div>
                        </template>
                    </div>
                    <div class='task'>
                        <el-select
                            v-if='selectOption[item.task_algo] && selectOption[item.task_algo].length !== 0'
                            v-model='selectValue[item.task_algo]'
                            placeholder='请选择task_algo'
                            >
                            <el-option
                                v-for='(item, index) in selectOption[item.task_algo]'
                                :key='index'
                                :value='item.algo_name'
                                :label='item.algo_name'
                                >
                            </el-option>
                        </el-select>
                    </div>
                </div>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        name: 'step1',
        props: {
            templates: {
                type: Array,
                default() {
                    return [];
                },
            },
        },
        data() {
            return {
                template_name: '',
                task_algo: '',
                selectOption: {},
                selectValue: {},
                activeCollapse: [],
                schedules: [], // 任务列表
                selectSchedules: {}, // 每一个task_algo对应选择的schedule的index: [task_algo]: number
            }
        },
        computed: {
            task_list: function() {
                // 选择的模板任务列表
                return (this.templates.find(item => item.template_name === this.template_name) || {}).task_list || [];
            },
        },
        watch: {
            template_name: function() {
                this.task_list.map(i => {
                    axios.get(`http://173.82.232.228:443/api/algo/${i.task_algo}`).then(res => {
                        this.selectOption = Object.assign({}, this.selectOption, { [i.task_algo]: res.data, });
                        this.selectValue = Object.assign({}, this.selectValue, { [i.task_algo]: '', });
                    })
                })
            },
            task_list: function() {
                // 默认展开所有面板
                this.activeCollapse = this.task_list.map(i => i.task_algo);
                this.task_list.map(i => {
                    this.selectSchedules[i.task_algo] = '';
                });
                this.selectSchedules = Object.assign({}, this.selectSchedules);
            },
        },
        methods: {
            preventCollapse() {
                // this.activeCollapse = this.task_list.map(i => i.task_algo);
            },
            getTemplate() {
                // return <div>4</div>
            }
        },
        created() {
            axios.get(`http://173.82.232.228:443/api/sched`).then(res => {
                this.schedules = res.data;
            })
        },
        mounted() {
            // setInterval(() => {
            //     console.log(Object.keys(this.selectOption))
            // }, 2000)
        },
    }
</script>

<style lang='less' scoped>
    .main {
        display: flex;
        .schedule, .task {
            flex: 1;
        }
    }
</style>
