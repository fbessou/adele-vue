<template>
  <div v-if="!!readonlyData">
    <div
      class="has-text-weight-medium subtitle m-b-xl"
    >
      Transcription
    </div>
    <div
      
      class="content"
      v-html="readonlyData.content"
    />
  </div>
</template>


<script>

import { mapState } from 'vuex';
import Vue from 'vue';
import addToolTip from '@/modules/tooltip';

export default {
    name: "DocumentTranscription",
    components: {
        
    },
    props: {
        readonlyData: {type: Object, default: null}
    },
    computed: {
        ...mapState('document', ['loading', 'transcriptionView']),
    },
    mounted() {
          // make tooltips
        if (this.transcriptionView) {
            // notes
            Object.keys(this.transcriptionView.notes).forEach(noteId => {
              const paddedId = `${noteId}`.padStart(10, '0')
              Array.from(document.querySelectorAll(`[data-note-id='${paddedId}']`)).forEach(el => {
                addToolTip(el, this.transcriptionView.notes[noteId], null, {contentType: 'note'});
              })
            });

            // persnames && placenames
            Array.from(document.querySelectorAll(`persname, placename`)).forEach(el => {
              addToolTip(el, el.attributes.ref.value, null, {contentType: el.localName, position: el.localName === 'persname' ? 'is-left' : 'is-bottom'});
            })
        }   
    },
    methods: {
 
    }
}
</script>

<style>

</style>