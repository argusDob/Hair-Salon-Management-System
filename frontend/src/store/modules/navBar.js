const state = {
        status: ''
  }
  
  const mutations = {
  
    SET_NAV_BAR_STATUS (state, status) {
        state.status = status
    }
  }
  
  const getters = {
    navBarStatus: state => state.status
  }
  
  export default {
    namespaced: true,
    state,
    mutations,
    getters,
  }