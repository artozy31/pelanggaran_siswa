<template>
    <v-timeline dense align-top>
        <v-timeline-item v-for="(item, index) in timelineItems" :key="index" :icon="item?.setup?.icon" :color="item?.setup?.color" :fill-dot="item?.setup?.fillDot" small>
            <v-card :color="item?.setup?.color" dark>
                <v-card-title class="text-subtitle-2">
                    <div class="w-100">
                        <div class="font-weight-light">Jenis Pelanggaran:</div> 
                        <span class="d-inline-block">{{ item.jenisPelanggaran.penjelasan }}</span>
                        <v-divider class="my-2"></v-divider>
                    </div>

                    <div class="mr-auto">
                        <div class="font-weight-light">Jumlah Poin Pelanggaran:</div>
                        <span class="d-inline-block">{{ item.jenisPelanggaran.poinPelanggaran }}</span>
                    </div>

                    <!-- <div class="ml-auto">
                        <div class="font-weight-light">Diperbarui:</div>
                        <span class="d-inline-block">{{ item.updated_at }}</span>
                    </div> -->
                </v-card-title>
                <v-card-text class="white text-primary pt-2">
                    <v-row>
                        <v-col>
                            <div class="text-caption">
                                Deskripsi Pelanggaran:
                            </div>
                            <v-row class="font-weight-medium" align="center">
                                <v-col>
                                    <div class="text-caption text-opacity-50">
                                        {{  item.description }}
                                    </div>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>

                    <v-expansion-panels class="mt-3 ">
                        <v-expansion-panel class="light-blue darken-4">
                            <v-expansion-panel-header>
                                Lihat selengkapnya
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <v-row>
                                    <v-col>
                                        <div class="text-caption">
                                            Bukti Pelanggaran:
                                        </div>
                                        <v-img :src="item.buktiPelanggaran" aspect-ratio="1" class="grey lighten-2 rounded-lg">
                                            <template v-slot:placeholder>
                                            <v-row class="fill-height ma-0" align="center" justify="center">
                                                <v-progress-circular
                                                indeterminate
                                                color="grey lighten-5"
                                                ></v-progress-circular>
                                            </v-row>
                                            </template>
                                        </v-img>
                                    </v-col>
                                </v-row>
            
                                <v-row>
                                    <v-col>
                                        <div class="text-caption">
                                            Waktu Pelanggaran:
                                        </div>
                                        <span class="font-weight-medium">
                                            {{ item.waktuPelanggaran }}
                                        </span>
                                    </v-col>
            
                                    <v-col>
                                        <div class="text-caption">
                                            Tanggal Pelanggaran:
                                        </div>
                                        <span class="font-weight-medium">
                                            {{ item.tanggalPelanggaran }}
                                        </span>
                                    </v-col>
                                </v-row>
            
                                <v-row>
                                    <v-col>
                                        <div class="text-caption">
                                            Pelapor:
                                        </div>
                                        <span class="font-weight-medium">
                                            {{ item.pelapor }}
                                        </span>
                                    </v-col>
            
                                    <v-col>
                                        <div class="text-caption">
                                            Deskripsi Jenis Pelanggaran:
                                        </div>
                                        <span class="font-weight-medium">
                                            {{ item.jenisPelanggaran.description }}
                                        </span>
                                    </v-col>
                                </v-row>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>

                </v-card-text>
            </v-card>
        </v-timeline-item>
    </v-timeline>
</template>

<script>
export default {
    props: {
        timelineItems: Array,
    },
};
</script>
