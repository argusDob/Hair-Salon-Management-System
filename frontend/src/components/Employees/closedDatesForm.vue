<template>
  <div>
     <b-modal  id="closedDatesForm" title="ClosedDates"  size="lg" @show="onOpenModel" hide-footer>
     <forms-notifier></forms-notifier>
     <b-form @submit.prevent="validateBeforeSubmit">
       <b-row>
          <b-col cols="6">
            <b-form-group id="closedDateName" label="Name:" label-for="firstNameInput">
            <b-form-input
                id="closedDateName"
                type="text"
                placeholder="Enter the Name"
                @input="$v.name.$touch()"
                v-model="name"
              ></b-form-input>
              <p class="text-danger" v-show="$v.name.$error">{{ vmsgName }}</p>
          </b-form-group>
          </b-col>
          <b-col cols="6">
                      {{selectedClosedDateId}}

            <b-form-group id="closedDate" label="Last Name:" label-for="lastNameInput">
            <b-form-datepicker id="closedDate" @input="$v.date.$touch()" v-model="date" class="mb-2"></b-form-datepicker>
            <p class="text-danger" v-show="$v.date.$error">{{ vmsgDate }}</p>
          </b-form-group>
          </b-col>
        </b-row>
           <div class="d-flex align-items-center justify-content-between">
            <b-button size="lg" variant="primary" type="submit">Save</b-button>
            <b-button size="lg" class="ml-2">Reset</b-button>
          </div>
     </b-form>
  </b-modal>
  </div>
</template>



<script>
import { mapActions, mapMutations, mapGetters } from "vuex";
import FormsNotifier from "@/components/FormsNotification";

import vh, {
  name,
  date,
} from "@/helpers/validators";

export default {
  name: "closedDates",
  components: { "forms-notifier": FormsNotifier },
  props:["selectedClosedDateId"],
  data() {
    return {
    name:null,
    date:null,
    theSelectedClosedDate:null
    };
  },
    validations: {
    name: vh.vrules(name),
    date: vh.vrules(date),
  },
  computed:{
      vmsgName() {
      return vh.vmsg(this.$v.name, name);
    },
      vmsgDate() {
      return vh.vmsg(this.$v.date, date);
    },
  },
  mounted(){

    // const theFormattedDate = this.formatDatePickerDate(this.theSelectedClosedDate[0].date)
    // console.log(theFormattedDate)
    // this.date = theFormattedDate
  },

  methods: {
       ...mapActions("closedDates", ["addClosedDates"]),
       ...mapMutations("formsNotifier", ["formsNotify"]),
       ...mapGetters("closedDates", ["returnTheSelectedClosedDate"]),

    formatDatePickerDate(pDate){
    const day = new Date(pDate).getDate();
    const month = new Date(pDate).getMonth() + 1;
    const year = new Date(pDate).getFullYear();
    console.log(day)
    return  year + "-" + month + "-" + day

    },
    onOpenModel(){
    this.theSelectedClosedDate = this.returnTheSelectedClosedDate();
    if(typeof(this.theSelectedClosedDate[0]) !== "undefined"){
    this.name = this.theSelectedClosedDate[0].name
    const theFormattedDate = this.formatDatePickerDate(this.theSelectedClosedDate[0].date)
    this.date = theFormattedDate
    }
     },
    validateBeforeSubmit() {
      this.$v.$touch();
      if (this.$v.$invalid) return;
      this.submitForm();
    },
    submitForm(){
        const theClosedDates = {
      isHolidays: "true",
      startTime: "null",
      breakStartTime : "null",
      breakEndTime:"null",
      endTime:"null",
      name:this.name,
      date: this.date
    }
    if(typeof(this.theSelectedClosedDate[0]._id) !== "undefined"){ 
      theClosedDates._id = this.theSelectedClosedDate[0]._id;
      this.saveRequest(theClosedDates)
  
      }
     else {
      this.$emit('clicked', theClosedDates);
      this.saveRequest(theClosedDates)

     }
     },
     saveRequest(pClosedDates){
        this.addClosedDates(pClosedDates).then( response => {
          this.formsNotify({ msg: response.data.message, type: response.data.messageType });
        },
        error => 
        {  this.formsNotify({ msg: error.data.message, type: error.data.messageType });
        }
      );
     }

  }
};
</script>

<style>
</style>



