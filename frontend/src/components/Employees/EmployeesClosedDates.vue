<template>
  <div>
  <b-container>
  <div class="w-100 mt-5 d-flex justify-content-end">
        <b-button size="lg">New Closed Dates
        </b-button>
        </div>
         <b-table :items="theClosedDates" :fields="fields" hover striped responsive="sm">
          <template #table-busy>
            <div class="text-center text-danger my-2">
              <b-spinner class="align-middle"></b-spinner>
              <strong>Loading...</strong>
            </div>
          </template>         
           <template #cell(actions)="row">
                <b-button
              size="sm"
              variant="success"
              v-b-modal.addEmployeeModal
              @click="getEmployeeId(row.item._id)"
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
  </b-container>
  </div>
</template>



<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "employeesClosedDates",
  

  data() {
    return {
      fields: ['name', 'date', 'actions'],
      theClosedDates:[]
    };
  },

  computed: {
        ...mapGetters("employeesScheduleList", ["returnTheClosedDates"])

  
  },
  mounted(){
      this.getClodedDates().finally(() => (
         this.theClosedDates =  this.returnTheClosedDates 
        ));
  },
  methods: {
     ...mapActions("employeesScheduleList", ["getClodedDates"]),

  }
};
</script>

<style>
</style>



