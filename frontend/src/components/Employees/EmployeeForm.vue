<template>
  <div>
    <b-container>
      <b-form @submit.prevent="validateBeforeSubmit">
        <b-row>
          <b-col cols="12">
            <forms-notifier></forms-notifier>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="3">
            <b-form-group id="firstNameLabel" label="First Name:" label-for="firstNameInput">
              <b-form-input
                id="firstNameInput"
                type="text"
                placeholder="Enter your First Name"
                v-model="firstName"
                @input="$v.firstName.$touch()"
              ></b-form-input>
              <p class="text-danger" v-show="$v.firstName.$error">{{ vmsgFirstName }}</p>
            </b-form-group>
          </b-col>
          <b-col cols="3">
            <b-form-group id="lastNameLabel" label="Last Name:" label-for="lastNameInput">
              <b-form-input
                id="lastNameInput"
                type="text"
                placeholder="Enter your last name"
                v-model="lastName"
                @input="$v.lastName.$touch()"
              ></b-form-input>
              <p class="text-danger" v-show="$v.lastName.$error">{{ vmsgLastName }}</p>
            </b-form-group>
          </b-col>
          <b-col cols="6">
            <b-form-group id="staffTitleLabel" label="Staff Title:" label-for="staffTitleInput">
              <b-form-input
                id="staffTitleInput"
                type="text"
                placeholder="Add staff title"
                v-model="staffTitle"
              ></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="6">
            <b-form-group
              id="staffmobileNumberLabel"
              label="Mobile Number:"
              label-for="mobileNumberInput"
            >
              <b-form-input
                id="mobileNumberInput"
                type="text"
                placeholder="+31 6 12345678"
                v-model="mobileNumber"
                @input="$v.mobileNumber.$touch()"
              ></b-form-input>
              <p class="text-danger" v-show="$v.mobileNumber.$error">{{ vmsgMobileNumber }}</p>
            </b-form-group>
            <b-form-group id="staffEmailLabel" label="Email:" label-for="staffEmailInput">
              <b-form-input
                id="staffEmailInput"
                type="email"
                placeholder="mail@example.com"
                v-model="email"
                @input="$v.mobileNumber.$touch()"
              ></b-form-input>
              <p class="text-danger" v-show="$v.email.$error">{{ vmsgEmail }}</p>
            </b-form-group>
            <b-form-group
              id="staffAppPermissionLabel"
              label="Permissions:"
              label-for="staffAppPermisionsSelect"
            >
              <b-form-select
                v-model="thePermissionOptions.selected"
                value-field="value"
                text-field="text"
                :options="thePermissionOptions.permissionTypes"
              ></b-form-select>
            </b-form-group>
          </b-col>
          <b-col cols>
            <b-form-group id="staffNotesLabel" label="Notes:" label-for="staffNotesInput">
              <b-form-textarea
                id="textarea"
                placeholder="Add Notes..."
                rows="8"
                max-rows="8"
                v-model="notes"
              ></b-form-textarea>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="3">
            <b-form-group
              id="staffStartDateLabel"
              label="Start Date:"
              label-for="staffStartDateInput"
            >
              <b-form-datepicker locale="en" v-model="startDate"></b-form-datepicker>
            </b-form-group>
          </b-col>
          <b-col cols="3">
            <b-form-group id="staffStartEndLabel" label="End Date:" label-for="staffEndDateInput">
              <b-form-datepicker locale="en" v-model="endDate"></b-form-datepicker>
            </b-form-group>
          </b-col>
          <div class="d-flex align-items-center justify-content-between">
            <b-button size="lg" variant="primary" type="submit">Save</b-button>
            <b-button size="lg" class="ml-2">Reset</b-button>
          </div>
        </b-row>
      </b-form>
      {{ employeeId }}
    </b-container>
  </div>
</template>



<script>
import vh, {
  firstName,
  lastName,
  mobileNumber,
  email
} from "@/helpers/validators";

import FormsNotifier from "@/components/FormsNotification";
import { mapActions, mapGetters, mapMutations } from "vuex";

export default {
  name: "employeeForm",
  components: { "forms-notifier": FormsNotifier },
  props: ["modalId", "employeeId"],
  data() {
    return {
      firstName: null,
      lastName: null,
      staffTitle: null,
      mobileNumber: null,
      email: null,
      notes: null,
      selectPermissions: null,
      startDate: null,
      endDate: null,
      employee: {},
      user: {},

      thePermissionOptions: {
        selected: "basic",
        permissionTypes: [
          { value: "basic", text: "Basic" },
          { value: "low", text: "Low" },
          { value: "medium", text: "Medium" },
          { value: "high", text: "High" }
        ]
      },

      alertMessage: {
        dismissSecs: 5,
        dismissCountDown: 0,
        showDismissibleAlert: true,
        variant: null,
        message: null
      }
    };
  },
  validations: {
    firstName: vh.vrules(firstName),
    lastName: vh.vrules(lastName),
    mobileNumber: vh.vrules(mobileNumber),
    email: vh.vrules(email)
  },
  computed: {
    ...mapGetters("employees", ["returnTheEmployee"]),
    vmsgFirstName() {
      return vh.vmsg(this.$v.firstName, firstName);
    },
    vmsgLastName() {
      return vh.vmsg(this.$v.firstName, lastName);
    },
    vmsgMobileNumber() {
      return vh.vmsg(this.$v.mobileNumber, mobileNumber);
    },
    vmsgEmail() {
      return vh.vmsg(this.$v.email, email);
    }
  },
  methods: {
    ...mapMutations("notification", ["notify"]),
    ...mapActions("employees", ["getEmployee"]),

    validateBeforeSubmit() {
      this.$v.$touch();
      if (this.$v.$invalid) return;
      this.submitForm();
    },

    async submitForm() {
      const theEmployee = {
        _id: this.employeeId,
        firstName: this.firstName,
        lastName: this.lastName,
        employeeTitle: this.staffTitle,
        mobileNumber: this.mobileNumber,
        email: this.email,
        notes: this.notes,
        permissions: this.thePermissionOptions.selected,
        startDate: this.startDate,
        endDate: this.endDate
      };
      console.log(theEmployee);
      this.saveRequest(theEmployee);
    },
    saveRequest(pThemployee) {
      this.$store.dispatch("employees/addEmployee", pThemployee).then(
        response => {
          console.log(response.data);
          this.notify({
            msg: response.data.message,
            type: response.data.messageType
          });
        },
        error => {
          this.notify({
            msg: error.data.message,
            type: error.data.messageType
          });
        }
      );
    }
  },
  //todo the componet has been created before the promise
  //todo this is a hacking you need to find a way to load the componet after the promise has been resolved
  mounted() {
    console.log(this.employeeId);
    if(this.employeeId){
    this.getEmployee(this.employeeId).then(
      response => (
        (this.employee = response.data.employee),
        (this.user = response.data.user ),
        console.log(response.data),
        (this.firstName = this.employee[0].firstName),
        (this.lastName = this.employee[0].lastName),
        (this.mobileNumber = this.employee[0].mobileNumber),
        (this.notes = this.employee[0].notes),
        (this.startDate = this.employee[0].startDate),
        (this.endDate = this.employee[0].endDate),
        (this.staffTitle = this.employee[0].title),
        (this.email = this.user[0].email),
        (this.thePermissionOptions.selected = this.user[0].permissions)

      )
    );
  }
  }
};
</script>
<style>
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






