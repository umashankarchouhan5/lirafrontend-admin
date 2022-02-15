<template>
    <div>
        <div :class="$style.checkList">
            <Loader v-if="isLoading"/>
            <div v-for="(check, i) in checkList" :key="i" :class="$style.checkItem">
                <div :class="$style.checkbox" @change="changeCheckboxValue">
                    <FormCheckbox :disabled="readonly" v-model="check.checked"/>
                </div>
                <div :class="$style.checkBrief">
                    {{ check.ChecklistBrief }}
                </div>
            </div>
        </div>
        <div :class="$style.error" v-if="error">
            You should check all items to proceed
        </div>
    </div>
</template>

<script>

    import { getChecklist } from './checkListActions'
    import loadingMixin from 'Mixins/loadingMixin'

    export default {
        name: "CheckList",
        mixins: [loadingMixin],
        data() {
            return {
                checkList: []
            }
        },
        computed: {
            processId() {
                return this.$store.state.common.currentProcessId
            },
            userData() {
                return this.$store.state.user.user
            },
            ticket(){
                return this.$store.state.ticket.ticket;
            }
        },
        created() {
            const data = {
                adminuser_id: this.userData.user_id,
                process_id: this.processId,
                reference_id: this.referenceId,
                step: this.ticket.step
            };
            this.showLoader();
            getChecklist(data)
                .then(this.getCheckboxesSuccess)
                .catch(this.hideLoader);
        },
        props: {
            error: Boolean,
            referenceId: Number,
            readonly: Boolean,
        },
        methods: {
            changeCheckboxValue() {
                this.$emit('onChange', this.checkList)
            },
            getCheckboxesSuccess(response) {
                this.checkList = response.data;
                if(this.readonly === true && this.ticket.outcome !== null){
                    this.checkList.forEach(element => {
                        element.checked = true;
                    });
                }
                this.$emit('listReceived', this.checkList)
                this.hideLoader();
            }
        }
    }
</script>

<style lang="scss" module>
    .checkList {
        position: relative;
        min-height: 30px;
        margin-bottom: 20px;
        border-radius: 3px;
        overflow: hidden;
        border: 1px solid #e1e1e1;
    }

    .checkItem {
        padding: 5px 8px;
        border-bottom: 1px solid #e1e1e1;
        display: flex;
        align-items: center;
        background: lighten(#ccc, 17%);

        &:last-child {
            border-bottom: none;
        }
    }

    .checkbox {
        flex-shrink: 0;
        flex-grow: 0;
        width: 25px;
        text-align: center;
        align-self: flex-start;
    }

    .checkBrief {
        flex-grow: 1;
    }

    .error {
        color: #ff3547;
        max-width: 100%;
        font-size: 11px;
        line-height: 13px;
        font-weight: 400;
        margin: -18px 0 18px;
    }
</style>
