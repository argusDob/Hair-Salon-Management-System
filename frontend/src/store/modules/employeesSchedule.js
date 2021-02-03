import Axios from "axios";

const state = {
  employeesScheduleList : [],
  theSelectedEmployeesSchedule : [],
  theClosedDates:[]


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
  returnTheClosedDates: state => {
    return state.theClosedDates;
  },
};

const actions = {
        async getEmployeesScheduleList(context, payload) {
          return new Promise((resolve, reject) => {
            Axios.post("http://localhost:3000/employeeSchedule/currentSchedule", payload, {
              withCredentials: true,
              headers: {
                "Content-Type": "application/json"
              }
            })
              .then(function(response) {
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
                // console.log(response)
                // context.commit("SET_SELECTED_EMPLOYEE_LIST", "")
                context.commit("SET_SELECTED_EMPLOYEE_LIST", response.data.theSelectedEmployeeScheduleList)
                console.log(response.data);
                resolve(response);
              })
              .catch(function(error) {
                reject(error);
              });
          });
        },
        async addEmployeeSchedule(context, payload) {
          return new Promise((resolve, reject) => {
            Axios.post("http://localhost:3000/employeeSchedule/add", payload, {
              withCredentials: true,
              headers: {
                "Content-Type": "application/json"
              }
            })
              .then(function(response) {
                console.log(response)
                resolve(response);
              })
              .catch(function(error) {
                reject(error);
              });
          });
        },
        async deleteEmployeeSchedule(context, payload) {
          return new Promise((resolve, reject) => {
            Axios.delete("http://localhost:3000/employeeSchedule/delete/" + payload,{
              withCredentials: true,
              headers: {
                "Content-Type": "application/json"
              }
            })
              .then(function(response) {
                console.log(response)
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
