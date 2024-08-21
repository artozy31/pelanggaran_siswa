a<template>
    <div class="page-margin">
        <v-card class="hb-input-form-style">
            <v-card-title class="bg-form-title" @click="showInputData = !showInputData" role="button">
                <h3>Tambah Data Wali Kelas</h3>
                <v-spacer></v-spacer>
                <span :class="showInputData ? 'mdi mdi-minus mdi-24px' : 'mdi mdi-plus mdi-24px'"></span>
            </v-card-title>

            <v-expand-transition>
                <div v-show="showInputData">
                    <!-- Form Input -->
                    <v-card flat>
                        <br>
                        <span class="required-form-asterisk"> * </span>Harus di isi

                        <!-- Building Form -->
                        <v-form ref="form">
                            <v-row>
                                <v-col cols="12" md="6">
                                    <FormTextField outlined required label="Nama *" type="text" v-model="payloads.namaWaliKelas"
                                        :rules="payloadsRules.namaRules"></FormTextField>
                                </v-col>

                                <v-col cols="12" md="6">
                                    <FormTextField outlined required label="No Telepon" type="text"
                                        v-model="payloads.noTelepon" :rules="payloadsRules.noTeleponRules">
                                    </FormTextField>
                                </v-col>
                            </v-row>
                        </v-form>

                        <v-card-actions>
                            <v-row>
                                <v-col class="text-right">
                                    <v-btn class="p-5 mr-2 text-white" color="blue-grey" @click="clearForm">
                                        <v-icon class="icon mr-2">{{ editFlagging ? 'mdi-close-circle' :
                                            'mdi-delete-circle' }}</v-icon>
                                        {{ editFlagging ? 'Batal' : 'Bersihkan' }}
                                    </v-btn>

                                    <v-btn class="p-5 btn-blue-style"
                                        @click="dialogConfirmations(editFlagging ? 'edit' : 'tambah', payloads.namaWaliKelas, 'saveData')"
                                        :disabled="checkValidForms">
                                        <v-icon class="icon mr-2">{{ editFlagging ? 'mdi-pencil-circle' :
                                            'mdi-plus-circle' }}</v-icon>
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
            <v-col cols="12" md="6">
                <v-text-field v-model="search" append-icon="search" label="Cari ..." hide-details
                    outlined></v-text-field>
            </v-col>

            <v-data-table :page="page" :items-per-page="itemsPerPage" :headers="headers" :items="dataWaliSiswa"
                :search="search" :loading="loader" loading-text="Tunggu sebentar..." hide-default-footer
                :sort-by="['id']" :sort-desc="['true']">
                <template v-slot:item.actions="{ item }">
                    <v-menu offset-y>
                        <!-- Memberikan Kontent yang akan ditampilkan dengan menu menggunakan activator. -->
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn text v-bind="attrs" v-on="on"><v-icon
                                    class="action-icons">mdi-settings</v-icon></v-btn>
                        </template>

                        <v-list>
                            <v-list-item @click="editWaliKelas(item)">
                                <v-icon class="action-icons">mdi-pencil</v-icon>
                                <b class="action-icons">Edit</b>
                            </v-list-item>

                            <v-list-item @click="deleteWaliKelas(item)">
                                <v-icon class="action-icons">mdi-delete</v-icon>
                                <b class="action-icons">Hapus</b>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </template>
            </v-data-table>

            <v-pagination class="p-4" v-model="page" :length="totalPages" :total-visible="6"
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
import FormTextField from "../components/FormTextField.vue";

export default {
    name: "wali-kelas",
    mixins: [sweetAlertDialogs],
    components: { FormTextField },

    data() {
        return {
            //Flagger
            showInputData: true,
            editFlagging: false,

            //Table Variables
            page: 1,
            itemsPerPage: 5,
            search: '',
            headers: [],
            dataWaliSiswa: [],
            loader: false,

            //Variable ID Kategori Pelanggaran for edit, delete and update.
            wali_kelas_id: null,

            payloads: {
                namaWaliKelas: '',
                noTelepon: ''
            },

            // Form rules
            payloadsRules: {
                namaRules: [
                    (v) => !!v || 'Nama harus diisi',
                ],
                noTeleponRules: [
                    (v) => !!v || 'No Telepon harus diisi',
                    (v) => (this.payloads.noTelepon || !this.payloads.noTelepon) && /^\d+$/.test(v) || 'Nomor Telepon harus terdiri dari angka',
                    (v) => (v && (v.length >= 10 && v.length <= 13) || 'Nomor Telepon harus terdiri dari 10 sampai 13 digit'),
                    (v) => (this.payloads.noTelepon || !this.payloads.noTelepon) && (v && v.startsWith('0') || 'Nomor Telepon harus dimulai dengan 0'),
                ],
            }

        }
    },

    computed: {
        endpoint() {
            return `${process.env.VUE_APP_BASE_ENDPOINT_DEV}/api/v1`;
        },

        totalItems() {
            return this.dataWaliSiswa.length;
        },

        totalPages() {
            return Math.ceil(this.totalItems / this.itemsPerPage);
        },

        //Check Form Validation
        checkValidForms() {
            const { payloads } = this;

            const formIsFilled = !!(payloads.namaWaliKelas && payloads.noTelepon);
            const isPhoneNumberSiswaValid = /^\d+$/.test(payloads.noTelepon) && (payloads.noTelepon.length >= 10 && payloads.noTelepon.length <= 13) && payloads.noTelepon.startsWith('0');
            const isPhoneNumberWaliSiswaValid = /^\d+$/.test(payloads.noTelepon) && (payloads.noTelepon.length >= 10 && payloads.noTelepon.length <= 13) && payloads.noTelepon.startsWith('0');

            return !(formIsFilled && isPhoneNumberSiswaValid && isPhoneNumberWaliSiswaValid);
        },
    },

    methods: {
        //Tambah dan Edit data
        saveData() {
            const { endpoint, payloads } = this;
            const restPayload = { ...payloads };

            this.loader = true;

            ApiService.setHeader();

            const apiEndpoint = this.editFlagging ? `${endpoint}/waliKelas/${this.wali_kelas_id}` : `${endpoint}/waliKelas`;
            const apiMethod = this.editFlagging ? ApiService.put : ApiService.post;

            apiMethod(apiEndpoint, restPayload)
                .then(resp => {
                    const action = this.editFlagging ? 'edit' : 'tambah';
                    this.dialogStatus(action, 'success', `Wali kelas ${resp.data.data.namaWaliKelas}`);

                    //Refresh form
                    this.clearForm();
                    this.getWaliKelasFromApi();
                })
                .catch(error => {
                    const action = this.editFlagging ? 'edit' : 'tambah';

                    if (error.response) {
                        console.error('HTTP error:', error.response.data);
                        const errorMessage = error.response.data?.errors || `Gagal ${action} data`;
                        this.dialogStatus(action, 'error', errorMessage);
                    } else if (error.request) {
                        console.error('Network error:', error.request);
                        this.dialogStatus(action, 'error', "Tidak ada respon dari server. Silakan coba lagi.");
                    } else {
                        console.error('Error:', error.message);
                        this.dialogStatus('hapus', 'error', "Data terkait dengan data lain tidak bisa dihapus silakan coba lagi setelah menghapus data yang terkait.");
                    }
                })
                .finally(() => {
                    this.loader = false;
                });
        },

        //Get Data from Api
        async getWaliKelasFromApi() {
            this.loader = true;
            ApiService.setHeader();

            try {
                const resp = await ApiService.get(`${this.endpoint}/waliKelas`);
                this.dataWaliSiswa = resp.data.data;

                if (this.dataWaliSiswa.length > 0) {
                    const setKey = ['namaWaliKelas', 'noTelepon'];
                    const dataArray = Object.entries(this.dataWaliSiswa[0]);

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

                    // const additionalHeaders = [
                    //     { text: 'Kategori', align: 'left', value: 'kategori.id', sortable: false },
                    // ];

                    const actionsHeader = [{ text: 'AKSI', align: 'center', value: 'actions', sortable: false }];

                    // Menambahkan header "UNIT / EMPLOYEE" berdasarkan nilai guest_type.has_expired
                    // let unitOrEmployeeHeader = { text: 'GUEST PURPOSE', align: 'center', value: 'guest_logs[0]', sortable: false };

                    // additionalHeaders.unshift(unitOrEmployeeHeader);

                    this.headers = [...responHead, ...actionsHeader];
                }
            } catch (err) {
                console.error('Error fetching data:', err);

                this.dialogStatus('fetch', 'error', 'server error')
            } finally {
                this.loader = false;
            }
        },

        editWaliKelas(item) {
            //Scroll To Top after edit icon is Clicked
            window.scrollTo({ top: 0, behavior: 'smooth' });
            console.log(item);

            this.editFlagging = true;
            this.wali_kelas_id = item.id;

            // Ambil Dari Table
            this.payloads = {
                namaWaliKelas: item.namaWaliKelas,
                noTelepon: item.noTelepon,
            }
        },

        deleteWaliKelas(item) {
            // alert("This is delete button");
            this.wali_kelas_id = item.id;

            this.dialogConfirmations('hapus', item.namaWaliKelas, 'confirmDeleteWaliKelas')
        },

        async confirmDeleteWaliKelas() {
            const { wali_kelas_id, endpoint } = this;
            this.loader = true;
            ApiService.setHeader();

            try {
                const resp = await ApiService.delete(`${endpoint}/waliKelas/${wali_kelas_id}`);
                this.jenis_pelanggaran_id = null;
                this.dialogStatus('hapus', 'success', `${resp.data?.message} ${resp.data?.data?.namaWaliKelas}`);

                // Refresh Form
                this.clearForm();
                this.getWaliKelasFromApi();
            } catch (error) {
                console.error('Full error:', error); // Log full error object for debugging

                if (error.response) {
                    console.error('HTTP error:', error.response.data);
                    const errorMessage = error.response.data?.error || "Gagal hapus data";
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

        onPageChange(newPage) {
            this.page = newPage;
        },

        //Clear Form
        clearForm() {
            this.wali_kelas_id = null;
            this.editFlagging = false;
            this.payloads = {};

            this.$refs.form.reset();
        },
    },

    mounted() {
        this.getWaliKelasFromApi();
        this.$store.dispatch(SET_BREADCRUMB, [{ title: 'Master Wali Kelas' }]);
    }
};

</script>