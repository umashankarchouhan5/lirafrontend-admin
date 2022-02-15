<template>
    <div>
        <div class="row" :class="$style.customRow">
            <div class="col-sm-2">
                <p><b>Reg. No.</b></p>
            </div>
            <div class="col-sm-1">:</div>
            <div class="col-sm-2" :class="$style.rightAlign">
                <p>{{ticket.CompanyRegNo}}</p>
            </div>
        </div>
        <div class="row" :class="$style.customRow">
            <div class="col-sm-2">
                <p><b>Entity Name</b></p>
            </div>
            <div class="col-sm-1">:</div>
            <div class="col-sm-2" :class="$style.rightAlign">
                <p>{{ticket.CompanyName}}</p>
            </div>
        </div>
        <div class="row" :class="$style.customRow">
            <div class="col-sm-2">
                <p><b>Renewal Date</b></p>
            </div>
            <div class="col-sm-1">:</div>
            <div class="col-sm-2" :class="$style.rightAlign">
                <p>{{dateFormat(ticket.RenewalDate)}}</p>
            </div>
        </div>
        <div class="row" :class="$style.customRow">
            <div class="col-sm-2">
                <p><b>Renewal Year</b></p>
            </div>
            <div class="col-sm-1">:</div>
            <div class="col-sm-2" :class="$style.rightAlign">
                <p>{{ticket.ForYear}}</p>
            </div>
        </div>
        <div class="row" :class="$style.customRow">
            <div class="col-sm-2">
                <p><b>Renewal Fee</b></p>
            </div>
            <div class="col-sm-1">:</div>
            <div class="col-sm-2" :class="$style.rightAlign">
                <p>{{ticket.RenewalFee}}</p>
            </div>
        </div>
        <div class="row" :class="$style.customRow">
            <div class="col-sm-2">
                <p><b>Tax</b></p>
            </div>
            <div class="col-sm-1">:</div>
            <div class="col-sm-2" :class="$style.rightAlign">
                <p>{{ticket.Tax}}</p>
            </div>
        </div>
        <div class="row" :class="$style.customRow">
            <div class="col-sm-2">
                <p><b>Penalty</b></p>
            </div>
            <div class="col-sm-1">:</div>
            <div class="col-sm-2" :class="$style.rightAlign">
                <p>{{ticket.Penalty}}</p>
            </div>
        </div>
        <div class="row" :class="$style.customRow">
            <div class="col-sm-2">
                <p><b>Total</b></p>
            </div>
            <div class="col-sm-1">:</div>
            <div class="col-sm-2" :class="$style.rightAlign">
                <p>{{ticket.Total}}</p>
            </div>
        </div>

        <div  class="row" :class="$style.customRow">
            <div class="col-sm-12">
                <ButtonGroup>
                    <FormButton type="primary" @click="nextStep" right-icon="ios-arrow-forward">Next</FormButton>
                </ButtonGroup>
            </div>
        </div>
    </div>
</template>

<script>

    import DateUtil from 'Utils/dateUtil';

    export default {
        name: "GeneralInfo",
        data() {
            return {
            }
        },
        created() {
            // this.$store.commit('setLoading', true);
            // searchICSPTypes().then(res => {
            //     this.icsp_ids = res.data;
            //     this.$store.commit('setLoading', false);
            // })
        },
        computed: {
            ticket() {
                return this.$store.state.ticket.ticket;
            },
        },
        props: {
            process_ids: Array,
            steps: Array,
            readonly: Boolean,
            customErrors: Array,
            value: {
                type: Object,
                required: true,
            },
        },
        methods: {
            dateFormat(date){
                return DateUtil.formatDate(date);
            },
            nextStep() {
                this.$emit('nextStep')
            },
            prevStep() {
                this.$emit('prevStep')
            }
        }
    }
</script>

<style lang="scss" module>
    .customRow{
        margin-bottom: 15px;
    }
    .rightAlign{
        text-align: right;
    }

    .error {
        color: #ff3547;
        font-size: 11px;
        line-height: 13px;
        font-weight: 400;
    }

</style>
