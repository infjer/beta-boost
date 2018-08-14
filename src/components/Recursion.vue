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
                        this.selectAlgo === null? null : (
                            <form-schema ref="formSchema" schema={ this.schema } v-model={ this.model }>
                                <el-button type="primary" onClick={ this.submit }>Subscribe</el-button>
                                <el-button type="reset">Reset</el-button>
                            </form-schema>
                        )
                    }
                    <div class='recursion-wrap'>
                        {
                            this.limit <= this.depth || this.sub_algo_types.length === 0? null : (
                                this.sub_algo_types.map((sub, index) => (
                                <recursion
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
            submit (e) {
                // this.$refs.formSchema.form() returns the ElementUI's form instance
                this.$refs.formSchema.form().validate(valid => {
                    if (valid) {
                        // this.model contains the valid data according your JSON Schema.
                        // You can submit your model to the server here
                        console.log(JSON.stringify(this.model))
                        this.$refs.formSchema.clearErrorMessage()
                    } else {
                        this.$refs.formSchema.setErrorMessage('Please fill out the required fields')
                        return false
                    }
                })
            },
        },
        mounted() {
            axios.get(`http://173.82.232.228:443/api/algo/${this.algo_type}`).then(res => {
                this.options = res.data;
            })
        },
        watch: {
            selectAlgo(index) {
                this.sub_algo_types = this.options[index].sub_algo_types;
                this.schema = this.options[index].algo_config_schema;
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
