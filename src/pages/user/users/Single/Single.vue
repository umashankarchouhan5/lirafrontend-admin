<template>
    <ValidationObserver ref="observer" v-slot="{ passes }">
        <FormWrapper :is-loading="isLoading" name="user" id="user" >
            <PageTitle :title="PageTitle" slot="title" />
            <CenterBlock :width="700">
                <FormRow>
                    <div class="col-sm-6">
                        <InputText v-model="form.Fname" rules="required" label="First Name" />
                    </div>
                    <div class="col-sm-6" >
                        <InputText v-model="form.Lname" rules="required" label="Last Name" />
                    </div>
                    <!-- <div class="col-sm-6" >
                        <InputDate label="DOB" type="date" v-model="form.DOB" />
                    </div> -->
                </FormRow>
                <FormRow>
                    <div class="col-sm-6" v-if="mode" >
                        <InputText v-model="form.EmpCode" label="Employee Code" readonly />
                    </div>
                    <div class="col-sm-6" v-else >
                        <InputText v-model="form.EmpCode"  rules="required" label="Employee Code" />
                    </div>
                    <div class="col-sm-6" >
                        <InputText v-model="form.Designation"  rules="required" label="Designation" />
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-6">
                        <InputText v-model="form.email" rules="required" type="email" label="Email" />
                    </div>
                    <div class="col-sm-6">
                        <InputTel v-model="form.Mobile" rules="required" label="Mobile Number" />
                    </div>
                </FormRow>
                <FormRow >
                    <div class="col-sm-6">
                        <FormSelect  label="Department"  rules="required" :items="departments" item-name="Name" item-value="id" v-model="form.Department_id" :clearable="false" />
                    </div>
                    <div class="col-sm-6">
                        <FormSelect  label="Manager" rules="required" :items="managers" item-name="fullName" item-value="id" v-model="form.manager_id" />
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-6">
                        <FormSelect label="Office Location"  rules="required" :items="officeLocations" item-name="Name" item-value="id" v-model="form.OfficeLocation_id" />
                    </div>
                    <FormCheckbox class="col-sm-3" name="is_manager" v-model="form.is_manager" >
                        <span>Is Manager</span>
                    </FormCheckbox>
                    <FormCheckbox class="col-sm-3" name="isDirector" v-model="form.isDirector" >
                        <span>Is Director</span>
                    </FormCheckbox>
                </FormRow>
                <FormRow>
                    <div class="col-sm-8">
                        <h6>Roles<span class="text-danger">*</span></h6>
                        <FormSelect :items="roles"
                            multiple
                            name="UserRoles"
                            v-model="form.UserRole"
                            item-name="Name"
                            item-value="id"
                            :title="form.Department_id === null ? 'Select Department first' : ''"
                            :disabled="form.Department_id === null"
                            :rules="{ disabled: mode === 'del' && mode === 'view'}" />
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-4" v-if="mode != 'view' && mode != 'del'">
                        <InputFile label="Choose Profile Picture" ref="prof" @onChange="(file) => uploadFile(file)" name="uploadFile" />
                    </div>
                    <div class="col-sm-3" >
                        <img v-if="url" :src="url" :class="$style.userimage" alt="User Image" >
                        <img v-else src="../../../../assets/images/profile-big.jpg" :class="$style.userimage" alt="User Image" >
                    </div>
                    <div class="col-sm-2">
                        <InputFile label="Signature" @onChange="(file) => uploadSignature(file)" :value="form.signatureattachmentfile"  />
                    </div>
                    <div class="col-sm-3" >
                        <img v-if="signatureUrl" :src="signatureUrl" :class="$style.userimage" alt="Signature Image" >
                        <img v-else src="../../../../assets/images/profile-big.jpg" :class="$style.userimage" alt="Signature Image" >
                    </div>
                </FormRow>
                <ButtonGroup>
                    <FormButton left-icon="ios-send" type="success" @click="passes(updateForm)" v-if="mode == 'edit'">Update</FormButton>

                    <FormButton left-icon="ios-send" type="danger" @click="passes(deleteForm)" v-if="mode == 'del'">Delete</FormButton>

                    <FormButton left-icon="ios-send" type="success" @click="passes(formSubmit)" v-if="!mode">Add</FormButton>

                    <FormButton type="success" @click="backToList" >Back</FormButton>
                </ButtonGroup>
            </CenterBlock>

            
<!-- Message popup -->
        <Popup title="Information" :value="warningModal.visible" @close="() => showWarningModal(false)">
            {{ warningModal.message }}
            <div slot="footer">
                <FormButton v-if="warningModal.buttons.cancel" @click="() => showWarningModal(false)">Cancel
                </FormButton>
                <FormButton v-if="warningModal.buttons.confirm" type="success" @click="confirmDelete">Confirm
                </FormButton>
                <FormButton v-if="warningModal.buttons.ok" @click="() => showWarningModal(false)">Ok</FormButton>
            </div>
        </Popup>

        </FormWrapper>
    </ValidationObserver>
</template>

<script>

    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import loadingMixin from 'Mixins/loadingMixin';
    import InputTel from "Components/form/InputTel";
    // import InputDate from 'Components/form/InputDate'; //hidden
    import { fetchUser, getRoles, getDepartments, getManagers, getLocations, addUser, editUser, deleteUser, fetchRoles  } from "../api.js";
    import { ValidationObserver } from "vee-validate";
    export default {
        name: "Single",
        mixins: [loadingMixin],
        data() {
            return {
                uploadData:{},
                id: null,
                mode: null,
                PageTitle: 'Add User',
                onSubmitError: false,
                departments: [],
                roles: [],
                managers:[],
                officeLocations: [],
                user_id: null,
                url: null,
                signatureUrl: null,
                form: {
                    Fname: null,
                    Lname: null,
                    email: null,
                    Mobile: null,
                    EmpCode: null,
                    Department_id: null,
                    manager_id: null,
                    is_manager: null,
                    UserRole: [],
                    Designation: null,
                    OfficeLocation_id: null,
                    isDirector: null,
                    // photoattachmentfile: null,
                    signatureattachmentfile: null,
                    // DOB: null, // hidden
                },
                warningModal: {
                    visible: false,
                    buttons: {
                        ok: true,
                        confirm: false,
                        cancel: false
                    }
                },
            }
        },
        created() {
            if( this.$route.params.mode == 'edit' || this.$route.params.mode == 'view' || this.$route.params.mode == 'del' ){
                this.mode = this.$route.params.mode;
                this.id = this.$route.params.id;
                this.fetchUserData(this.id);
            }else{
                // push to previous route
            }

            if( this.$route.params.mode == 'edit' ){
                this.PageTitle = 'Edit User'
            }
            else if( this.$route.params.mode == 'view' ){
                this.PageTitle = 'View User'
            }
            else if( this.$route.params.mode == 'del' ){
                this.PageTitle = 'Delete User';
            }
            else {
                this.PageTitle = 'Add User'
            }

            this.getDropdownValues();
        },
        computed: {
            userData() {
                return this.$store.state.user.user
            }
        },
        watch:{
            'form.Department_id': function(val){
                if(val !== null){
                    this.fetchUserRoles();
                }
            }
         },
        components: {
            FormWrapper,
            PageTitle,
            ValidationObserver,
            InputTel,
            // InputDate, //hidden
        },
        methods: {
            showWarningModal(value) {
                this.warningModal.visible = value;
            },
            fetchUserRoles(){
                fetchRoles({Department_id: this.form.Department_id}).then(
                    res => {
                        this.roles = res.data;
                    }
                )
            },
            getDropdownValues() {
                this.showLoader();
                const data = { TableName: 'MasDepartment' };
                Promise.all([
                    getDepartments(data),
                    getRoles(),
                    getManagers(),
                    getLocations(),
                ]).then(this.handleDropdownValues)
            },
            handleDropdownValues(response) {
                this.departments = response[0].data;
                this.roles = response[1].data;
                this.managers = response[2].data.map(item => {
                    item.fullName = item.Fname + ' ' + item.Lname;
                    return item;
                });
                this.officeLocations = response[3].data;
                if(!this.mode)
                    this.hideLoader();
            },
            uploadFile(file) {
                if(file){
                    this.form.photoattachmentfile = file;
                    this.url = URL.createObjectURL(file)
                }
            },
            uploadSignature(file) {
                if(file){
                    this.form.signaturefile = file;
                    this.signatureUrl = URL.createObjectURL(file)
                }
            },
            formSubmit() {
                this.showLoader();
                if(this.form.UserRole == ''){
                    this.warningModal.message = 'Choose a role';
                    this.showWarningModal(true);
                    this.hideLoader();
                    return false;
                }else{
                    const data = new FormData();
                    if(this.form.photoattachmentfile)
                        data.append("photoattachmentfile", this.form.photoattachmentfile);
                    for (let key in this.form) {
                        if (this.form.hasOwnProperty(key)) {
                            data.append(key, this.form[key]);
                        }
                    }
                    this.uploadData = data; 
                    addUser(this.uploadData).then(this.handleSuccessResponse)
                }
            },
            updateForm() {
                this.showLoader();
                const data = new FormData();
                
                data.append("photoattachmentfile", this.form.photoattachmentfile);
                for (let key in this.form) {
                    if (this.form.hasOwnProperty(key)) {
                        data.append(key, this.form[key]);
                    }
                }
                this.uploadData = data;
                editUser(this.uploadData).then(
                    res=>{
                        this.handleSuccessResponse(res)
                    },
                    error=>{
                        this.hideLoader()
                    })
            },
            deleteForm() {
                this.showLoader();
                deleteUser(this.id).then(this.handleSuccessResponse)
            },
            handleSuccessResponse(response) {
                this.hideLoader();
                if( response.code == 204 ){
                    this.warningModal.message = response.message;
                    this.showWarningModal(true);
                    this.hideLoader();
                    return false;
                }else{
                    this.$router.push({ path: `/users/` })
                }
            },
            backToList(){
                this.$router.push({ path: `/users/` })
            },
            fetchUserData(id){
                this.showLoader();
                const data = { code: this.id}
                fetchUser(data).then(this.handleResponse)
            },
            handleResponse(response) {
                let data = response.data;
                this.form = response.data;
                this.form.departmentSelected = response.data.Department_id;
                this.url = response.data.url;
                this.signatureUrl = response.data.signatureUrl;
                this.hideLoader();
            },
        }
    }
</script>

<style lang="scss" module>
    
    .formFile {
        display: inline-flex;
        span {
            margin-left: 20px;
            padding: 3px;
            cursor: pointer;
        }
    }

    .bulkFilesError {
        position: absolute;
        z-index: 4;
        bottom: 5px;
        left: 11px;
        font-size: 11px;
        color: #ff3547
    }

    .exampleFile {
        display: inline-block;
        margin-top: 10px;
    }

    .uploadedFiles {
        background: rgb(241, 241, 241);
        height: 200px;
        width: calc(100%/2 - 8px);
        padding: 10px 15px;
        border-radius: 4px;
        overflow: auto;
    }

    .bulkFile {
        display: flex;
        border-bottom: 1px solid darken(rgb(241, 241, 241), 10%);
        align-items: center;
        &:last-child {
            border-bottom: none;
        }
    }

    .removeBulkFile {
        cursor: pointer;
        padding: 3px;
        margin-left: auto;
    }

    .excelFile {
        display: flex;
        padding: 5px 0;
    }

    .excelFileLabel {
        width: 120px;
        flex-shrink: 0;
        flex-grow: 0;
        align-items: center;
        display: flex;
    }

    .excelFileInput {
        flex-grow: 1;
    }

    .progress {
        margin: 0 20px;
        progress {
            width: 100%;
        }
    }

    .upload {
        width: calc(100%/2 - 8px);
        height: 200px;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
        &:hover {
            .uploadArea {
                background: darken(#f2f2f2, 5%);
                border: 2px dashed  darken(#e3e3e3, 5%);
            }
        }
        .uploadArea {
            position: absolute;
            pointer-events: none;
            background: #f2f2f2;
            border: 2px dashed #e3e3e3;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 1;
            outline: none;
            display: flex;
            align-items: center;
            text-align: center;
            justify-content: center;
        }
        input {
            width: 100%;
            height: 100%;
        }
    }

    .files {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
    }

    .filter {
        margin: -10px 0 25px;
        display: flex;
        align-items: flex-end;
    }

    .filterItem {
        flex: 0 0 180px;
        margin-right: 20px;
    }

    .popupRow {
        padding: 5px 0 15px;
    }

    .userimage{
        width: 30px;
        height: 30px;
    }
</style>
