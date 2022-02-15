<template>
    <div>
        <span>{{ getBriefSummary }}</span>
        <a v-if="row.RFIBrief.length >= 100" href="#" @click.prevent="showBriefLogPopup"> More...</a>
    </div>
</template>

<script>

    import Event from 'Utils/event'

    export default {
        name: "BriefCell",
        props: {
            row: {
                type: Object,
                required: true
            }
        },
        computed: {
            getBriefSummary(){
                const brief = this.row.RFIBrief
                if(brief.length < 100){
                    return brief;
                }
                else{
                    return brief.substring(0, 100)
                }
            },
        },
        methods: {
            showBriefLogPopup() {
                Event.fire('showBriefPopup', this.row.RFIBrief)
            }
        }
    }
</script>
