// menu.ts
export const MENUS = [
    {
        title: "Utama",
        items: [
            // { text: "Dashboard", to: "/dashboard", icon: "mdi mdi-clipboard-account mdi-18px", roles: ['ADMIN'] },
            // { text: "Builder", to: "/builder", icon: "mdi mdi-clipboard-account mdi-18px", roles: ['ADMIN'] },
            { text: "Dashboard Pelanggaran", to: "/pelanggaran-hb/dashboard", icon: "mdi mdi-view-dashboard mdi-18px", roles: ['ADMIN'] },
            { text: "Pelanggaran Siswa", to: "/pelanggaran-hb/siswa", icon: "mdi mdi-cancel mdi-18px", roles: ['ADMIN', 'OSIS'] },
            { text: "Riwayat Siswa", to: "/pelanggaran-hb/riwayat-siswa", icon: "mdi mdi-history mdi-18px", roles: ['ADMIN', 'GURU'] },
        ],
    },
    {
        title: "Pengguna",
        items: [
            { text: "Manajemen User", to: "/pelanggaran-hb/manajemen-user", icon: "mdi mdi-account-key mdi-18px", roles: ['ADMIN'] },
            { text: "Tindak Lanjut", to: "/pelanggaran-hb/tindak-lanjut", icon: "mdi mdi-account-check mdi-18px", roles: ['ADMIN'] },
            {
                text: "Master Data",
                icon: 'mdi mdi-database-lock mdi-18px',
                children: [
                    {
                        text: "Master Pelanggaran",
                        icon: "mdi mdi-close-box-multiple mdi-18px",
                        subChildren: [
                            {
                                text: 'Pelanggaran Siswa',
                                to: "/master-data/pelanggaran",
                                icon: "mdi mdi-account-group",
                                roles: ['ADMIN']
                            },
                            {
                                text: "Jenis Pelanggaran",
                                to: "/master-data/jenis-pelanggaran",
                                icon: "mdi mdi-clipboard",
                                roles: ['ADMIN']
                            },
                            {
                                text: "Kategori Pelanggaran",
                                to: "/master-data/kategori-pelanggaran",
                                icon: "mdi mdi-format-list-bulleted",
                                roles: ['ADMIN']
                            }
                        ]
                    },
                    {
                        text: "Master Siswa",
                        to: "/master-data/siswa",
                        icon: "mdi mdi-account-multiple-plus mdi-18px",
                        roles: ['ADMIN']
                    },
                    {
                        text: "Master Kelas",
                        to: "/master-data/kelas",
                        icon: "mdi mdi-google-classroom mdi-18px",
                        roles: ['ADMIN']
                    },
                    {
                        text: "Master Wali Kelas",
                        to: "/master-data/wali-kelas",
                        icon: "mdi mdi-school mdi-18px",
                        roles: ['ADMIN']
                    },
                ],
            },
        ],
    },
];
