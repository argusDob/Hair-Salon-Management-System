<template>
  <div>
    <b-container>
      <b-row>
        <label for="example-datepicker">Choose a date</label>
        <b-form-datepicker
          id="example-datepicker"
          v-model="selectedDay"
          @context="getMonday(selectedDay)"
          class="mb-2"
        ></b-form-datepicker>
      </b-row>
      <table class="employeesScheduleTable">
        <thead>
          <tr>
            <th>
              <div class="d-flex align-items-center justify-content-center">Name</div>
            </th>
            <th v-for="(date, index) in test" :key="`date-${index}`">
              <div class="d-flex align-items-center justify-content-center">{{ date }}</div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in dynamicData" :key="row.id">
            <td>
              <strong>{{row.firstName}}</strong>
            </td>
            <td v-for="(test, index) in row.employeeSchedule" :key="index">
              <div
                v-if="test.startTime !== '' "
                class="d-flex align-items-center justify-content-center"
              >
                <b-button
                  v-b-modal.addEmployeeSchedule
                  variant="info"
                  @click="onGetSelectedDate()"
                >{{test.startTime}}-{{test.endTime}}</b-button>
              </div>
              <div v-else class="d-flex align-items-center justify-content-center">
                <b-button
                  class="w-100"
                  v-b-modal.addEmployeeSchedule
                  variant="secondary"
                  @click="onGetSelectedDate(index)"
                >
                                  +
                </b-button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </b-container>
    <employee-schedule-form :theScheduleDate="addScheduleSelectedDay"></employee-schedule-form>
  </div>
</template>

<script>
import moment from "moment";
import AddEmployeeSchedule from "./EmployeeScheduleForm";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "employeesCalendar",
  components: { "employee-schedule-form": AddEmployeeSchedule },

  data() {
    return {
      selectedDay: "",
      theWorkingDateRange: [
        "24-01-2021",
        "25-01-2021",
        "26-01-2021",
        "27-01-2021",
        "28-01-2021",
        "29-01-2021"
      ],
      dynamicData: [],
      addScheduleSelectedDay: null,
      test: [],
      employeesScheduleList: [],
      rows: [
        {
          id: 1,
          name: "Chandler Bing",
          times: [
            { start: "9.00", end: "17.00", date: "18-01-2021" },
            { start: "9.00", end: "17.00", date: "19-01-2021" },
            { start: "9.00", end: "17.00", date: "21-01-2021" }
          ]
        },
        {
          id: 2,
          name: "Employee 2",
          times: [
            { start: "9.00", end: "17.00", date: "18-01-2021" },
            { start: "9.00", end: "17.00", date: "19-01-2021" },
            { start: "9.00", end: "17.00", date: "23-01-2021" }
          ]
        },
        {
          id: 3,
          name: "Employee 2",
          times: [
            { start: "9.00", end: "17.00", date: "19-01-2021" },
            { start: "9.00", end: "17.00", date: "22-01-2021" },
            { start: "9.00", end: "17.00", date: "24-01-2021" }
          ]
        }
      ]
    };
  },
  computed: {
        ...mapGetters("employeesScheduleList", ["returnTheEmployeesScheduleList"]),
       

  },
  methods: {
    ...mapActions("employeesScheduleList", ["getEmployeeScheduleList"]),

    getMonday(pSelectedDay) {
      console.log(pSelectedDay);
      if (pSelectedDay) {
        pSelectedDay = new Date(pSelectedDay);
      } else {
        pSelectedDay = new Date();
      }
      let day = pSelectedDay.getDay();
      let theDifferenceOfTheday =
        pSelectedDay.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
      let theMonday = new Date(pSelectedDay.setDate(theDifferenceOfTheday));
      this.getTheWorkingWeek(theMonday);
    },
    getTheWorkingWeek(pTheMonday) {
      const theDateArray = [];
      let thecurrentMonday = moment(pTheMonday);
      let theLastWorkingDay = moment(
        pTheMonday.setDate(pTheMonday.getDate() + 5)
      );
      while (thecurrentMonday <= theLastWorkingDay) {
        theDateArray.push(moment(thecurrentMonday).format("DD-MM-YYYY"));
        thecurrentMonday = moment(thecurrentMonday).add(1, "days");
      }

      //todo change name
      this.test = theDateArray;

      const liza = this.onGetEmployeeScheduleList();
      this.setEmployeeScheduleOntheTable(liza);
      return theDateArray;
    },
    setEmployeeScheduleOntheTable(liza) {
      this.dynamicData = liza.map(o => ({
        ...o,
        employeeSchedule: this.test.map(
          (i => date =>
            o.employeeSchedule[i]?.date === date
              ? o.employeeSchedule[i++]
              : { startTime: "", endTime: "", date: "+" })(0))
      }));
    },
    onGetSelectedDate(pIndex) {
      this.addScheduleSelectedDay = this.test[pIndex];
    },
    onGetEmployeeScheduleList() {
      let liza = [];
      const theInitialDate = this.test[0];
      const theLastDate = this.test[5];
      this.getEmployeeScheduleList({theInitialDate : theInitialDate, theLastDate : theLastDate});
      // .finally(
      //   () => (
           const copy = [ ...this.returnTheEmployeesScheduleList ];
           console.log(copy);
          this.loading = false;
       
          copy.forEach(function(employee) {
              employee.employeeSchedule.forEach(function(employeeSchedule) {
              const date = moment(employeeSchedule.date);
              employeeSchedule.date = date.format("DD-MM-YYYY");             
            });
            // this.employeesScheduleList = theEmployeeShcheduleList;
             liza.push(employee)
              

          })
                      console.log(liza)

          return liza;
          // )
          // );
      //  this.employeesScheduleList = theEmployeeShcheduleList;
      //  console.log(this.returnTheEmployeesScheduleList)
       
      //  this.employeesScheduleList.push(theEmployeeShcheduleList);
    }
  },
  mounted:function() {
    console.log(this.selectedDay);
    this.getMonday("2021-01-28")
    // this.getEmployeeScheduleList.finally(
    //   () => (
    //     (this.loading = false),
    //     (this.employeesScheduleList = this.returnTheEmployeesScheduleList)
    //   )
    // );
  }
};
</script>

<style scoped>
.employeesScheduleTable {
  width: 100%;
  margin-bottom: 1.5em;
}
.employeesScheduleTable thead {
  position: absolute;
  clip: rect(1px 1px 1px 1px);
  /* IE6, IE7 */
  clip: rect(1px, 1px, 1px, 1px);
  padding: 0;
  border: 0;
  height: 1px;
  width: 1px;
  overflow: hidden;
}
.employeesScheduleTable thead th {
  background-color: #1d96b2;
  border: 1px solid #1d96b2;
  font-weight: normal;
  text-align: center;
  color: white;
}

.employeesScheduleTable tr:hover:not(:first-child) {
  background-color: #d8e7f3;
}

.employeesScheduleTable thead th:first-of-type {
  text-align: left;
}
.employeesScheduleTable tbody,
.employeesScheduleTable tr,
.employeesScheduleTable th,
.employeesScheduleTable td {
  display: block;
  padding: 0;
  text-align: left;
  white-space: normal;
}
.employeesScheduleTable th,
.employeesScheduleTable td {
  padding: 0.5em;
  vertical-align: middle;
}
.employeesScheduleTable caption {
  margin-bottom: 1em;
  font-size: 1em;
  font-weight: bold;
  text-align: center;
}
.employeesScheduleTable tfoot {
  font-size: 0.8em;
  font-style: italic;
}
.employeesScheduleTable tbody tr {
  margin-bottom: 1em;
  border: 2px solid #1d96b2;
}
.employeesScheduleTable tbody tr:last-of-type {
  margin-bottom: 0;
}
.employeesScheduleTable tbody th[scope="row"] {
  background-color: #1d96b2;
  color: white;
}
.employeesScheduleTable tbody td[data-type="currency"] {
  text-align: right;
}
.employeesScheduleTable tbody td[data-title]:before {
  content: attr(data-title);
  float: left;
  font-size: 0.8em;
  color: rgba(94, 93, 82, 0.75);
}
.employeesScheduleTable tbody td {
  text-align: right;
  border-bottom: 1px solid #1d96b2;
}

@media (min-width: 52em) {
  .employeesScheduleTable {
    font-size: 0.9em;
  }
  .employeesScheduleTable thead {
    position: relative;
    clip: auto;
    height: auto;
    width: auto;
    overflow: auto;
  }
  .employeesScheduleTable tr {
    display: table-row;
  }
  .employeesScheduleTable th,
  .employeesScheduleTable td {
    display: table-cell;
    padding: 0.5em;
  }

  .employeesScheduleTable caption {
    font-size: 1.5em;
  }
  .employeesScheduleTable tbody {
    display: table-row-group;
  }
  .employeesScheduleTable tbody tr {
    display: table-row;
    border-width: 1px;
  }
  .employeesScheduleTable tbody tr:nth-of-type(even) {
    background-color: rgba(94, 93, 82, 0.1);
  }
  .employeesScheduleTable tbody th[scope="row"] {
    background-color: transparent;
    color: #5e5d52;
    text-align: left;
  }
  .employeesScheduleTable tbody td {
    text-align: center;
  }
  .employeesScheduleTable tbody td[data-title]:before {
    content: none;
  }
}
@media (min-width: 62em) {
  .employeesScheduleTable {
    font-size: 1em;
  }
  .employeesScheduleTable th,
  .employeesScheduleTable td {
    padding: 0.75em 0.5em;
  }
  .employeesScheduleTable tfoot {
    font-size: 0.9em;
  }
}

@media (min-width: 75em) {
  .employeesScheduleTable th,
  .employeesScheduleTable td {
    padding: 0.75em;
  }
}
</style>



