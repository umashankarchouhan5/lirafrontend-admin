<template>
    <div>
        <p v-if="price !== '' && price !== ' ' && price !== null">{{ parseFloat(price).toFixed(2) }} </p>
        <p v-else></p>
    </div>
</template> 

<script>


    export default {
        name: "PriceCell",
        props: {
            row: Object,
            price: [ Number, String ],
        },
        methods: {
            
        }
    }
</script>

<style lang="scss" module>

</style>
