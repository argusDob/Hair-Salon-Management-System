<template>
  <div>
     <b-modal  id="closedDatesForm" title="ClosedDates"  size="lg" @show="onOpenModel" @hide="closeModal" hide-footer>
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
    theSelectedClosedDate:null,
    isOverlap : false
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
       ...mapMutations("closedDates", ["REMOVE_SELECTED_CLOSED_DATE"]),
        ...mapGetters("closedDates", ["returnTheSelectedClosedDate", "returnClosedDates"]),

    formatDatePickerDate(pDate){
    const day = new Date(pDate).getDate();
    const month = new Date(pDate).getMonth() + 1;
    const year = new Date(pDate).getFullYear();
    return  year + "-" + month + "-" + day

    },
    onOpenModel(){
    this.theSelectedClosedDate = this.returnTheSelectedClosedDate();
    if(typeof(this.theSelectedClosedDate[0]) !== "undefined"){
    this.name = this.theSelectedClosedDate[0].name;
    const theFormattedDate = this.formatDatePickerDate(this.theSelectedClosedDate[0].date);
    this.date = theFormattedDate;
    }

     },
    closeModal(){
      this.REMOVE_SELECTED_CLOSED_DATE();
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
    let theSelectedClosedDateId = ""
    if(typeof(this.theSelectedClosedDate[0]) !== "undefined"){ theSelectedClosedDateId =  this.theSelectedClosedDate[0]._id }
    this.checkOverlapClosedDates(this.date, theSelectedClosedDateId);
    if(this.isOverlap) { 
      return;
    } else {
    if(typeof(this.theSelectedClosedDate[0]) !== "undefined"){ 
      theClosedDates._id = this.theSelectedClosedDate[0]._id;
      this.saveRequest(theClosedDates);
     } else {
       this.saveRequest(theClosedDates);
      }    
    }
      },
     saveRequest(pClosedDates){
        this.addClosedDates(pClosedDates).then( response => {
          console.log(response.data.theClosedDate);
          this.$emit('clicked', response.data.theClosedDate);
          this.formsNotify({ msg: response.data.message, type: response.data.messageType });
        },
        error => {  
          this.formsNotify({ msg: error.data.message, type: error.data.messageType });
        }
      );
     },
     checkOverlapClosedDates(pDate, pTheSelectedClosedId){
       console.log(pTheSelectedClosedId);
      const theClosedDates =  this.returnClosedDates();
      console.log("I am here");
      theClosedDates.forEach(closedDate => {
        if(new Date(closedDate.date).toISOString().substring(0, 10) === pDate){
            this.formsNotify({ msg: "The closed date is already booked", type: "warning" }) 
            this.isOverlap = true;
        } 
        // if((pTheSelectedClosedId !== "") && (new Date(closedDate.date).toISOString().substring(0, 10) === pDate)){
        //       console.log("I am here")
        //       this.isOverlap = false;
        // }
      });
        return this.isOverlap;
     }
  }
};
</script>

<style>
</style>



//Same dates
//Edit Name
//Edit Name + Date