<template>
    <div>
        <div>
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
        <drag-plumb v-for='(task, index) in task_list' :task='task' :key='index'></drag-plumb>
        <!-- <div>
            <el-select v-if='task_list.length > 0' v-model='task_algo' @change='handleTaskAlgoChange'>
                <el-option
                    v-for='(task, index) in task_list'
                    :key='index'
                    :value='task.task_algo'
                    :label='task.task_display_name'
                    >
                </el-option>
            </el-select>
        </div> -->
    </div>
</template>

<script>
    import axios from 'axios';

    import DragPlumb from './DragPlumb';

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
        components: {
            DragPlumb,
        },
        data() {
            return {
                template_name: '',
                task_algo: '',
            }
        },
        computed: {
            task_list: function() {
                return (this.templates.find(item => item.template_name === this.template_name) || {}).task_list || [];
            },
        },
        watch: {
            task_list: function() {
                this.task_algo = '';
            },
        },
        methods: {
            handleTaskAlgoChange(task_algo) {
                axios.get(`http://173.82.232.228:443/api/algo/${task_algo}`).then(res => {
                    console.log(res)
                })
            }
        }
    }
</script>
