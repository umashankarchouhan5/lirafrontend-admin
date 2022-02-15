<template>
    <div>
        <Editor :api-key="EDITOR_API_KEY" :disabled="readonly" :init="editor" v-model="innerValue" /> 
    </div>
</template>

<script>
    
    import Editor from '@tinymce/tinymce-vue';
    import Config from 'Config/base';
    import valueMixin from 'Mixins/valueMixin';

    export default {
        name:'EditorComponent',
        mixins: [ valueMixin ],
        components: {
            Editor,
        },
        props: {
            readonly: { 
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                EDITOR_API_KEY: Config.EDITOR_API_KEY,
                editor: {
                    height : 400,
                    plugins: [
                        'advlist autolink lists link charmap preview hr anchor pagebreak ',
                        'wordcount visualblocks visualchars code fullscreen',
                        'insertdatetime table',
                    ],
                    a11y_advanced_options: true,
                    // toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl',
                },
            }
        }
        
    }
</script>