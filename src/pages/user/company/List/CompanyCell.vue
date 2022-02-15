<template>
    <div>
        <a @click="openDossier"> {{row.Name}} </a>
    </div>
</template>

<script>
    export default {
        name: "ReferenceCell",
        props: {
            row: {
                type: Object,
                required: true
            }
        },
        methods:{
            link() {
                window.open(this.row.path, 'blank') ;
            },
            openDossier() {
                let routeData = this.$router.resolve({name: 'DossierReportByID',params: {licenseType: this.row.Entitytype, CompanyRegNo: this.row.CompanyRegNo, id: this.row.id}});
                window.open(routeData.href, '_blank');
            }
        }
    }
</script>
<style lang="scss" module>
    
</style>
