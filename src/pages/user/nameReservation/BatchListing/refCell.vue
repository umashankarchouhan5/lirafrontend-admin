<template>
    <div>
        <p>{{ getStatus }}</p>
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
        computed: {
            getStatus() {
                if(this.row.Status_id == -1){
                    return 'Processing';
                }
                else if(this.row.Status_id == 0){
                    return 'Submitted';
                }
                else if(this.row.Status_id == 1){
                    return 'Completed';
                }
                return '';
            },
        }
    }
</script>
