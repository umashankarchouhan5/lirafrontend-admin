<template>
    <div>
        <FormRow >
            <div class="col-sm-2">
                <FormSelect label="Select Process Type" v-model="innerValue.processType_id" :items="processTypes" itemName="Name" itemValue="id" />
            </div>
            <div class="col-sm-3">
                <FormSelect label="Select Process" v-model="innerValue.process_id" :items="processes" itemName="Name" itemValue="id" :disabled="!innerValue.processType_id || innerValue.processType_id == null" />
            </div>
            <div class="col-sm-3">
                <FormSelect label="Select Licensee" v-model="innerValue.license_id" :items="licensees" itemName="name" itemValue="id" />
            </div>
            <div class="col-sm-2">
                <FormSelect label="Select Officer" rules="required" :vid="`Officer-${i}`" v-model="innerValue.officer_id" :items="officers" itemName="Name" itemValue="id"  />
            </div>
            <div class="col-sm-2">
                <FormSelect label="Notification Group" :vid="`Notification-${i}`" v-model="innerValue.group_id" :items="notificationGroups" itemName="Name" itemValue="id"  />
            </div>
        </FormRow>
    </div>
</template>

<script>

    import valueMixin from 'Mixins/valueMixin';
    import { getProcesses } from '../../api';
    import loadingMixin from 'Mixins/loadingMixin';

    export default {
        name: "RulesElement",
        mixins: [ valueMixin, loadingMixin ],
        props:{
            readonly: Boolean,
            i: Number,
            processTypes: {
                type: Array,
                default: () => []
            },
            licensees: {
                type: Array,
                default: () => []
            },
            officers: {
                type: Array,
                default: () => []
            },
            notificationGroups: {
                type: Array,
                default: () => []
            },
        },
        data() {
            return {
                processes: [],
            }
        },
        computed: {
            userData() {
                return this.$store.state.user.user
            },
        },
        watch:{
            value:{
                deep: true,
                handler(val){
                    
                }
            },
            'innerValue.processType_id': function(val){
                if( val && val !== undefined && val !== null) this.fetchProcess();
                else this.resetProcess()
            }
        },
        methods: {
            resetProcess(){
                this.processes = [];
                this.innerValue.process_id = null;
            },
            fetchProcess() {
                this.showLoader()
                getProcesses({ProcessType_id: this.innerValue.processType_id}).then(
                    res => {
                        this.processes = res.data;
                        this.hideLoader();
                    }
                )
            },
            
        }
    }
</script>
<style lang="scss" module>
    .indentClass{
        margin-left: 0px;
    }
</style>