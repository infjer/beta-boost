<script>
    import axios from 'axios';

    export default {
        name: 'recursion',
        render() {
            return (
                <div class='recursion'>
                    <el-collapse>
                        <el-collapse-item>
                            <div slot='title'>
                                {
                                    this.options.length === 0? null : (
                                        <el-select
                                            value={ this.selectAlgo }
                                            placeholder='请选择algo'
                                            onChange={ this.handleSelectChange }
                                            >
                                            {
                                                this.options.map((option, index) => (
                                                    <el-option
                                                        key={ index }
                                                        value={ index }
                                                        label={ option.algo_name }
                                                        >
                                                    </el-option>
                                                ))
                                            }
                                        </el-select>
                                    )
                                }
                            </div>
                            {
                                this.selectAlgo === null || !this.schema? null : (
                                    <form-schema ref='formSchema' schema={ this.schema } v-model={ this.model }>
                                        <div style={{ display: 'none' }}></div>
                                    </form-schema>
                                )
                            }
                        </el-collapse-item>
                    </el-collapse>
                    <div class='recursion-wrap'>
                        {
                            this.limit <= this.depth || this.sub_algo_types.length === 0? null : (
                                this.sub_algo_types.map((sub, index) => (
                                <recursion
                                    ref={ `${sub.algo_type}_${this.depth + 1}` }
                                    key={ index }
                                    algo_type={ sub.algo_type }
                                    depth={ this.depth + 1 }
                                    limit={ this.limit }
                                    >
                                </recursion>
                            )))
                        }
                    </div>
                </div>
            )
        },
        props: {
            algo_type: {
                type: String,
                required: true,
            },
            algo_name: {
                type: String,
                default() {
                    return '';
                },
            },
            limit: {
                type: Number,
                default() {
                    return 5;
                },
            },
            depth: {
                type: Number,
                required: true,
            },
        },
        data() {
            return {
                options: [],
                selectAlgo: null,
                sub_algo_types: [],
                schema: {},
                model: {},
            }
        },
        methods: {
            handleSelectChange(index) {
                this.selectAlgo = index;
            },
            getFormData() {
                if(this.selectAlgo === null) return;
                let { algo_type: type, algo_name: clazz } = this.options[this.selectAlgo];
                let building_blocks = {};
                if(this.sub_algo_types.length !== 0) {
                    this.sub_algo_types.map(i => {
                        building_blocks[i.name] = this.$refs[`${i.algo_type}_${this.depth + 1}`].getFormData();
                    })
                } else {

                }
                return {
                    type,
                    clazz,
                    config: this.schema? this.$refs.formSchema.data : undefined,
                    building_blocks: this.sub_algo_types.length !== 0? building_blocks : undefined,
                };
            },
        },
        mounted() {
            axios.get(`http://173.82.232.228:443/api/algo/${this.algo_type}`).then(res => {
                this.options = res.data;
            })
        },
        watch: {
            selectAlgo(index) {
                let { sub_algo_types } = this.options[index];
                this.sub_algo_types = Object.keys(sub_algo_types).map(name => ({
                    name,
                    algo_type: sub_algo_types[name],
                }))
                // this.sub_algo_types = this.options[index].sub_algo_types;
                this.schema = require(`./schema${Math.floor(Math.random()*3+1)}.json`);
                // this.schema = this.options[index].algo_config_schema;
            },
        },
    }
</script>

<style lang='less' scoped>
    .recursion {
        margin: 0 40px;
    }
    .el-collapse {
        margin-bottom: 20px;
    }
    .recursion-wrap {
        display: flex;
        > div {
            flex: 1;
        }
    }
</style>
