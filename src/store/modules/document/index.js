import {http} from '../../../modules/http-common';

const state = {

  document: undefined,
  documents: [],
  
  transcriptionView: undefined,

  loading: false,
};

const mutations = {

  UPDATE_DOCUMENT (state, payload) {
    state.document = payload;
  },
  UPDATE_TRANSCRIPTION_VIEW (state, {content, notes}) {
    state.transcriptionView = {
      content,
      notes
    };
  },
  RESET_TRANSCRIPTION_VIEW(state) {
    state.transcriptionView = null;
  },
  UPDATE_ALL (state, payload) {
    state.documents = payload;
  },

  /*
  PARTIAL_UPDATE_DOCUMENT(state, payload) {
    state.document =  {
      ...state.document,
      ...payload
    };
  },
  */
  LOADING_STATUS (state, payload) {
    state.loading = payload;
  },
};

const actions = {

  fetch ({ commit }, {id}) {
    commit('LOADING_STATUS', true);
    console.log("fetching doc")
    return http.get(`documents/${id}`).then( (response) => {
      commit('UPDATE_DOCUMENT', response.data.data)
      commit('RESET_TRANSCRIPTION_VIEW')
      console.log("doc ok")
      commit('LOADING_STATUS', false);
    }).catch((error) => {
      commit('LOADING_STATUS', false);
      throw error
    })
  },
  fetchTranscriptionView ({ commit }, {id, userId}) {
    commit('LOADING_STATUS', true);
    console.log("fetching  tr")
    return http.get(`documents/${id}/view/transcription${userId ? '/from-user/' + userId: ''}`).then( (response) => {
      commit('UPDATE_TRANSCRIPTION_VIEW',  {
        content: response.data.data["content"],
        notes: response.data.data["notes"]
      })
      console.log("tr ok")
      commit('LOADING_STATUS', false);
    }).catch((error) => {
      commit('LOADING_STATUS', false);
      throw error
    })
  },
  fetchAll ({ commit }, {pageId, pageSize, filters}) {
    commit('LOADING_STATUS', true);
    return http.get(`documents?${filters}&page[size]=${pageSize}&page[number]=${pageId}`)
      .then( (response) => {
      commit('UPDATE_ALL', response.data.data);
      commit('LOADING_STATUS', false);
    }).catch((error) => {
      commit('LOADING_STATUS', false);
      throw error
    })
  },
  /*
  save ({ commit, rootGetters }, data) {

    const auth = rootGetters['user/authHeader'];

    return new Promise( ( resolve, reject ) => {
      axios.put(`/adele/api/1.0/documents`, { data: data }, auth)
        .then(response => {
          if (response.data.errors) {
            console.error("error", response.data.errors);
            reject(response.data.errors);
          } else {
            commit('UPDATE_DOCUMENT', response.data.data)
            resolve(response.data)
          }
        })
        .catch(error => {
          console.error("error", error)
          reject(error)
        });
    })
  },
  setValidationStage ({ commit }, {validationStage, validationStageLabel}) {
    commit('PARTIAL_UPDATE_DOCUMENT', {validation_step: validationStage, validation_step_label: validationStageLabel})
  },
  */
};

const getters = {

  document: state => state.document,
  manifestURL: state => {
    const manifest_url = `documents/${state.document.id}/manifest`;
    return state.document && state.document.images &&  state.document.images.length > 0 ? manifest_url : null
  }

};

const documentModule = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}

export default documentModule;
