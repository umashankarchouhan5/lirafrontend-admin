<template>
    <div>
        <a @click="openDossier"> {{row.CompanyName}} </a>
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
                console.log(this.row);
                let routeData = this.$router.resolve({name: 'DossierReportByID',params: {licenseType: this.row.Licensetype, CompanyRegNo: this.row.RegNo, id: this.row.Company_id}});
                window.open(routeData.href, '_blank');
            }
        }
    }
</script>
<style lang="scss" module>
    
</style>
