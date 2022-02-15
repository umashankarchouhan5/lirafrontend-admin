<template>
    <div>
        <span>{{ getComplaintSummary }}</span>
        <a v-if="row.ComplaintSummary.length >= 100" href="#" @click.prevent="showCommentLogPopup"> More...</a>
    </div>
</template>

<script>

    import Event from 'Utils/event'

    export default {
        name: "CommentCell",
        props: {
            row: {
                type: Object,
                required: true
            }
        },
        computed: {
            getComplaintSummary(){
                const comment = this.row.ComplaintSummary
                if(comment.length < 100){
                    return comment;
                }
                else{
                    return comment.substring(0, 100)
                }
            },
        },
        methods: {
            showCommentLogPopup() {
                Event.fire('showComplaintPopup', this.row.ComplaintSummary)
            }
        }
    }
</script>
