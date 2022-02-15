<template>
    <div>
        <h6>Inspection Team</h6>
        <RecordItem v-for="(item, i) in value" :key="i" :readonly="readonly" :record-index="i" :length="value.length" @onAddRow="addRow" @onDeleteRow="deleteRow">
            <FormRow :class="$style.indentClass">
                <div class="col-sm-3">
                    <!-- <FormSelect label="Select Officer" :items="adminUsers" :disabled="readonly" rules="required" item-name="Name" item-value="id" v-model="item.adminuser_id" :vid="`user-${i}`"  /> -->
                    <InspectionTeamComponent v-model="value[i]" :adminUsers="adminUsers" :selectedMembers="value" :i="i" :readonly="readonly" />
                </div>
            </FormRow>
        </RecordItem>
    </div>
</template>

<script>

    import recordMixin1 from 'Mixins/recordMixin1';
    import InspectionTeamComponent from './inspectionTeamComponent';

    export default {
        name: "InspectionTeam",
        mixins: [ recordMixin1 ],
        components: {
            InspectionTeamComponent
        },
        props:{
            readonly: Boolean,
            adminUsers: Array
        },
        data() {
            return {
                
            }
        },
        computed: {
            filteredAdminList() {
                return this.adminUsers.filter(item =>{
                    return this.value.find(val => val.adminuser_id === item.id) == undefined;
                })
            },
            
        },
        watch:{
            value:{
                deep: true,

                handler(val){
                    if(this.value.length == 0){
                        this.pushEmptyValue();
                    }
                }
            },
        },
        methods: {
            pushEmptyValue() {
                this.value.push({
                    adminuser_id: null,
                    isTeamLead: 0,
                })
            },
        }
    }
</script>
<style lang="scss" module>
    .indentClass{
        margin-left: 0px;
    }
</style>