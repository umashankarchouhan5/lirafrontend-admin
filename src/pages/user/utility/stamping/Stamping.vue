<template>
    <FormWrapper>
        <PageTitle title="Stamp" slot="title" />

        <template v-if="selectedStamp == null" >
            <div :class="$style.stampList">
                <div v-for="(stamp,i) in stamps" :key="i" :class="$style.stampStyle" @click="selectStamp(stamp)">
                    <img :src="stamp.path" />
                    <p>{{stamp.stamp_name}}</p>
                </div>
            </div>
        </template>

        <template v-if="selectedStamp !== null">
            <div :class="$style.selectedStampStyle">
                <div  :class="$style.selectedStyle" >
                    <p>{{selectedStamp.stamp_name}}</p>
                    <img :src="selectedStamp.path" />
                </div>
                <div >
                    <ValidationObserver ref="validator" >
                        <InputDate label="Stamp Date" v-model="stampDate" :options="options" rules="required" />
                        <br />
                        <br />
                        <ButtonGroup>
                            <FormButton type="success" @click="submitData" >Submit</FormButton>
                            <FormButton @click="cancelSelection" >Change Stamp</FormButton>
                            <FormButton @click="openImage" type="success" v-if="downloadData !== null" >Open Stamp</FormButton>
                        </ButtonGroup>
                    </ValidationObserver>

                </div>
            </div>
        </template>


    </FormWrapper>
</template>

<script>
    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import InputDate from 'Components/form/InputDate';
    import DateUtil from 'Utils/dateUtil' ;
    import { stampsList, addWatermark } from '../api';
    import { ValidationObserver } from "vee-validate"; 
    
    export default {
        name: 'Stamping',
        components: {
            FormWrapper,
            PageTitle,
            InputDate,
            ValidationObserver
        },
        data() {
            return {
                stamps: [],
                selectedStamp: null,
                stampDate: DateUtil.formatInNumbersOnly(new Date()),
                options: {
                    disabledDate(date) {
                        return date && date.valueOf() > Date.now();
                    }
                },
                downloadData: null,
            }
        },
        created() {
            this.fetchData();
            console.log(Date.now());
            console.log(new Date());
            console.log(DateUtil.formatInNumbersOnly(Date.now()))
            console.log(DateUtil.formatInNumbersOnly(new Date()))
        },
        methods: {
            openImage() {
                window.open(this.downloadData,'_target');
            },
            selectStamp(item) {
                this.selectedStamp = item;
            },
            cancelSelection() {
                this.selectedStamp = null;
                this.downloadData = null;
            },
            fetchData() {
                stampsList().then(
                    res=> {
                        this.stamps = res.data;
                    }
                )

            },
            submitData() {
                this.$refs.validator.validate().then(result => {
                    if(result){
                        const data = {
                            date: this.stampDate,
                            stamp_id: this.selectedStamp.id
                        } 
                        addWatermark(data).then (
                            res=> {
                                this.downloadData = res.data;
                            }
                        )
                    }
                })
            }
        }
    }
</script>

<style lang="scss" module>
    .stampList {
        display: flex;
        flex-wrap: wrap;
    }
    .stampStyle {
        width: 200px;
        height: 180px;
        // box-shadow: 0px 0px 15px rgba(0,0,0,0.1);
        padding: 10px;
        transition: 0.3s ease-in;
        text-align: center;
        border-radius: 8px;
        // border: 2px solid #000;
        background: #f5f5f5;
        cursor: pointer;
        margin: 10px;
        img {
            width: 180px;
            height: 120px;
            object-fit: contain;
        }
        p {
            font-weight: 500;
            font-size: 16px;
            letter-spacing: 1.3px;
            text-transform: uppercase;
        }
        &:hover {
            box-shadow: 5px 5px 20px rgba(0,0,0,0.15);
            // padding: 0px;
            // img {
            //     width: 200px;
            //     height: 140px;
            // }
            // p {
            //     letter-spacing: 1px;
            //     // text-shadow: 1px 1px rgba(0,0,0,0.6);
            // }
        }
    }

    .selectedStampStyle {
        box-shadow: 5px 5px 15px rgba(0,0,0,0.1);
        display: flex;
        align-items: center;
        padding: 20px;
        background: #fafafa;
        .selectedStyle {
            margin-right: 30px;
            text-align: center;
            padding-right: 30px;
            border-right: 2px solid #dcdcdc;
            // background: #fff;
            img {
                width: 180px;
                height: 120px;
                object-fit: contain;
            }
            p {
                font-weight: 500;
                font-size: 16px;
                letter-spacing: 1.3px;
                text-transform: uppercase;
            }

        }
    }
</style>