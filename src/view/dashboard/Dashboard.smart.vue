<template>
    <div class="app-container dashboard-app">
        <span>{{ title }}</span><br/><br/><br/><br/><br/><br/>
    </div>
</template>

<script>
    // smart component (this means it interacts with application state)

    export default {
        data: function () {
            return {
                title: 'welcome to dashboard'
            };
        }
    };
</script>

<style scoped lang="scss">
    @import '../../styles/view/dashboard/dashboard.scss';
</style>
