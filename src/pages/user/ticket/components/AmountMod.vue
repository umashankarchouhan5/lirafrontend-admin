<template>
    <div >
        <p>{{amount !== null ? Number(amount).toFixed(2): amount}}</p>
    </div>
</template>

<script>

    export default {
        name: "AmountCell",
        props: {
            row: {
                type: Object,
                required: true,
            },
            amount: [Number, String]
        },
        computed:{
        },
        methods: {
        }
    }
</script>

