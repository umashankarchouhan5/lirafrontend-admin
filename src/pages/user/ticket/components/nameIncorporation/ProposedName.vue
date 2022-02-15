<template>
    <div>
        <FormRow>
            <div class="col-sm-4">
                <InputText label="Entity Type" readonly rules="required" :value="ticket.EntityType"/>
            </div>
        </FormRow>
        <FormRow>
            <div class="col-sm-4">
                <InputText label="Name" readonly rules="required" :value="ticket.ProposedName"/>
            </div>
        </FormRow>
        <div :class="$style.similarSearch">
            <Loader v-if="similar.isLoading" />
            <div :class="$style.similarButtons">
                <ButtonGroup>
                    <FormButton type="primary" left-icon="md-search" @click="searchForSimilarName">Check for Similar Name</FormButton>
                    <!-- <FormButton type="success" left-icon="md-search" @click="searchForName">Search for Name</FormButton> -->
                </ButtonGroup>
            </div>
            <FormRow v-if="ticket.ValidationResult !== null">
                <div  class="col-sm-6">
                    <div v-for="(err,index) in getDispositions" :key="index">
                        <p  :class="$style.messageError" v-if="err.isError === true">
                            <Icon type="md-close-circle"  />
                            {{err.Comment}}
                        </p>
                        <p  :class="$style.messageSuccess" v-if="err.isError === false">
                            <Icon type="md-checkmark-circle"   />
                            {{err.ErrorMsg}}
                        </p>
                    </div>
                </div>
            </FormRow>
            
            <FormRow>
                <div  class="col-sm-12">
                    <p :class="$style.messageInfo" v-if="similar.message">
                        <Icon type="md-close-circle"  :class="$style.redColor" v-if="similar.items.length > 0" />
                        <Icon type="md-information-circle" :class="$style.blueColor" v-else />
                        {{ similar.message }}
                        <FormButton size="small" :class="$style.closeButton" @click="toggleTableVisibility" v-if="similar.items.length > 0">Close table</FormButton>
                    </p>
                </div>
            </FormRow>
            <DataTable :rowClassName="rowClassName" :noStripe="true" :columns="similar.tableColumns" :data="similar.items" v-if="similar.items.length > 0" />
               
        </div>

        <FormRow>
            <div class="col-sm-4">
                <InputText label="Foreign Name" readonly rules="required" :value="ticket.ForeignName"/>
            </div>
        </FormRow>
        <FormRow>
            <div class="col-sm-4">
                <div :class="$style.currentEntityFile" v-if="ticket.document_file && ticket.document_file !== '' && ticket.document_file !== ' ' && ticket.document_file !== null ">
                    <a :href="ticket.document_file" target="_blank">
                        <Icon type="md-eye"/>
                        {{ ticket.TranslationFile }}
                    </a>
                </div>
                <div v-else>
                    No file attached
                </div>
            </div>
        </FormRow>
        <FormRow>
            <div class="col-sm-4">
                <ButtonGroup>
                    <FormButton type="primary" @click="nextStep" right-icon="ios-arrow-forward">Next</FormButton>
                </ButtonGroup>
            </div>
        </FormRow>
    </div>
</template>

<script>

    import { checkSimilarName } from '../../config/api'
    import Loader from 'Components/layout/Loader'
    import DataTable from 'Components/DataTable'
    import DateUtil from 'Utils/dateUtil'


    export default {
        name: "GeneralInfo101",
        data() {
            return {
                similar: {
                    isLoading: false,
                    message: '',
                    items: [],
                    tableColumns: [
                        {
                            key: '$NameID',
                            title: 'Name ID',
                            width: 70,
                        },
                        {
                            key: 'Name',
                            title: 'Name'
                        },
                        {
                            key: 'Score',
                            title: 'Score',
                            align: 'center',
                            width: 50,
                        },
                        {
                            key: 'MatchDistance',
                            title: 'Match Distance',
                            width: 60,
                        },
                        {
                            key: 'MatchPercent',
                            title: 'Match Percent',
                            width: 60,
                        },
                        {
                            key: '$ICSP',
                            title: 'ICSP'
                        },
                        {
                            key: 'Status',
                            title: 'Status',
                            width: 80,
                        },
                        {   
                            title: 'Date',
                            render: (h, params) => {
                                return h('span', DateUtil.formatDate(params.row.InputDate));
                            },
                            width: 90,
                        },
                    ],
                }
            }
        },
        computed: {
            getDispositions(){
                return JSON.parse(this.ticket.ValidationResult);
            },
            ticket() {
                return this.$store.state.ticket.ticket;
            },
            toggleButtonText() {
                return this.similar.isTableVisible ? 'Hide table' : 'Show table';
            }
        },
        created(){
            // if(this.ticket !== null && this.ticket !== undefined){
            //     this.searchForSimilarName();
            // }
        },
        components: {
            Loader,
            DataTable
        },
        methods: {
            rowClassName (row, index) {
                if (row.Color === "Red") {
                    return this.$style.redBackground;
                } 
                return '';
            },
            toggleTableVisibility() {
                this.similar.message = '';
                this.similar.items = [];
            },
            showLoader() {
                this.similar.isLoading = true;
            },
            hideLoader() {
                this.similar.isLoading = false;
            },
            nextStep() {
                this.$emit('nextStep')
            },
            searchForSimilarName() {
                const data = {
                    EntityType: this.ticket.EntityType,
                    ProposedName: this.ticket.ProposedName
                };
                this.showLoader();
                checkSimilarName(data).then(this.searchForSimilarNameSuccess)
            },
            searchForSimilarNameSuccess(response) {
                this.similar.message = response.message;
                this.similar.items = response.data;
                this.hideLoader();
            },
            searchForName() {
                let routeData = this.$router.resolve({name: 'CompanyPublic'});
                window.open(routeData.href, '_blank');
            },
        }
    }
</script>

<style lang="scss" module>
    .redBackground{
        td{
            background-color: #ff3547;
            color: #000000;

        }
        &:hover{
            transition: all 0.2s ease-out;
            td{
                transition: all 0.2s ease-out;
                color: #000000
            }
        }
    }
    .redColor {
        color: #ff3547;
    }
    .blueColor {
        color: #609dff;
    }
    .similarSearch {
        position: relative;
        margin-bottom: 30px;
    }

    .similarButtons {
        margin: -10px 0 20px;
    }

    .closeButton {
        margin-left: auto;
    }

    .messageInfo {
        padding: 7px 10px;
        display: flex;
        margin-bottom: 10px;
        border-radius: 4px;
        color: #000000;
        align-items: center;
        box-shadow: 0px 5px 20px rgba(0,0,0,0.2);
        :global {
            .ivu-icon {
                font-size: 21px;
                margin-right: 3px;
                margin-top: -4px;
                vertical-align: middle;
                // color: #609dff;
            }
        }
    }
    .messageError {
        padding: 10px 10px;
        display: flex;
        margin-bottom: 15px;
        border-radius: 4px;
        color: #000000;
        align-items: center;
        box-shadow: 0px 5px 20px rgba(0,0,0,0.2);
        :global {
            .ivu-icon {
                font-size: 21px;
                margin-right: 3px;
                margin-top: -4px;
                vertical-align: middle;
                color: #ff3547;
            }
        }
    }
    .messageSuccess {
        padding: 10px 10px;
        display: flex;
        margin-bottom: 15px;
        border-radius: 4px;
        color: #000000;
        align-items: center;
        box-shadow: 0px 5px 20px rgba(0,0,0,0.2);
        :global {
            .ivu-icon {
                font-size: 21px;
                margin-right: 3px;
                margin-top: -4px;
                vertical-align: middle;
                color: #00ff00;
            }
        }
    }
    // .messageInfo {
    //     padding: 7px 10px;
    //     display: flex;
    //     background: #ebf3ff;
    //     margin-bottom: 10px;
    //     border: 1px solid #b6d2ff;
    //     border-radius: 4px;
    //     color: #609dff;
    //     align-items: center;
    //     :global {
    //         .ivu-icon {
    //             font-size: 21px;
    //             margin-right: 3px;
    //             margin-top: -4px;
    //             vertical-align: middle;
    //         }
    //     }
    // }
    // .messageError {
    //     padding: 7px 10px;
    //     display: flex;
    //     background: rgb(255, 0, 0);
    //     margin-bottom: 10px;
    //     border: 1px solid #ff3300;
    //     border-radius: 4px;
    //     color: #ff3547;
    //     align-items: center;
    //     :global {
    //         .ivu-icon {
    //             font-size: 21px;
    //             margin-right: 3px;
    //             margin-top: -4px;
    //             vertical-align: middle;
    //         }
    //     }
    // }
    // .messageSuccess {
    //     padding: 7px 10px;
    //     display: flex;
    //     background: rgba(69, 238, 106, 0.247);
    //     margin-bottom: 10px;
    //     border: 1px solid #00ff0d;
    //     border-radius: 4px;
    //     color: #00ff00;
    //     align-items: center;
    //     :global {
    //         .ivu-icon {
    //             font-size: 21px;
    //             margin-right: 3px;
    //             margin-top: -4px;
    //             vertical-align: middle;
    //         }
    //     }
    // }
    .currentEntityFile {
        display: inline-flex;
        align-items: center;
        :global {
            .ivu-icon {
                font-size: 19px;
                margin-right: 5px;
                vertical-align: middle;
                margin-top: -1px;
            }
        }
        div {
            margin-left: 20px;
            padding: 3px;
            cursor: pointer;
        }
    }
</style>
