<template>
    <div class="page-margin">
        <v-card class="hb-input-form-style">
            <v-card-title class="bg-form-title" @click="showInputData = !showInputData" role="button">
                <h3>Tambah Data Jenis Pelanggaran</h3>
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
                                        <v-autocomplete outlined required clearable label="Kategori Pelanggaran *" type="text"
                                            :value="payloads.kategori" @input="updatePayload('kategori', $event)"
                                            :rules="payload_rules.kategori_pelanggaran_rules" :items="kategoriPelanggaranOptions" item-text="description"
                                            item-value="id"></v-autocomplete>
                                    </v-col>
                                </v-row>

                                <v-row>
                                    <v-col cols="12" md="4">
                                        <v-text-field outlined required label="Penjelasan *" type="text" persistent-hint
                                            hint="Contoh: Pelanggaran A." :value="payloads.penjelasan" :rules="payload_rules.penjelasanRules"
                                            @input="updatePayload('penjelasan', $event)">
                                        </v-text-field>
                                    </v-col>

                                    <v-col cols="12" md="4">
                                        <v-text-field outlined required label="Poin Pelanggaran *"
                                            :value="payloads.poinPelanggaran"
                                            @input="updatePayload('poinPelanggaran', $event)"
                                            :rules="payload_rules.poinPelanggaranRules"></v-text-field>
                                    </v-col>

                                    <v-col cols="12" md="4">
                                        <v-text-field outlined required label="Deskripsi" type="text"
                                            :value="payloads.description"
                                            @input="updatePayload('description', $event)"></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-form>
                        </v-card-text>

                        <v-card-actions>
                            <v-spacer></v-spacer>

                            <v-btn class="p-5 mr-3 text-white" color="blue-grey" @click="clearForm">
                                <v-icon class="icon mr-2">{{ editFlagging ? 'mdi-close-circle' :
                                    'mdi-delete-circle' }}</v-icon>
                                {{ editFlagging ? 'Batal' : 'Bersihkan' }}
                            </v-btn>

                            <v-btn class="btn-blue-style p-5"
                                @click="dialogConfirmations(editFlagging ? 'edit' : 'tambah', payloads.penjelasan, 'saveData')"
                                :disabled="formIsNotFilled">
                                <v-icon class="icon mr-2">{{ editFlagging ? 'mdi-pencil-circle' : 'mdi-plus-circle'
                                    }}</v-icon>
                                {{ editFlagging ? 'Update' : 'Tambah' }}
                            </v-btn>
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

            <v-data-table :page="page" :items-per-page="itemsPerPage" :headers="headers"
                :items="dataJenisPelanggaran" :search="search" :loading="loader" loading-text="Tunggu sebentar..."
                hide-default-footer :sort-by="['id']" :sort-desc="['false']">
                <template v-slot:item.actions="{ item }">
                    <v-menu offset-y>
                        <!-- Memberikan Kontent yang akan ditampilkan dengan menu menggunakan activator. -->
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn text v-bind="attrs" v-on="on"><v-icon
                                    class="action-icons">mdi-settings</v-icon></v-btn>
                        </template>

                        <v-list>
                            <v-list-item @click="jenisPelanggaranHandleEdit(item)">
                                <v-icon class="action-icons">mdi-pencil</v-icon>
                                <b class="action-icons">Edit</b>
                            </v-list-item>

                            <v-list-item @click="jenisPelanggaranHandleUpdate(item)">
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

//Import SweetAlert2
import { sweetAlertDialogs } from "../components/dialog-status/sweet-alert2.js";

export default {
    name: "jenis-pelanggaran",
    mixins: [sweetAlertDialogs],

    data() {
        return {
            showInputData: true,
            editFlagging: false,

            //Table Variables
            page: 1,
            itemsPerPage: 5,
            search: '',
            headers: [],
            dataJenisPelanggaran: [],
            loader: false,

            // Jenis Pelanggaran ID for Edit
            jenis_pelanggaran_id: null,

            //Empty data for input
            payloads: {
                kategori: '',
                penjelasan: '',
                poinPelanggaran: 0,
                description: '',
            },

            //Select2 Options
            kategoriPelanggaranOptions: [],

            //Form Validation
            payload_rules: {
                kategori_pelanggaran_rules: [
                    (v) => !!v || 'Kategori Pelanggaran harus diisi',
                ],
                penjelasanRules: [
                    (v) => !!v || 'Penjelasan harus diisi',
                ],
                poinPelanggaranRules: [
                    (v) => (this.payloads.poinPelanggaran || !this.payloads.poinPelanggaran) && /^\d+$/.test(v) || 'Poin Pelanggaran harus terdiri dari angka',
                    (v) => (this.payloads.poinPelanggaran || !this.payloads.poinPelanggaran) && (v && (v >= 1 && v <= 100) || 'Poin Pelanggaran hanya dari 1 sampai 100'),
                    (v) => (this.payloads.poinPelanggaran || !this.payloads.poinPelanggaran) && (v && (v <= 100) || 'Poin Melebihi jumlah maksimal'),
                ],
            },
        }
    },

    computed: {
        endpoint() {
            return `${process.env.VUE_APP_BASE_ENDPOINT_DEV}/api/v1`;
        },

        totalItems() {
            return this.dataJenisPelanggaran.length;
        },

        totalPages() {
            return Math.ceil(this.totalItems / this.itemsPerPage);
        },

        //Check Form Validation
        formIsNotFilled() {
            const { payloads } = this;

            const formIsFilled = !!(payloads.kategori && payloads.penjelasan && payloads.poinPelanggaran);

            return !(formIsFilled);
        },
    },

    methods: {
        //Get Data from Api
        async getJenisPelanggaranFromApi() {
            this.loader = true;
            ApiService.setHeader();

            try {
                const resp = await ApiService.get(`${this.endpoint}/jenisPelanggaran`);
                this.dataJenisPelanggaran = resp.data.data;

                if (this.dataJenisPelanggaran.length > 0) {
                    const setKey = ['penjelasan'];
                    const dataArray = Object.entries(this.dataJenisPelanggaran[0]);

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
                        { text: 'Kategori Pelanggaran', align: 'left', value: "kategori.description", sortable: false },
                    ];

                    const actionsHeader = [
                        { text: 'Poin Pelanggaran', align: 'center', value: 'poinPelanggaran', sortable: false },
                        { text: 'Deskripsi Pelanggaran', align: 'left', value: 'description', sortable: false },
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

        //Clear Form
        clearForm() {
            this.jenis_pelanggaran_id = null;
            this.editFlagging = false;

            this.$refs.form.reset();
        },

        //Still need to fix the fetch search, to edit a data the user needs to search first !! FIX ASAP !!
        jenisPelanggaranHandleEdit(item) {
            if (item && typeof item === 'object' && item !== null) {
                //Scroll To Top after edit icon is Clicked
                window.scrollTo({ top: 0, behavior: 'smooth' });

                this.editFlagging = true;
                this.jenis_pelanggaran_id = item.id;

                Object.entries(item).forEach(([key, value]) => {
                    if (key == 'kategori') {
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

        clearSelect2Kategori() {
            this.updatePayload('kategori', null);
        },

        updatePayload(key, value) {
            // Tambahkan data baru ke dalam objek payloads
            // this.$set(this.payloads, key, value);
            this.payloads[key] = value;
        },

        getShowKategori(param) {
            const { endpoint, payloads } = this;

            ApiService.setHeader();
            ApiService.get(`${endpoint}/jenisPelanggaran/${param}`)
                .then(res => {
                    const resp_data = res.data.data;
                    payloads.kategori = resp_data.kategori.description;
                    payloads.penjelasan = resp_data.penjelasan;
                    payloads.poinPelanggaran = resp_data.poinPelanggaran;
                    payloads.description = resp_data.description;
                })
                .catch(err => {
                    console.error("Gagal : ", err)
                });
        },

        jenisPelanggaranHandleUpdate(item) {
            this.jenis_pelanggaran_id = item.id;

            this.dialogConfirmations('hapus', item.penjelasan, 'confirmDeleteJenisPelanggaran')
        },

        saveData() {
            var formIsValid = this.$refs.form.validate();
            const { endpoint, payloads } = this;
            const restPayload = { ...payloads };

            if (formIsValid == true) {
                // Input Data
                if (this.editFlagging != true) {
                    this.loader = true;

                    ApiService.setHeader();
                    ApiService.post(`${endpoint}/jenisPelanggaran`, restPayload)
                        .then(resp => {
                            this.dialogStatus('tambah', 'success', resp.data.message);

                            // Refresh Form
                            this.clearForm();
                            this.getJenisPelanggaranFromApi();
                        })
                        .catch(err => {
                            this.loader = false;
                            const result = err.response;
                            const textMessage = result?.message || result?.data?.message;
                            const listMessage = result?.data?.data;
                            console.error(result);

                            this.dialogStatus('tambah', 'error', textMessage, listMessage);
                        })
                } else {
                    // Edit Data
                    this.loader = true;
                    console.log('==============> restPayload', restPayload);
                    ApiService.setHeader();
                    ApiService.put(`${endpoint}/jenisPelanggaran/${this.jenis_pelanggaran_id}`, restPayload)
                        .then(resp => {
                            this.dialogStatus('edit', 'success', resp.data.message);

                            // Refresh Form
                            this.clearForm();
                            this.getJenisPelanggaranFromApi();
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
                                this.dialogStatus(action, 'error', `Ada yang salah saat ${action} data dari server. Silakan coba lagi.`);
                            }
                        })
                        .finally(() => {
                            this.loader = false;
                        })
                }
            } else {
                alert("Form tidak valid !");
                this.clearForm();
            }
        },

        confirmDeleteJenisPelanggaran() {
            const { jenis_pelanggaran_id, endpoint } = this;

            this.loader = true;
            ApiService.setHeader();
            ApiService.delete(`${endpoint}/jenisPelanggaran/${jenis_pelanggaran_id}`)
                .then(resp => {
                    this.jenis_pelanggaran_id = null;

                    this.dialogStatus('hapus', 'success', `${resp.data?.message} ${resp.data?.data?.penjelasan}`);

                    // Refresh Form
                    this.clearForm();
                    this.getJenisPelanggaranFromApi();
                })
                .catch((error) => {
                    console.error('==============> err', error);
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
                })
                .finally(() => {
                    this.loader = false;
                })
        },

        getSelect2KategoriPelanggaran() {
            const { endpoint } = this;

            ApiService.setHeader();
            ApiService.get(`${endpoint}/select2/kategoriPelanggaran`)
                .then(resp => {
                    this.kategoriPelanggaranOptions = resp.data?.data;
                })
                .catch(err => {
                    console.error(err);
                    console.error('Gagal mengambil data Select2 Kategori Pelanggaran: ', err);
                })
        },

        onPageChange(newPage) {
            this.page = newPage;
        },
    },

    mounted() {
        this.getJenisPelanggaranFromApi();
        this.getSelect2KategoriPelanggaran();

        this.$store.dispatch(SET_BREADCRUMB, [{ title: 'Master Jenis Pelanggaran' }]);
    }
};

</script>