<template>
  <div class="editor-area">
    <div
      ref="controls"
      class="editor-controls"
    >
      <div class="editor-controls-group">
        <label>Structure éditoriale</label>
        <editor-button
          :selected="buttons.paragraph"
          :active="editorHasFocus"
          :callback="simpleFormat"
          :format="'paragraph'"
        />
        <editor-button
          :selected="buttons.verse"
          :active="editorHasFocus"
          :callback="simpleFormat"
          :format="'verse'"
        />
        <editor-button
          :active="isNoteButtonActive"
          :callback="newNoteChoiceOpen"
          :format="'note'"
        />
        <editor-button
          :selected="buttons.segment"
          :active="editorHasFocus"
          :callback="insertSegment"
          :format="'segment'"
        />
      </div>
      <div class="editor-controls-group">
        <label>Enrichissements typographiques</label>
        <editor-button
          :selected="buttons.bold"
          :active="editorHasFocus"
          :callback="simpleFormat"
          :format="'bold'"
        />
        <editor-button
          :selected="buttons.italic"
          :active="editorHasFocus"
          :callback="simpleFormat"
          :format="'italic'"
        />
        <editor-button
          :selected="buttons.superscript"
          :active="editorHasFocus"
          :callback="simpleFormat"
          :format="'superscript'"
        />
        <editor-button
          :selected="buttons.smallcaps"
          :active="editorHasFocus"
          :callback="simpleFormat"
          :format="'smallcaps'"
        />
        <editor-button
          :selected="buttons.underline"
          :active="editorHasFocus"
          :callback="simpleFormat"
          :format="'underline'"
        />
      </div>
      <div class="editor-controls-group">
        <label>Enrichissements sémantiques</label>
        <editor-button
          :selected="buttons.del"
          :active="editorHasFocus"
          :callback="simpleFormat"
          :format="'del'"
        />
        <editor-button
          :selected="buttons.expan"
          :active="editorHasFocus"
          :callback="simpleFormat"
          :format="'expan'"
        />
        <editor-button
          :selected="buttons.person"
          :active="editorHasFocus"
          :callback="displayPersonForm"
          :format="'person'"
        />
        <editor-button
          :selected="buttons.location"
          :active="editorHasFocus"
          :callback="displayLocationForm"
          :format="'location'"
        />
      </div>
    </div>
    <div class="editor-container">
      <div
        id="transcription-editor"
        ref="editor"
        class="quill-editor"
        spellcheck="false"
      />
      <note-actions
        v-show="selectedNoteId && editor.hasFocus()"
        refs="noteActions"
        :style="actionsPosition"
        :new-note="setNoteEditModeNew"
        :edit="setNoteEditModeEdit"
        :update-link="setNoteEditModeList"
        :unlink="unlinkNote"
        :delete="setNoteEditModeDelete"
      />
      <new-note-actions
        v-if="defineNewNote"
        :mode-new="setNoteEditModeNew"
        :mode-link="setNoteEditModeList"
        :cancel="newNoteChoiceClose"
      />
    </div>
        
    <notes-list-form
      v-if="noteEditMode == 'list'"
      :note-id="selectedNoteId"
      :submit="updateNoteId"
      :cancel="closeNoteEdit"
    />
    <textfield-form
      v-if="formTextfield"
      :title="formTextfield.title"
      :label="formTextfield.label"
      :value="formTextfield.value"
      :submit="submitTextfieldForm"
      :cancel="cancelTextfieldForm" 
    />
    <note-form
      v-if="noteEditMode == 'new' || noteEditMode == 'edit'"
      :title="noteEditMode == 'new' ? 'nouvelle note' : 'Éditer la note'"
      :note="currentNote"
      :note-id="selectedNoteId"
      :submit="updateNote"
      :cancel="closeNoteEdit"
    />
    <modal-confirm-note-delete
      v-if="noteEditMode == 'delete'"
      :cancel="closeNoteEdit"
      :submit="deleteNote"
    />
  </div>
</template>

<script>
    
    import { mapState } from 'vuex'
    import EditorButton from './EditorButton.vue';
    import EditorMixins from '../../mixins/EditorMixins'
    import EditorNotesMixins from '../../mixins/EditorNotesMixins'
    //import InEditorActions from './InEditorActions';
    import NoteActions from './NoteActions';
    import NewNoteActions from './NewNoteActions';
    import NoteForm from '../forms/NoteForm';
    import NotesListForm from '../forms/NotesListForm';
    import ModalConfirmNoteDelete from '../forms/ModalConfirmNoteDelete';
    //import SaveBar from "../ui/SaveBar";
    import TextfieldForm from "../forms/TextfieldForm";
    
    export default {
        name: "TranscriptionEditor",
        components: {
            TextfieldForm,
            //SaveBar,
            NewNoteActions,
            //InEditorActions,
            EditorButton,
            ModalConfirmNoteDelete,
            NoteActions,
            NotesListForm,
            NoteForm,
        },
        mixins: [EditorMixins, EditorNotesMixins],
        props: ['initialContent'],
        data() {
            return {
                storeActions: {
                    changed: 'transcription/changed'
                },
                delta: null,
                buttons: {
                    bold: false,
                    italic: false,
                    superscript: false,
                    smallcaps: false,
                    underline: false,
                    del: false,
                    expan: false,
                    person: false,
                    location: false,
                    note: false,
                    segment: false,
                    paragraph: false,
                }
            }
        },
        mounted () {
            this.initEditor(this.$refs.editor, this.$props.initialContent);
        },
        beforeDestroy () {
            this.deactivateEvents();
        },
        methods: {
            
            updateContent () {
                this.delta = this.editor.getContents().ops;
                
            }
        },
        
        computed: {
            ...mapState('transcription', ['transcriptionSaved']),
        }
    }
</script>