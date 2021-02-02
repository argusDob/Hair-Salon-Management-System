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
  SET_CLOSED_DATES: (state, payload) => {
    const theClosedDates = [];
    const map = new Map();
    for (const holidays of payload) {
    if(!map.has(holidays._id)){
        map.set(holidays._id, true);    // set any value to Map
        theClosedDates.push({
            id: holidays._id,
            name: holidays.name,
            date: holidays.date
           });
    }
  } 
  console.log(theClosedDates)
      state.theClosedDates = theClosedDates;
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
        async getClodedDates(context) {
          return new Promise((resolve, reject) => {
            Axios.get("http://localhost:3000/employeeSchedule/all", {
              withCredentials: true,
              headers: {
                "Content-Type": "application/json"
              }
            })
              .then(function(response) {
                context.commit("SET_CLOSED_DATES", response.data.theClosedDates)

                resolve(response);
              })
              .catch(function(error) {
                console.log(error)
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
