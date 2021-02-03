<template>
  <div>
  <b-container>
  <div class="w-100 mt-5 d-flex justify-content-end">
        <b-button  v-b-modal.closedDatesForm size="lg" @click="showModal">New Closed Dates
        </b-button>
        </div>
         <b-table :items="theClosedDates" :fields="fields" hover striped responsive="sm"> 
           <template #cell(actions)="row">
                <b-button
              size="sm"
              variant="success"
              v-b-modal.closedDatesForm
               @click="getClosedDateId(row.item._id)"
              class="mr-2"
            >
              <i class="fas fa-edit"></i>
            </b-button>
            <b-button
              size="sm"
              :id="row.item._id"
              variant="danger"
              @click="removeEmployee(row.item._id, row.item.userRefs)"
              class="mr-2"
            >
              <i class="fas fa-trash-alt"></i>
            </b-button>
           </template>

         </b-table>
         <closedDatesForm v-if="showDelete" @clicked="onCreateEditClosedDate" :selectedClosedDateId="theClosedDateId" ></closedDatesForm>
  </b-container>
  </div>
</template>



<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import ClosedDatesForm from "./closedDatesForm";

export default {
  name: "employeesClosedDates",
  components: { "closedDatesForm": ClosedDatesForm },

  

  data() {
    return {
      fields: ['name', 'date', 'actions'],
      theClosedDates:[],
      theClosedDateId : null,
      showDelete:false,
      theNewClosedDate:{},
    };
  },

  computed: {
  },
  mounted(){
      this.getClosedDates().finally(() => (
         this.theClosedDates =  this.returnClosedDates
        ));
  },
  methods: {
     ...mapActions("closedDates", ["getClosedDates"]),
     ...mapGetters("closedDates", ["returnClosedDates"]),
      ...mapMutations("closedDates", ["FIND_THE_CLOSED_DATE", "SET_CLOSED_DATES", "SET_THE_NEW_CLOSED_DATE", "SET_THE_UPDATED_CLOSED_DATE"]),


     getClosedDateId(pId){
       this.FIND_THE_CLOSED_DATE({ closedDates:this.returnClosedDates(), theSelectedClosedDateId:pId })
       this.showDelete = true;
     },
     getTheSectedClosedDate(){
       this.FIND_THE_CLOSED_DATE({ closedDates:this.returnClosedDates(), theSelectedClosedDateId:this.selectedClosedDateId })

     },
     showModal(){
      this.showDelete = true;

     },
      onCreateEditClosedDate (pTheClosedDate) {
      if(typeof(pTheClosedDate._id) === "undefined"){
       this.SET_THE_NEW_CLOSED_DATE(pTheClosedDate);
       this.theClosedDates = this.returnClosedDates();
      } else {
      this.SET_THE_UPDATED_CLOSED_DATE(pTheClosedDate);
      }
    },
  }
};
</script>

<style>
</style>



