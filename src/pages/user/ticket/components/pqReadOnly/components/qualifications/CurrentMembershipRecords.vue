<template>
    <div class="recordLine">
        <RecordItem v-for="(item, i) in value" readonly :key="i" :record-index="i" :length="value.length" >
            <FormRow>
                <div class="col-sm-3">
                    <InputText readonly v-model="item.C_MembershipNumber" label="Membership No." />
                </div>
                <div class="col-sm-4">
                    <InputText readonly v-model="item.C_Institute" label="Name of Institution" />
                </div>
                <div class="col-sm-2">
                    <YearSelect readonly label="Year Admitted" v-model="item.C_MembershipYear" />
                </div>
                <div class="col-sm-3">
                    <FormSelect disabled label="Select One" v-model="item.C_MembershipType_AFM" :items="membershipTypes" item-value="id" item-name="label" />
                </div>
            </FormRow>
            <h6>Contact Detail</h6>
            <FormRow>
                <div class="col-sm-4">
                    <InputText readonly v-model="item.C_ContactName" label="Contact Person / Department" />
                </div>
                <div class="col-sm-4">
                    <InputTel disabled label="Phone" v-model="item.C_ContactPhone" />
                </div>
                <div class="col-sm-4">
                    <AddressInput readonly label="Address" v-model="item.C_Address_id" />
                </div>
            </FormRow>
        </RecordItem>
    </div>
</template>

<script>

    import recordMixin from 'Mixins/recordMixin'
    import InputTel from 'Components/form/InputTel'
    import AddressInput from 'Components/form/addressInput/AddressInput'

    export default {
        data() {
            return {
                membershipTypes: [
                    {
                        label: 'Associate',
                        id: 'A'
                    },
                    {
                        label: 'Fellow',
                        id: 'A'
                    },
                    {
                        label: 'Member',
                        id: 'A'
                    },
                ]
            }
        },
        name: "CurrentMembershipRecords",
        mixins: [recordMixin],
        props: ['pqId', 'qualificationTypes'],
        components: {
            InputTel,
            AddressInput
        },
        methods: {
            pushEmptyValue() {
                this.value.push({
                    "PQRecord_id": null,
                    "pq_id": this.pqId,
                    "RecordType": "CMemb",
                    "C_MembershipNumber": "",
                    "C_Institute": "",
                    "C_MembershipYear": "",
                    "C_MembershipType_AFM": "",
                    "C_ContactName": "",
                    "C_ContactPhone": "",
                    "C_Address_id": null
                })
            }
        }
    }
</script>
