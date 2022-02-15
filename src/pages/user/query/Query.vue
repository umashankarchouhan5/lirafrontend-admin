<template>
    <FormWrapper>
        <PageTitle title="Query" slot="title"  />
        
        <div>
            <FormRow>
                <div class="col-sm-12">
                    <InputTextArea label="Query" maxlength="1000" rows="4" v-model="query"  />
                </div>
                
            </FormRow>
            <FormButton  @click="() => getData()">Fetch Data</FormButton>
        </div>
        
        <br />
        <div v-if="queryData.length > 0">
            <!-- <FormRow v-for="(item,i) in queryData" :key="i">
                <div class="col-sm-12">
                    {{item}}
                </div>

            </FormRow> -->
            <!-- {{tableKeys}} -->
            <table :class="$style.tableClass">
                <thead>
                    <tr>
                        <th v-for="(head,ind) in tableKeys" :key="ind">{{head.key}}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,i) in queryData" :key="i">
                        <td v-for="(val,index) in tableKeys" :key="index">{{item[val.key]}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!-- <Popup title="Information" :value="warningModal.visible" @close="() => showWarningModal(false)">
            {{ warningModal.message }}
            <div slot="footer">
                <FormButton v-if="warningModal.buttons.cancel" @click="() => showWarningModal(false)">Cancel
                </FormButton>
                <FormButton v-if="warningModal.buttons.confirm" type="success" @click="confirmDelete">Confirm
                </FormButton>
                <FormButton v-if="warningModal.buttons.ok" @click="() => showWarningModal(false)">Ok</FormButton>
            </div>
        </Popup> -->
    </FormWrapper>
</template>

<script>

    import FormWrapper from 'Components/form/FormWrapper';
    import {  tempQuery } from './api';
    import PageTitle from 'Components/layout/PageTitle';
    import loadingMixin from 'Mixins/loadingMixin'

    const DEFAULT_STATUS = 43;

    export default {
        name:'Query',
        mixins: [loadingMixin],
        components:{
            PageTitle,
            FormWrapper,
        },
        data(){
            return{
                queryData: [],
                query: '',
                tableKeys: [],
            }
        },
        computed:{
            userData() {
                return this.$store.state.user.user
            },
        },
        created(){
        },
        methods:{
            getTableKeys(){
                var tableColumn = [];
                for (var key in this.queryData[0]) {
                    if (this.queryData[0].hasOwnProperty(key)) {
                        const col = {
                            'key': key,
                        }
                        tableColumn.push(col)
                    }
                }
                this.tableKeys = tableColumn;
            },
            getData(){
                tempQuery({sqlquery: this.query }).then(
                    res => {
                        this.queryData = res.data;
                        this.getTableKeys();
                    }
                )
            },
            backToInstruction(){
                this.$router.push('/tasks');
            },
            
            
        }
    }
</script>


<style lang="scss" module>

    .tableClass {
        border-collapse: collapse;
        border: 1px solid black;
        td,th {
            padding: 10px 5px;
            border: 1px solid black;
        }
        thead {
            background: #aaaaaa;
        }
        tbody {
            tr:nth-child(even){
                background: #eeeeee
            }
        }
    }
</style>