<script>
    import axios from 'axios';
    import { mapGetters } from 'vuex';

    import Recursion from './Recursion';

    export default {
        name: 'step2',
        render() {
            return (
                <div>
                    <div>factor</div>
                    {
                        this.factors.length === 0? null : (
                            <el-select multiple value={ this.factor } onChange={ this.handleSelectFactor }>
                                {
                                    this.factors.map((factor, index) => (
                                        <el-option
                                            key={ index }
                                            value={ index }
                                            label={ factor.name }
                                            >
                                        </el-option>
                                    ))
                                }
                            </el-select>
                        )
                    }
                    <el-button type='primary' onClick={ this.saveFactor }>保存factor</el-button>
                    <div class='task'>
                        {
                            this.task_list.map((task, index) => (
                                <div key={ index } class='task_item'>
                                    <div>task_algo={ task.task_algo }</div>
                                    <div>task_display_name={ task.task_display_name }</div>
                                    <div>task_type={ task.task_type }</div>
                                    <div>
                                        <span>请选择schedule</span>
                                        <el-select
                                            value={ this.selectSchedule[index].name }
                                            placeholder='请选择schedule'
                                            onChange={ this.handleSelectChange.bind(this, index) }
                                            >
                                            {
                                                this.schedules.map((schedule, _index) => (
                                                    <el-option
                                                        key={ _index }
                                                        value={ _index }
                                                        label={ schedule.name }
                                                        >
                                                    </el-option>
                                                ))
                                            }
                                        </el-select>
                                    </div>
                                    <div>您选择的是</div>
                                    {
                                        (() => {
                                            if(this.selectSchedule[index].name === undefined) return null;
                                            let { template, variables } = this.selectSchedule[index];
                                            if(variables.length === 0) return ( <div>{ template }</div> );
                                            let t = template.split(/\{[a-zA-Z]*\}/g);
                                            let length = Math.max(variables.length, t.length);
                                            let arr = [];
                                            for(let i = 0; i < length; i++) {
                                                if(t[i] !== undefined) arr.push(<span>{ t[i] }</span>);
                                                if(variables[i] !== undefined) {
                                                    let v = variables[i];
                                                    let options = [];
                                                    if(v === 'dayOfWeek' || v === 'daysOfWeek') {
                                                        options = [
                                                            { label: '一', value: 'MON', },
                                                            { label: '二', value: 'TUE', },
                                                            { label: '三', value: 'WEN', },
                                                            { label: '四', value: 'THU', },
                                                            { label: '五', value: 'FRI', },
                                                            { label: '六', value: 'SAT', },
                                                            { label: '七', value: 'SUN', },
                                                        ];
                                                        arr.push(
                                                            <el-select
                                                                multiple={ v === 'daysOfWeek' }
                                                                value={ this.selectSchedule[index].form[v] }
                                                                onChange={ this.handleScheduleChange.bind(this, index, v, v === 'daysOfWeek') }
                                                                >
                                                                {
                                                                    options.map((option, _index) => (
                                                                        <el-option
                                                                            key={ _index }
                                                                            value={ option.value }
                                                                            label={ option.label }
                                                                            >
                                                                        </el-option>
                                                                    ))
                                                                }
                                                            </el-select>
                                                        )
                                                    } else {
                                                        options = Array.from({ length: v === 'hour'? 24 : 60 }, (v, k) => k).map(i => ({ label: i, value: i }));
                                                        arr.push(
                                                            <el-select
                                                                value={ this.selectSchedule[index].form[v] }
                                                                onChange={ this.handleScheduleChange.bind(this, index, v, v === 'daysOfWeek') }
                                                                >
                                                                {
                                                                    options.map((option, _index) => (
                                                                        <el-option
                                                                            key={ _index }
                                                                            value={ option.value }
                                                                            label={ option.label }
                                                                            >
                                                                        </el-option>
                                                                    ))
                                                                }
                                                            </el-select>
                                                        )
                                                    }
                                                }
                                            }
                                            return arr;
                                        })()
                                    }
                                    <el-button onClick={ this.handleSave.bind(this, index) }>保存</el-button>
                                    <recursion ref={ `${task.task_algo}_1` } algo_type={ task.task_algo } limit={ 4 } depth={ 1 }></recursion>
                                    <el-button onClick={ this.handleSaveForm.bind(this, task.task_algo) }>保存</el-button>
                                </div>
                            ))
                        }
                    </div>
                    <el-button onClick={ this.handleNextStep }>下一步</el-button>
                </div>
            )
        },
        props: {
            templates: {
                type: Array,
                default() {
                    return [];
                },
            },
        },
        components: {
            Recursion,
        },
        data() {
            return {
                schedules: [],
                selectSchedule: [],
                factors: [],
                factor: [],
            }
        },
        computed: {
            ...mapGetters([
                'task_list',
            ])
        },
        watch: {

        },
        methods: {
            handleSelectChange(task_index, _index) {
                this.selectSchedule[task_index] = Object.assign({}, this.selectSchedule[task_index], this.schedules[_index]);
                if(this.selectSchedule[task_index].variables.length !== 0) {
                    this.selectSchedule[task_index].form = {};
                    this.selectSchedule[task_index].variables.map(i => {
                        if(i === 'daysOfWeek') {
                            this.selectSchedule[task_index].form[i] = [];
                        } else {
                            this.selectSchedule[task_index].form[i] = '';
                        }
                    })
                }
                this.selectSchedule = this.selectSchedule.slice(0);
            },
            handleScheduleChange(index, key, isMultiple, value) {
                let { form } = this.selectSchedule[index];
                form = Object.assign({}, form, { [key]: value });
                this.selectSchedule[index] = Object.assign({}, this.selectSchedule[index], { form });
                this.selectSchedule = this.selectSchedule.slice(0);
            },
            handleSave(index) {
                let { variables, form, type, name, template } = this.selectSchedule[index];
                if(!variables) return;
                for(let i in form) {
                    if(form[i] === '') return;
                }
                let data = {
                    robo_config_id: this.$route.params.id,
                    type,
                    name,
                    template: (() => {
                        let s = template;
                        for(let i in form) {
                            s = s.replace(new RegExp(`{${i}}`), Array.isArray(form[i])? form[i].join() : form[i]);
                        }
                        return s;
                    })()
                }
                axios.post(`http://173.82.232.228:443/api/sched`, data).then(res => {
                    if(res.data.status === 'success') {
                        this.$message({
                            message: '成功',
                            type: 'success',
                        });
                    }
                })
            },
            handleNextStep() {
                this.$router.push(`/portofolio/${this.$route.params.id}`);
            },
            handleSelectFactor(value) {
                this.factor = value;
            },
            saveFactor() {
                let data = {
                    robo_config_id: this.$route.params.id,
                    factor: this.factor.map(i => this.factors[i])
                }
                axios.post(`http://173.82.232.228:443/api/factor`, data).then(res => {

                })
            },
            handleSaveForm(task_algo) {
                let data = {
                    [task_algo]: this.$refs[`${task_algo}_1`].getFormData(),
                    robo_config_id: this.$route.params.id,
                };
                axios.post(`http://173.82.232.228:443/api/algo`, data).then(res => {
                    console.log(res.data)
                })
            },
        },
        created() {
            axios.get(`http://173.82.232.228:443/api/sched`).then(res => {
                this.schedules = res.data;
            })
            axios.get(`http://173.82.232.228:443/api/factor`).then(res => {
                this.factors = res.data.factor;
            })
            this.selectSchedule = this.task_list.map(task => ({
                type: task.task_type,
            }))
            // this.task_list.map(i => {
            //     axios.get(`http://173.82.232.228:443/api/algo/${i.task_algo}`).then(res => {
            //
            //     })
            // })
        },
        mounted() {

        },
    }
</script>

<style lang='less' scoped>
    .task {
        display: flex;
        .task_item {
            flex: 1;
        }
    }
</style>
