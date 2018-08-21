<template>
    <div class='step3'>
        <el-form inline>
            <el-form-item label='请选择round lotter'>
                <el-select v-model='selectRoundLotter' v-if='roundlotters.length !== 0'>
                    <el-option
                        v-for='(roundlotter, index) in roundlotters'
                        :key='index'
                        :value='roundlotter.path'
                        :label='roundlotter.name'
                        >
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div style='display: flex'>
            <div style='flex: 1; margin-right: 20px;'>
                <h2>investables</h2>
                <div class='table-wrap'>
                    <el-table border stripe
                        :data='investables'
                        height='100%'
                        empty-text='暂无数据'
                        :cell-style='getCellStyle'
                        :header-cell-style='getHeaderCellStyle'
                        >
                        <el-table-column
                            prop='symbol'
                            label='symbol'
                            align='center'
                            >
                            <template slot-scope='scope'>
                                <el-select v-model='scope.row.selectIndex' v-if='symbols.length !== 0' @change='selectSymbol(scope.$index, scope.row.selectIndex, "investables")'>
                                    <el-option
                                        v-for='(symbol, index) in symbols'
                                        :key='index'
                                        :value='index'
                                        :label='symbol.symbol'
                                        >
                                    </el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop='type'
                            label='type'
                            align='center'
                            >
                        </el-table-column>
                        <el-table-column
                            prop='delete'
                            :render-header='renderHeaderInvest'
                            align='center'
                            >
                            <template slot-scope='scope'>
                                <el-button @click='delInvest(scope.$index)'>删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <div style='flex: 1; margin-left: 20px;'>
                <h2>init_portfolio</h2>
                <div class='table-wrap'>
                    <el-table border stripe
                        :data='init_portfolio'
                        height='100%'
                        empty-text='暂无数据'
                        :cell-style='getCellStyle'
                        :header-cell-style='getHeaderCellStyle'
                        >
                        <el-table-column
                            prop='symbol'
                            label='symbol'
                            align='center'
                            >
                            <template slot-scope='scope'>
                                <el-select v-model='scope.row.selectIndex' v-if='symbols.length !== 0' @change='selectSymbol(scope.$index, scope.row.selectIndex, "init_portfolio")'>
                                    <el-option
                                        v-for='(symbol, index) in symbols'
                                        :key='index'
                                        :value='index'
                                        :label='symbol.symbol'
                                        >
                                    </el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop='volume'
                            label='volume'
                            align='center'
                            >
                            <template slot-scope='scope'>
                                <el-input v-model='scope.row.volume' type='number'></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop='delete'
                            :render-header='renderHeaderInit'
                            align='center'
                            >
                            <template slot-scope='scope'>
                                <el-button @click='delInit(scope.$index)'>删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>


        <el-form inline>
            <el-form-item label='未投资金额'>
                <el-input v-model='uninvested_cash' type='number'></el-input>
            </el-form-item>
        </el-form>
        <div class='button-wrap'>
            <el-button type='primary' @click='submit'>提交</el-button>
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
                investables: [],
                init_portfolio: [],
                roundlotters: [],
                symbols: [],
                selectRoundLotter: null,
                uninvested_cash: null,
            }
        },
        computed: {

        },
        watch: {

        },
        methods: {
            addInvest() {
                this.investables.push({ symbol: null, type: null, selectIndex: null, });
            },
            delInvest(index) {
                this.investables.splice(index, 1);
            },
            addInit() {
                this.init_portfolio.push({ symbol: null, type: null, volume: null, selectIndex: null, });
            },
            delInit(index) {
                this.init_portfolio.splice(index, 1);
            },
            renderHeaderInvest(h) {
                return h(
                    'el-button',
                    {
                        on: {
                            click: this.addInvest,
                        },
                    },
                    ['添加'],
                )
            },
            renderHeaderInit(h) {
                return h(
                    'el-button',
                    {
                        on: {
                            click: this.addInit,
                        },
                    },
                    ['添加'],
                )
            },
            selectSymbol($index, index, tableDataName) {
                this[tableDataName][$index].symbol = this.symbols[index].symbol;
                this[tableDataName][$index].type = this.symbols[index].type;
                this[tableDataName] = this[tableDataName].slice(0);
            },
            submit() {
                let { selectRoundLotter: roundlotter, uninvested_cash, investables, init_portfolio: volumes } = this;
                let robo_config_id = this.$route.params.id;
                let data = {};
                if(!roundlotter) {
                    this.$message({
                        type: 'error',
                        message: '请选择roundlotter',
                    })
                    return;
                } else {
                    data.roundlotter = roundlotter;
                }

                data.init_portfolio = {};
                uninvested_cash = parseFloat(uninvested_cash);
                if(isNaN(uninvested_cash)) {
                    this.$message({
                        type: 'error',
                        message: '请输入正确的未投资金额',
                    })
                    return;
                } else {
                    data.init_portfolio.uninvested_cash = uninvested_cash;
                }
                let flag = true;
                volumes = volumes.map(i => {
                    delete i.selectIndex;
                    delete i.type;
                    i.volume = parseFloat(i.volume);
                    if(isNaN(i.volume)) {
                        flag = false;
                    }
                    return i;
                })
                if(!flag) {
                    this.$message({
                        type: 'error',
                        message: '请输入正确的数字',
                    })
                    return;
                } else {
                    data.init_portfolio.volumes = volumes;
                }

                data.investables = investables.map(i => {
                    delete i.selectIndex;
                    return i;
                }).filter(i => i.symbol !== null)
                data.robo_config_id = this.$route.params.id;
                axios.post(`http://173.82.232.228:443/api/port`, data).then(res => {
                    if(res.data.status === 'success') {
                        this.$router.push(`/result`);
                    }
                })
            },
            getCellStyle() {
                return { padding: '6px 0', };
            },
            getHeaderCellStyle() {
                return { padding: '6px 0', };
            },
        },
        mounted() {
            axios.get(`http://173.82.232.228:443/api/port`).then(res => {
                let { roundlotter, symbols } = res.data;
                this.roundlotters = roundlotter;
                this.symbols = symbols;
            })
        },
    }
</script>

<style lang='less' scoped>
    .step3 {
        padding: 40px 20px;
        .el-form {
            margin-bottom: 20px;
        }
        .button-wrap {
            text-align: center;
            margin-top: 40px;
        }
        h2 {
            font-size: 16px;
            line-height: 32px;
            font-weight: normal;
        }
        .table-wrap {
            height: 400px;
            margin-bottom: 20px;
        }
    }
</style>
