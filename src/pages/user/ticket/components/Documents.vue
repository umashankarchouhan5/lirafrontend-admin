<template>
    <div>
        <FormRow>
            <div class="col-sm-12">
                <div :class="$style.wrapper">
                    <Loader v-if="isLoading"/>
                    <DataTable v-if="documents.mandatory.length > 0" :class="$style.breakWord" noDataText="No Documents Attached" :data="documents.mandatory"
                               :columns="columnsMandatory"/>
                    <br>
                    <DataTable v-if="documents.optional.length > 0" :class="$style.breakWord" noDataText="No Documents Attached" :data="documents.optional"
                               :columns="columnsOptional"/>
                    <br>
                    <DataTable :class="$style.breakWord" noDataText="No Documents Attached" :data="documents.additional"
                               :columns="columnsAdditional"/>
                </div>
            </div>
        </FormRow>
        <Declaration v-if="ticket.DeclarationName !== undefined && ticket.DeclarationName !== ' '  && ticket.DeclarationName !== '' && ticket.DeclarationName !== null  && $route.name !== 'PQReadonly'" v-model="ticket" :readonly="true" />
        <br />
        <FormRow>
            <div class="col-sm-12">
                <ButtonGroup>
                    <FormButton type="primary" @click="prevStep" left-icon="ios-arrow-back">Previous</FormButton>
                    <FormButton type="primary" @click="nextStep" right-icon="ios-arrow-forward">Next</FormButton>
                </ButtonGroup>
            </div>
        </FormRow>
    </div>
</template>

<script>

    import DataTable from 'Components/DataTable'
    import loadingMixin from 'Mixins/loadingMixin'
    import columns from '../config/documentsTableColumns'
    import Declaration from 'Components/Declaration';

    export default {
        name: "Documents",
        mixins: [loadingMixin],
        props:{
            readonly: Boolean,
        },
        data() {
            return {
                columnsMandatory: columns('Mandatory Documents'),
                columnsOptional: columns('Optional Documents'),
                columnsAdditional: columns('Additional Documents'),
            }
        },
        components: {
            DataTable,
            Declaration
        },
        computed: {
            documents() {
                return this.$store.state.ticket.documents
            },
            ticket() {
                return this.$store.state.ticket.ticket;
            },
        },
        methods: {
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
    .breakWord{
        word-break: break-all;
    }
    .wrapper {
        position: relative;
    }
</style>
