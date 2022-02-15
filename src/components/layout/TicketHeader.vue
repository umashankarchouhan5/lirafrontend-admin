<template>
    <div :class="getStyle" v-if="ticketValue">
        <div :class="$style.infoBlock" >
            {{ ticketValue.First }}
        </div>
        <div :class="$style.infoBlock" >
            {{ ticketValue.Second }}
        </div>
        <div :class="$style.infoBlock" >
            {{ ticketValue.Third }}
        </div>
    </div>
</template>
<script>

    export default {
        name: 'TicketHeader',
        props:{
            ticketValue:{
                type: Object,
            },
            typeOfHeader:{
                type: String,
                default: 'header'
            }
        },
        computed: {
            getStyle() {
                return this.typeOfHeader == 'header'? this.$style.info : this.$style.infoPopup
            }
        },
        created(){
        }
        
    }
</script>
<style lang="scss" module>
    .info {
        background: #d7d6da;
        box-shadow: 0 2px 2px #00000059;
        padding: 0 15px;
        display: flex;
        font-size: 13px;
        margin: -38px -30px 30px;
        line-height: 35px;
        justify-content: space-between;
        position: sticky;
        top: 34.5px;
        z-index: 10;
        & .infoBlock:nth-child(1){
            text-align: left;
            width: 33.33%
        }
        & .infoBlock:nth-child(2){
            text-align: center;
            width: 33.33%
        }
        & .infoBlock:nth-child(3){
            text-align: right;
            width: 33.33%
        }
    }
    .infoPopup {
        background: #d7d6da;
        box-shadow: 0 2px 2px #00000059;
        padding: 0 15px;
        display: flex;
        font-size: 13px;
        margin: -18px -16px 30px;
        line-height: 35px;
        justify-content: center;
        z-index: 10;
        position: sticky;
        top: 0px;
        & .infoBlock:nth-child(1){
            text-align: left;
            margin: 0px auto 0xp 0px;
            width: 33.33%;
            line-height: 22px;
        }
        & .infoBlock:nth-child(2){
            text-align: center;
            margin: 0px auto;
            width: 33.33%;
            line-height: 22px;
        }
        & .infoBlock:nth-child(3){
            text-align: right;
            margin: 0px 0px 0px auto;
            width: 33.33%;
            line-height: 22px;
        }
    }
</style>