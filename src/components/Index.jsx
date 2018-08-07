<script>
    import axios from 'axios';

    import Step1 from './step1';
    import Step2 from './step2';
    import Step3 from './step3';

    export default {
        components: {
            'step1': Step1,
            'step2': Step2,
            'step3': Step3,
        },
        render() {
            return (
                <div>
                    <el-steps active={ this.active } align-center finish-status="success">
                        <el-step title='步骤1' description='这是一段很长很长很长的描述性文字'></el-step>
                        <el-step title='步骤2' description='这是一段很长很长很长的描述性文字'></el-step>
                        <el-step title='步骤3' description='这是一段很长很长很长的描述性文字'></el-step>
                    </el-steps>
                    <transition name='fade'>
                        {
                            this.active === 0? <Step1 /> : null
                        }
                        {
                            this.active === 1? <Step2 /> : null
                        }
                        {
                            this.active === 2? <Step3 /> : null
                        }
                    </transition>
                    <el-button style="margin-top: 12px;" onClick={ this.next }>下一步</el-button>
                </div>
            )
        },
        data() {
            return {
                templates: [],
                templateIndex: 0,
                task_algo: null,
                active: 0,
            };
        },
        computed: {
            list: function() {
                return this.templates[this.templateIndex] && this.templates[this.templateIndex].task_list;
            },
        },
        watch: {
            templateIndex: function() {
                this.task_algo = null;
            },
        },
        methods: {
            next() {
                if (this.active++ > 2) this.active = 0;
            },
        },
        mounted() {
            axios.get('http://173.82.232.228:443/api/template', {}).then(res => {
                console.log(res)
                this.templates = res.data;
            })
        },
        created() {

        },
    }
</script>

<style lang='less' scoped>
    .page__content {
        display: flex;
    }
    .main {
        display: flex;
        flex: 1;
        height: 100%;
        .left {
            flex: 4 1 0;
            position: relative;
            .left-wrap {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                overflow: auto;
            }
        }
        .right {
            flex: 1 1 0;
        }
    }
    .fade-enter-active, .fade-leave-active {
        transition: transform .5s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        transform: translate(100%, 0);
    }
</style>
