<script>
    import axios from 'axios';
    import { mapMutations } from 'vuex';

    export default {
        name: 'step1',
        render() {
            return (
                <div>
                    {
                        this.templates.length !== 0? (
                            <div>
                                <span>请选择模板</span>
                                <el-select value={ this.index } onChange={ this.handleSelectTemplate }>
                                    {
                                        this.templates.map((template, index) => (
                                            <el-option
                                                key={index}
                                                value={ index }
                                                label={ template.template_display_name }
                                                >
                                            </el-option>
                                        ))
                                    }
                                </el-select>
                            </div>
                        ) : null
                    }
                    {
                        this.index !== null? (
                            <div>
                                <span>请输入template名字</span>
                                <el-input value={ this.robo_config_name } onChange={ this.handleInptChange }></el-input>
                            </div>
                        ) : null
                    }
                    <el-button onClick={ this.handleNextStep }>下一步</el-button>
                </div>
            )
        },
        data() {
            return {
                templates: [],
                index: null,
                robo_config_name: '',
            }
        },
        props: {
            next: {
                type: Function,
                default() {
                    return () => {};
                },
            },
        },
        methods: {
            handleSelectTemplate(index) {
                this.index = index;
            },
            handleInptChange(robo_config_name) {
                this.robo_config_name = robo_config_name;
            },
            handleNextStep() {
                let { index, robo_config_name } = this;
                if(robo_config_name.trim() === '') return;
                axios.post('http://173.82.232.228:443/api/template', {
                    template_name: this.templates[index].template_name,
                    robo_config_name,
                }).then(res => {
                    this.setTaskList(this.templates[index].task_list);
                    this.$router.push(`/robovisor/${res.data.robo_config_id}`);
                })
            },
            ...mapMutations({
                setTaskList: 'SET_TASK_LIST',
            }),
        },
        mounted() {
            axios.get('http://173.82.232.228:443/api/template', {}).then(res => {
                this.templates = res.data;
            })
        },
    }
</script>
