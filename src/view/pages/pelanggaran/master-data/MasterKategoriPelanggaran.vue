a<template>
    <div class="page-margin">

        <v-card class="hb-input-form-style">
            <v-card-title class="bg-form-title" @click="showInputData = !showInputData" role="button">
                <h3>Tambah Data Kategori Pelanggaran</h3>
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
                                <v-col>
                                    <FormTextField outlined required label="Kategori Pelanggaran" type="text"
                                        v-model="payloads.description"></FormTextField>
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
                                        @click="dialogConfirmations(editFlagging ? 'edit' : 'tambah', payloads.description, 'saveData')"
                                        :disabled="formIsNotFilled">
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
            <v-col cols="12" md="6">
                <v-text-field v-model="search" append-icon="search" label="Cari ..." hide-details
                    outlined></v-text-field>
            </v-col>

            <v-data-table :page="page" :items-per-page="itemsPerPage" :headers="headers"
                :items="dataKategoriPelanggaran" :search="search" :loading="loader" loading-text="Tunggu sebentar..."
                hide-default-footer :sort-by="['id']" :sort-desc="['true']">
                <template v-slot:item.actions="{ item }">
                    <v-menu offset-y>
                        <!-- Memberikan Kontent yang akan ditampilkan dengan menu menggunakan activator. -->
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn text v-bind="attrs" v-on="on"><v-icon
                                    class="action-icons">mdi-settings</v-icon></v-btn>
                        </template>

                        <v-list>
                            <v-list-item @click="editKategoriPelanggaran(item)">
                                <v-icon class="action-icons">mdi-pencil</v-icon>
                                <b class="action-icons">Edit</b>
                            </v-list-item>

                            <v-list-item @click="kategoriPelanggaranHandleDelete(item)">
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
    name: "kategori-pelanggaran",
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
            pagesTotalData: null,
            search: '',
            headers: [],
            dataKategoriPelanggaran: [],
            loader: false,

            //Variable ID Kategori Pelanggaran for edit, delete and update.
            kategori_pelanggaran_id: null,

            payloads: {
                description: '',
            },
        }
    },

    computed: {
        endpoint() {
            return `${process.env.VUE_APP_BASE_ENDPOINT_DEV}/api/v1`;
        },

        totalItems() {
            return this.dataKategoriPelanggaran.length;
        },

        totalPages() {
            return Math.ceil(this.totalItems / this.itemsPerPage);
        },

        //Check Form Validation
        formIsNotFilled() {
            if (!this.payloads.description) {
                return true
            } else {
                return false
            }
        },
    },

    methods: {
        //Tambah dan Edit data
        saveData() {
            const { endpoint, payloads } = this;
            const restPayload = { ...payloads };

            this.loader = true;

            ApiService.setHeader();

            const apiEndpoint = this.editFlagging ? `${endpoint}/kategoriPelanggaran/${this.kategori_pelanggaran_id}` : `${endpoint}/kategoriPelanggaran`;
            const apiMethod = this.editFlagging ? ApiService.put : ApiService.post;

            apiMethod(apiEndpoint, restPayload)
                .then(resp => {
                    const action = this.editFlagging ? 'edit' : 'tambah';
                    this.dialogStatus(action, 'success', resp.data.message);

                    //Refresh form
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
                });
        },

        //Get Data from Api
        async getJenisPelanggaranFromApi() {
            this.loader = true;
            ApiService.setHeader();

            try {
                const resp = await ApiService.get(`${this.endpoint}/kategoriPelanggaran`);
                this.dataKategoriPelanggaran = resp.data.data;

                if (this.dataKategoriPelanggaran.length > 0) {
                    const setKey = ['description'];
                    const dataArray = Object.entries(this.dataKategoriPelanggaran[0]);

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

        editKategoriPelanggaran(item) {
            //Scroll To Top after edit icon is Clicked
            window.scrollTo({ top: 0, behavior: 'smooth' });

            this.editFlagging = true;
            this.kategori_pelanggaran_id = item.id;

            // //Ambil Dari Table
            this.payloads = {
                description: item.description,
            }
        },

        kategoriPelanggaranHandleDelete(item) {
            // alert("This is delete button");
            this.kategori_pelanggaran_id = item.id;

            this.dialogConfirmations('hapus', item.description, 'confirmDeleteKategoriPelanggaran')
        },

        async confirmDeleteKategoriPelanggaran() {
            const { kategori_pelanggaran_id, endpoint } = this;
            this.loader = true;
            ApiService.setHeader();

            try {
                const resp = await ApiService.delete(`${endpoint}/kategoriPelanggaran/${kategori_pelanggaran_id}`);
                this.jenis_pelanggaran_id = null;
                this.dialogStatus('hapus', 'success', `${resp.data?.message} ${resp.data?.data?.description}`);

                // Refresh Form
                this.clearForm();
                this.getJenisPelanggaranFromApi();
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

        onPageChange(newPage) {
            this.page = newPage;
        },

        //Clear Form
        clearForm() {
            this.kategori_pelanggaran_id = null;
            this.editFlagging = false;
            this.payloads = {};

            this.$refs.form.reset();
        },
    },

    mounted() {
        this.getJenisPelanggaranFromApi();
        this.$store.dispatch(SET_BREADCRUMB, [{ title: 'Master Kategori Pelanggaran' }]);
    }
};

</script>