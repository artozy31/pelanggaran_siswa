<template>
    <div class="card card-custom bg-gray-100 card-stretch gutter-b">
        <v-card class="hb-card-table-style">
            <v-col cols="12" md="6">
                <v-text-field v-model="search" append-icon="search" label="Cari ..." hide-details
                    outlined></v-text-field>
            </v-col>

            <v-data-table :page="page" :items-per-page="itemsPerPage" :headers="headers" :items="filteredDataSiswa"
                :search="search" :loading="loader" loading-text="Tunggu sebentar..." :sort-by="['totalPoinPelanggaran']"
                :sort-asc="['true']">
                <template v-slot:item.totalPoinPelanggaran="{ item }">
                    <v-chip outlined :color="getColor(item.totalPoinPelanggaran)">{{ item.totalPoinPelanggaran
                        }}</v-chip>
                </template>

                <template v-slot:item.siswa.statusSanksi="{ item }">
                    <v-btn text @click="toggleSanksiStatus(item)">
                        <v-icon :color="item.siswa.statusSanksi ? 'success' : 'grey'">
                            mdi-check-circle
                        </v-icon>
                    </v-btn>
                </template>

                <template v-slot:item.selectKategori="{ item }">
                    <v-select :items="sanksiOptions" v-model="item.siswa.kategoriSanksi.id" item-value="id"
                        @change="updateSanksi(item)" solo-filled>
                        <!-- Slot untuk menampilkan opsi dengan kategori dan description -->
                        <template v-slot:item="{ item, index }">
                            <v-list-item-content>
                                <v-list-item-title v-text="item.kategori"></v-list-item-title>
                                <v-list-item-subtitle v-text="item.description"></v-list-item-subtitle>
                            </v-list-item-content>
                        </template>

                        <!-- Slot untuk menampilkan pilihan yang telah dipilih -->
                        <template v-slot:selection="{ item, index }">
                            <v-list-item-content>
                                <v-list-item-title v-text="item.kategori"></v-list-item-title>
                                <v-list-item-subtitle v-text="item.description"></v-list-item-subtitle>
                            </v-list-item-content>
                        </template>
                    </v-select>
                </template>

            </v-data-table>
        </v-card>

        <v-divider></v-divider>

        <v-card class="hb-card-table-style">
            <v-col cols="12" md="6">
                <v-text-field v-model="search" append-icon="search" label="Cari ..." hide-details
                    outlined></v-text-field>
            </v-col>

            <v-data-table :page="page" :items-per-page="itemsPerPage" :headers="headers" :items="allDataSiswa"
                :search="search" :loading="loader" loading-text="Tunggu sebentar..." :sort-by="['totalPoinPelanggaran']"
                :sort-asc="['true']">
                <!-- ? COLUMN STATUS SANKSI -->
                <template v-slot:item.totalPoinPelanggaran="{ item }">
                    <v-chip outlined :color="getColor(item.totalPoinPelanggaran)">{{ item.totalPoinPelanggaran
                        }}</v-chip>
                </template>

                <!-- ? COLUMN STATUS SANKSI -->
                <template v-slot:item.siswa.statusSanksi="{ item }">
                    <v-btn text @click="toggleSanksiStatus(item)">
                        <v-icon :color="item.siswa.statusSanksi ? 'success' : 'grey'">
                            mdi-check-circle
                        </v-icon>
                    </v-btn>
                </template>

                <!-- ? COLUMN KATEGORI SANKSI -->
                <template v-slot:item.selectKategori="{ item }">
                    <v-select :items="sanksiOptions" v-model="item.siswa.kategoriSanksi.id" item-value="id"
                        @change="updateSanksi(item)" solo-filled>
                        <!-- Slot untuk menampilkan opsi dengan kategori dan description -->
                        <template v-slot:item="{ item, index }">
                            <v-list-item-content>
                                <v-list-item-title v-text="item.kategori"></v-list-item-title>
                                <v-list-item-subtitle v-text="item.description"></v-list-item-subtitle>
                            </v-list-item-content>
                        </template>

                        <!-- Slot untuk menampilkan pilihan yang telah dipilih -->
                        <template v-slot:selection="{ item, index }">
                            <v-list-item-content>
                                <v-list-item-title v-text="item.kategori"></v-list-item-title>
                                <v-list-item-subtitle v-text="item.description"></v-list-item-subtitle>
                            </v-list-item-content>
                        </template>
                    </v-select>
                </template>
            </v-data-table>
        </v-card>
    </div>
</template>

<script>
import ApiService from "@/core/services/api.service";
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";

//Composable Cames Case To Words
import { camelCaseToWords } from "../components/CamelCaseToWords.js";

// Import SweetAlert2
// import { sweetAlertDialogs } from "../components/dialog-status/sweet-alert2.js";

export default {
    name: "list-data-siswa",
    // mixins: [sweetAlertDialogs],

    data() {
        return {
            //Table Variables
            page: 1,
            itemsPerPage: 10,
            search: '',
            headers: [],
            dataSiswa: [],
            sanksiOptions: [],
            loader: false,

            // Dialog Timeline
            dialogLog: {
                show: false,
                data: {},
                items: [],
            },
        }
    },

    computed: {
        endpoint() {
            return `${process.env.VUE_APP_BASE_ENDPOINT_DEV}/api/v1`;
        },
        filteredDataSiswa() {
            return this.dataSiswa.filter(item => item.totalPoinPelanggaran < 50 && item.siswa.statusSanksi === 0);
        },
        allDataSiswa() {
            return this.dataSiswa;
        }
    },

    methods: {
        // itemProps(item) {
        //     return {
        //         title: item.kategori,
        //         subtitle: item.description,
        //     }
        // },
        updateSanksi(item) {
            this.loader = true;

            // Extract the new sanksi ID from the item
            const newSanksiId = item.siswa.kategoriSanksi.id;

            ApiService.setHeader();
            ApiService.patch(`${this.endpoint}/siswa/${item.siswa.id}`, {
                sanksi_id: newSanksiId // Assuming this is the correct field name for the API
            })
                .catch(err => {
                    console.error('Error updating data:', err);
                    this.dialogStatus('update', 'error', 'server error');
                })
                .finally(() => {
                    this.loader = false;
                    this.getSiswaFromApi(); // Refresh the data
                });
        },
        toggleSanksiStatus(item) {
            // console.log('==============> item', item);
            // Toggle the status
            item.siswa.statusSanksi = item.siswa.statusSanksi ? 0 : 1;
            this.loader = true

            ApiService.setHeader();
            ApiService.patch(`${this.endpoint}/siswa/${item.siswa.id}`, {
                status_sanksi: item.siswa.statusSanksi
            })
                .catch(err => {
                    console.error('Error updating data:', err);
                    this.dialogStatus('update', 'error', 'server error');
                })
                .finally(() => {
                    this.loader = false;
                    this.getSiswaFromApi();
                });
        },
        selectSanksi(item, sanksi) {
            item.statusSanksi.kategori = sanksi.description;
            // Lakukan sesuatu dengan pilihan sanksi, seperti menyimpan data ke server
        },
        //Get Data from Api
        async getSiswaFromApi() {
            this.loader = true;
            ApiService.setHeader();

            try {
                const resp = await ApiService.get(`${this.endpoint}/total-poin-pelanggaran`);
                this.dataSiswa = resp.data.data;

                if (this.dataSiswa.length > 0) {
                    const setKey = ['totalPoinPelanggaran'];
                    const dataArray = Object.entries(this.dataSiswa[0]);

                    const responHead = dataArray.reduce((acc, key) => {
                        if (setKey.includes(key[0])) {
                            acc.push({
                                text: camelCaseToWords(key[0]),
                                align: 'center',
                                value: key[0],
                            });
                        }
                        return acc;
                    }, []);

                    const additionalHeaders = [
                        { text: 'Nama Siswa', align: 'center', value: 'siswa.nama', sortable: false },
                        { text: 'NISN', align: 'center', value: 'siswa.nisn', sortable: false },
                        // { text: 'Jenis Kelamin', align: 'center', value: 'siswa.jenisKelamin', sortable: false },
                        // { text: 'Tindak Lanjut', align: 'center', value: 'siswa.status_sanksi', sortable: false },
                    ];

                    const actionsHeader = [
                        { text: 'Status Sanksi', align: 'left', value: 'siswa.statusSanksi', sortable: true },
                        { text: 'Kategori Sanksi', align: 'left', value: 'siswa.kategoriSanksi.kategori', sortable: false },
                        { text: 'Test Select Sanksi', align: 'center', value: 'selectKategori', sortable: false },
                        // { text: 'AKSI', align: 'center', value: 'actions', sortable: false }
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

        getColor(totalPoinPelanggaran) {
            if (totalPoinPelanggaran < 50) return 'red'
            else return 'green'
        },

        getSanksiOptions() {
            const { endpoint } = this;

            ApiService.setHeader();
            ApiService.get(`${endpoint}/sanksi`)
                .then((response) => {
                    this.sanksiOptions = response.data.data;
                    console.log('==============> this.sanksiOptions', this.sanksiOptions);
                    // this.dataLastWeek = response.data.data.last_week.total;
                })
                .catch((error) => {
                    console.error(error)
                })
        },

        onPageChange(newPage) {
            this.page = newPage;
        },
    },

    mounted() {
        this.getSiswaFromApi();
        this.getSanksiOptions();
        this.$store.dispatch(SET_BREADCRUMB, [{ title: 'Tindak Lanjut' }]);
    }
};

</script>