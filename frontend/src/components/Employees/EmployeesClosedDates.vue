<template>
  <div>
  <b-container>
  <notifier></notifier>
  <div class="w-100 mt-5 d-flex justify-content-end">
        <b-button  v-b-modal.closedDatesForm size="lg" @click="showModal">New Closed Dates
        </b-button>
        </div>
         <b-table :items="theClosedDates" :fields="fields" hover striped    
         :sort-by.sync="sortBy"
         :sort-desc.sync="sortDesc"
         sort-icon-left responsive="sm"> 
           <template #cell(actions)="row">
             <div class="d-flex">
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
              @click="removeClosedDate(row.item._id)"
              class="mr-2"
            >
              <i class="fas fa-trash-alt"></i>
            </b-button>
             </div>
           </template>

         </b-table>
         <closedDatesForm v-if="showDelete" @clicked="onCreateEditClosedDate" :selectedClosedDateId="theClosedDateId" ></closedDatesForm>
          <confirmDalogue ref="confirmDialogue"></confirmDalogue>

  </b-container>
  </div>
</template>



<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import ClosedDatesForm from "./closedDatesForm";
import ConfirmDialogue from '@/components/Shared/ConfirmDelete.vue';
import Notifier from '@/components/Notifier.vue';


export default {
  name: "employeesClosedDates",
  components: { 
    "closedDatesForm": ClosedDatesForm,
    "confirmDalogue": ConfirmDialogue,
    "notifier": Notifier

   },
  data() {
    return {
      fields: [   
          { key: 'name', sortable: true },
          { key: 'date', sortable: true },
          { key: 'actions', sortable: false }
      ],
      theClosedDates:[],
      theClosedDateId : null,
      showDelete:false,
      theNewClosedDate:{},
      sortBy: 'date',
      sortDesc: false,
    };
  },
  mounted(){
      this.getClosedDates().finally(() => (
           this.theClosedDates = [...this.returnClosedDates()],
           this.theClosedDates.forEach(theClosedDate => {
              theClosedDate.date =  new Date(theClosedDate.date).toISOString().substring(0, 10)
          })
        ));
  },
  methods: {
     ...mapActions("closedDates", ["getClosedDates","deleteTheClosedDate"]),
     ...mapGetters("closedDates", ["returnClosedDates"]),
     ...mapMutations("closedDates", ["FIND_THE_CLOSED_DATE", "SET_CLOSED_DATES", "SET_THE_NEW_CLOSED_DATE", "SET_THE_UPDATED_CLOSED_DATE", "REMOVE_CLOSED_DATE"]),
     ...mapMutations("notification", ["notify"]),

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
       if(pTheClosedDate.isUpdated){
       pTheClosedDate.date = pTheClosedDate.date.substring(0, 10);
       this.SET_THE_UPDATED_CLOSED_DATE(pTheClosedDate);
       this.theClosedDates = this.returnClosedDates();
      } else {
      pTheClosedDate.date = pTheClosedDate.date.substring(0, 10);
      this.SET_THE_NEW_CLOSED_DATE(pTheClosedDate);
      this.theClosedDates = this.returnClosedDates();
       }
    },
    async removeClosedDate(pTheClosedDateId){
        console.log(pTheClosedDateId);
         const confirmed = await this.$refs.confirmDialogue.show({title:"Delete a closed date"})
         if(confirmed){
        this.REMOVE_CLOSED_DATE(pTheClosedDateId);
        this.theClosedDates = this.returnClosedDates();
        this.deleteTheClosedDate(pTheClosedDateId).then( response => {
           this.notify({msg:response.data.message, type:response.data.messageType})
         }) 
         //todo notify request error
      }
  }
  }
};
</script>

<style>
</style>



