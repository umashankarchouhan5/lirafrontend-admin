<template>
    <div>
        <a @click="openMessage" class="message">
            <span v-html="note"></span>
            <!-- <div :inner-html.prop="row.notes | truncate(250)"></div> -->
        </a>
    </div>
</template>


<script>
    
    export default {
        name: "MessageCell",
        props: {
            row: {
                type: Object,
                required: true
            },
            getMessage: Function,
        },
        computed: {
            note(){
                return this.row.notes !== null ? this.truncate(this.row.notes.replace(/(<([^>]+)>)/gi, ""),100) : '';
            }
        },
        methods: {
            openMessage() {
                this.getMessage(this.row.notes);
            },
            truncate:function(value, length) {
                if (!value) return "";
                value = value.toString().trim();
                if (value.length > length) {
                    return value.substring(0, length) + "...";
                } else {
                    return value;
                }
            }
        }
    }
</script>