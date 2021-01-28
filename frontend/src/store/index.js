import Vue from "vue";
import Vuex from "vuex";
import notification from "./modules/notification";
import authentication from "./modules/authentication";
import navBar from "./modules/navBar";
import employees from "./modules/employees";
import employeesScheduleList from "./modules/employeesSchedule";

import formsNotifier from "./modules/formsNotifier";



import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: { notification, authentication, navBar, employees, employeesScheduleList, formsNotifier },
  plugins: [
    createPersistedState({
      paths: ["authentication"]
    })
  ]
});
