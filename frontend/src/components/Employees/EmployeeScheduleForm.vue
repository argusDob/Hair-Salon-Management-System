<template>
  <div>
    <b-modal id="addEmployeeSchedule" size="lg" title="Edit Employee Schedule" hide-footer>
      <b-container>
        <b-row>
          <b-col cols="6">
            <b-form-group label="Start Time"></b-form-group>
            <b-form-timepicker v-model="startTime"></b-form-timepicker>
          </b-col>
          <b-col cols="6">
            <b-form-group label="EndTime"></b-form-group>
            <b-form-timepicker v-model="startBreak"></b-form-timepicker>
          </b-col>
        </b-row>
        <b-row>
          <b-col class="mt-3" cols="6">
            <b-button
              v-if="!addAnotherShift"
              variant="outline-primary"
              @click="onAddAnotherShift"
            >Add another Shift</b-button>
          </b-col>
        </b-row>
        <b-row
          class="d-flex align-items-center justify-content-center mt-2 mb-2"
          v-if="addAnotherShift"
        >
          <b-col cols="5">
            <b-form-group label="Start Time"></b-form-group>
            <b-form-timepicker v-model="startTimeAfterBreak"></b-form-timepicker>
          </b-col>
          <b-col cols="5">
            <b-form-group label="EndTime"></b-form-group>
            <b-form-timepicker v-model="endTimeAfterBreak"></b-form-timepicker>
          </b-col>
          <b-col cols="2">
            <b-form-group></b-form-group>
            <b-button class="mt-4" variant="danger" @click="onRemoveAnOtherShift">
              <i class="fas fa-minus-circle"></i>
            </b-button>
          </b-col>
        </b-row>
        <b-row class="d-flex justify-content-between mt-2">
        <div v-if="isTimeOverlaping"><p class="text-danger">Dates overlapping</p></div>
          <b-button @click="save()">Save</b-button>
        </b-row>
      </b-container>
    </b-modal>
  </div>
</template>



<script>
import Moment from 'moment';
import { extendMoment } from 'moment-range';


export default {
  name: "employeesScheduleForm",
  props: ["theScheduleDate"],

  data() {
    return {
      startTime: null,
      startBreak: null,
      startTimeAfterBreak: null,
      endTimeAfterBreak: null,
      addAnotherShift: false,
      isTimeOverlaping: false, 
      employees: []
    };
  },


  methods: {
    onAddAnotherShift() {
      this.addAnotherShift = true;
      this.formatTimeDate();
    },
    onRemoveAnOtherShift() {
      this.addAnotherShift = false;
    },
    formatTimeDate() {
      const breakStartTime = this.startBreak;
      const day = this.theScheduleDate.split("-")[0];
      const month = this.theScheduleDate.split("-")[1];
      const years = this.theScheduleDate.split("-")[2];
      const theSelectedDate = years + "/" + month + "/" + day;
      const getTimeAfterBreak =  new Date(theSelectedDate + " " + breakStartTime).getTime()
      this.brakeStartTime =  new Date(theSelectedDate + " " + breakStartTime);
      const startTimeAfterBreak = new Date(getTimeAfterBreak + 3600000);
      console.log(getTimeAfterBreak);
      const getTheStartTimeAfterTheBrake = new Date(startTimeAfterBreak.getTime());
      this.fillInTimePicker(getTheStartTimeAfterTheBrake)
    },
      fillInTimePicker(pGetTheStartTimeAfterTheBrake){
        const hours = (pGetTheStartTimeAfterTheBrake.getHours()<10?'0':'') + pGetTheStartTimeAfterTheBrake.getHours();
        const minutes = (pGetTheStartTimeAfterTheBrake.getMinutes()<10?'0':'') + pGetTheStartTimeAfterTheBrake.getMinutes();
        const seconds = (pGetTheStartTimeAfterTheBrake.getSeconds()<10?'0':'') + pGetTheStartTimeAfterTheBrake.getSeconds();
         this.startTimeAfterBreak = hours + ":" + minutes + ":" + seconds
         

    },
    isTimeRangeOverlap(){
    const moment = extendMoment(Moment);

    let isOverlap = false;   
    if( this.startTime !== null || this.startBreak !== null || this.startTimeAfterBreak !== null || this.endTimeAfterBreak !== null ){
    const range = moment.range( moment(this.startTime.substring(0, this.startTime.length - 3), 'HH:mm'),  moment(this.startBreak.substring(0, this.startBreak.length - 3), 'HH:mm'))
    const range2 = moment.range( moment(this.startTimeAfterBreak.substring(0, this.startTimeAfterBreak.length - 3), 'HH:mm'),  moment(this.endTimeAfterBreak.substring(0, this.endTimeAfterBreak.length - 3), 'HH:mm'))
    if((range.overlaps(range2)) || range2.overlaps(range) || range.adjacent(range2) || range2.adjacent(range)){ 
      isOverlap = true 
      return isOverlap;
      }
    }
      return isOverlap;

    },
    save(){
          
    if( this.startTime !== null || this.startBreak !== null || this.startTimeAfterBreak !== null || this.endTimeAfterBreak !== null ){ 
        if(!this.isTimeRangeOverlap()){
            console.log("ok");

        } else { this.isTimeOverlaping = true; }
    }
    
          

        






      // console.log(this.startTime.substring(0, this.startTime.length - 3));
      // console.log(this.startBreak.substring(0, this.startBreak.length - 3));
      // console.log(this.startTimeAfterBreak.substring(0, this.startTimeAfterBreak.length - 3))
      // console.log(this.endTimeAfterBreak.substring(0, this.endTimeAfterBreak.length - 3));


    // const range = moment.range( moment(this.startTime.substring(0, this.startTime.length - 3), 'HH:mm'),  moment(this.startBreak.substring(0, this.startBreak.length - 3), 'HH:mm'))
    // const range2 = moment.range( moment(this.startTimeAfterBreak.substring(0, this.startTimeAfterBreak.length - 3), 'HH:mm'),  moment(this.endTimeAfterBreak.substring(0, this.endTimeAfterBreak.length - 3), 'HH:mm'))
    //   console.log(range.overlaps(range2))
    //   console.log(range2.overlaps(range))
    //   console.log(range.adjacent(range2))
    //         console.log(range2.adjacent(range))

   

      


      // const day = this.theScheduleDate.split("-")[0];
      // const month = this.theScheduleDate.split("-")[1];
      // const years = this.theScheduleDate.split("-")[2];
      // const theSelectedDate = years + "/" + month + "/" + day;
      // console.log(theSelectedDate);
      



    }
  },



};
</script>

<style scoped>
</style>



