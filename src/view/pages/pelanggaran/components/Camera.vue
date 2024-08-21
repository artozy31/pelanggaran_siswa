<template>
    <v-row>
        <!-- ? CAMERA CONTROLLER -->
        <v-col cols="6">
            <v-sheet class="dashed-outline">
                <div class="web-camera-container bg-blue-hb">
                    <div class="camera-button">
                        <div v-if="!isCameraOpen" class="text-center">
                            <v-btn class="text-blue-hb btn-open mb-3" color="white" @click="toggleCamera()">
                                <v-icon class="icon mr-2">{{ isCameraOpen? 'mdi-camera-off' : 'mdi-camera-plus' }}</v-icon>
                                Foto
                            </v-btn>
                        </div>


                        <v-btn class="btn-close p-1 shadow" color="white" outlined v-else @click="toggleCamera()">
                            Tutup
                        </v-btn>

                        <div v-if="isCameraOpen && !isLoading" class="camera-shoot">
                            <v-btn class="button" color="white" icon elevation="2" large @click="takePhoto">
                                <v-icon class="icon">mdi-camera</v-icon>
                            </v-btn>
                            
                            <!-- <button type="button" class="button ml-4" @click="toogleFacingMode">
                                <i class="la la-refresh icon-2x"></i>
                            </button> -->
                        </div>
                    </div>

                    <div v-show="isCameraOpen && isLoading" class="camera-loading text-white">
                        <span class="spinner spinner-primary mr-6" color="white"></span> Tunggu sebentar..
                    </div>

                    <div v-if="isCameraOpen" v-show="!isLoading" class="camera-box" :class="{ 'flash': isShotPhoto }">
                        <div class="camera-shutter" :class="{ 'flash': isShotPhoto }"></div>
                        <video ref="camera" autoplay></video>
                    </div>
                </div>
            </v-sheet>
        </v-col>

        <!-- ? PREVIEW CONTROLLER -->
        <v-col cols="6">
            <v-sheet class="dashed-outline">
                <v-img v-show="!isPhotoTaken" class="mx-auto text-center align-items-center p-2" cover width="auto" height="350" src="" outlined>
                    <h2>{{ name }}</h2>
                </v-img>
                <!-- <canvas v-show="isPhotoTaken" id="photoTaken" ref="canvas"></canvas> -->
                <v-img v-show="isPhotoTaken" class="mx-auto text-center align-items-center rounded-lg" aspect-ratio="1" cover width="auto" height="350" :src="photoDataURL" outlined>
                    <template v-slot:placeholder>
                        <v-row class="fill-height ma-0" align="center" justify="center">
                            <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                        </v-row>
                    </template>
                </v-img>
            </v-sheet>
        </v-col>
    </v-row>
    
</template>

<script>
export default {
    props: {
        id: String,
        name: String
    },
    data() {
        return {
            isCameraOpen: false,
            isPhotoTaken: false,
            isShotPhoto: false,
            isLoading: false,
            isFacingMode: 'user',
            link: '#',
            photoDataURL: '',
        }
    },

    methods: {
        closeCamera() {
            this.isCameraOpen = false;
            this.isPhotoTaken = false;
            this.isShotPhoto = false;
            this.stopCameraStream();
        },

        toggleCamera() {
            if (this.isCameraOpen) {
                this.closeCamera()
            } else {
                this.isCameraOpen = true;
                this.createCameraElement();
            }
        },

        toogleFacingMode() {
            this.toggleCamera();

            if(this.isFacingMode == 'user') {
                this.isFacingMode = 'environment'
            } else {
                this.isFacingMode = 'user'
            }

            this.toggleCamera();
        },

        async createCameraElement() {
            this.isLoading = true;

            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const videoDevices = devices.filter(device => device.kind === 'videoinput');
                console.log('*** videoDevices =====> ', videoDevices)

                let selectedCameraId = null;

                // Cari kamera eksternal
                for (const device of videoDevices) {
                    if (device.label.toLowerCase().includes('external')) {
                        selectedCameraId = device.deviceId;
                        break;
                    }
                }

                // Jika tidak ada kamera eksternal, pilih kamera internal
                if (!selectedCameraId) {
                    for (const device of videoDevices) {
                        if (device.label.toLowerCase().includes('internal')) {
                            selectedCameraId = device.deviceId;
                            break;
                        }
                    }
                }

                // Jika tidak ada kamera internal, pilih kamera pertama yang tersedia
                if (!selectedCameraId && videoDevices.length > 0) {
                    selectedCameraId = videoDevices[0].deviceId;
                }

                const constraints = {
                    audio: false,
                    video: {
                        facingMode: this.isFacingMode,
                        deviceId: selectedCameraId ? { exact: selectedCameraId } : undefined
                    }
                };

                const stream = await navigator.mediaDevices.getUserMedia(constraints);

                this.isLoading = false;
                this.$refs.camera.srcObject = stream;
            } catch (error) {
                this.isLoading = false;
                console.error('Error accessing camera:', error);
                alert("May the browser didn't support or there is some errors.");
            }
        },

        stopCameraStream() {
            if(this.$refs.camera) {
                const tracks = this.$refs?.camera?.srcObject?.getTracks();
                tracks.forEach(track => {
                    track.stop();
                });
            }
        },

        takePhoto() {
            if (!this.isPhotoTaken) {
                this.isShotPhoto = true;

                const FLASH_TIMEOUT = 50;

                setTimeout(() => {
                    this.isShotPhoto = false;
                }, FLASH_TIMEOUT);
            }

            this.isPhotoTaken = !this.isPhotoTaken;

            const MAX_WIDTH = 300;
            const MAX_HEIGHT = 300;

            let width = this.$refs.camera.videoWidth;
            let height = this.$refs.camera.videoHeight;

            console.log('*** width =====> ', width)

            // Change the resizing logic
            if (width > height) {
                if (width > MAX_WIDTH) {
                    height = height * (MAX_WIDTH / width);
                    width = MAX_WIDTH;
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width = width * (MAX_HEIGHT / height);
                    height = MAX_HEIGHT;
                }
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const context = canvas.getContext('2d');
            // Draw the video frame onto the canvas
            context.drawImage(this.$refs.camera, 0, 0, canvas.width, canvas.height);

            // Compress the image
            const quality = 100; // Adjust the quality as needed
            const imageDataURL = canvas.toDataURL('image/jpeg', quality);

            // Display the compressed image
            this.photoDataURL = imageDataURL;

            // Convert data URL to Blob
            const blob = this.dataURLToBlob(imageDataURL);

            // Create a File from the Blob
            const generateFileName = this.name.toLowerCase().replace(/\s+/g, '_');
            const file = new File([blob], generateFileName, { type: 'image/jpeg' });

            // Emit the photoTaken event with the File object and URL
            const result = {
                id: this.id,
                data_name: this.name,
                image_file: file,
                image_url: URL.createObjectURL(file),
                image_blob: blob,
            };

            this.$emit('photoTaken', result);
        },

        dataURLToBlob(dataURL) {
            const arr = dataURL.split(',');
            const mime = arr[0].match(/:(.*?);/)[1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8arr], { type: mime });
        },
    },
}
</script>


<style scoped>
    .web-camera-container {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        border-radius: 4px;
        width: 100%;
        height: 350px;
        border-radius: 10px;
    }

    .camera-button {
        display: flex;
        justify-content: center;
        align-items: center;
        height: auto;
        width: auto;
        z-index: 9;
    }
    .btn-open {
        width: fit-content;
    }

    .btn-close {
        width: fit-content;
        position: absolute;
        right: 5px;
        top: 5px;
    }

    .camera-loading {
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .camera-box {
        padding-top: 15px; 
        padding-bottom: 8px;
        width: 100%;
    }

    .camera-shutter {
        opacity: 0;
        background-color: #fff;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
    }

    .flash {
        opacity: 1;
    }

    .camera-shoot {
        position: absolute;
        bottom: 10px;
        left: 0;
        right: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
    }

    canvas {
        width: 100%;
        height: 350px;
        margin-bottom: 0;
    }

    video {
        width: 100%;
        height: 350px;
    }
</style>