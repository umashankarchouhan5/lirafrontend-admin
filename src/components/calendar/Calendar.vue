<template>
    <div class="mainCom" :style="minHeight == null? '' : `height:${minHeight}px`">
        <VueCal class="vuecal--blue-theme" 
            :events="events" 
            :time="false" 
            active-view="month"
            hide-weekends 
            events-count-on-year-view
            events-on-month-view="short"
            :disable-views="['years']"
        />

        <!-- To disable validateSelectedRows
             -->

        <!-- If on change of view action needed
        @view-change="viewChanged($event)" -->
    </div>
</template>

<script>
    import VueCal from 'vue-cal';
    import 'vue-cal/dist/vuecal.css';
    import loadingMixin from 'Mixins/loadingMixin';
    import moment from 'moment';

    export default {
        name:'Calendar',
        mixins: [ loadingMixin ],
        components: {
            VueCal
        },
        props:{
            companyCalendar: {
                type: Array,
                default: () => []
            },
            minHeight: {
                type: [Number, String],
                default: null,
            }
        },
        data() {
            return {
            }
        },
        computed: {
            userData() {
                return this.$store.state.user.user
            },
            events() {
                if(this.companyCalendar.length > 0){
                    return this.companyCalendar.map( ele => {
                        const data = {};
                        data.start = ele.dueDate;
                        data.end = ele.dueDate;
                        data.title = ele.activityType;
                        data.content = `<p><b>Company</b>:${ele.companyname}</p><p><b>Action</b>:${ele.action}</p>`;
                        if(ele.status_id == 40) data.class = 'pending';
                        else if(ele.status_id == 46) data.class = 'notToBeDone';
                        else if(ele.status_id == 41) data.class = 'completed';
                        return data;
                    })
                }
                return []
            }
        },
        created() {
        },
        methods: {
            viewChanged(eventData){
                console.log(eventData);
                let startDate = moment(eventData.startDate).format("YYYY-MM-DD");
                let endDate = moment(eventData.startDate).format("YYYY-MM-DD");
                console.log(startDate);
                console.log(endDate)
            },
        }
        
    }
</script>

<style lang="scss" >
    .mainCom {
        height: 100%;
    }
    .vuecal__event{
        text-align: left;
    }
    .vuecal__event-title {
        font-size: 1.1em;
        font-weight: bold;
        text-shadow: 1px 1px 5px rgba(0,0,0,0.1);
        // margin: 4px 0 8px;
    }
    .vuecal__event.pending {background-color: rgba(37, 105, 206, 0.9);border: 1px solid rgb(96, 160, 233);color: #fff;}
    .vuecal__event.completed {background-color: rgba(171, 255, 102, 0.9);border: 1px solid rgb(7, 238, 76);color: #fff;}
    .vuecal__event.notToBeDone {background-color: rgba(255, 102, 102, 0.9);border: 1px solid rgb(247, 75, 75);color: #fff;}
</style>