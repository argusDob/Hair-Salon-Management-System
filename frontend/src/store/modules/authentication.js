import Axios from "axios";

const state = {
  username: "",
  token: null,
  resetPasswordToken: null,
  isAuthenticate: false
};

const mutations = {
  SET_LOGIN_TOKEN: (state, payload) => {
    state.token = payload;
  },
  SET_RESET_PASSWORD_TOKEN: (state, payload) => {
    state.resetPasswordToken = payload;
  },
  SET_USERNAME: (state, payload) => {
    state.username = payload;
  },
  SET_IS_AUTHENTICATE: (state, payload) => {
    console.log(payload);
    state.isAuthenticate = payload;
  }
};

const getters = {
  LOGIN: state => {
    return state.token;
  },
  USERNAME: state => {
    return state.username;
  },
  ISAUTHENTICATE: state => {
    return state.isAuthenticate;
  }
};

const actions = {
  async loginUser(context, payload) {
    return new Promise((resolve, reject) => {
      Axios.post("http://localhost:3000/login", payload,  { withCredentials: true ,  headers: {
        'Content-Type': 'application/json',
      }})
        .then(function(response) {
          console.log(response);
          resolve(response);
          localStorage.setItem("jwt", response.data.token);
          context.commit("SET_LOGIN_TOKEN", response.data.token);
          context.commit("SET_USERNAME", response.data.username);
          context.commit("SET_IS_AUTHENTICATE", true);
        })
        .catch(function(error) {
          reject(error);
          console.log(error);
        });
    });
  },
  async requestNewPassword(context, payload) {
    return new Promise((resolve, reject) => {
      Axios.post("http://localhost:3000/forgot", payload)
        .then(function(response) {
          resolve(response);
          context.commit("SET_RESET_PASSWORD_TOKEN", response.data.token);
          context.commit("SET_USERNAME", response.data.email);
        })
        .catch(function(error) {
          reject(error);
          console.log(error);
        });
    });
  },
  async resetPassword(context, payload) {
    console.log(payload);
    return new Promise((resolve, reject) => {
      Axios.post("http://localhost:3000/forgot/reset/" + payload.token, payload)
        .then(function(response) {
          console.log(response);
          resolve(response);
        })
        .catch(function(error) {
          reject(error);
          console.log(error);
        });
    });
  },
  async logout(context, payload) {
    console.log(payload);
    return new Promise((resolve, reject) => {
      Axios.post("http://localhost:3000/logout")
        .then(function(response) {
          context.commit("SET_USERNAME", "");
          context.commit("SET_IS_AUTHENTICATE", false);
          resolve(response);
        })
        .catch(function(error) {
          reject(error);
          console.log(error);
        });
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
};
