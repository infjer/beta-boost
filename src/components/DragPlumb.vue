<template>
    <div class='drag-plumb'>
        <div :id="'plumb' + uuid">
            <div
                v-for='(item, index) in block'
                :key='index'
                :id='item.id'
                class='plumb-element'
                :style="{ left: index * 200 + 'px' }"
                @click='index !== 0 && handleClick(item)'
                >
                {{ item.algo_name || item.task_display_name }}
            </div>
        </div>
        <div :id="'drag' + uuid">
            <div
                v-for='(item, index) in drag'
                :key='index'
                :id='item.id'
                class='drag-element'
                >
                {{ item.algo_name }}
            </div>
        </div>
    </div>
</template>

<script>
    import uuid from 'uuid';
    import axios from 'axios';
    import jsplumb from 'jsplumb';
    import $ from 'jquery';

    export default {
        props: {
            task: {
                type: Object,
                default() {
                    return {};
                }
            }
        },
        data() {
            return {
                uuid: '',
                block: [],
                drag: [],
                idsPosition: [],
                currentId: null,
            }
        },
        created() {
            this.uuid = uuid();
            this.block.push({ id: `${this.uuid}-p1`, ...this.task });
            this.block.push({ id: `${this.uuid}-p2`, ...this.task });
        },
        methods: {
            handleClick(data) {
                if(data.task_algo) {
                    if(this.drag.length === 0) {
                        axios.get(`http://173.82.232.228:443/api/algo/${data.task_algo}`).then(res => {
                            this.drag = res.data.map((item, index) => ({
                                id: `${this.uuid}-d${index}`,
                                ...item
                            }))
                        })
                    }
                } else {

                }
            },
        },
        watch: {
            block: function(blocks) {
                this.idsPosition = blocks.map(item => ({
                    width: $(item.id).outerWidth(),
                    height: $(item.id).outerHeight(),
                    offset: $(item.id).offset(),
                    id: item.id,
                }))
            },
            drag: function(el) {
                el.map((item, index) => {
                    jsPlumb.draggable(item.id, {
                        clone: true,
                        drag: e => {
                            let target = {
                                offset: {
                                    left: e.pos[0],
                                    top: e.pos[1],
                                },
                                width: $(`#${item.id}`).outerWidth(),
                                height: $(`#${item.id}`).outerHeight(),
                                id: `#${item.id}`,
                            }
                            let center = {
                                x: target.offset.left + target.width / 2,
                                y: target.offset.top + target.height / 2,
                            }
                            let isIn = false;
                            for(let i of this.idsPosition) {
                                if(center.x <= (i.offset.left + i.width)
                                    && center.x >= i.offset.left
                                    && center.y <= (i.offset.top + i.height)
                                    && center.y >= i.offset.top) {
                                        this.currentId = i.id;
                                        isIn = true;
                                        break;
                                }
                            }
                            if(!isIn) {
                                this.currentId = null;
                            }
                        },
                        stop: e => {
                            let target = {
                                offset: e.selection[0][1],
                                width: $(`#${item.id}`).outerWidth(),
                                height: $(`#${item.id}`).outerHeight(),
                                id: `#${item.id}`,
                            }
                            let center = {
                                x: target.offset.left + target.width / 2,
                                y: target.offset.top + target.height / 2,
                            }
                            for(let i of this.idsPosition) {
                                if(center.x <= (i.offset.left + i.width)
                                    && center.x >= i.offset.left
                                    && center.y <= (i.offset.top + i.height)
                                    && center.y >= i.offset.top) {
                                        let _target = $(target.id).clone();
                                        let _uuid = uuid();
                                        _target.attr({ id: _uuid, }).attr('style', $(i.id).attr('style')).text(`drag1, id=${_uuid}`).css({ background: '#fff' });
                                        $(`plumb${this.uuid}`).append(_target);
                                        $(i.id).remove();
                                        this.ids.splice(this.ids.indexOf(i.id), 1);
                                        this.ids.push(`#${_uuid}`);
                                        break;
                                }
                            }
                            this.currentId = null;
                        },
                    });
                })
            },
        }
    }
</script>

<style lang='less' scoped>
    .drag-plumb {
        display: flex;
        height: 400px;
        div[id^=plumb] {
            flex: 3 1 0;
            position: relative;
        }
        div[id^=drag] {
            flex: 1 1 0;
        }
        .plumb-element {
            width: 100px;
            height: 100px;
            border: 1px solid red;
            position: absolute;
        }
        .drag-element {
            width: 100px;
            height: 100px;
            border: 1px solid blue;
            display: inline-block;
        }
    }
</style>
