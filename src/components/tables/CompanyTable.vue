<template>
    <div class="card">
        <data-table style="text-align: center;" index="false" :data="g$listCompany" :columns="dt.column"
            :actions="dt.action" @detail="triggerDetail" @delete="triggerDelete" />
    </div>
    <modal-comp v-model:show="modal.add">
        <template #header>
            <h3 class="modal-title">Add New {{ pageTitle }}</h3>
        </template>
        <template v-if="modal.add" #body>
            <div class="row">
                <div class="col-12">
                    <argon-input v-model="input.name" type="text" placeholder="Name" name="name" size="md">
                    </argon-input>
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
                    <argon-input v-model="input.name" type="text" placeholder="Name" name="name" size="md">
                    </argon-input>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <argon-input v-model="input.address" type="text" placeholder="Address" name="address" size="md">
                    </argon-input>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <argon-input v-model="input.phone" type="text" placeholder="Phone" name="phone" size="md">
                    </argon-input>
                </div>
            </div>
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
                Apakah Anda yakin ingin menghapus <b>perusahaan</b> ini?
            </p>
        </template>
        <template #footer>
            <argon-button color="secondary" @click="modal.confirm = false">
                Close
            </argon-button>
            <argon-button color="danger" @click="delInquiry()">Delete</argon-button>
        </template>
    </modal-comp>
</template>

<script>
import { mapActions, mapState } from 'pinia';
import d$company from '@/stores/dashboard/company';
import auth from '@/router/routes/auth';

export default {
    // name: 'company-table',
    data: () => ({
        pageTitle: 'company-table',
        // Input
        input: {
            id: null,
            name: '',
        },
        components: {
        },
        // DataTable
        dt: {
            column: [
                {
                    name: 'name',
                    th: 'Nama Perusahaan',
                },
                {
                    name: 'auth_user.level',
                    th: 'Tier',
                    render: ({ auth_user }) => auth_user.level
                },
                {
                    name: 'auth_user.username',
                    th: 'Username',
                    render: ({ auth_user }) => auth_user.username
                },
                {
                    name: 'address',
                    th: 'alamat',
                },
                {
                    name: 'phone',
                    th: 'Nomor telepon',
                },
            ],
            action: [
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
        ...mapState(d$company, ['g$listCompany', 'g$detail']),
        modals() {
            return Object.values(this.modal).includes(true);
        }
    },
    async mounted() {
        await this.a$inquiryList();
    },
    methods: {
        ...mapActions(d$company, ['a$inquiryList', 'a$inquiryEdit', 'a$inquiryDel', 'a$inquiryDetail']),

        clear() {
            this.input = {
                id: null,
                name: '',
                username: '',
                level: '',
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
                const { username, password, level, name, address, phone } = this.input;
                const data = {
                    username, password, level, name, address, phone
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
                const { id, name, address, phone } = this.input;
                const data = {
                    name,
                    address, phone
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
                const { id_company } = this.input;
                await this.a$inquiryDel(id_company);
                this.modal.confirm = false;
                console.log(`Delete ${this.pageTitle} Succeed!`);
            } catch (e) {
                console.error(e);
            } finally {
                await this.init();
            }
        },

        async triggerDetail({ id_company, name, address, phone }) {
            try {
                this.input = {
                    id: id_company,
                    name,
                    address,
                    phone,
                };
                this.modal.detail = true;
            } catch (e) {
                console.error(e);
            }
        },

        // buat manggil page baru di page selanjutnya

        // async triggerDetail({ id_company, name, address, phone }) {
        //     try {
        //         this.input = {
        //             id: id_company,
        //             name,
        //             address,
        //             phone,
        //         };
        //         this.modal.detail = true;
        //         this.$router.push({ name: 'TrackingDetail', params: { id: id_company, status: status }})
        //         console.log(this.$route.params.id);
        //     } catch (e) {
        //         console.error(e);
        //     }
        // },

        async triggerDelete({ id_company }) {
            try {
                this.input = {
                    id_company
                };
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
}
</script>