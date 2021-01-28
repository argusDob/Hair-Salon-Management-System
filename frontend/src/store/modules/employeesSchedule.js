import Axios from "axios";

const state = {
  employeeScheduleList : []

};

const mutations = {
  SET_EMPLOYEES_LIST: (state, payload) => {
    state.employeeScheduleList = payload;
  },

};

const getters = {
  returnTheEmployeesScheduleList: state => {
    return state.employeeScheduleList;
  },
};

const actions = {
        async getEmployeeScheduleList(context, payload) {
          return new Promise((resolve, reject) => {
            Axios.post("http://localhost:3000/employeeSchedule/all", payload, {
              withCredentials: true,
              headers: {
                "Content-Type": "application/json"
              }
            })
              .then(function(response) {
                console.log(response)
                context.commit("SET_EMPLOYEES_LIST", response.data.employeeScheduleList)
                resolve(response);
              })
              .catch(function(error) {
                reject(error);
              });
          });
        },

};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
};
