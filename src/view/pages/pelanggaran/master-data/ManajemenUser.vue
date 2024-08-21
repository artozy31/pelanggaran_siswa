a<template>
    <div class="page-margin">
        <v-card class="hb-input-form-style">
            <v-card-title class="bg-form-title" @click="showInputData = !showInputData" role="button">
                <h3>Tambah Data User</h3>
                <v-spacer></v-spacer>
                <span :class="showInputData ? 'mdi mdi-minus mdi-24px' : 'mdi mdi-plus mdi-24px'"></span>
            </v-card-title>

            <v-expand-transition>
                <div v-show="showInputData">
                    <!-- Form Input -->
                    <v-card flat>
                        <br>
                        <span class="required-form-asterisk"> * </span>Harus di isi

                        <v-card-text>
                            <!-- Building Form -->
                            <v-form ref="form">
                                <v-row>
                                    <v-col>
                                        <v-text-field outlined required clearable label="Nama *" :value="payloads.name"
                                            @input="updatePayload('name', $event)" :rules="rules.namaRules">
                                        </v-text-field>
                                    </v-col>
                                </v-row>

                                <v-row>
                                    <v-col cols="12" md="6">
                                        <v-autocomplete outlined required clearable label="Role User *" type="text"
                                            :value="payloads.role" :items="roleItems"
                                            @input="updatePayload('role', $event)" item-text="description"
                                            item-value="id" :rules="rules.roleRules"></v-autocomplete>
                                    </v-col>

                                    <v-col cols="12" md="6">
                                        <v-text-field outlined required clearable label="Email *"
                                            append-icon="mdi-email" :value="payloads.email"
                                            @input="updatePayload('email', $event)" :rules="rules.emailRules">
                                        </v-text-field>
                                    </v-col>
                                </v-row>

                                <v-row>
                                    <v-col cols="12" md="6">
                                        <v-text-field outlined label="Masukkan Password" persistent-hint
                                            hint="* Harus di isi."
                                            :rules="rules.passwordRules"
                                            :append-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                                            :type="visible ? 'text' : 'password'"
                                            :value="payloads.password" :clickable="true"
                                            @click:append="visible = !visible"
                                            @input="updatePayload('password', $event)"></v-text-field>
                                    </v-col>

                                    <v-col cols="12" md="6">
                                        <v-text-field outlined label="Masukkan Kembali Password" persistent-hint
                                            hint="* Harus di isi."
                                            :rules="rules.rePasswordRules"
                                            :append-icon="visibleRe ? 'mdi-eye-off' : 'mdi-eye'"
                                            :type="visibleRe ? 'text' : 'password'" 
                                            :value="payloads.password_confirmation" :clickable="true"
                                            @click:append="visibleRe = !visibleRe"
                                            @input="updatePayload('password_confirmation', $event)"></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-form>
                        </v-card-text>

                        <v-card-actions>
                            <v-row>
                                <v-col class="text-right">
                                    <v-btn class="p-5 mr-3 text-white" color="blue-grey" @click="clearForm">
                                        <v-icon class="icon mr-2">{{ editFlagging ? 'mdi-close-circle' :
                                            'mdi-delete-circle' }}</v-icon>
                                        {{ editFlagging ? 'Batal' : 'Bersihkan' }}
                                    </v-btn>

                                    <v-btn class="btn-blue-style p-5"
                                        @click="dialogConfirmations(editFlagging ? 'edit' : 'tambah', payloads.description, 'saveData')"
                                        :disabled="checkValidForms">
                                        <v-icon class="icon mr-2">{{ editFlagging ? 'mdi-pencil-circle' :
                                            'mdi-plus-circle'
                                            }}</v-icon>
                                        {{ editFlagging ? 'Update' : 'Tambah' }}
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-card-actions>
                    </v-card>
                </div>
            </v-expand-transition>
        </v-card>

        <v-divider></v-divider>

        <v-card class="hb-card-table-style">
            <v-card-title>
                <v-row>
                    <v-col cols="12" sm="6">
                        <v-text-field v-model="search" append-icon="search" label="Cari ..." hide-details
                            outlined></v-text-field>
                    </v-col>
                </v-row>
            </v-card-title>

            <v-data-table :page="page" :items-per-page="itemsPerPage" :headers="headers" :items="dataUser"
                :search="search" :loading="loader" loading-text="Tunggu sebentar..." :sort-by="['id']" hide-default-footer
                :sort-desc="['true']">
                <template v-slot:item.actions="{ item }">
                    <v-menu offset-y>
                        <!-- Memberikan Kontent yang akan ditampilkan dengan menu menggunakan activator. -->
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn text v-bind="attrs" v-on="on"><v-icon
                                    class="action-icons">mdi-settings</v-icon></v-btn>
                        </template>

                        <v-list>
                            <v-list-item @click="userHandleEdit(item)">
                                <v-icon class="action-icons">mdi-pencil</v-icon>
                                <b class="action-icons">Edit</b>
                            </v-list-item>

                            <v-list-item @click="userHandleDelete(item)">
                                <v-icon class="action-icons">mdi-delete</v-icon>
                                <b class="action-icons">Hapus</b>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </template>
            </v-data-table>

            <v-pagination class="p-2" v-model="page" :length="totalPages" :total-visible="6"
                @input="onPageChange"></v-pagination>
        </v-card>
    </div>
</template>

<script>
import ApiService from "@/core/services/api.service";
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";

//Composable Cames Case To Words
import { camelCaseToWords } from "../components/CamelCaseToWords.js";

// Import SweetAlert2
import { sweetAlertDialogs } from "../components/dialog-status/sweet-alert2.js";


export default {
    name: "manajemen-user",
    mixins: [sweetAlertDialogs],

    data() {
        return {
            //Flagger
            showInputData: true,
            editFlagging: false,
            //Variable ID Kategori Pelanggaran for edit, delete and update.
            user_id: null,
            visible: false,
            visibleRe: false,

            //Table Variables
            page: 1,
            itemsPerPage: 5,
            search: '',
            headers: [],
            dataUser: [],
            loader: false,

            //Get Roles from Select2 API
            roleItems: [],

            payloads: {
                name: '',
                email: '',
                password: '',
                password_confirmation: '',
                role: null,
            },

            // Form rules
            rules: {
                namaRules: [
                    v => !!v || 'Nama harus diisi',
                    v => (v && v.length <= 50) || 'Nama tidak boleh lebih dari 50 karakter',
                ],
                emailRules: [
                    v => !!v || 'Email harus diisi',
                    v => /.+@.+\..+/.test(v) || 'Email tidak valid',
                ],
                passwordRules: [
                    v => !!v || 'Password harus diisi',
                    v => (v && v.length >= 8) || 'Password minimal 8 karakter',
                ],
                rePasswordRules: [
                    v => !!v || 'Password harus diisi',
                    v => (v && v.length >= 8) || 'Password minimal 8 karakter',
                    v => v === this.payloads.password || 'Password tidak sama',
                ],
                roleRules: [
                    v => !!v || 'Role harus diisi',
                ],
            },
        }
    },

    computed: {
        endpoint() {
            return `${process.env.VUE_APP_BASE_ENDPOINT_DEV}/api/v1`;
        },

        totalItems() {
            return this.dataUser.length;
        },

        totalPages() {
            return Math.ceil(this.totalItems / this.itemsPerPage);
        },

        //Check Form Validation
        checkValidForms() {
            const { payloads } = this;

            const formIsFilled = payloads.name && payloads.email && payloads.password && payloads.password_confirmation;
            const isRoleValid = !!payloads.role;

            const isEmailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(payloads.email);
            const isPasswordValid = payloads.password && payloads.password.length >= 8;
            const isRePasswordValid = payloads.password_confirmation && payloads.password_confirmation === payloads.password;

            return !(formIsFilled && isRoleValid && isEmailValid && isPasswordValid && isRePasswordValid);
        }
    },

    methods: {
        handlePrependClick(param) {
            this[param] = !this[param];
        },

        updatePayload(key, value) {
            // Tambahkan data baru ke dalam objek payloads
            this.$set(this.payloads, key, value);
        },

        //Tambah dan Edit data
        saveData() {
            const { endpoint, payloads } = this;
            const restPayload = { ...payloads };
            this.loader = true;

            ApiService.setHeader();
            const apiEndpoint = this.editFlagging ? `${endpoint}/user/${this.user_id}` : `${endpoint}/user`;
            const apiMethod = this.editFlagging ? ApiService.put : ApiService.post;

            apiMethod(apiEndpoint, restPayload)
                .then(resp => {
                    const action = this.editFlagging ? 'edit' : 'tambah';
                    this.dialogStatus(action, 'success', `${resp.data.data.name}`);
                    //Refresh form
                    this.clearForm();
                    this.getUserFromApi();
                })
                .catch(error => {
                    const action = this.editFlagging ? 'edit' : 'tambah';
                    if (error.response) {
                        console.error('HTTP error:', error.response.data.message);
                        const errorMessage = `Gagal ${action} data: ${error.response.data.message}`;
                        console.error('==============> restPayload', restPayload);
                        this.dialogStatus(action, 'error', errorMessage);
                    } else if (error.request) {
                        console.error('Network error:', error.request);
                        this.dialogStatus(action, 'error', "Tidak ada respon dari server. Silakan coba lagi.");
                    } else {
                        console.error('Error:', error.message);
                        this.dialogStatus(action, 'error', `Ada yang salah saat ${action} data dari server. Silakan coba lagi.`);
                    }
                })
                .finally(() => {
                    this.loader = false;
                });
        },

        //Get Data from Api
        async getUserFromApi() {
            this.loader = true;
            ApiService.setHeader();

            try {
                const resp = await ApiService.get(`${this.endpoint}/user`);
                this.dataUser = resp.data.data;

                if (this.dataUser.length > 0) {
                    const setKey = ['id', 'name', 'email'];
                    const dataArray = Object.entries(this.dataUser[0]);

                    const responHead = dataArray.reduce((acc, key) => {
                        if (setKey.includes(key[0])) {
                            acc.push({
                                text: camelCaseToWords(key[0]),
                                align: 'left',
                                value: key[0],
                            });
                        }
                        return acc;
                    }, []);

                    const additionalHeaders = [
                        { text: 'Role User', align: 'left', value: 'role.description' },
                    ];

                    const actionsHeader = [{ text: 'AKSI', align: 'center', value: 'actions', sortable: false }];

                    this.headers = [...responHead, ...additionalHeaders, ...actionsHeader];
                }
            } catch (err) {
                console.error('Error fetching data:', err);

                this.dialogStatus('fetch', 'error', 'server error')
            } finally {
                this.loader = false;
            }
        },

        userHandleEdit(item) {
            if (item && typeof item === 'object' && item !== null) {
                //Scroll To Top after edit icon is Clicked
                window.scrollTo({ top: 0, behavior: 'smooth' });
                this.editFlagging = true;
                this.user_id = item.id;

                Object.entries(item).forEach(([key, value]) => {
                    if (key == 'role') {
                        this.updatePayload(key, value.id);
                    } else {
                        this.updatePayload(key, value);
                    }
                });
            } else {
                console.error('Invalid parameter: item harus berupa objek.');
                return;
            }
        },

        userHandleDelete(item) {
            // alert("This is delete button");
            this.user_id = item.id;

            this.dialogConfirmations('hapus', item.name, 'confirmDeleteKelas')
        },

        async confirmDeleteKelas() {
            const { user_id, endpoint } = this;
            this.loader = true;
            ApiService.setHeader();

            try {
                const resp = await ApiService.delete(`${endpoint}/user/${user_id}`);
                this.dialogStatus('hapus', 'success', `${resp.data?.message} ${resp.data?.data?.name}`);

                // Refresh Form
                this.clearForm();
                this.getUserFromApi();
            } catch (error) {
                console.error('Full error:', error); // Log full error object for debugging
                if (error.response) {
                    console.error('HTTP error:', error.response.data);
                    const errorMessage = error.response.data?.errors || "Gagal hapus data";
                    this.dialogStatus('hapus', 'error', errorMessage);
                } else if (error.request) {
                    console.error('Network error:', error.request);
                    this.dialogStatus('hapus', 'error', "Tidak ada respon dari server. Silakan coba lagi.");
                } else {
                    console.error('Error:', error.message);
                    this.dialogStatus('hapus', 'error', "Data terkait dengan data lain tidak bisa dihapus silakan coba lagi setelah menghapus data yang terkait.");
                }
            } finally {
                this.loader = false;
            }
        },

        getSelect2RoleUser() {
            const { endpoint } = this;

            ApiService.setHeader();
            ApiService.get(`${endpoint}/select2/roles`)
                .then(resp => {
                    this.roleItems = resp.data.data;
                })
                .catch(err => {
                    console.error('Error fetching data:', err);
                    this.dialogStatus('fetch', 'error', 'server error')
                })
        },

        onPageChange(newPage) {
            this.page = newPage;
        },

        //Clear Form
        clearForm() {
            this.user_id = null;
            this.editFlagging = false;

            this.$refs.form.reset();
        },
    },

    mounted() {
        this.getUserFromApi();
        this.getSelect2RoleUser();
        this.$store.dispatch(SET_BREADCRUMB, [{ title: 'Manajemen User' }]);
    }
};

</script>