<template>
    <v-col :cols="cols">
        <v-text-field outlined :prepend-icon="prependIcon" :prepend-inner-icon="prependInnerIcon"
            @click:prepend-inner="handlePrependClick" :clearable="clearable" :readonly="readonly" :disabled="disabled"
            :required="required" :label="label" :type="type" :rules="rules" :value="value" :counter="counter"
            persistent-hint :hint="hint" v-model="model" @input="updateValue"></v-text-field>
    </v-col>
</template>

<script>
export default {
    props: {
        cols: String,
        clearable: {
            type: Boolean,
            default: true, // Menetapkan nilai default true
        },
        disabled: {
            type: Boolean,
            default: false, // Menetapkan nilai default true
        },
        prependIcon: {
            type: String,
            default: '', // Menetapkan nilai default true
        },
        prependInnerIcon: {
            type: String,
            default: '', // Menetapkan nilai default true
        },
        clickable: Boolean,
        clickHandler: Function,
        readonly: Boolean,
        required: Boolean,
        label: String,
        type: String,
        rules: Array,
        value: [String, Number],
        counter: String,
        hint: String,
    },
    data() {
        return {
            model: this.value,
        };
    },
    watch: {
        value(newVal) {
            this.model = newVal;
        },
        model(newVal) {
            this.$emit('input', newVal);
        },
    },
    methods: {
        handlePrependClick(param) {
            if (this.clickable && this.clickHandler) {
                this.clickHandler(param);
            }
        },
        updateValue(newValue) {
            const numericValue = this.type === 'number' ? Number(newValue) : newValue; // Mengonversi ke number dalam bilangan bulat
            this.model = numericValue;
            this.$emit('input', this.model);
        }
    },
};
</script>
