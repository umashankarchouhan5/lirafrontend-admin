<template>
    <div>
        <a @click="openInvoice" v-if="row.invoice_id"> {{row.invoice_id}} </a>
        <span v-else></span>
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
            openInvoice() {
                if( this.row.invoice_url != '' && this.row.invoice_url != null ){
                    window.open(this.row.invoice_url, "_blank");
                }
            }
        }
    }
</script>
<style lang="scss" module>
    
</style>
