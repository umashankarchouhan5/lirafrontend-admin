<template>
    <div>
        <DataTable :actions="true" v-if="personData.length > 0" :data="personData" :columns="tableColumns">
        </DataTable>
    <!-- PQ Popup -->
        <br />

        <ButtonGroup>
            <FormButton type="primary" @click="prevStep" left-icon="ios-arrow-back">Previous</FormButton>
            <FormButton type="primary" @click="nextStep" right-icon="ios-arrow-forward">Next</FormButton>
        </ButtonGroup>

    </div>
</template>

<script>
    import DataTable from 'Components/DataTable'
    import loadingMixin from 'Mixins/loadingMixin'
    import DateUtil from 'Utils/dateUtil'
    import PQAction from './refCell/referenceCell'

export default {
    name: "CompanyPersons",
    props: {
        value: [Object,Array],
        readonly: Boolean,
        reference_id: [String,Number],
    },
    components: {
        DataTable,
    },
    data() {
        return {
            pq_list: [],
            positions: [],
            data: {
                position: null,
                Licensee: null,
                name: null,
            },
            pqPositionName: null,
            tableData: [],
            tableColumns: [
                {
                    title: 'PQ ID',
                    key: 'UniqueRef',

                    render: (h, params) => {
                        return h(PQAction, {
                            props: {
                                row: params.row
                            }
                        });
                    },
                },
                {
                    title: 'Name',
                    key: 'Name',
                },
                {
                    title: 'Position',
                    key: 'Position',
                },
            ],
            selectedRows: [],
            personData: [],
        }
    },
    computed: {
        userData() {
            return this.$store.state.user.user
        },
        positionName() {
            var data = this.positions.filter((val) => {
                return val.id === this.data.position
            });
            return data[0].Name;
        },
        ticket() {
            return this.$store.state.ticket.ticket;
        },

    },
    watch: {
        ticket(val){
            console.log(val)
            if( val !== null && val.PeopleJson !== undefined && val.PeopleJson !== undefined){
                this.personData = JSON.parse(val.peopleJson)

            }
        },
    },
    created() {
        if(this.ticket !== null && this.ticket.PeopleJson !== undefined){
            this.personData = JSON.parse(this.ticket.PeopleJson)
        }
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
    .listStyle {
        margin-left: 30px;
    }
</style>
