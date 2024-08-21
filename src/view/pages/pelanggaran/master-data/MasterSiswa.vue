a<template>
    <div class="page-margin">

        <v-card class="hb-input-form-style">
            <v-card-title class="bg-form-title" @click="showInputData = !showInputData" role="button">
                <h3>Tambah Data Siswa</h3>
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
                                    <v-col cols="12" md="6">
                                        <v-text-field outlined required clearable label="NISN *" type="text"
                                            v-model="payloads.nisn" :rules="rules.nisnRules"></v-text-field>
                                    </v-col>

                                    <v-col cols="12" md="6">
                                        <v-text-field outlined required clearable label="Nama *" type="text"
                                            v-model="payloads.nama" :rules="rules.namaRules"></v-text-field>
                                    </v-col>
                                </v-row>

                                <v-row>
                                    <v-col cols="12" md="6">
                                        <v-select outlined required clearable label="Jenis Kelamin *"
                                            v-model="payloads.jenisKelamin" :items="genderOptions" 
                                            :rules="rules.jenisKelaminRules"></v-select>
                                    </v-col>

                                    <v-col cols="12" md="6">
                                        <v-menu ref="dateDialog" v-model="dateDialog" :close-on-content-click="false"
                                            :return-value.sync="payloads.tanggalLahir" transition="scale-transition"
                                            offset-y min-width="auto">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-combobox label="Tanggal Lahir *" append-icon="mdi-calendar" clearable
                                                    v-model="payloads.tanggalLahir" outlined required readonly
                                                    v-bind="attrs" v-on="on" :rules="rules.tanggalLahirRules">
                                                    <template v-slot:selection="{ item }">
                                                        <v-chip size="small" color="primary">
                                                            {{ item }}
                                                        </v-chip>
                                                    </template>
                                                </v-combobox>
                                            </template>

                                            <v-date-picker v-model="payloads.tanggalLahir" locale="id">
                                                <v-spacer></v-spacer>
                                                <v-btn text color="primary" @click="dateDialog = false">
                                                    Cancel </v-btn>
                                                <v-btn text color="primary"
                                                    @click="$refs.dateDialog.save(payloads.tanggalLahir)">
                                                    OK
                                                </v-btn>
                                            </v-date-picker>
                                        </v-menu>
                                    </v-col>
                                </v-row>

                                <v-row>
                                    <v-col cols="12" md="6">
                                        <v-text-field outlined required clearable label="No Telepon Siswa *"
                                            type="text"
                                            v-model="payloads.noTeleponSiswa" :rules="rules.noTeleponSiswaRules">
                                        </v-text-field>
                                    </v-col>

                                    <v-col cols="12" md="6">
                                        <v-text-field outlined required clearable label="No Telepon Wali Siswa *" type="text"
                                            v-model="payloads.noTeleponWali"
                                            :rules="rules.noTeleponWaliRules"></v-text-field>
                                    </v-col>
                                </v-row>

                                <v-row>
                                    <v-col>
                                        <v-text-field outlined required clearable label="Alamat *" type="text"
                                            v-model="payloads.alamatSiswa"
                                            :rules="rules.alamatSiswaRules"></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-form>
                        </v-card-text>

                        <v-card-actions>
                            <v-row>
                                <v-col class="text-right">
                                    <v-btn class="p-5 mr-2 text-white" color="blue-grey" @click="clearForm">
                                        <v-icon class="icon mr-2">{{ editFlagging ? 'mdi-close-circle' :
                                            'mdi-delete-circle' }}</v-icon>
                                        {{ editFlagging ? 'Batal' : 'Bersihkan' }}
                                    </v-btn>

                                    <v-btn class="p-5 btn-blue-style"
                                        @click="dialogConfirmations(editFlagging ? 'edit' : 'tambah', payloads.nama, 'saveData')"
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

                    <template>
                        <v-col cols="12" sm="6" class="d-flex justify-end align-center">
                            <v-btn @click="dialogImport = true" color="blue-grey" class="text-white">
                                <v-icon class="icon mr-2">mdi-import</v-icon>
                                Import
                            </v-btn>

                            <v-dialog v-model="dialogImport" max-width="500px">
                                <v-card>
                                    <v-card-title class="headline">Import Data</v-card-title>
                                    <v-card-text>
                                        <v-file-input outlined v-model="excelFile" label="Pilih file excel..."
                                            accept=".xlsx, .xls" prepend-icon="mdi-file-excel"> </v-file-input>
                                    </v-card-text>

                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn class="text-white" color="blue-grey" text @click="dialogImport = false">
                                            Batal
                                        </v-btn>
                                        <v-btn class="btn-blue-style p-5" @click="handleImportFile"
                                            :disabled="!excelFile">
                                            <v-icon class="icon mr-2">mdi-import</v-icon>
                                            Import
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </v-col>
                    </template>
                </v-row>
            </v-card-title>

            <v-data-table :page="page" :items-per-page="itemsPerPage" :headers="headers" :items="dataSiswa"
                :search="search" :loading="loader" loading-text="Tunggu sebentar..." :sort-by="['id']"
                hide-default-footer :sort-desc="['true']">
                <template v-slot:item.actions="{ item }">
                    <v-menu offset-y>
                        <!-- Memberikan Kontent yang akan ditampilkan dengan menu menggunakan activator. -->
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn text v-bind="attrs" v-on="on"><v-icon
                                    class="action-icons">mdi-settings</v-icon></v-btn>
                        </template>

                        <v-list>
                            <v-list-item @click="editSiswa(item)">
                                <v-icon class="action-icons">mdi-pencil</v-icon>
                                <b class="action-icons">Edit</b>
                            </v-list-item>

                            <v-list-item @click="deleteSiswa(item)">
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
import { mapGetters } from "vuex";

//Composable Cames Case To Words
import { camelCaseToWords } from "../components/CamelCaseToWords.js";

// Import SweetAlert2
import { sweetAlertDialogs } from "../components/dialog-status/sweet-alert2.js";

//Import Constant.js
import { GenderEnum } from "@/core/constant"

export default {
    name: "siswa",
    mixins: [sweetAlertDialogs],

    data() {
        return {
            //Flagger
            showInputData: true,
            editFlagging: false,
            dateDialog: false,

            //Table Variables
            page: 1,
            itemsPerPage: 5,
            search: '',
            headers: [],
            dataSiswa: [],
            loader: false,

            //Import - Export Variables
            dialogImport: false,
            excelFile: null,

            //Variable ID Kategori Pelanggaran for edit, delete and update.
            siswa_id: null,

            payloads: {
                nama: '',
                nisn: '',
                tanggalLahir: null,
                jenisKelamin: null,
                noTeleponSiswa: '',
                alamatSiswa: '',
                noTeleponWali: '',
                statusSanksi: 0,
                kategoriSanksi: 1,
                createdBy: 4,
            },

            genderOptions: [
                { text: 'Laki-laki', value: GenderEnum.Male },
                { text: 'Perempuan', value: GenderEnum.Female },
            ],

            // Form rules
            rules: {
                nisnRules: [
                    (v) => !!v || 'NISN siswa harus diisi',
                    (v) => (this.payloads.nisn || !this.payloads.nisn) && /^\d+$/.test(v) || 'NISN harus terdiri dari angka.',
                    (v) => (v && (v.length == 10) || 'NISN harus terdiri dari 10 digit angka.'),
                ],
                namaRules: [
                    (v) => !!v || 'Nama siswa harus diisi',
                ],
                tanggalLahirRules: [
                    (v) => !!v || 'Tanggal lahir siswa harus diisi',
                ],
                jenisKelaminRules: [
                    (v) => !!v || 'jenis kelamin siswa harus diisi',
                ],
                noTeleponSiswaRules: [
                    (v) => !!v || 'Nomor Telepon siswa harus diisi',
                    (v) => (this.payloads.noTeleponSiswa || !this.payloads.noTeleponSiswa) && /^\d+$/.test(v) || 'Nomor Telepon harus terdiri dari angka',
                    (v) => (v && (v.length >= 10 && v.length <= 13) || 'Nomor Telepon harus terdiri dari 10 sampai 13 digit'),
                    (v) => (this.payloads.noTeleponSiswa || !this.payloads.noTeleponSiswa) && (v && v.startsWith('0') || 'Nomor Telepon harus dimulai dengan 0'),
                ],
                alamatSiswaRules: [
                    (v) => !!v || 'Alamat siswa harus diisi',
                ],
                noTeleponWaliRules: [
                (v) => !!v || 'Nomor Telepon siswa harus diisi',
                    (v) => (this.payloads.noTeleponWali || !this.payloads.noTeleponWali) && /^\d+$/.test(v) || 'Nomor Telepon harus terdiri dari angka',
                    (v) => (v && (v.length >= 10 && v.length <= 13) || 'Nomor Telepon harus terdiri dari 10 sampai 13 digit'),
                    (v) => (this.payloads.noTeleponWali || !this.payloads.noTeleponWali) && (v && v.startsWith('0') || 'Nomor Telepon harus dimulai dengan 0'),
                ]
            }
        }
    },

    computed: {
        endpoint() {
            return `${process.env.VUE_APP_BASE_ENDPOINT_DEV}/api/v1`;
        },

        totalItems() {
            return this.dataSiswa.length;
        },

        totalPages() {
            return Math.ceil(this.totalItems / this.itemsPerPage);
        },

        ...mapGetters(["currentUser"]),

        //Check Form Validation
        checkValidForms() {
            const { payloads } = this;

            const formIsFilled = !!(payloads.nisn && payloads.nama && payloads.tanggalLahir && payloads.jenisKelamin && payloads.noTeleponSiswa && payloads.alamatSiswa && payloads.noTeleponWali);
            const isNISNValid = /^\d+$/.test(payloads.nisn) && (payloads.nisn.length == 10);

            return !(formIsFilled && isNISNValid);
        },
    },

    methods: {
        //Tambah dan Edit data
        saveData() {
            const { endpoint, payloads } = this;
            const restPayloads = { ...payloads };
            restPayloads['createdBy'] = this.currentUser.id;

            this.loader = true;
            ApiService.setHeader();
            const apiEndpoint = this.editFlagging ? `${endpoint}/siswa/${this.siswa_id}` : `${endpoint}/siswa`;
            const apiMethod = this.editFlagging ? ApiService.put : ApiService.post;

            apiMethod(apiEndpoint, restPayloads)
                .then(resp => {
                    const action = this.editFlagging ? 'edit' : 'tambah';
                    this.dialogStatus(action, 'success', `${resp.data.message} ${resp.data.data.nama}`);
                    console.log('==============> restPayloads', restPayloads);

                    //Refresh form
                    this.clearForm();
                    this.getSiswaFromApi();
                })
                .catch(error => {
                    const action = this.editFlagging ? 'edit' : 'tambah';
                    console.error('==============> error', error);

                    if (error.response) {
                        console.error('HTTP error:', error.response.data);
                        const errorMessage = error.response.data?.errors || `Gagal ${action} data`;
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
        async getSiswaFromApi() {
            this.loader = true;
            ApiService.setHeader();

            try {
                const resp = await ApiService.get(`${this.endpoint}/siswa`);
                this.dataSiswa = resp.data.data;

                if (this.dataSiswa.length > 0) {
                    const setKey = ['nama', 'nisn', 'kelas'];
                    const dataArray = Object.entries(this.dataSiswa[0]);

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
                        { text: 'No Telepon Siswa', align: 'center', value: 'noTeleponSiswa', sortable: false },
                        { text: 'No Telepon Wali Siswa', align: 'center', value: 'noTeleponWali', sortable: false },
                        { text: 'Data Dibuat Oleh', align: 'center', value: 'createdBy.name', sortable: false },
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

        editSiswa(item) {
            //Scroll To Top after edit icon is Clicked
            window.scrollTo({ top: 0, behavior: 'smooth' });

            this.editFlagging = true;
            this.siswa_id = item.id;

            // //Ambil Dari Table
            this.payloads = {
                nama: item.nama,
                nisn: item.nisn,
                tanggalLahir: item.tanggalLahir,
                jenisKelamin: item.jenisKelamin,
                noTeleponSiswa: item.noTeleponSiswa,
                alamatSiswa: item.alamatSiswa,
                noTeleponWali: item.noTeleponWali,
                statusSanksi: item.statusSanksi,
                kategoriSanksi: item.kategoriSanksi,
                createdBy: this.currentUser.id, //Value sementara 1 karena belum ada sistem login, nanti diganti dengan user yang login
            };
        },

        deleteSiswa(item) {
            // alert("This is delete button");
            this.siswa_id = item.id;

            this.dialogConfirmations('hapus', item.nama, 'confirmDeleteSiswa')
        },

        async confirmDeleteSiswa() {
            const { siswa_id, endpoint } = this;
            this.loader = true;
            ApiService.setHeader();

            try {
                const resp = await ApiService.delete(`${endpoint}/siswa/${siswa_id}`);
                this.jenis_pelanggaran_id = null;
                this.dialogStatus('hapus', 'success', `${resp.data?.message} ${resp.data?.data?.nama}`);

                // Refresh Form
                this.clearForm();
                this.getSiswaFromApi();
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

        handleImportFile() {
            if (this.excelFile) {
                console.log('File yang akan di import:', this.excelFile);
                this.uploadExcelFile(this.excelFile);

            } else {
                alert('Please select a file.');
            }
        },

        uploadExcelFile(file) {
            const { endpoint } = this;
            // Example function to handle the file upload
            const formData = new FormData();
            formData.append('file', file);

            ApiService.setHeader();
            // Make an API call to upload the file (example with Axios)
            ApiService.post(`${endpoint}/import/siswa`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })
                .then(response => {
                    this.dialogImport = false;
                    this.excelFile = null;
                    this.getSiswaFromApi();

                    console.log('Berhasil import file:', response.data);
                    this.dialogStatus('import', 'success', response.data.message);

                })
                .catch(error => {
                    console.error('Error mengupload file:', error);
                    this.excelFile = null;
                    this.dialogStatus('import', 'error', error.message);
                })
                .finally(() => {
                    this.loader = false;
                });
        },

        onPageChange(newPage) {
            this.page = newPage;
        },

        //Clear Form
        clearForm() {
            this.siswa_id = null;
            this.editFlagging = false;

            this.$refs.form.reset();
        },
    },

    mounted() {
        this.getSiswaFromApi();
        this.$store.dispatch(SET_BREADCRUMB, [{ title: 'Master Siswa' }]);
    }
};

</script>