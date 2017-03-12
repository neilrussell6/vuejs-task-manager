<template xmlns:v-on="http://www.w3.org/1999/xhtml">

    <button class="common-cycle-button" v-on:click="_onClick()">
        <span class="label">{{label}}</span>
        <i v-if="icon_class" class="fa" :class="icon_class" aria-hidden="true"></i>
    </button>

</template>

<script type="text/babel">

    export default {

        data: function () {
            return {
                index: 0,
                label: null,
                value: null,
                icon_class: null
            };
        },

        props: {
            data: { type: Array, default: [] },
            onClick: { type: Function },
            selectedIndex: { type: Number }
        },

        watch: {
            selectedIndex: function (value) {
                this.index = value;
                this._updateView();
            }
        },

        methods: {

            // ------------------------------------
            // handlers
            // ------------------------------------

            _onClick: function () {

                if (this.data.length === 0) {
                    return;
                }

                if (++this.index === this.data.length) {
                    this.index = 0;
                }

                this._updateView();

                if (typeof this.onClick !== 'undefined') {
                    this.onClick(this.value);
                }
            },

            // ------------------------------------
            // utils
            // ------------------------------------

            _updateView: function () {

                this.label = this.data[ this.index ].hasOwnProperty('label') ? this.data[ this.index ].label :  null;
                this.value = this.data[ this.index ].hasOwnProperty('value') ? this.data[ this.index ].value :  null;
                this.icon_class = this.data[ this.index ].hasOwnProperty('icon_class') ? this.data[ this.index ].icon_class :  null;
            }
        },

        created: function() {
            this._updateView();
        }
    };

</script>

<style scoped lang='scss'>
    @import '../../../styles/view/common/common-cycle-button/common-cycle-button.scss';
</style>
