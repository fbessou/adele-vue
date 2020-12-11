<template>
  <div style="height:100vh;">
    <div
      v-show="viewerContainer"
      id="vue-mirador-container"
    />
  </div>
</template>

<script>

import Vue from 'vue';
import { mapActions, mapState } from "vuex";

import Mirador from "mirador";
import annotationPlugins from 'mirador-annotations';
import AdeleAnnotationApiAdapter from '@/modules/adele-annotation-api-adapter';
import AnnotationsActionBar from '@/components/document/edition/actionbars/AnnotationsActionBar';

export default {
  name: "MiradorViewer",
  components: {
    
  },
  props: {
    manifestUrl: { type: String, required: true },
    canvasIndex: { type: Number, default: 0 },
    annotationMode: { type: Boolean, default: false},
    showAnnotations: { type: Boolean, default: true},
    configuration: {type: Object, default: () => {return {}}}
  },
  data() {
    return {
      viewerContainer: null,
      viewerLoaded: false,
      miradorLoadingInterval: null
    }
  },
  computed: {
    ...mapState('workflow', ['currentSection']),
    ...mapState('document', ['document']),

    fullConfig() {
      const manifests = {};
      let url = this.manifestUrl
      return {
          id: "vue-mirador-container",
          manifests: manifests,
          windows: [
            {
              id: 1,
              loadedManifest: url,
              canvasIndex: this.canvasIndex
            }
          ],
          window: {
            allowClose: false,
            allowMaximize: false,
            defaultSideBarPanel: this.currentSection === 'facsimile' ? 'annotations' : 'info',
            sideBarOpen: this.currentSection === 'facsimile',
            hideWindowTitle: true,
            maximizedByDefault: true,
            highlightAllAnnotations: true,
            defaultSidebarPanelWidth: 350,
          },
          workspace: {
            showZoomControls: true,
            type: "mosaic", // Which workspace type to load by default. Other possible values are "elastic"
            height: 5000, // height of the elastic mode's virtual canvas
            viewportPosition: { // center coordinates for the elastic mode workspace
              x: 0,
              y: 0,
            },
            width: 5000, // width of the elastic mode's virtual canvas
          },
          workspaceControlPanel: {
            enabled: false
          },
          annotations: {
            htmlSanitizationRuleSet: 'iiif', // See src/lib/htmlRules.js for acceptable values
            filteredMotivations: ['oa:commenting', 'oa:tagging', 'sc:painting', 'commenting', 'tagging', 'describing'],
          },
          annotation: {
            adapter: (canvasId) => new AdeleAnnotationApiAdapter(
              this.document.id,
              canvasId, 
              {
                'fetchAll': this.fetchAll,
                'fetchAnnotation' : this.fetchAnnotation
              }),
          },
          ...this.configuration
        }
    }
  },
  watch: {
    viewerLoaded() {
      if (this.viewerLoaded) {
        clearInterval(this.miradorLoadingInterval);
      }
    },
    viewerContainer() {
      if (this.viewerContainer && !this.viewer) {
        this.viewer = Mirador.viewer(this.fullConfig, [...annotationPlugins]);
      }
    }
  },
  mounted() {
      this.viewerContainer = document.getElementById('vue-mirador-container');
      if (this.currentSection === 'facsimile') {
        this.miradorLoadingInterval = setInterval(() => {
            const reset = document.querySelector(`button[title='Reset zoom']`);
            if (reset) {
              reset.click();
              this.addAnnotationsActionBar()
              this.viewerLoaded = true;
            }
        },
        1500);
      }
  },
  beforeDestroy() {
    clearTimeout(this.miradorLoadingInterval)
  },
  methods: {
    fetchAll(docId, canvasId) {
      return this.$store.dispatch('annotations/fetchAll', {
        docId: docId,
        canvasId: canvasId
      });
    },
    fetchAnnotation() {

    },
    addAnnotationsActionBar() {
      if (this.currentSection === 'facsimile') {
        const anoToolBarClass =  Vue.extend(AnnotationsActionBar)
        const header = document.querySelector(`aside[aria-label='Annotations'] .mirador-companion-window-header`);

        const span = document.createElement('span')
        //span.setAttribute('id', 'annotations-action-bar');
        //span.setAttribute('style', 'width: 24px; height:24px; background-color:red;');
        header.appendChild(span);

        const toolbar = new anoToolBarClass({propsData:{}})
        toolbar.$mount(span);
      }
    }
  }
}
</script>

<style>
 
</style>
