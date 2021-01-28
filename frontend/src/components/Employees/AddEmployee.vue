<template>
  <div>
    <b-modal modal-class="modal-fullscreen" id="addEmployeeModal" title="New Staff" hide-footer>
      <b-tabs content-class="mt-3">
        <b-tab title="Details" active>
              <employee-form :employeeId="employeeId" modalId = "addEmployeeModal"></employee-form>
        </b-tab>
        <b-tab title="Services">
          <p>I'm the second tab</p>
        </b-tab>
      </b-tabs>
    </b-modal>
  </div>
</template>



<script>
import EmployeeForm from "./EmployeeForm";

export default {
  
  name: "addEmployee",
  components: { "employee-form": EmployeeForm},
  props: ["employeeId"],
  data() {
    return {
    };
  },

  computed: {},
  methods: {},
  created(){
  }
};
</script>

<style scoped>
.modal-fullscreen .modal-dialog {
  max-width: 100%;
  margin: 0;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100vh;
  display: flex;
  position: fixed;
  z-index: 100000;
  max-width: 100%;
}
</style>



