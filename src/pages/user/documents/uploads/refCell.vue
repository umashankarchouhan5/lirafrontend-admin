<template>
    <div>
        <a @click="link">{{ row.Name }}</a>
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

        }
    }
</script>
