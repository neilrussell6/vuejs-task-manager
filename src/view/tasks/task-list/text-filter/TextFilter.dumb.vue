<template>
    <div class="text-filter">
        <input type="text" v-model="term" placeholder="filter..." debounce="500" />
    </div>
</template>

<script>
    // dumb component (this means it does not interact with application state, it only emit events and fires callbacks so parent components can interact with state)

    import Vue from 'vue';

    export default {
        data: function () {
            return {
                term: ''
            };
        },

        props: {
            onChange: {
                type: Function
            }
        },

        watch: {
            term: function (value) {
                this.onChange(value);
            }
        }
    };
</script>

<style scoped lang='scss'>
    @import '../../../../styles/view/tasks/text-filter/text-filter.scss';
</style>
