import Vue from "vue";
import Vuex from "vuex";
import Vuelidate from 'vuelidate'

import notification from "./modules/notification";
import authentication from "./modules/authentication";
import navBar from "./modules/navBar";
import employees from "./modules/employees";
import employeesScheduleList from "./modules/employeesSchedule";
import closedDates from "./modules/closedDates";


import formsNotifier from "./modules/formsNotifier";



import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex, Vuelidate);

export default new Vuex.Store({
  modules: { notification, authentication, navBar, employees, employeesScheduleList, formsNotifier, closedDates },
  plugins: [
    createPersistedState({
      paths: ["authentication"]
    })
  ]
});
