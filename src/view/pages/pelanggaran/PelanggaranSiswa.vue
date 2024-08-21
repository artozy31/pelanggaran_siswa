a<template>
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
                                        <v-autocomplete outlined clearable label="Wali Kelas *" type="text"
                                            :value="payloads.waliKelas" :rules="rules.waliKelasRules"
                                            @input="updatePayload('waliKelas', $event)" :items="waliKelasOptions"
                                            item-text="nama_wali_kelas" item-value="id">
                                        </v-autocomplete>
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
                                                    clearable outlined required readonly append-icon="mdi-clock-outline"
                                                    :value="payloads.waktuPelanggaran"
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
                                                <v-combobox v-bind="attrs" v-on="on" label="Tanggal Pelanggaran *"
                                                    clearable outlined required readonly append-icon="mdi-calendar"
                                                    :value="payloads.tanggalPelanggaran"
                                                    @input="updatePayload('tanggalPelanggaran', $event)"
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
                                            label="Bukti Pelanggaran" outlined chips show-size
                                            @change="updateImagePayload"></v-file-input>
                                    </v-col>
                                </v-row>
                            </v-form>
                        </v-card-text>

                        <v-card-actions>
                            <v-row>
                                <v-col class="text-right">
                                    <v-btn class="p-5 mr-3 text-white" color="blue-grey" @click="clearForm">
                                        <v-icon class="icon mr-2">{{ 'mdi-delete-circle' }}</v-icon>
                                        Bersihkan
                                    </v-btn>

                                    <v-btn class="btn-blue-style p-5"
                                        @click="dialogConfirmations('tambah', `pelanggaran baru ?`, 'submitData')"
                                        :disabled="checkValidForms">
                                        <v-icon class="icon mr-2">{{ 'mdi-plus-circle' }}</v-icon>
                                        Tambah
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
            <v-row>
                <v-col cols="12" md="6">
                    <v-text-field v-model="search" append-icon="search" label="Cari ..." hide-details
                        outlined></v-text-field>
                </v-col>
            </v-row>

            <v-data-table :page="page" :items-per-page="itemsPerPage" :headers="headers" :items="dataPelanggaran"
                :search="search" :loading="loader" loading-text="Tunggu sebentar..." :sort-by="['id']"
                :sort-desc="['true']">
            </v-data-table>
        </v-card>
    </div>
</template>

<script>
import ApiService from "@/core/services/api.service";
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";
import { mapGetters } from "vuex";

//Composable Cames Case To Words
import { camelCaseToWords } from "./components/CamelCaseToWords.js";

// Import SweetAlert2
import { sweetAlertDialogs } from "./components/dialog-status/sweet-alert2.js";
// import Swal from "sweetalert2";


export default {
    name: "pelanggaran-siswa",
    mixins: [sweetAlertDialogs],

    data() {
        return {
            //Flagger
            showInputData: true,
            dateDialog: false,
            timePickerModel: false,

            //Table Variables
            page: 1,
            itemsPerPage: 5,
            search: '',
            headers: [],
            dataPelanggaran: [],
            loader: false,

            payload_img: undefined,
            payloads: {
                siswa: 0,
                kelas: 0,
                waliKelas: 0,
                jenisPelanggaran: 0,
                pelapor: '',
                description: '',
                waktuPelanggaran: '00:00:00',
                tanggalPelanggaran: '',
                // buktiPelanggaran: undefined,
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
                    (v) => !!v || 'Jenis pelanggaran harus diisi',
                ],
                waktuPelanggaranRules: [
                    (v) => !!v || 'Waktu pelanggaran harus diisi',
                ],
                tanggalPelanggaranRules: [
                    (v) => !!v || 'Tanggal pelanggaran harus diisi',
                ],
            }
        }
    },

    computed: {
        endpoint() {
            return `${process.env.VUE_APP_BASE_ENDPOINT_DEV}/api/v1`;
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
        },

        updateImagePayload(event) {
            this.payload_img = event;
        },

        //Tambah dan Edit data
        async submitData() {
            const { endpoint, payloads } = this;
            const restPayloads = { ...payloads };
            this.loader = true;
            console.log('==============> restPayloads', restPayloads);

            // Hapus key yang memiliki nilai undefined
            Object.keys(restPayloads).forEach(key => restPayloads[key] === undefined && delete restPayloads[key]);

            let formData = new FormData();
            Object.entries(restPayloads).forEach(([key, value]) => formData.append(key, value));
            if (this.payload_img) {
                formData.append('buktiPelanggaran', this.payload_img);
            }
            formData.append('createdBy', this.currentUser.id);

            try {
                ApiService.setHeader();
                const resp = await ApiService.post(`${endpoint}/pelanggaran`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                });
                console.log('==============> formData', formData);
                this.dialogStatus('tambah', 'success', `Pelanggaran baru siswa ${resp.data.data.siswa.nama}`);

                //Refresh form
                this.clearForm();
                this.getPelanggaranFromApi();
            } catch (error) {
                console.log('==============> error', error);
                if (error.response) {
                    console.error('HTTP error:', error.response.data);
                    const errorMessage = error.response.data?.errors || `Gagal 'tambah' data`;
                    this.dialogStatus('tambah', 'error', errorMessage);
                } else if (error.request) {
                    console.error('Network error:', error.request);
                    this.dialogStatus('tambah', 'error', "Tidak ada respon dari server. Silakan coba lagi.");
                } else {
                    console.error('Error:', error.message);
                    this.dialogStatus('tambah', 'error', "Ada yang salah ketika menambahkan data dari server. Silakan coba lagi.");
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
                        { text: 'Wali Kelas', align: 'center', value: 'waliKelas.nama', sortable: false },
                        { text: 'Jenis Pelanggaran', align: 'center', value: 'jenisPelanggaran.penjelasan', sortable: false },
                    ];

                    const actionsHeader = [
                        { text: 'Dibuat oleh', align: 'center', value: 'createdBy.name', sortable: false },
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

        getSelect2TahunAjaran() {
            const { endpoint } = this;

            ApiService.setHeader();
            ApiService.get(`${endpoint}/select2/waliKelas`)
                .then(resp => {
                    this.waliKelasOptions = resp.data?.data;
                })
                .catch(err => {
                    console.error('Gagal mengambil data wali kelas: ', err);
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
                })
        },

        onPageChange(newPage) {
            this.page = newPage;
        },

        //Clear Form
        clearForm() {
            this.$refs.form.reset();
        },
    },


    mounted() {
        this.getPelanggaranFromApi();
        this.getSelect2Siswa() || this.getSelect2Kelas() || this.getSelect2TahunAjaran() || this.getSelect2JenisPelanggaran();
        this.$store.dispatch(SET_BREADCRUMB, [{ title: 'Master Pelanggaran Siswa' }]);
    },
};

</script>