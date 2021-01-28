<template>
  <div v-if="!loading">
    <b-container>
      <div class="w-100 mt-5 d-flex justify-content-end">
        <b-button v-b-modal.addEmployeeModal @click="removeEmployeeId()" size="lg">New Staff</b-button>
        <add-employee :employeeId="employeeId"></add-employee>
      </div>
      <div>
        <b-table :items="employees" :fields="employeesTableCol" hover striped responsive="sm">
          <template #table-busy>
            <div class="text-center text-danger my-2">
              <b-spinner class="align-middle"></b-spinner>
              <strong>Loading...</strong>
            </div>
          </template>
          <template #cell(actions)="row">
            <b-button size="sm" variant="info" @click="row.toggleDetails" class="mr-2">
              <i class="fas fa-info-circle"></i>
            </b-button>
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

          <template #row-details="row">
            <b-tabs content-class="mt-3">
              <b-tab title="Details" active>
                <b-card>
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>Mobile Number:</strong>
                      {{ row.item.mobileNumber }}
                    </div>
                    <div>
                      <strong>Title:</strong>
                      {{ row.item.title }}
                    </div>
                  </div>

                  <b-row class="mt-2">
                    <b-col cols="6">
                      <strong>Start Date:</strong>
                      {{ new Date(row.item.startDate).toDateString() }}
                    </b-col>
                    <b-col cols="6" class="text-sm-right">
                      <strong>End Date:</strong>
                      {{ new Date(row.item.endDate).toDateString() }}
                    </b-col>
                  </b-row>
                </b-card>
              </b-tab>
              <b-tab title="Notes">
                <b-form-textarea id="textarea" :placeholder="row.item.notes" rows="3" max-rows="6"></b-form-textarea>
              </b-tab>
            </b-tabs>
          </template>
        </b-table>
      </div>
    </b-container>
  </div>
</template>



<script>
import AddEmployee from "./AddEmployee";
import { mapActions, mapGetters, mapMutations } from "vuex";

export default {
  name: "employeesList",
  components: { "add-employee": AddEmployee },

  data() {
    return {
      loading: false,
      employeesTableCol: ["firstName", "lastName", "actions"],
      employees: [],
      employeeId: null
    };
  },
  computed: {
    ...mapGetters("employees", ["returnTheEmployees"]),
    ...mapActions("employees", ["getAllEmployees"])
  },
  methods: {
    ...mapMutations("notification", ["notify"]),

    removeEmployee(employeeId, userId) {
      const theBody = {
        userId: userId,
        employeeId: employeeId
      };
      this.$store.dispatch("employees/removeEmployee", theBody).then(
        response => {
          this.notify({
            msg: response.data.message,
            type: response.data.messageType
          });
          this.employees = this.returnTheEmployees;
        },
        error => {
          this.notify({
            msg: error.data.message,
            type: error.data.messageType
          });
        }
      );
    },
    getEmployeeId(employeeId) {
      this.employeeId = employeeId;
    },
    removeEmployeeId() {
      this.employeeId = undefined;
    }
  },
   mounted() {
    this.getAllEmployees.finally(
      () => ((this.loading = false), (this.employees = this.returnTheEmployees))
    );
  }
};
</script>

<style>
</style>



