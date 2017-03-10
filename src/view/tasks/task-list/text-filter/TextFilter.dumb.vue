<template>
    <div class="text-filter">
        <input type="text" v-model="term_value" placeholder="filter..." debounce="500" />
    </div>
</template>

<script type="text/babel">
    // dumb component (this means it does not interact with application state, it only emit events and fires callbacks so parent components can interact with state)

    import Vue from 'vue';

    export default {
        data: function () {
            return {
                term_value: ''
            };
        },

        props: {
            term: { type: String, default: '' },
            onChange: { type: Function }
        },

        watch: {
            term: function (value) {
                this.term_value = value;
            },
            term_value: function (value) {
                this.onChange(value);
            }
        }
    };
</script>

<style scoped lang='scss'>
    @import '../../../../styles/view/tasks/text-filter/text-filter.scss';
</style>
