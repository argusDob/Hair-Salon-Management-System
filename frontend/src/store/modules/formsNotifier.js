  
const state = {
    message: '',
    variant: '',
    dismissCountDown: ''
  }
  
  const mutations = {
    notify (state, { message, variant, dismissCountDown }) {
      state.message = message
      state.variant = variant
      state.dismissCountDown = dismissCountDown

    },
    // remove (state) {
    //   state.message = ""
    //   state.messageType = ""
    //   state.variant = ""

    // },
  }
  
  const getters = {
    message: state => state.message,
    variant: state => state.variant,
    dismissCountDown: state => state.dismissCountDown
  }
  
  export default {
    namespaced: true,
    state,
    mutations,
    getters,
  }