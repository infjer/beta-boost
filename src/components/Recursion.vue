<script>
    import axios from 'axios';

    export default {
        name: 'recursion',
        render() {
            return (
                <div>
                    <div>depth={ this.depth }</div>
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
                    {
                        this.selectAlgo === null || !this.schema? null : (
                            <form-schema ref='formSchema' schema={ this.schema } v-model={ this.model }>
                                <div style={{ display: 'none' }}></div>
                            </form-schema>
                        )
                    }
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
                }
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
                this.schema = require('./schema.json');
            },
        },
    }
</script>

<style lang='less'>
    .recursion-wrap {
        display: flex;
        > div {
            flex: 1;
        }
    }
</style>
