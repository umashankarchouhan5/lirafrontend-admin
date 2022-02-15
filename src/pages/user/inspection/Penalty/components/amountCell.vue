<template>
    <div>
        <span v-if="amount !== null" > {{parseFloat(amount).toFixed(2)}} </span>
        
    </div>
</template>

<script>
    export default {
        name: "ReferenceCell",
        props: {
            row: {
                type: Object,
                required: true
            },
            amount: {
                type: [Number, String],
            }
        },
    }
</script>
<style lang="scss" module>
    
</style>
