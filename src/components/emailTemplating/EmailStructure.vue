<template>
    <div :class="$style.emailMain">

        <div :class="$style.flex">
            <div :class="$style.label1">
                To...
            </div>
            <div :class="$style.content">
                {{emailData.ToEmail}}
            </div>
        </div>
        <div :class="$style.flex">
            <div :class="$style.label1">
                CC...
            </div>
            <div :class="$style.content">
                {{emailData.CC}}
            </div>
        </div>
        <div :class="$style.flex">
            <div :class="$style.label2">
                Subject:
            </div>
            <div :class="$style.content">
                {{emailData.Subject}}
            </div>
        </div>
        <div :class="$style.flex">
            <div :class="$style.label2">
                Attachment:
            </div>
            <div :class="$style.attchmentBox">
                <div :class="$style.attachments" v-for="(docAttachment,i) in parseDocAttachment(emailData.DocAttachmentjson)" :key="`doc-${i}`" @click="openDocAttachment(docAttachment.path)">
                    {{docAttachment.name}}
                </div>
                <div :class="$style.attachments" v-for="(attachment,index) in parseAttachment(emailData.Attachment)" :key="`att-${index}`" @click="openAttachment(attachment.path)">
                    {{attachment.FileNamePrefix}}
                </div>
            </div>
        </div>

        <div :class="$style.emailBody">
            <div v-html="emailData.Body"></div>
        </div>

    </div>
</template>

<script>
    export default {
        name: "EmailStructure",
        props: {
            emailData: {
                type: Object,
                required: true,
            }
        },
        methods: {
            openAttachment(path) {
                // var myWindow=window.open('','','width=700,height=900');
                // myWindow.document.write(val);
                window.open(path,'_blank');
            },
            openDocAttachment(path) {
                window.open(path,'_blank');
            },
            parseAttachment(val){
                if(val != null){
                    let parsedVal = JSON.parse(val);
                    return parsedVal
                }
                else{
                    return []
                }
            },
            parseDocAttachment(val){
                if(val != null){
                    let parsedVal = JSON.parse(val);
                    if(parsedVal.length == 0 || parsedVal[0].name == '') return []
                    else return parsedVal
                }
                else{
                    return []
                }
            },
        }
    }
</script>

<style lang="scss" module>
    .emailMain {
        // background: linear-gradient( 90deg,  rgba(164,195,233,1) 0%, rgba(118,131,189,1) 100%); 
        // background: linear-gradient(90deg, rgba(164,195,233,1) 0%, rgba(128,143,207,1) 100%);
        background: #a4c3e9;
        margin: 0px;
        padding: 10px;
        .flex {
            display: flex;
            width: 100%;
            margin: 10px 0px;
            .label1 {
                background: #ddd;
                padding: 5px 30px;
                margin: 0px 10px;
                border: 1px solid #acacac;
                min-width: 90px;
                text-align: center;
            }
            .label2 {
                padding: 5px 0px;
                margin: 0px 10px;
                min-width: 90px;
            }
            .content {
                border: 1px solid #acacac;
                background: #fff;
                width: 100%;
                padding: 5px 10px;
                margin: 0px 10px;
                color: #aaa;
            }
        }
        .attchmentBox {
            display: flex;
            flex-wrap: wrap;
            margin: 0px 7px;
            .attachments {
                cursor: pointer;
                background: #fff;
                padding: 5px 30px;
                border: 1px solid #acacac;
                margin: 0px 3px;
                box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1);
                word-break: break-all;
                font-size: 11px;
                margin-bottom: 5px;
            }
        }
        .emailBody {
            border: 1px solid #acacac;
            background: #fff;
            width: auto;
            margin: 10px;

        }
    }

</style>