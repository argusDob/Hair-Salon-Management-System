<template>
  <div v-if="scheduleForm">
    <b-modal id="addEmployeeSchedule" size="lg" :title="modalTitle" @hide="clearInputs" hide-footer>
      <forms-notifier></forms-notifier>
      <div style="text-align:center;" v-if="isTimeOverlapingMsg">
        <p class="text-danger">Dates overlapping</p>
      </div>
      <div style="position:absolute left: 50%; top:13% margin-left: -4em;">
        <b-spinner v-if="isLoading" v-bind:class="{'hideSpinner': hideSpinner}" label="Spinning"></b-spinner>
      </div>
      <b-container v-if="isDataRendered">
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
            <b-form-timepicker v-model="endTime"></b-form-timepicker>
          </b-col>
          <b-col cols="2">
            <b-form-group></b-form-group>
            <b-button class="mt-4" variant="danger" @click="onRemoveAnOtherShift">
              <i class="fas fa-minus-circle"></i>
            </b-button>
          </b-col>
        </b-row>
        <b-row class="d-flex justify-content-end mt-2">
          <b-button @click="onSubmit()">Save</b-button>
          <b-button
            v-if="typeof(theSelectedEmployeeSchedule) !== 'undefined' "
            class="ml-2"
            variant="danger"
            @click="removeTheShift()"
          >Remove</b-button>
        </b-row>
      </b-container>
    </b-modal>
  </div>
</template>

<script>
import Moment from "moment";
import { extendMoment } from "moment-range";
import { mapActions, mapMutations } from "vuex";
import FormsNotifier from "@/components/FormsNotification";

export default {
  name: "employeesScheduleForm",
  props: ["theSelectedEmployeeSchedule", "isNew", "theDate", "theEmployeeId"],
  components: { "forms-notifier": FormsNotifier },

  data() {
    return {
      startTime: null,
      startBreak: null,
      startTimeAfterBreak: null,
      endTime: null,
      addAnotherShift: false,
      isTimeOverlapingMsg: false,
      modalTitle: null,
      isLoading: true,
      isDataRendered: false,
      hideSpinner: false,
      isActive: false,
      theScheduleDate: null,
      scheduleForm: true
    };
  },
  watch: {
    theSelectedEmployeeSchedule: function() {
      this.hideSpinner = false;
      if (!this.isNew) {
        console.log(this.theSelectedEmployeeSchedule);
        if (typeof this.theSelectedEmployeeSchedule !== "undefined") {
          this.fillInInputs(this.theSelectedEmployeeSchedule);
          this.renderMyModal();
        }
      } else {
        this.renderMyModal();
      }
    }
  },
  mounted() {
    if (this.isNew) {
      this.renderMyModal();
    }
  },
  methods: {
    ...mapActions("employeesScheduleList", [
      "addEmployeeSchedule",
      "deleteEmployeeSchedule"
    ]),
    ...mapMutations("formsNotifier", ["formsNotify"]),

    onAddAnotherShift() {
      this.addAnotherShift = true;
      this.formatTimeDate();
    },
    onRemoveAnOtherShift() {
      this.addAnotherShift = false;
    },
    formatTimeDate() {
      const breakStartTime = this.startBreak;
      const day = this.theDate.split("-")[0];
      const month = this.theDate.split("-")[1];
      const years = this.theDate.split("-")[2];
      const theSelectedDate = years + "/" + month + "/" + day;
      const getTimeAfterBreak = new Date(
        theSelectedDate + " " + breakStartTime
      ).getTime();
      this.brakeStartTime = new Date(theSelectedDate + " " + breakStartTime);
      const startTimeAfterBreak = new Date(getTimeAfterBreak + 3600000);
      const getTheStartTimeAfterTheBrake = new Date(
        startTimeAfterBreak.getTime()
      );
      this.getOneHourBrake(getTheStartTimeAfterTheBrake);
    },
    getOneHourBrake(pGetTheStartTimeAfterTheBrake) {
      const hours =
        (pGetTheStartTimeAfterTheBrake.getHours() < 10 ? "0" : "") +
        pGetTheStartTimeAfterTheBrake.getHours();
      const minutes =
        (pGetTheStartTimeAfterTheBrake.getMinutes() < 10 ? "0" : "") +
        pGetTheStartTimeAfterTheBrake.getMinutes();
      const seconds =
        (pGetTheStartTimeAfterTheBrake.getSeconds() < 10 ? "0" : "") +
        pGetTheStartTimeAfterTheBrake.getSeconds();
      console.log(hours);
      this.startTimeAfterBreak = hours + ":" + minutes + ":" + seconds;
    },
    isTimeRangeOverlap() {
      const moment = extendMoment(Moment);
      let isOverlap = false;
      if (
        this.startTime !== null ||
        this.startBreak !== null ||
        this.startTimeAfterBreak !== null ||
        this.endTime !== null
      ) {
        const range = moment.range(
          moment(
            this.startTime.substring(0, this.startTime.length - 3),
            "HH:mm"
          ),
          moment(
            this.startBreak.substring(0, this.startBreak.length - 3),
            "HH:mm"
          )
        );
        const range2 = moment.range(
          moment(
            this.startTimeAfterBreak.substring(
              0,
              this.startTimeAfterBreak.length - 3
            ),
            "HH:mm"
          ),
          moment(this.endTime.substring(0, this.endTime.length - 3), "HH:mm")
        );
        if (
          range.overlaps(range2) ||
          range2.overlaps(range) ||
          range.adjacent(range2) ||
          range2.adjacent(range)
        ) {
          isOverlap = true;
          return isOverlap;
        }
      }
      return isOverlap;
    },
    getValidDateFormat(pTheDate) {
      const day = pTheDate.split("-")[0];
      const month = pTheDate.split("-")[1];
      const years = pTheDate.split("-")[2];
      return years + "/" + month + "/" + day;
    },
    clearInputs() {
      this.startTime = "";
      this.modalTitle = "";
      this.isLoading = false;
      this.isDataRendered = false;
      this.scheduleForm = false;
      this.$router.go("Employee");
    },
    renderMyModal() {
      this.theScheduleDate = this.date;
      this.isLoading = false;
      this.isDataRendered = true;
    },
    fillInInputs(ptheSelectedEmployeeSchedule) {
      this.startTime = ptheSelectedEmployeeSchedule.startTime.replace(".", ":");
      if (typeof ptheSelectedEmployeeSchedule.breakStartTime !== "undefined") {
        this.startBreak = ptheSelectedEmployeeSchedule.breakStartTime.replace(
          ".",
          ":"
        );
      }
      if (typeof ptheSelectedEmployeeSchedule.breakEndTime !== "undefined") {
        this.startTimeAfterBreak = ptheSelectedEmployeeSchedule.breakEndTime.replace(
          ".",
          ":"
        );
      }
      this.endTime = ptheSelectedEmployeeSchedule.endTime.replace(".", ":");
      this.modalTitle =
        "Edit" +
        " " +
        ptheSelectedEmployeeSchedule.firstName +
        "'s" +
        " " +
        "schedule";
    },
    onSubmit() {
      const theDate = this.getValidDateFormat(this.theDate);
      const theSchedule = {
        _id: this.theEmployeeId,
        startTime: this.startTime,
        breakStartTime: this.startBreak,
        breakEndTime: this.startTimeAfterBreak,
        endTime: this.endTime,
        date: theDate,
        isHolidays: "false",
        name: "null"
      };
      console.log(theSchedule);
      const test = this.isTimeRangeOverlap();
      console.log(test);
      //update
      if (!this.isTimeRangeOverlap()) {
        if (typeof this.theSelectedEmployeeSchedule !== "undefined") {
          theSchedule.theSelectedWorkingScheduleId = this.theSelectedEmployeeSchedule.employeeSchedule_id;
          this.saveOrUpdateRequest(theSchedule);
          this.isTimeOverlapingMsg = false;
          //add
        } else {
          this.saveOrUpdateRequest(theSchedule);
          this.isTimeOverlapingMsg = false;
        }
      } else {
        this.isTimeOverlapingMsg = true;
      }
    },
    removeTheShift() {
      const theEmployeeId = this.theEmployeeId;
      const theSelectedWorkingScheduleId = this.theSelectedEmployeeSchedule
        .employeeSchedule_id;
      this.deleteRequest(theEmployeeId, theSelectedWorkingScheduleId);
    },
    saveOrUpdateRequest(pSchedule) {
      this.addEmployeeSchedule(pSchedule).then(
        response => {
          this.formsNotify({
            msg: response.data.message,
            type: response.data.messageType
          });
        },
        error => {
          this.formsNotify({
            msg: error.data.message,
            type: error.data.messageType
          });
        }
      );
    },
    deleteRequest(pTheEmployeeId, pTheSelectedWorkingScheduleId) {
      this.deleteEmployeeSchedule(
        pTheEmployeeId + pTheSelectedWorkingScheduleId
      ).then(
        response => {
          this.formsNotify({
            msg: response.data.message,
            type: response.data.messageType
          });
        },
        error => {
          this.formsNotify({
            msg: error.data.message,
            type: error.data.messageType
          });
        }
      );
    }
  }
};
</script>

<style scoped>
.showSpinner {
  display: block;
}

.hideSpinner {
  display: none;
}
</style>
