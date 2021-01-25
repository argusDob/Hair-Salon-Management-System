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

<style>
</style>



