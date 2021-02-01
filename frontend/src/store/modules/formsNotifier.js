  
const state = {
  formsmsg: '',
  formsType: '',
  formsStatus: ''
}

const mutations = {
  formsNotify (state, { msg, type }) {
    console.log(type);
    state.formsmsg = msg
    state.formsType = type
  },
  formsRemove (state) {
    state.formsmsg = ''
    state.formsType = ''
  },
  formsSetStatus (state, status) {
    state.formsStatus = status
  }
}

const getters = {
  message: state => state.formsmsg,
  alertClass: state => 'alert-' + state.formsType,
  status: state => state.formsStatus
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
}