<template>
    <div class="page-margin">
        <v-card class="hb-input-form-style">
            <v-card-title class="bg-form-title" @click="showInputData = !showInputData" role="button">
                <h3>Tambah Data Pelanggaran Siswa</h3>
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
                                        <v-autocomplete outlined required clearable label="Siswa *" type="text"
                                            :value="payloads.siswa" @input="updatePayload('siswa', $event)"
                                            :rules="rules.siswaRules" :items="siswaOptions" item-text="nama"
                                            item-value="id"></v-autocomplete>
                                    </v-col>

                                    <v-col cols="12" md="6">
                                        <v-autocomplete outlined required clearable label="Kelas *" type="text"
                                            :value="payloads.kelas" @input="updatePayload('kelas', $event)"
                                            :rules="rules.kelasRules" :items="kelasOptions" item-text="description"
                                            item-value="id"></v-autocomplete>
                                    </v-col>
                                </v-row>

                                <v-row>
                                    <v-col cols="12" md="6">
                                        <v-autocomplete outlined required clearable label="Wali Kelas *" type="text"
                                            :value="payloads.waliKelas" @input="updatePayload('waliKelas', $event)"
                                            :rules="rules.waliKelasRules" :items="waliKelasOptions" item-text="nama_wali_kelas"
                                            item-value="id"></v-autocomplete>
                                    </v-col>

                                    <v-col cols="12" md="6">
                                        <v-autocomplete outlined required clearable label="Jenis Pelanggaran *"
                                            type="text" :value="payloads.jenisPelanggaran"
                                            @input="updatePayload('jenisPelanggaran', $event)"
                                            :rules="rules.jenisPelanggaranRules" :items="jenisPelanggaranOptions"
                                            item-text="penjelasan" item-value="id"></v-autocomplete>
                                    </v-col>
                                </v-row>

                                <v-row>
                                    <v-col cols="12" md="6">
                                        <v-text-field outlined clearable label="Pelapor" type="text"
                                            :value="payloads.pelapor" @input="updatePayload('pelapor', $event)"
                                            :rules="rules.pelaporRules">
                                        </v-text-field>
                                    </v-col>

                                    <v-col cols="12" md="6">
                                        <v-text-field outlined clearable label="Deksripsi Pelanggaran" type="text"
                                            :value="payloads.description" @input="updatePayload('description', $event)"
                                            :rules="rules.deskripsiPelanggaranRules"></v-text-field>
                                    </v-col>
                                </v-row>

                                <v-row>
                                    <v-col cols="12" md="6">
                                        <v-menu ref="timePickerModel" v-model="timePickerModel"
                                            :close-on-content-click="false"
                                            :return-value.sync="payloads.waktuPelanggaran" transition="scale-transition"
                                            offset-y min-width="auto">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-combobox v-bind="attrs" v-on="on" label="Waktu Pelanggaran *"
                                                    outlined required readonly
                                                    append-icon="mdi-clock-outline" :value="payloads.waktuPelanggaran"
                                                    @input="updatePayload('waktuPelanggaran', $event)"
                                                    :rules="rules.waktuPelanggaranRules">
                                                    <template v-slot:selection="{ item }">
                                                        <v-chip size="small" color="primary">
                                                            {{ item }}
                                                        </v-chip>
                                                    </template>
                                                </v-combobox>
                                            </template>
                                            <v-time-picker :value="payloads.waktuPelanggaran"
                                                @input="updatePayload('waktuPelanggaran', $event)" format="24hr"
                                                use-seconds>
                                                <v-btn text color="primary" @click="timePickerModel = false">
                                                    Cancel </v-btn>
                                                <v-btn text color="primary"
                                                    @click="$refs.timePickerModel.save(payloads.waktuPelanggaran)">
                                                    OK
                                                </v-btn>
                                            </v-time-picker>
                                        </v-menu>
                                    </v-col>

                                    <v-col cols="12" md="6">
                                        <v-menu ref="dateDialog" v-model="dateDialog" :close-on-content-click="false"
                                            :return-value.sync="payloads.tanggalPelanggaran"
                                            transition="scale-transition" offset-y min-width="auto">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-combobox label="Tanggal Pelanggaran *" append-icon="mdi-calendar"
                                                    clearable :value="payloads.tanggalPelanggaran"
                                                    @input="updatePayload('tanggalPelanggaran', $event)" outlined
                                                    readonly required v-bind="attrs" v-on="on"
                                                    :rules="rules.tanggalPelanggaranRules">
                                                    <template v-slot:selection="{ item }">
                                                        <v-chip size="small" color="primary">
                                                            {{ item }}
                                                        </v-chip>
                                                    </template>
                                                </v-combobox>
                                            </template>

                                            <v-date-picker :value="payloads.tanggalPelanggaran"
                                                @input="updatePayload('tanggalPelanggaran', $event)" locale="id">
                                                <v-spacer></v-spacer>
                                                <v-btn text color="primary" @click="dateDialog = false">
                                                    Cancel </v-btn>
                                                <v-btn text color="primary"
                                                    @click="$refs.dateDialog.save(payloads.tanggalPelanggaran)">
                                                    OK
                                                </v-btn>
                                            </v-date-picker>
                                        </v-menu>
                                    </v-col>
                                </v-row>

                                <v-row>
                                    <v-col>
                                        <v-file-input type="file" accept="image/*" :value="payload_img"
                                            label="Bukti Pelanggaran" id="file-input" outlined chips show-size
                                            @change="updateImagePayload"></v-file-input>
                                    </v-col>
                                </v-row>
                            </v-form>
                        </v-card-text>

                        <v-card-actions>
                            <v-row>
                                <v-col class="text-right">
                                    <v-btn class="p-5 mr-2 text-white" color="blue-grey" @click="clearForm">
                                        <v-icon class="icon mr-2">
                                            {{ editFlagging ? 'mdi-close-circle' : 'mdi-delete-circle' }}
                                        </v-icon>
                                        {{ editFlagging ? 'Batal' : 'Bersihkan' }}
                                    </v-btn>

                                    <v-btn class="btn-blue-style p-5 mr-3"
                                        @click="dialogConfirmations(editFlagging ? 'edit' : 'tambah', 'pelanggaran baru ?', 'submitData')"
                                        :disabled="checkValidForms">
                                        <v-icon class="icon mr-2">
                                            {{ editFlagging ? 'mdi-pencil-circle' : 'mdi-plus-circle' }}
                                        </v-icon>
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

                            <!-- Dialog Component -->
                            <v-dialog v-model="dialogImport" max-width="500px">
                                <v-card>
                                    <v-card-title class="headline">Import Data</v-card-title>
                                    <v-card-text>
                                        <v-file-input outlined v-model="excelFile" label="Pilih file excel..."
                                            accept=".xlsx, .xls" prepend-icon="mdi-file-excel" @change="checkImportFileType"> </v-file-input>
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

            <v-data-table :page="page" :items-per-page="itemsPerPage" :headers="headers" :items="dataPelanggaran"
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
                            <v-list-item @click="pelanggaranSiswaHandleEdit(item)">
                                <v-icon class="action-icons">mdi-pencil</v-icon>
                                <b class="action-icons">Edit</b>
                            </v-list-item>

                            <v-list-item @click="pelanggaranSiswaHandleDelete(item)">
                                <v-icon class="action-icons">mdi-delete</v-icon>
                                <b class="action-icons">Hapus</b>
                            </v-list-item>

                            <v-list-item @click="sendWhatsappMessageToTeacher(item)">
                                <v-icon class="action-icons">mdi-whatsapp</v-icon>
                                <b class="action-icons">Kirim Pesan Whatsapp ke Wali Kelas</b>
                            </v-list-item>

                            <v-list-item @click="sendWhatsappMessageToParent(item)">
                                <v-icon class="action-icons">mdi-whatsapp</v-icon>
                                <b class="action-icons">Kirim Pesan Whatsapp ke Orang Tua Siswa</b>
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
import Swal from "sweetalert2";

export default {
    name: "pelanggaran",
    mixins: [sweetAlertDialogs],

    data() {
        return {
            //Flagger
            showInputData: true,
            editFlagging: false,
            timePickerModel: false,
            dateDialog: false,

            //Table Variables
            page: 1,
            itemsPerPage: 5,
            search: '',
            headers: [],
            dataPelanggaran: [],
            loader: false,

            //Import - Export Variables
            dialogImport: false,
            excelFile: null,

            //Variable ID Kategori Pelanggaran for edit, delete and update.
            pelanggaran_id: null,

            payload_img: null,
            payloads: {
                siswa: 0,
                kelas: 0,
                waliKelas: 0,
                jenisPelanggaran: 0,
                pelapor: '',
                description: '',
                waktuPelanggaran: '00:00:00',
                tanggalPelanggaran: '',
                createdBy: 0,
            },

            //Select2 Options
            siswaOptions: [],
            kelasOptions: [],
            waliKelasOptions: [],
            jenisPelanggaranOptions: [],

            // Form rules
            rules: {
                siswaRules: [
                    (v) => !!v || 'Siswa harus diisi',
                ],
                kelasRules: [
                    (v) => !!v || 'Nama kelas harus diisi',
                ],
                waliKelasRules: [
                    (v) => !!v || 'Wali kelas harus diisi',
                ],
                jenisPelanggaranRules: [
                    (v) => !!v || 'jenis pelanggaran harus diisi',
                ],
                waktuPelanggaranRules: [
                    (v) => !!v || 'Waktu pelanggaran harus diisi',
                ],
                tanggalPelanggaranRules: [
                    (v) => !!v || 'tanggal pelanggaran harus diisi',
                ],
            }
        }
    },

    computed: {
        endpoint() {
            return `${process.env.VUE_APP_BASE_ENDPOINT_DEV}/api/v1`;
        },

        totalItems() {
            return this.dataPelanggaran.length;
        },

        totalPages() {
            return Math.ceil(this.totalItems / this.itemsPerPage);
        },

        ...mapGetters(["currentUser"]),

        //Check Form Validation
        checkValidForms() {
            const { payloads } = this;

            const formIsFilled = !!(payloads.siswa && payloads.kelas && payloads.waliKelas && payloads.jenisPelanggaran && payloads.waktuPelanggaran && payloads.tanggalPelanggaran);

            return !(formIsFilled);
        },
    },

    methods: {
        updatePayload(key, value) {
            // Tambahkan data baru ke dalam objek payloads
            this.$set(this.payloads, key, value);
            // this.payloads[key] = value;
        },

        updateImagePayload(event) {
            if (!event) {
                return;
            }

            const file = event.type;

            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            
            if (!validTypes.includes(file)) {
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid File Type',
                    text: 'Tipe file tidak boleh selain (JPEG, jpg, PNG, GIF).',
                }).then(() => {
                    this.payload_img = undefined;
                });
            }

            this.payload_img = event;
        },

        checkImportFileType(event) {
            if (!event) {
                return;
            }

            const file = event.type;

            const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
            if (!validTypes.includes(file)) {
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid File Type',
                    text: 'Tipe file tidak boleh selain (.xls atau .xlsx).',
                }).then(() => {
                    this.excelFile = undefined;
                });
            }
        },

        //Tambah dan Edit data
        async submitData() {
            const { endpoint, payloads } = this;
            const restPayloads = { ...payloads };
            this.loader = true;

            // Hapus key yang memiliki nilai undefined
            Object.keys(restPayloads).forEach(key => restPayloads[key] === undefined && delete restPayloads[key]);

            let formData = new FormData();
            if (this.editFlagging) {
                formData.append('_method', 'PUT'); // Method override for PUT
            }
            Object.entries(restPayloads).forEach(([key, value]) => formData.append(key, value));
            formData.append('buktiPelanggaran', this.payload_img);
            formData.append('createdBy', this.currentUser.id);

            const apiEndpoint = this.editFlagging ? `${endpoint}/pelanggaran/${this.pelanggaran_id}` : `${endpoint}/pelanggaran`;
            // const apiMethod = this.editFlagging ? ApiService.put : ;

            try {
                ApiService.setHeader();
                const resp = await ApiService.post(apiEndpoint, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                });
                const action = this.editFlagging ? 'edit' : 'tambah';
                this.dialogStatus(action, 'success', `Pelanggaran baru siswa  ${resp.data?.data?.siswa.nama}`);
                //Refresh form
                this.clearForm();
                this.getPelanggaranFromApi();
            } catch (error) {
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
            } finally {
                this.loader = false;
            };
        },

        //Get Data from Api
        async getPelanggaranFromApi() {
            this.loader = true;
            ApiService.setHeader();

            try {
                const resp = await ApiService.get(`${this.endpoint}/pelanggaran`);
                this.dataPelanggaran = resp.data.data;

                if (this.dataPelanggaran.length > 0) {
                    const setKey = ['pelapor', 'waktuPelanggaran', 'tanggalPelanggaran'];
                    const dataArray = Object.entries(this.dataPelanggaran[0]);

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
                        { text: 'Siswa', align: 'center', value: 'siswa.nama', sortable: false },
                        { text: 'Kelas', align: 'center', value: 'kelas.description', sortable: false },
                        { text: 'Wali Kelas', align: 'center', value: 'waliKelas.namaWaliKelas', sortable: false },
                        { text: 'Jenis Pelanggaran', align: 'center', value: 'jenisPelanggaran.penjelasan', sortable: false },
                    ];

                    const actionsHeader = [
                        { text: 'Dibuat Oleh', align: 'center', value: 'createdBy.name', sortable: false },
                        { text: 'AKSI', align: 'center', value: 'actions', sortable: false }
                    ];

                    this.headers = [...additionalHeaders, ...responHead, ...actionsHeader];
                }
            } catch (err) {
                console.error('Error fetching data:', err);

                this.dialogStatus('fetch', 'error', 'server error')
            } finally {
                this.loader = false;
            }
        },

        pelanggaranSiswaHandleEdit(item) {
            if (item && typeof item === 'object' && item !== null) {

                // Scroll To Top after edit icon is Clicked
                window.scrollTo({ top: 0, behavior: 'smooth' });

                this.editFlagging = true;
                this.pelanggaran_id = item.id;
                this.payloads.createdBy = this.currentUser.id;

                const idKeys = ['siswa', 'kelas', 'waliKelas', 'jenisPelanggaran'];

                Object.entries(item).forEach(([key, value]) => {
                    if (idKeys.includes(key)) {
                        this.updatePayload(key, value.id);
                    } else {
                        this.updatePayload(key, value);
                    }
                });
            } else {
                console.error('Invalid parameter: item harus berupa objek.');
            }
        },

        pelanggaranSiswaHandleDelete(item) {
            // alert("This is delete button");
            this.pelanggaran_id = item.id;

            this.dialogConfirmations('hapus', item.siswa.nama, 'confirmDeleteSiswa')
        },

        async confirmDeleteSiswa() {
            const { pelanggaran_id, endpoint } = this;
            this.loader = true;
            ApiService.setHeader();

            try {
                const resp = await ApiService.delete(`${endpoint}/pelanggaran/${pelanggaran_id}`);
                this.jenis_pelanggaran_id = null;
                this.dialogStatus('hapus', 'success', `Pelanggaran siswa ${resp.data?.data?.siswa.nama}`);

                // Refresh Form
                this.clearForm();
                this.getPelanggaranFromApi();
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
                this.uploadExcelFile(this.excelFile);
            } else {
                alert('Please select a file first.');
            }
        },

        uploadExcelFile(file) {
            const { endpoint } = this;

            let formData = new FormData();
            formData.append('file', file);
            this.loader = true

            ApiService.setHeader();
            ApiService.post(`${endpoint}/import/pelanggaran`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then(response => {
                    this.dialogImport = false;
                    this.excelFile = null;
                    this.getPelanggaranFromApi();

                    console.log('Berhasil import file:', response.data);
                    this.dialogStatus('import', 'success', response.data.message);
                })
                .catch(error => {
                    console.error('Error mengupload file:', error);
                    this.dialogStatus('import', 'error', error.message);
                })
                .finally(() => {
                    this.loader = false;
                })
        },

        sendWhatsappMessageToTeacher(data) {
            const { endpoint } = this;

            this.dialogLoading('send');

            ApiService.setHeader();
            ApiService.post(`${endpoint}/message`, {
                target: data.waliKelas.noTelepon,
                message: `Ini adalah pesan otomatis jangan balas pesan ini. 
                
Diberitahukan anak siswa yang bernama: ${data.siswa.nama} telah melakukan pelanggaran pada tanggal ${data.tanggalPelanggaran} dengan jenis pelanggaran ${data.jenisPelanggaran.penjelasan}. Terima kasih.`,
                countryCode: '62'
            })
                .then(response => {
                    this.dialogStatus('send', 'success', `Pesan berhasil terkirim ke Guru dengan nomor: ${response.data.target[0]}`);
                })
                .catch(error => {
                    console.error('Gagal mengirim pesan:', error);
                })
        },

        sendWhatsappMessageToParent(data) {
            const { endpoint } = this;

            // Display loading alert
            this.dialogLoading('send');

            ApiService.setHeader();
            ApiService.post(`${endpoint}/message`, {
                target: data.siswa.noTeleponWali,
                message: `Ini adalah pesan otomatis jangan balas pesan ini. 
                
Diberitahukan anak siswa yang bernama: ${data.siswa.nama} telah melakukan pelanggaran pada tanggal ${data.tanggalPelanggaran} dengan jenis pelanggaran ${data.jenisPelanggaran.penjelasan}. Terima kasih.`,
                countryCode: '62'
            })
                .then(response => {
                    // Handle success response as needed
                    this.dialogStatus('send', 'success', `Pesan berhasil terkirim ke Wali Siswa dengan nomor: ${response.data.target[0]}`);
                })
                .catch(error => {
                    // Handle error
                    console.error('Gagal mengirim pesan:', error);
                });
        },

        getSelect2Siswa() {
            const { endpoint } = this;

            ApiService.setHeader();
            ApiService.get(`${endpoint}/select2/siswa`)
                .then(resp => {
                    this.siswaOptions = resp.data?.data;
                })
                .catch(err => {
                    console.error('Gagal mengambil data Select2 Siswa: ', err);
                })
        },

        getSelect2Kelas() {
            const { endpoint } = this;

            ApiService.setHeader();
            ApiService.get(`${endpoint}/select2/kelas`)
                .then(resp => {
                    this.kelasOptions = resp.data?.data;
                })
                .catch(err => {
                    console.error('Gagal mengambil data Select2 kelas: ', err);
                })
        },

        getSelect2WalIKelas() {
            const { endpoint } = this;

            ApiService.setHeader();
            ApiService.get(`${endpoint}/select2/waliKelas`)
                .then(resp => {
                    this.waliKelasOptions = resp.data?.data;
                })
                .catch(err => {
                    console.error('Gagal mengambil data Select2 wali kelas: ', err);
                })
        },

        getSelect2JenisPelanggaran() {
            const { endpoint } = this;

            ApiService.setHeader();
            ApiService.get(`${endpoint}/select2/jenisPelanggaran`)
                .then(resp => {
                    this.jenisPelanggaranOptions = resp.data?.data;
                })
                .catch(err => {
                    console.error('Gagal mengambil data Select2 jenis pelanggaran: ', err);
                    this.dialogStatus('fetch', 'error', 'server error')
                })
        },

        onPageChange(newPage) {
            this.page = newPage;
        },

        clearForm() {
            this.pelanggaran_id = null;
            this.editFlagging = false;
            
            this.$refs.form.reset();
        },
    },


    mounted() {
        this.getPelanggaranFromApi();
        this.getSelect2Siswa() || this.getSelect2Kelas() || this.getSelect2WalIKelas() || this.getSelect2JenisPelanggaran();
        this.$store.dispatch(SET_BREADCRUMB, [{ title: 'Master Pelanggaran Siswa' }]);
    },
};

</script>