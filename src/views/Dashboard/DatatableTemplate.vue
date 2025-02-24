<template>
  <div class="py-4 container-fluid">
    <h1>Company</h1>
    <div class="card">
      <data-table :index="false" :data="g$list" :columns="dt.column" :actions="dt.action" @detail="triggerDetail"
        @delete="triggerDelete" />
    </div>

    <modal-comp v-model:show="modal.add">
      <template #header>
        <h3 class="modal-title">Add New {{ pageTitle }}</h3>
      </template>
      <template v-if="modal.add" #body>
        <div class="row">
          <div class="col-12">
            <argon-input v-model="input.name" type="text" placeholder="Name" name="name" size="md"></argon-input>
          </div>
        </div>
      </template>
      <template #footer>
        <argon-button color="secondary" @click="modal.add = false">
          Close
        </argon-button>
        <argon-button color="primary" @click="addInquiry()">
          Save Changes
        </argon-button>
      </template>
    </modal-comp>
    <modal-comp v-model:show="modal.detail">
      <template #header>
        <h3 class="modal-title">{{ pageTitle }} Details</h3>
      </template>

      <!-- buat ngerubah detail -->
      <template v-if="modal.detail" #body>
        <div class="row">
          <div class="col-12">
            <argon-input v-model="input.username" type="text" placeholder="Name" name="name" size="md"></argon-input>
          </div>
        </div>
        <!-- <div class="row">
          <div class="col-12">
            <argon-input v-model="input.address" type="text" placeholder="Name" name="name" size="md"></argon-input>
          </div>
        </div> -->
      </template>
      <template #footer>
        <argon-button color="secondary" @click="modal.detail = false">
          Close
        </argon-button>
        <argon-button color="primary" @click="editInquiry()">
          Save Changes
        </argon-button>
      </template>
    </modal-comp>
    <modal-comp v-model:show="modal.confirm">
      <template #header>
        <h3 class="modal-title">Confirm</h3>
      </template>
      <template v-if="modal.confirm" #body>
        <p>
          Are you sure you want to delete <strong>{{ pageTitle }}: {{ input.name }}</strong>?
        </p>
      </template>
      <template #footer>
        <argon-button color="secondary" @click="modal.confirm = false">
          Close
        </argon-button>
        <argon-button color="danger" @click="delInquiry()">Delete</argon-button>
      </template>
    </modal-comp>
  </div>
</template>

<script>
import { mapActions, mapState } from 'pinia';
import d$company from '@/stores/dashboard/company';

export default {
  name: 'Company',
  data: () => ({
    pageTitle: 'Company',
    // Input
    input: {
      id: null,
      name: '',
    },
    // DataTable
    dt: {
      column: [
        {
          name: 'id',
          th: 'no',
        },
        {
          name: 'name',
          th: 'Name',
        },
        {
          name: 'address',
          th: 'address',
        },
        {
          name: 'phone',
          th: 'phone',
        },
      ],
      action: [
        {
          text: 'Detail',
          color: 'info',
          event: 'detail',
        },
        {
          text: 'Delete',
          color: 'danger',
          event: 'delete',
        },
      ],
    },
    // UI
    modal: {
      add: false,
      detail: false,
      confirm: false,
    },
  }),
  computed: {
    ...mapState(d$company, ['g$list', 'g$detail']),
    modals() {
      return Object.values(this.modal).includes(true);
    }
  },
  async mounted() {
    await this.a$inquiryList();
  },
  methods: {
    ...mapActions(d$company, ['a$inquiryList', 'a$inquiryEdit', 'a$inquiryDelete', 'a$inquiryDetail']),

    clear() {
      this.input = {
        id: null,
        name: '',
      };
    },

    async init() {
      try {
        await this.a$inquiryList();
      } catch (e) {
        console.error(e);
      }
    },

    async addInquiry() {
      try {
        const { name } = this.input;
        const data = {
          name,
        };
        await this.a$inquiryAdd(data);
        this.modal.add = false;
        console.log(`Add ${this.pageTitle} Succeed!`);
      } catch (e) {
        console.error(e);
      } finally {
        await this.init();
      }
    },
    async editInquiry() {
      try {
        const { id, name } = this.input;
        const data = {
          name,
        };
        await this.a$inquiryEdit(id, data);
        this.modal.detail = false;
        console.log(`Edit ${this.pageTitle} Succeed!`);
      } catch (e) {
        console.error(e);
      } finally {
        await this.init();
      }
    },
    async delInquiry() {
      try {
        const { id } = this.input;
        await this.a$inquiryDel(id);
        this.modal.confirm = false;
        console.log(`Delete ${this.pageTitle} Succeed!`);
      } catch (e) {
        console.error(e);
      } finally {
        await this.init();
      }
    },

    async triggerDetail(row) {
      try {
        this.input = row;
        this.modal.detail = true;
      } catch (e) {
        console.error(e);
      }
    },
    async triggerDelete({ id }) {
      try {
        await this.a$inquiryDetail(id);
        this.input = this.g$detail;
        this.modal.confirm = true;
      } catch (e) {
        console.error(e);
      }
    },
  },
  watch: {
    modals(val) {
      if (!val) this.clear();
    }
  },
};
</script>
