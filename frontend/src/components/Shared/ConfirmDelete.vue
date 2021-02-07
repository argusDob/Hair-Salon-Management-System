
<template>
    <popup-modal ref="popup">
      <div class="d-flex justify-content-center align-items-center flex-column">
      <i class="fas fa-exclamation-triangle fa-5x" style="color:orange;"></i><br>
      <p><strong>This action is irreversible.</strong></p>
      <p>Are you sure you want to continue?</p>
      </div>
        <div class="d-flex justify-content-around">
        <b-button variant="success" @click="confirm()">Confirm</b-button>
        <b-button variant="danger"  @click="cancel()">Cancel</b-button>
        </div>
        </popup-modal>
</template>

<script>
import PopupModal from './Modal.vue'

export default {
    name: 'ConfirmDialogue',

    components: { PopupModal },

 data() {  
        return{      // Parameters that change depending on the type of dialogue
        title: undefined,
        
        // Private variables
        resolvePromise: undefined,
        rejectPromise: undefined,
        }
    },

    methods: {
        show(opts = {}) {
            this.title = opts.title
            // Once we set our config, we tell the popup modal to open
            this.$refs.popup.open(this.title)
            // Return promise so the caller can get results
            return new Promise((resolve, reject) => {
                this.resolvePromise = resolve
                this.rejectPromise = reject
            })
        },

        confirm() {
            this.$refs.popup.close()
            this.resolvePromise(true)
        },

        cancel() {
            this.$refs.popup.close()
            this.resolvePromise(false)
            // Or you can throw an error
            // this.rejectPromise(new Error('User cancelled the dialogue'))
        },
    },
}
</script>