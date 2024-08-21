<template>
    <div>
        <v-dialog v-model="dialog" :max-width="timelineItems !== null ? 900 : 700" persistent>
            <v-card>
                <v-card-title>
                    <span class="font-weight-normal">{{ timelineItems !== null ? 'Riwayat Pelanggaran' : 'Detail' }}</span>
                    <!-- <span class="text-blue-hb"> {{ logs.nama }}</span> -->
                    <v-btn class="text-white ml-auto" color="blue-grey" @click="closeDialog">Tutup</v-btn>
                </v-card-title>
                <v-card-subtitle>
                    Update terbaru: {{ localUpdatedAt }}
                </v-card-subtitle>

                <v-card-text class="px-0">
                    <ScrollShadow class="shadows">
                        <v-container class="my-5 px-5 py-2">
                            <v-row :justify="timelineItems !== null ? 'space-around' : 'center'">
                                <v-col :cols="timelineItems !== null ? 4 : 10" class="pr-0">
                                    <v-card elevation="5" color="light-blue darken-4">
                                        <v-card-title class="text-center border-bottom text-white" justify="center">
                                            <h2>Detail Information</h2>
                                            <br>
                                            <span>Poin Siswa: {{ 100 - totalPoinPelanggaran }}</span>
                                        </v-card-title>

                                        <v-list v-for="li in listInfo" :key="li.index" dense>
                                            <v-list-item class="my-0 py-0">
                                                <v-list-item-icon>
                                                    <v-icon color="light-blue darken-4">
                                                        {{ li.icon }}
                                                    </v-icon>
                                                </v-list-item-icon>

                                                <v-list-item-content>
                                                    <v-list-item-title class="text-wrap">{{ li.value || '-'
                                                        }}</v-list-item-title>
                                                    <v-list-item-subtitle> {{ li.subtitle }} </v-list-item-subtitle>
                                                </v-list-item-content>
                                            </v-list-item>
                                            <v-divider inset v-if="li.divider" class="my-2"></v-divider>
                                        </v-list>
                                    </v-card>
                                </v-col>

                                <v-col cols="7" class="pl-0" v-if="timelineItems !== null">
                                    <log-timeline :timelineItems="timelineItems" v-if="timelineItems?.length > 0" />
                                    <div class="text-center" v-else>
                                        Data history log belum tersedia
                                    </div>
                                </v-col>
                            </v-row>
                        </v-container>
                    </ScrollShadow>
                </v-card-text>
            </v-card>
        </v-dialog>

    </div>
</template>

<script>
import LogTimeline from './LogTimeline.vue';
import ScrollShadow from '../ScrollShadow.vue';

export default {
    data() {
        return {
            listInfo: [],
            scrollShadow: null,
        }
    },
    computed: {
        localUpdatedAt() {
            if (this.logs && this.logs.updated_at) {
                const date = new Date(this.logs.updated_at);
                return date.toLocaleString(); // Convert to local time string
            }
            return null;
        },

        totalPoinPelanggaran() {
            if (!this.logs || !this.logs.pelanggaran) return null;

            let total = 0;

            for (let pelanggaran of this.logs.pelanggaran) {
                total += pelanggaran.jenisPelanggaran.poinPelanggaran;
            }
            return total;
        }
    },
    watch: {
        logs(newValue) {
            if (newValue) {
                // console.log('*** newValue =====> ', newValue)
                this.listInfo = this.convertDataToListInfo(newValue);
            }
        }
    },
    components: {
        LogTimeline,
        ScrollShadow
    },
    props: {
        dialog: Boolean,
        logs: Object,
        timelineItems: Array,
    },
    methods: {
        convertDataToListInfo(data) {
            // console.log('==============> data', data);
            const addInfo = (icon, value, subtitle, divider = true) => ({ icon, value, subtitle, divider });

            const listInfo = [
                // data.expired_date?.start && addInfo('mdi-calendar-clock', new Date(data.expired_date.start).toISOString().split('T')[0], `Expired In ${data.expired_date.interval ?? ''}`),
                // data.hasOwnProperty('people') && addInfo('mdi-account-multiple', data.people, 'People', false),
                data.hasOwnProperty('nama') && addInfo('mdi-account-circle', data.nama, 'Nama Siswa'),
                data.hasOwnProperty('nisn') && addInfo('mdi-phone', data.nisn, 'NISN'),
                data.hasOwnProperty('tanggalLahir') && addInfo('mdi-calendar', data.tanggalLahir, 'Tanggal Lahir'),
                data.hasOwnProperty('jenisKelamin') && addInfo('mdi-gender-male-female', data.gender === 'F' ? 'Perempuan' : 'Laki-Laki', 'Jenis Kelamin'),
                data.hasOwnProperty('noTeleponSiswa') && addInfo('mdi-phone', data.noTeleponSiswa, 'Nomor Telepon'),
                data.hasOwnProperty('waliKelasSiswa') && addInfo('mdi-account-child', data.waliKelasSiswa, 'Wali Kelas Siswa'),
                data.hasOwnProperty('teleponWaliSiswa') && addInfo('mdi-phone', data.teleponWaliSiswa, 'Nomor Telepon Wali'),
                
                // Tambahkan logika lainnya sesuai kebutuhan
            ].filter(Boolean);

            // console.log('*** listInfo =====> ', listInfo);

            return listInfo;
        },
        closeDialog() {
            this.$emit('close');
        },
    },
};
</script>

<style scoped>
.shadows {
    max-height: 650px;
}
</style>