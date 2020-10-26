<template>
  <div>
    <button
      class="button"
      @click="createNewAnnotation"
    >
      add !
    </button>
  </div>
</template>

<script>

import Vue from 'vue';
import {mapState} from 'vuex';


export default {
    name: 'AnnotationsActionBar',
    components: {
     
    },
    props: {
      data: {type: Object, default: () => {}}
    },
    data(){
      return {
        addQuillTimeout: null
      }
    },
    computed: {
      ...mapState('document', ['transcriptionView']),
    },
    beforeDestroy() {
      clearTimeout(this.addQuillTimeout)
    },
    created() {
    },
    methods: {
      createNewAnnotation() {
        const target = document.querySelector(`button[title='Create new annotation']`);
        target.click();
        this.addQuillTimeout = setTimeout(this.insertQuill, 1500);
      },
      insertQuill() {
        const form = document.querySelector(`aside[aria-label='New annotation'] form`);
       
        const trContainer = document.createElement('div')
        //trContainer.setAttribute('style', 'width: 300px; height: 200px; background-color: lightgrey;')
        form.appendChild(trContainer);
        trContainer.appendChild(document.querySelector('#facsimile-transcription'))

        clearTimeout(this.addQuillTimeout)
      }
    }
}
</script>