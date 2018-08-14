<template>
    <div>
        <div>init_portfolio</div>
        <el-button @click='add'>新增</el-button>
        <div class='table-wrap'>
            <el-table border stripe
                :data='data'
                height='100%'
                empty-text='暂无数据'
                >
                <el-table-column
                    prop='symbol'
                    label='symbol'
                    >
                    <template slot-scope='scope'>
                        <el-input v-model='scope.row.symbol'></el-input>
                    </template>
                </el-table-column>
                <el-table-column
                    prop='volume'
                    label='volume'
                    >
                    <template slot-scope='scope'>
                        <el-input v-model='scope.row.volume' type='number'></el-input>
                    </template>
                </el-table-column>
                <el-table-column
                    prop='delete'
                    label='操作'
                    >
                    <template slot-scope='scope'>
                        <el-button @click='del(scope.$index)'>删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        name: 'step3',
        props: {
            templates: {
                type: Array,
                default() {
                    return []
                },
            },
        },
        data() {
            return {
                data: [],
            }
        },
        computed: {

        },
        watch: {

        },
        methods: {
            add() {
                this.data.push({ symbol: '', volume: '', });
            },
            del(index) {
                this.data.splice(index, 1);
            },
        },
        mounted() {

        },
    }
</script>

<style lang='less' scoped>
    .table-wrap {
        height: 500px;
    }
</style>
