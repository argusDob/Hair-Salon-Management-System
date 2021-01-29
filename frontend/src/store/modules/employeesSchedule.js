import Axios from "axios";

const state = {
  employeesScheduleList : [],
  theSelectedEmployeesSchedule : []


};

const mutations = {
  SET_EMPLOYEES_LIST: (state, payload) => {
    state.employeesScheduleList = payload;
  },
  SET_SELECTED_EMPLOYEE_LIST: (state, payload) => {
    state.theSelectedEmployeesSchedule = payload;
  },
};

const getters = {
  returnTheEmployeesScheduleList: state => {
    return state.employeesScheduleList;
  },
  returnTheSelectedEmployeesSchedule: state => {
    return state.theSelectedEmployeesSchedule;
  },
};

const actions = {
        async getEmployeesScheduleList(context, payload) {
          return new Promise((resolve, reject) => {
            Axios.post("http://localhost:3000/employeeSchedule/all", payload, {
              withCredentials: true,
              headers: {
                "Content-Type": "application/json"
              }
            })
              .then(function(response) {
                console.log(response)
                resolve(response);

                context.commit("SET_EMPLOYEES_LIST", response.data.employeeScheduleList)
              })
              .catch(function(error) {
                reject(error);
              });
          });
        },
        async getTheSelectedEmployeesSchedule(context, payload) {
          return new Promise((resolve, reject) => {
            Axios.get("http://localhost:3000/employeeSchedule/selectedSchedule/" + payload, {
              withCredentials: true,
              headers: {
                "Content-Type": "application/json"
              }
            })
              .then(function(response) {
                console.log(response)
                resolve(response);

                context.commit("SET_SELECTED_EMPLOYEE_LIST", response.data.theSelectedEmployeeScheduleList)
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
