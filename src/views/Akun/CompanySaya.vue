<template>
    <div class="container-fluid">
        <div class="page-header min-height-200"
            style="background-color: #3B82F6; margin-right: -24px; margin-left: -34%;">
        </div>
        <div class="card shadow-lg mt-n6 p-1 w-lg-60 w-md-80 w-80 mx-auto mb-3">
            <div class="card-body p-4">
                <div class="row gx-4">
                    <div class="mb-0">
                        <h5>{{ g$getMyCompany.name }}</h5>
                    </div>
                    <p class="mb-1">{{ g$getMyCompany.address }}</p>
                    <p class="mb-0">{{ g$getMyCompany.phone }}</p>
                </div>
            </div>
        </div>
        <div class="py-3 container-fluid">
            <div class="row">
                <div class="card">
                    <div class="card-header pb-0">
                        <div class="d-flex align-items-center">
                            <h5 class="mb-0">Edit Password</h5>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="row mb-2">
                            <div class="col-lg-6 col-md-6 col-12">
                                <label for="example-text-input" class="form-control-label text-sm">Current
                                    Password</label>
                                <argon-input v-model='input.cur_password' type="text" />
                            </div>
                            <div class="col-lg-6 col-md-6 col-12">
                                <label for="example-text-input" class="form-control-label text-sm">New Password</label>
                                <argon-input v-model='input.new_password' type="text" />
                            </div>
                        </div>
                        <argon-button @click="editPassword()" color="primary" size="md" class="ms-auto">Simpan Password
                        </argon-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="py-4 container-fluid">
            <div class="row">
                <div class="card">
                    <div class="card-header pb-0">
                        <h5 class="mb-0">Edit Profil</h5>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-lg-8 col-md-8 col-12">
                                <label for="example-text-input" class="form-control-label text-sm">Nomor Telepon</label>
                                <argon-input v-model='input.phone' type="text" />
                            </div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-lg-8 col-md-8 col-12 mb-2">
                                <label for="example-text-input" class="form-control-label text-sm">Alamat</label>
                                <argon-input v-model='input.address' type="text" />
                            </div>
                        </div>
                        <argon-button @click="editInquiry()" color="primary" size="md" class="ms-auto">Simpan Perubahan
                        </argon-button>
                    </div>
                </div>
            </div>
        </div>
        <div id="liveToast"
            class="w-75 w-md-30 w-lg-30 toast position-fixed top-5 start-50 translate-middle-x align-items-center text-white bg-success"
            role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    Password Berhasil di Update
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"
                    aria-label="Close"></button>
            </div>
        </div>
        <div id="ToastProfil"
            class="toast position-fixed top-0 start-50 translate-middle-x mt-3  align-items-center text-white bg-success"
            role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    Profile Berhasil di Update
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"
                    aria-label="Close"></button>
            </div>
        </div>
    </div>
</template>
  
<script>
import ArgonInput from "@/components/ArgonInput.vue";
import ArgonButton from "@/components/ArgonButton.vue";
import ArgonTextarea from "@/components/ArgonTextarea.vue";
import d$company from '@/stores/dashboard/company';
import d$user from '@/stores/dashboard/user';
import d$auth from '@/stores/auth.d';
import { mapActions, mapState } from "pinia";

export default {
    pageTitle: "Profile",
    name: "profile",
    components: {
        ArgonInput,
        ArgonButton,
        ArgonTextarea
    },
    data: () => ({
        input: {
            phone: '',
            address: '',
            cur_password: '',
            new_password: '',
        }
    }),

    computed: {
        ...mapState(d$company, ['g$getMyCompany', 'g$list']),
        ...mapState(d$user, ['g$username']),
    },
    methods: {
        ...mapActions(d$company, ['a$getMyCompany', 'a$editMyCompany']),
        ...mapActions(d$user, ['a$username', 'a$editPassword']),
        ...mapActions(d$auth, ['a$logout']),

        async init() {
            try {
                await this.a$getMyCompany();
                await this.a$username();
            } catch (e) {
                console.error(e);
            }
        },

        async editInquiry() {
            try {
                const { address, phone } = this.input;
                const data = {
                    address, phone
                };
                await this.a$editMyCompany(data);
                const ToastProfil = document.getElementById('ToastProfil')
                const toast2 = new bootstrap.Toast(ToastProfil)
                toast2.show()
                setTimeout(() => {
                    this.$router.push({ name: 'Perusahaan Saya' });
                }, 2000);
            } catch (e) {
                console.error(e);
            } finally {
                await this.init();
            }
        },
        async editPassword() {
            try {
                const { cur_password, new_password } = this.input;
                const data = {
                    cur_password, new_password
                };
                await this.a$editPassword(data);
                await this.a$logout();
                const toastLiveExample = document.getElementById('liveToast')
                const toast = new bootstrap.Toast(toastLiveExample)
                toast.show()
                setTimeout(() => {
                    this.$router.push({ name: 'LogIn' });
                }, 1000);
            } catch (e) {
                console.error(e);
            } finally {
                await this.init();
            }
        },
    },
    async mounted() {
        try {
            await this.a$getMyCompany();
            await this.a$username();
            this.input.address = this.g$getMyCompany.address;
            this.input.phone = this.g$getMyCompany.phone;
        } catch (e) {
        }
    }
};
</script>