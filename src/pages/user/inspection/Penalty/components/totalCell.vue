<template>
    <div>
        <span  v-if="row.icsp_id === 9999 && row.total !== null"> {{parseFloat(row.total).toFixed(2)}} </span>
        
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
    }
</script>
<style lang="scss" module>
    
</style>
