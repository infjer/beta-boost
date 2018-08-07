<template>
    <div>
        <el-steps :active='active' align-center finish-status="success">
            <el-step title='步骤1'></el-step>
            <el-step title='步骤2'></el-step>
            <el-step title='步骤3'></el-step>
        </el-steps>
        <keep-alive>
            <Step1 v-if='active === 0' :templates='templates'/>
        </keep-alive>
        <keep-alive>
            <Step2 v-if='active === 1' :templates='templates'/>
        </keep-alive>
        <keep-alive>
            <Step3 v-if='active === 2' :templates='templates' ref='step3'/>
        </keep-alive>
        <el-button @click='next' v-if='active !== 3'>下一步</el-button>
    </div>
</template>

<script>
    import axios from 'axios';

    import query from './scenario5.js';

    import Step1 from './step1';
    import Step2 from './step2';
    import Step3 from './step3';

    export default {
        components: {
            Step1,
            Step2,
            Step3,
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
                this.active++;
                if(this.active === 3) {
                    console.log('post');
                    // setTimeout(() => {
                    //     this.$router.replace('/');
                    // }, 2000)
                    // this.post();
                }
            },
            post() {
                axios.post('http://173.82.232.228:443/api/task', query).then(res => {
                    console.log(res.data);
                })
            },
        },
        mounted() {
            axios.get('http://173.82.232.228:443/api/template', {}).then(res => {
                this.templates = res.data;
            })
        },
        created() {

        },
    }
</script>

<style lang='less' scoped>
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
</style>
