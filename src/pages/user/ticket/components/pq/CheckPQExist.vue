<template>
    <ValidationObserver ref="validator">
        <CenterBlock :width="800">
            <div :class="$style.note">
                <p><strong>Note:</strong> If you have filled the PQ form before, you MUST NOT add a new form. You must Edit the previously filled form.</p>
                <p>To search for an existing PQ form, please use the search section above.</p>
                <p>You can search for an existing PQ form and its status by entering the Unique Reference or by entering the Passport #, Last Name and Date of Birth</p>
            </div>
            <div :class="$style.search">
                <FormRow>
                    <div class="col-sm-6">
                        <InputText v-model="Fname" label="First Name" rules="required" />
                    </div>
                    <div class="col-sm-6">
                        <InputText v-model="Lname" label="Last Name" rules="required" />
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-6">
                        <DateSelect :errors="errors" is-required label="Date of Birth" @onSelect="onSelectDOB" />
                    </div>
                    <div class="col-sm-6">
                        <InputText v-model="PassportNo" label="Passport #" rules="required" />
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-12">
                        <FormButton type="success" @click="validateData" left-icon="md-checkmark-circle-outline">Submit</FormButton>
                    </div>
                </FormRow>
            </div>
        </CenterBlock>
        <Popup :value="popup.isVisible" title="Information" @close="() => popup.isVisible = false">
            <p>{{ message }}</p>
            <FormButton v-if="exist" slot="footer" @click="backToList" left-icon="md-arrow-round-back">Back to list</FormButton>
            <FormButton v-else slot="footer" type="success" @click="createNewForm" left-icon="md-checkmark-circle-outline">Add New</FormButton>
        </Popup>
    </ValidationObserver>
</template>

<script>

    import { checkIfPQExist } from '../config/requests';
    import DateSelect from 'Components/dateSelect/dateSelect'
    import { ValidationObserver } from 'vee-validate'

    export default {
        name: "CheckPQExist",
        components: {
            DateSelect,
            ValidationObserver
        },
        data() {
            return {
                Fname: '',
                Lname: '',
                DOB: '',
                PassportNo: '',
                errors: [],
                message: '',
                popup: {
                    isVisible: false,
                },
                exist: false,
            }
        },
        methods: {
            createNewForm() {
                this.popup.isVisible = false;
                const data = {
                    Fname: this.Fname,
                    Lname: this.Lname,
                    DOB: this.DOB,
                    PassportNo: this.PassportNo
                };
                this.$emit('onCreateNew', data)
            },
            onSelectDOB(date) {
                this.DOB = date;
            },
            sendRequest() {
                const data = {
                    Fname: this.Fname,
                    Lname: this.Lname,
                    DOB: this.DOB,
                    PassportNo: this.PassportNo
                };
                checkIfPQExist(data).then(res => {
                    this.popup.isVisible = true;
                    this.exist = res.exist;
                    this.message = res.message
                })
            },
            backToList() {
                this.popup.isVisible = false;
                this.$router.push({ path: '/pq-forms' })
            },
            validateData() {
                this.errors = [];
                if (!this.DOB) {
                    this.errors.push('dob')
                }
                this.$refs.validator.validate().then((res) => {
                    if (res && this.errors.length === 0) {
                        this.sendRequest();
                    }
                });
            }
        }
    }
</script>

<style lang="scss" module>
    .note {
        margin-bottom: 10px;
        font-size: 13px;
        p {
            margin-bottom: 5px;
        }
    }
</style>
