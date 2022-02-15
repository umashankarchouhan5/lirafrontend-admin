<template>
    <Popup title="Add an Internal Note" width="900" :value="isVisible" @close="closeModal">
        <div :class="$style.description" v-if="this.$slots.default">
             <slot />
        </div>
                <form>
                    <Loader v-if="isLoading" />
                    <ValidationObserver  ref="notesValidator">
                        <ValidationProvider  rules="editorRequired|required"  name="Message" mode="passive" v-slot="{ errors }">
                            <FormRow>
                                <div class="col-sm-12">
                                    <!-- <InputTextArea name="Note" rows="6" rules="required" :maxlength="2000" v-model="note.notes"/> -->
                                    <EditorComponent v-if="!isLoading" v-model="note.notes" />
                                </div>
                            </FormRow>
                            <div :class="$style.error" v-if="errors[0]">
                                {{ errors[0] }}
                            </div>
                        </ValidationProvider>
                    </ValidationObserver>
                    <FormRow>
                        <div class="col-sm-6">
                            <FormButton @click="saveNote">Save comment</FormButton>
                        </div>
                    </FormRow>
                </form>

        <NotesTable />
    </Popup>
</template>

<script>

    import { ValidationObserver, ValidationProvider } from 'vee-validate'
    import { saveNote } from './notesModalActions'
    import NotesTable from 'Components/notesTable/NotesTable'
    import { mapMutations } from 'vuex';

    export default {
        name: "NotesModal",
        props: {
            isVisible: Boolean,
            referenceId: Number
        },
        components: {
            ValidationObserver,
            ValidationProvider,
            NotesTable,
        },
        data() {
            return {
                note: null,
            }
        },
        computed: {
            isLoading() {
                return this.$store.state.notesTable.isLoading
            },
            userData() {
                return this.$store.state.user.user
            },
            currentProcessId() {
                return this.$store.state.common.currentProcessId
            },
            notes() {
                return this.$store.state.notesTable.notes
            },
        },
        created() {
            this.setNote();
            if (this.notes.length === 0) {
                this.getPreviousNotes();
            }
        },
        watch:{
            referenceId(val){
                this.setNote();
                this.getPreviousNotes();
            }
        },
        methods: {
            ...mapMutations([
                'notesTable/setLoading', // -> this['notesTable/setLoading']()
            ]),
            setNote() {
                this.note = {
                    DocumentData_id: '',
                    DocumentBrief: '',
                    adminuser_id: this.userData.user_id,
                    notes: '',
                    process_id: this.currentProcessId,
                    reference_id: +this.referenceId,
                    isinternal: false,
                }
            },
            saveNote() {
                this.$refs.notesValidator.validate().then(
                    res => {
                        if (res){
                            this['notesTable/setLoading'](true);
                            saveNote(this.note)
                                .then(this.saveNoteSuccess)
                        }
                    }
                )
            },
            getPreviousNotes() {
                const data = {
                    documentdata_id: null,
                    process_id: +this.currentProcessId,
                    reference_id: +this.referenceId
                };
                this.$store.dispatch('notesTable/getNotes', data)
            },
            saveNoteSuccess() {
                this.getPreviousNotes();
                this.setNote();
                this.$refs.notesValidator.reset();
            },
            closeModal() {
                this.$emit('onClose')
            }
        }
    }
</script>

<style lang="scss" module>
    .checkboxInternal {
        display: inline-block;
        margin-left: 20px;
    }
    .description {
        margin-bottom: 10px;
    }
    .error {
        color: #ff3547;
        // position: absolute;
        // left: 0;
        font-size: 11px;
        line-height: 13px;
        // top: calc(100% + 2px);
        font-weight: 400;
        margin: 10px;
    }
</style>
