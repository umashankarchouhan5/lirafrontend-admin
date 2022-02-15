<template>
    <div>
        <FormSelect label="Select Officer" :items="notSelectedInspectionTeam" :disabled="readonly" rules="required" item-name="Name" item-value="id" v-model="innerValue.adminuser_id" :vid="`user-${i}`"  />
    </div>
</template>

<script>

    import valueMixin from 'Mixins/valueMixin';

    export default {
        name: "InspectionTeam",
        mixins: [ valueMixin ],
        components: {

        },
        data() {
            return {
            }
        },
        props:{
            readonly: Boolean,
            i: Number,
            adminUsers: Array,
            selectedMembers: Array,
        },
        computed: {
            notSelectedInspectionTeam() {
                return this.adminUsers.filter( item => {
                    return (this.selectedMembers.find(val => val.adminuser_id === item.id) == undefined) || (item.id == this.innerValue.adminuser_id) ;
                })
            },
        },
        watch:{
            value:{
                deep: true,
                handler(val){
                    
                }
            },
        },
        methods: {
            
            
        }
    }
</script>
<style lang="scss" module>
    .indentClass{
        margin-left: 0px;
    }
</style>