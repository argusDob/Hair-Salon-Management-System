import Axios from "axios";

const state = {
  employees: [],
  employee: []
};

const mutations = {
  SET_EMPLOYEES: (state, payload) => {
    state.employees = payload;
  },
  REMOVE_EMPLOYEE:(state,id) =>  { 
    state.employees = state.employees.filter((employee) => employee._id !== id) 
  },
  SET_EMPLOYEE: (state, payload) => {
    state.employee = payload;
  },
  SET_THE_NEW_EMPLOYEE:(state, payload) => {
    state.employees.push(payload);
},
SET_THE_UPDATED_EMPLOYEE:(state,payload) => {
  const theUpdatedEmployee = payload;
  console.log(theUpdatedEmployee);
  const theEmployees = [...state.employees];
  theEmployees.forEach(theEmployee => {
      if(theEmployee._id == theUpdatedEmployee._id){
        theEmployee.firstName = theUpdatedEmployee.firstName;
        theEmployee.lastName = theUpdatedEmployee.lastName;
        theEmployee._id = theUpdatedEmployee._id;
        theEmployee.startDate = theUpdatedEmployee.startDate;
        theEmployee.endDate = theUpdatedEmployee.endDate;
        theEmployee.mobileNumber = theUpdatedEmployee.mobileNumber;
        theEmployee.notes = theUpdatedEmployee.notes;
        theEmployee.title = theUpdatedEmployee.title;
      }
  });    
},
};

const getters = {
  returnTheEmployees: state => {
    return state.employees;
  },
  returnTheEmployee: state => {
    return state.employee;
  }
};

const actions = {
  async addEmployee(context, payload) {
    return new Promise((resolve, reject) => {
      Axios.post("http://localhost:3000/employee", payload, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(function(response) {
          resolve(response);
        })
        .catch(function(error) {
          reject(error);
        });
    });
  },
  async getAllEmployees(context) {
    // const theEmployee ={};
    return new Promise((resolve, reject) => {
    Axios("http://localhost:3000/employee/all", {
        method: "GET",
        withCredentials: true
      })
      .then(function(response) {
        resolve(response);
        console.log(response.data.employees);
        context.commit("SET_EMPLOYEES", response.data.employees)
        })
        .catch(function(error) {
          reject(error);
          console.log(error);
        });
      });
        },
        async removeEmployee(context, payload) {
          return new Promise((resolve, reject) => {
            Axios.post("http://localhost:3000/employee/delete", payload, {
              withCredentials: true,
              headers: {
                "Content-Type": "application/json"
              }
            })
              .then(function(response) {
                console.log(payload.employeeId)
                context.commit("REMOVE_EMPLOYEE", payload.employeeId)
                resolve(response);
              })
              .catch(function(error) {
                reject(error);
              });
          });
        },
         async getEmployee(context,payload) {
          return new Promise((resolve, reject) => {
          Axios("http://localhost:3000/employee/getEmployee/" + payload, {
              method: "GET",
              withCredentials: true
            })
            .then(function(response) {
              resolve(response);
              context.commit("SET_EMPLOYEE", response.data.employee)
              })
              .catch(function(error) {
                reject(error);
                console.log(error);
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
