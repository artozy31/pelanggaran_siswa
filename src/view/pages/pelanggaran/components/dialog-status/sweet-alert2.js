import Swal from 'sweetalert2';

export const sweetAlertDialogs  = {
    data(){
        return{
            variableActions: {
                terima: 'menerima',
                tambah: 'menambahkan',
                edit: 'mengedit',
                hapus: 'menghapus',
                import: 'mengimport',
                export: 'mengexport',
                send: 'mengirim',
                pickup: 'pickup',
                fetch: 'fetch'
            },
            variableStates: {
                success: 'Selamat anda berhasil',
                error: 'Ada yang salah saat',
            }
        }
    },

    methods: {
        dialogStatus(param, status, message, list_message = []){
            const { variableActions, variableStates } = this;

            const title = `${variableStates[status]} ${variableActions[param]} data`;
            // Cek apakah list_message ada dan memiliki lebih dari 0 data
            const listContent = list_message && list_message.length > 0 ? `<ul class='text-left'>${list_message.map(item => `<li>- ${item}</li>`).join('')}</ul>` : '';

            const confirmButtonText = `Tutup`;
            const cancelButtonText = `Batal`;

            Swal.fire({
                title,
                html: `<div class="font-weight-bold mb-2">${message}</div>${listContent}`,
                icon: status,
                confirmButtonText,
                confirmButtonColor: "#d33",
                cancelButtonText
            })
        },

        dialogConfirmations(param, name_data, name_function){
            const { variableActions } = this;

            const title = `Yakin untuk ${ variableActions[param] } data ?`;
            const html = `Anda akan <u>${ variableActions[param] }</u>  data <b> ${ name_data ? name_data : '' } </b>`;
            const icon = `question`;
            const confirmButtonText = `Simpan`;
            const cancelButtonText = `Batal`;

            Swal.fire({ title, html, icon, confirmButtonText, cancelButtonText, showCancelButton: true})
            .then((result => {
                if(result.isConfirmed) {
                    if(param == 'checkout') {
                        this[name_function](name_data);
                    } else {
                        this[name_function]();
                    }
                }
            }))
        },

        dialogLoading(param) {
            const { variableActions } = this;

            Swal.fire({
                title: `Loading ...`,
                text: `Sedang ${variableActions[param]} pesan`,
                icon: `info`,
                timerProgressBar: true,
                allowOutsideClick: false,
                didOpen: () => { Swal.showLoading(); }
            });
        }
    },
}