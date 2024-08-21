<template>
    <div class="card card-custom bg-gray-100 card-stretch gutter-b">
        <v-card class="hb-card-table-style">
            <v-col cols="12" md="6">
                <v-text-field v-model="search" append-icon="search" label="Cari ..." hide-details
                        outlined></v-text-field>
            </v-col>

            <v-data-table :page="page" :items-per-page="itemsPerPage" :headers="headers" :items="dataSiswa"
                :search="search" :loading="loader" loading-text="Tunggu sebentar..." :sort-by="['id']"
                :sort-desc="['true']">
                <template v-slot:item.actions="{ item }">
                    <v-menu offset-y>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn text v-bind="attrs" v-on="on"><v-icon
                                    class="action-icons">mdi-settings</v-icon></v-btn>
                        </template>

                        <v-list>
                            <v-list-item @click="timelineLog(item, 'show')">
                                <v-icon class="action-icons">mdi-format-list-bulleted</v-icon>
                                <b class="action-icons">Detail</b>
                            </v-list-item>

                            <v-list-item @click="exportData(item, 'show')">
                                <v-icon class="action-icons">mdi-file-excel</v-icon>
                                <b class="action-icons">Export</b>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </template>
            </v-data-table>
        </v-card>

        <log-timeline-dialog :dialog="dialogLog.show" :logs="dialogLog.data" :timelineItems="dialogLog.items"
            @close="timelineLog(null, 'hide')" />
    </div>
</template>

<script>
import ApiService from "@/core/services/api.service";
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";

//Composable Cames Case To Words
import { camelCaseToWords } from "./components/CamelCaseToWords.js";

// Import SweetAlert2
import { sweetAlertDialogs } from "./components/dialog-status/sweet-alert2.js";

import LogTimelineDialog from "@/view/pages/pelanggaran/components/dialog-timeline";
// import fileDownload from 'js-file-download';
import JwtService from "@/core/services/jwt.service";
import axios from "axios";

export default {
    name: "list-data-siswa",
    mixins: [sweetAlertDialogs],

    data() {
        return {
            //Table Variables
            page: 1,
            itemsPerPage: 20,
            search: '',
            headers: [],
            dataSiswa: [],
            loader: false,

            // Dialog Timeline
            dialogLog: {
                show: false,
                data: {},
                items: [],
            },
        }
    },

    components: {
        LogTimelineDialog,
    },

    computed: {
        endpoint() {
            return `${process.env.VUE_APP_BASE_ENDPOINT_DEV}/api/v1`;
        },
    },

    methods: {
        //Get Data from Api
        async getSiswaFromApi() {
            this.loader = true;
            ApiService.setHeader();

            try {
                const resp = await ApiService.get(`${this.endpoint}/siswa`);
                this.dataSiswa = resp.data.data;
                console.log('==============> this.dataSiswa', this.dataSiswa);

                if (this.dataSiswa.length > 0) {
                    const setKey = ['nama', 'nisn', 'kelas', 'noTeleponSiswa', 'waliKelasSiswa', 'teleponWaliKelas'];
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

                    // const additionalHeaders = [
                    //     { text: 'Data Dibuat Oleh', align: 'center', value: 'createdBy.name', sortable: false },
                    // ];

                    const actionsHeader = [{ text: 'AKSI', align: 'center', value: 'actions', sortable: false }];

                    this.headers = [...responHead, ...actionsHeader];
                }
            } catch (err) {
                console.error('Error fetching data:', err);

                this.dialogStatus('fetch', 'error', 'server error')
            } finally {
                this.loader = false;
            }
        },

        timelineLog(data, param) {
            if (param == 'show') {
                this.dialogLog.show = true;
                if (data !== null) {
                    this.dialogLog.data = data;
                    const setup = { color: 'light-blue darken-4', icon: 'mdi-history', fillDot: true };
                    this.dialogLog.items = data.pelanggaran.map(i => ({ ...i, setup }))
                }
            } else {
                this.dialogLog.show = false;
                this.dialogLog.data = {};
                this.dialogLog.items = [];
            }
        },

        exportData(data, param) {
            const { endpoint } = this; // Assuming endpoint is defined correctly elsewhere

            try {
                if (param === 'show') {
                    axios.get(`${endpoint}/export/siswa/${data.id}`, {
                        headers: {
                            'Authorization': `Bearer ${JwtService.getToken()}`
                        },
                        responseType: 'blob' // Ensure response type is blob for file download
                    })
                        .then(response => {
                            // Create a blob URL for the downloaded file
                            const url = window.URL.createObjectURL(new Blob([response.data]));

                            // Create a link element to trigger download
                            const link = document.createElement('a');
                            link.href = url;
                            link.setAttribute('download', `siswa_${data.nama}_${Date()}.xlsx`); // Set desired file name with proper extension
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link); // Clean up after download
                        })
                        .catch(error => {
                            console.error('Error exporting data:', error);
                        });
                }
            } catch (error) {
                console.error('Error Export Data:', error);
                // Handle errors if necessary
            }
        },

        onPageChange(newPage) {
            this.page = newPage;
        },
    },

    mounted() {
        this.getSiswaFromApi();
        this.$store.dispatch(SET_BREADCRUMB, [{ title: 'Riwayat Siswa' }]);
    }
};

</script>