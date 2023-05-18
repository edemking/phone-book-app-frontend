<script>
import { usePostsStore } from '../stores/posts';
import { onMounted, inject, reactive, computed } from 'vue';
import { useToast } from "vue-toastification";
import useVuelidate from '@vuelidate/core'
import { required, maxLength, minLength, numeric } from '@vuelidate/validators'

// const axios = inject('axios')

export default {
  setup() {
    // Get toast interface
    const toast = useToast();

    return { toast, v$: useVuelidate() }
  },
  data() {
    return {
      modal: false,
      isEdit: false,
      isProcessing: false,
      keyword: "",
      contacts: [],
      contact: {
        first_name: "",
        last_name: "",
        phone_number: ""
      }
    }
  },
  validations() {
    return {
      contact: {
        first_name: { required },
        last_name: { required },
        phone_number: { required, min: minLength(9), max: maxLength(12), numeric }
      }
    }
  },
  mounted() {
    this.fetchContacts()
  },
  computed: {
    filteredContacts() {
      return this.contacts.filter((item) => {
        return (
          item.last_name
            .toLowerCase()
            .includes(this.keyword)
        );
      });
    },
  },
  methods: {
    toggleModal() {
      // if (modal) {
      this.modal = !this.modal
      // }
    },
    assignContact(cont) {
      this.isEdit = true
      this.contact = cont
      this.toggleModal()
    },
    clearContact() {
      this.isEdit = false
      this.contact = {
        first_name: "",
        last_name: "",
        phone_number: ""
      }
    },
    saveContact() {
      let _ = this
      this.isProcessing = true
      this.axios.post("api/contacts", this.contact)
        .then((response) => {
          _.fetchContacts()
          _.toggleModal()
          _.toast.success("Success", {
            timeout: 3000
          });
          _.isProcessing = false
        })
        .catch((error) => {
          _.toast.error(error.data, {
            timeout: 3000
          });
          _.isProcessing = false
        })
    },
    saveChanges() {
      let _ = this
      this.isProcessing = true
      this.axios.put("api/contacts/" + this.contact.id, this.contact)
        .then((response) => {
          _.fetchContacts()
          _.toggleModal()
          _.toast.success("Success", {
            timeout: 3000
          });
          _.isProcessing = false
        })
        .catch((error) => {
          _.toast.error(error.data, {
            timeout: 3000
          });
          _.isProcessing = false
        })
    },
    deleteContact(cont) {
      let _ = this
      this.isProcessing = true
      this.axios.delete("api/contacts/" + cont.id)
        .then((response) => {
          _.contacts.splice(_.contacts.indexOf(cont), 1)
          _.toast.info("Deleted", {
            timeout: 3000
          });
          _.isProcessing = false
        })
        .catch((error) => {
          _.toast.error(error.data, {
            timeout: 3000
          });
          _.isProcessing = false
        })
    },
    fetchContacts() {
      let _ = this
      this.isProcessing = true
      this.axios.get("api/contacts")
        .then((response) => {
          _.clearContact()
          _.contacts = response.data
          _.isProcessing = false
        })
        .catch((error) => {
          _.toast.success(error.data, {
            timeout: 3000
          });
          _.isProcessing = false
        })
    },
    closeModal(target) {
      /* eslint-disable */
      $(target).modal("hide");
      /* eslint-enable */
    },
  }
}


</script>

<template>
  <div>
    <!-- Modal -->
    <div v-show="modal" class="modal fade" id="contactModal" tabindex="-1" aria-labelledby="exampleModalLabel"
      aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Contact Modal</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="form-group mb-3" :class="{ error: v$.contact.first_name.$errors.length }">
              <label for="firstName" class="form-label">First Name</label>
              <input v-model="contact.first_name" type="text" class="form-control" id="firstName">
              <div class="input-errors" v-for="(error, index) of v$.contact.first_name.$errors" :key="index">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </div>
            <div class="form-group mb-3" :class="{ error: v$.contact.last_name.$errors.length }">
              <label for="lastName" class="form-label">Last Name</label>
              <input v-model="contact.last_name" type="text" class="form-control" id="lastName">
              <div class="input-errors" v-for="(error, index) of v$.contact.last_name.$errors" :key="index">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </div>
            <div class="form-group mb-3" :class="{ error: v$.contact.phone_number.$errors.length }">
              <label for="phoneNumber" class="form-label">Phone Number</label>
              <input v-model="contact.phone_number" maxlength="12" type="text" class="form-control" id="phoneNumber">
              <div class="input-errors" v-for="(error, index) of v$.contact.phone_number.$errors" :key="index">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button v-if="isEdit" :disabled="v$.contact.$invalid" @click="saveChanges" type="button"
              class="btn btn-primary">Save Changes</button>
            <button v-else :disabled="v$.contact.$invalid" @click="saveContact" type="button" class="btn btn-success">Save
              Contact</button>
          </div>
        </div>
      </div>
    </div>
    <div class="container w-100">
      <div class="row mb-4">
        <div class="col-sm-6">
          <h3>Contacts</h3>
        </div>
        <div class="col-sm-6 text-right">
          <button @click="clearContact()" data-bs-toggle="modal" data-bs-target="#contactModal" data-backdrop="false"
            class="btn btn-primary"><font-awesome-icon icon="add" />&nbsp;Add Contact</button>
        </div>
      </div>
      <div class="row mb-4">
        <div class="col-md-12">
          <input type="search" v-model="keyword" name="" id="" placeholder="Search contact by last name"
            class="form-control">
        </div>
      </div>
      <div class="row">
        <div class="col-md-12 text-center">
          <div class="spinner-border" v-if="isProcessing" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <div class="col-md-12">
          <ol class="list-group">
            <li v-for="(c, i) in filteredContacts" :key="i"
              class="list-group-item d-flex justify-content-between align-items-start py-3">
              <div class="ms-2 me-auto">
                <div class="fw-bold">
                  <h3><a href="#" @click="assignContact(c)" data-bs-toggle="modal" data-bs-target="#contactModal"
                      data-backdrop="false">{{
                        `${c.first_name} ${c.last_name}` }}</a></h3>
                </div>
                <small class="text-muted"><font-awesome-icon icon="phone" /> {{ `${c.phone_number}` }}</small>
              </div>
              <button @click="deleteContact(c)" class="btn btn-danger btn-sm"><font-awesome-icon icon="trash" /></button>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {

  .greetings h1,
  .greetings h3 {
    text-align: left;
  }

}

.modal-backdrop {
  background-color: transparent;
  display: none;
}
</style>
