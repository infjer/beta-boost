<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
    import Index from './components/Index';

    export default {
        name: 'App',
        data() {
            return {
                pageStack: [ Index, ],
            }
        },
    }
</script>

<style lang="less">
    #app {
        height: 100%;
        overflow: auto;
    }
</style>
