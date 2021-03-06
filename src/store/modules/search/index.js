import {http} from '../../../modules/http-common';

const initState = () => ({
  selection: {
      languages : [],
      acteTypes: [],
      institutions: [],
      traditions: [],
      centuries: [],
      copyCenturies: [],
      availableCommentaries: [],
      countries: [],
      districts: []
  },
})

const mutations = {
  CLEAR (state, {filter}) {
    state.selection[filter] = []
  },
  CLEAR_ALL (state) {
    const initial = initState()
    Object.keys(initial).forEach(key => { state[key] = initial[key] })
  },
  REMOVE (state, {filter, index}) {
    state.selection[filter].splice(index, 1)
  },
  ADD (state, {filter, item}) {
    state.selection[filter].push(item)
  }

};

const actions = {
    clear({commit, state}, {filter}) {
        commit('CLEAR', {filter})
    },
    clearAll({commit, state}) {
        commit('CLEAR_ALL')
    },
    toggleSelection({commit, state}, {filter, item}) {
      console.log("toggleSelection", filter, item)
      const index = state.selection[filter].indexOf(item)
      if (index > -1) {
         commit('REMOVE', {filter, index})
      } else {
        commit('ADD', {filter, item})
      }
    }

};

const getters = {
    isLanguageSelected : (state) => (item) => {
        return state.selection.languages.indexOf(item) > -1
    },
    isActeTypeSelected : (state) => (item) => {
        return state.selection.acteTypes.indexOf(item) > -1
    },
    isTraditionSelected : (state) => (item) => {
        return state.selection.traditions.indexOf(item) > -1
    },
    isCenturySelected : (state) => (item) => {
        return state.selection.centuries.indexOf(item) > -1
    },
    isCopyCenturySelected : (state) => (item) => {
        return state.selection.copyCenturies.indexOf(item) > -1
    },
    isInstitutionSelected : (state) => (item) => {
        return state.selection.institutions.indexOf(item) > -1
    },
    isCountrySelected : (state) => (item) => {
        return state.selection.countries.indexOf(item) > -1
    },
    isDistrictSelected : (state) => (item) => {
        return state.selection.districts.indexOf(item) > -1
    },
    isAvailableCommentarySelected : (state) => (item) => {
        return state.selection.availableCommentaries.indexOf(item) > -1
    }
};

const searchModule = {
  namespaced: true,
  state: initState(),
  mutations,
  actions,
  getters
}

export default searchModule;
