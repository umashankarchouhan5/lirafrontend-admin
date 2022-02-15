<template>
    <div>
        <a @click="openPQReadonly"> {{row.uniqueref}} </a>
    </div>
</template>

<script>
    export default {
        name: "ReferenceCell",
        props: {
            row: {
                type: Object,
                required: true
            }
        },
        methods:{
            openPQReadonly() {
                let routeData = this.$router.resolve({name: 'PQReadonly',params: { id: this.row.pq_id}});
                window.open(routeData.href, '_blank');
            }
        }
    }
</script>
<style lang="scss" module>
    
</style>
