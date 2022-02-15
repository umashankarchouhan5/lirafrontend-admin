<template>
    <!-- <FormButton @click="openWindow">Print</FormButton> -->
    <div @click="openWindow" :class="$style.save" >
        <img src="../../../../assets/images/print.png" alt="FSA Print Document" title="Print Document">
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
            openWindow(){
                var myWindow=window.open('','','width=900,height=900');
                myWindow.document.write(this.row.HTMLBody);
            }
        }
    }
</script>


<style lang="scss" module>
.save {
    position: relative;
    margin-top: 10px;
    min-height: 44px;
    margin-bottom: 10px;
}

</style>
