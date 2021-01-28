<template>
  <div>
    <b-container>
      <b-tabs content-class="mt-3" fill>
        <!-- <b-tab title="First" active>
          <employee></employee>
        </b-tab>
        <b-tab title="Second">
          <p>I'm the second tab</p>
        </b-tab>
        <b-tab title="Very, very long title">
          <p>I'm the tab with the very, very long title</p>
        </b-tab>
        <b-tab title="Disabled" disabled>
          <p>I'm a disabled tab!</p>
        </b-tab>-->
        <b-tab v-for="tab in tabs" :title="tab.title" :key="tab.title">
          <div v-if="tab.component === 'employeesCalendar'">
            <employees-calendar></employees-calendar>
          </div>
          <div v-if="tab.component === 'employeesClosedDates'">
            <employees-closed-dates></employees-closed-dates>
          </div>
          <div v-if="tab.component === 'employeesList'">
            <employees-list></employees-list>
          </div>
        </b-tab>
      </b-tabs>
    </b-container>
  </div>
</template>



<script>
import EmployeesList from "./EmployeesList";
import EmployeesCalendar from "./EmployeesScheduleList";
import EmployeesClosedDates from "./EmployeesClosedDates";

export default {
  name: "employees",
  components: {
    "employees-calendar": EmployeesCalendar,
    "employees-closed-dates": EmployeesClosedDates,
    "employees-list": EmployeesList
    },
  data() {
    return {
      tabs: [
        {
          title: "Working Hours",
          active: "active",
          component: "employeesCalendar"
          //   component: getComponents()
        },
        {
          title: "Closed Dates",
          component: "employeesClosedDates"
        },
        {
          title: "Staff Members",
          active: "active",
          component: "employeesList"
        }
      ]
    };
  },
  methods: {}
};
</script>

<style>
</style>



