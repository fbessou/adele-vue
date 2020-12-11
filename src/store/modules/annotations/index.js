import {http} from '../../../modules/http-common';

const state = {

};

const mutations = {

};

const actions = {

  async fetchAll({ commit }, {docId, canvasId}) {

    const s = canvasId.split('/')
    const canvasIdx = parseInt(s[s.length - 1].replace('f', '') - 1)

    const commentingAnnos = await http.get(`iiif/${docId}/list/commenting-${canvasIdx}`)
    const describingAnnos = await http.get(`iiif/${docId}/list/describing-${canvasIdx}`)
    console.log(commentingAnnos)
    return [
      ...commentingAnnos.data.resources.filter(a => a["@type"] === "oa:Annotation"),
      ...describingAnnos.data.resources.filter(a => a["@type"] === "oa:Annotation")
    ]
  }

};

const getters = {

};

const annotationsModule = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}

export default annotationsModule;
