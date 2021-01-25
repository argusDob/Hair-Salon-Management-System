<template>
  <div>
    <label for="example-datepicker">Choose a date</label>
    <b-form-datepicker
      id="example-datepicker"
      v-model="selectedDay"
      :@context="day = getMonday(selectedDay)"
      class="mb-2"
    ></b-form-datepicker>
    <table id="firstTable">
      <thead>
        <tr>
          <th><div class="d-flex align-items-center justify-content-center">Name</div></th>
          <th v-for="(date, index) in theWorkingDateRange" :key="`date-${index}`"><div class="d-flex align-items-center justify-content-center">{{ date }}</div></th>
       </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.id">
          <td>{{row.name}}</td>
          <td v-for="test in row.times" :key="test.times">
            <div class="d-flex align-items-center justify-content-center" id="workingHours">{{test.start}}-{{test.end}}</div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "employeesCalendar",
  data() {
    return {
      selectedDay: "",
      theWorkingDateRange:null,
      rows: [
        {
          id: 1,
          name: "Chandler Bing",
          times: [
            {
              start: "9.00",
              end: "17.00",
              date: "12-07-2020"
            },
            {
              start: "9.00",
              end: "17.00",
              date: "13-07-2020"
            },
            {
              start: "9.00",
              end: "17.00",
              date: "14-07-2020"
            },
            {
              start: "9.00",
              end: "17.00",
              date: "14-07-2020"
            },
            {
              start: "9.00",
              end: "17.00",
              date: "14-07-2020"
            },
            {
              start: "9.00",
              end: "17.00",
              date: "14-07-2020"
            }]
        },
              {
          id: 2,
          name: "Ioannis Dimitriou",
          times: [
            {
              start: "9.00",
              end: "17.00",
              date: "12-07-2020"
            },
            {
              start: "9.00",
              end: "17.00",
              date: "13-07-2020"
            },
            {
              start: "9.00",
              end: "17.00",
              date: "14-07-2020"
            },
            {
              start: "9.00",
              end: "17.00",
              date: "14-07-2020"
            },
            {
              start: "9.00",
              end: "17.00",
              date: "14-07-2020"
            },
            {
              start: "9.00",
              end: "17.00",
              date: "14-07-2020"
            }
          ]
        }]
    };
  },
  methods: {
    getMonday(pSelectedDay) {
      if(pSelectedDay){
      pSelectedDay = new Date(pSelectedDay);
      }else { pSelectedDay = new Date(); }
      let day = pSelectedDay.getDay();
      let theDifferenceOfTheday = pSelectedDay.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
      let theMonday = new Date(pSelectedDay.setDate(theDifferenceOfTheday));
      this.getTheWorkingWeek(theMonday);
    },
    getTheWorkingWeek(pTheMonday){
      const theDateArray = [];
      let thecurrentMonday = moment(pTheMonday);
      let theLastWorkingDay = moment(pTheMonday.setDate(pTheMonday.getDate() + 5));
      while (thecurrentMonday <= theLastWorkingDay) {
        theDateArray.push(moment(thecurrentMonday).format("YYYY-MM-DD"));
        thecurrentMonday = moment(thecurrentMonday).add(1, "days");
      }
      this.theWorkingDateRange = theDateArray
      return theDateArray;
    }
  }
};
</script>

<style scoped>
table {
  font-family: "Open Sans", sans-serif;
  width: 100%;
  border-collapse: collapse;
  border: 3px solid #44475c;
  margin: 10px 10px 0 10px;
}

table th {
  text-transform: uppercase;
  text-align: left;
  background: #44475c;
  color: #fff;
  padding: 8px;
  min-width: 30px;
}

table td {
  text-align: left;
  padding: 8px;
  border-right: 2px solid #7d82a8;
}
table td:last-child {
  border-right: none;
}
table tbody tr:nth-child(2n) td {
  background: #d4d8f9;
}

#workingHours{
  background-color: lightskyblue;
}

#workingHours:hover{
  cursor: pointer;
}

</style>



