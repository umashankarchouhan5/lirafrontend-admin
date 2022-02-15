<template>
    <div>
        <ve-histogram :data="{rows: data}" :settings="computedSettings" :height="height" :grid="grid"  />
    </div>
</template>
<script>
    export default {
        name: 'Histogram',
        props: {
            data: {
                type: Array,
                required: true,
                default: () => []
            },
            settings: {
                type: Object,
                default: () => {}
            },
            height: {
                type: String,
                default: '175px'
            },
        },
        data() {
            return {
                grid: {
                    left: '20px',
                    right: '20px',
                    top: '25px',
                    bottom: '10px',
                    containLabel: true
                }
            }
        },
        computed: {
            computedSettings() {
                return {
                    dimension: ['period'],
                    metrics: ['mm'],
                    dataOrder: {
                        label: 'period',
                        order: 'asc'
                    },
                    legendName: {
                        'mm': 'Stats'
                    },
                    labelMap: {
                        'mm': 'Stats'
                    },
                    // axisSite: { bottom: ['period'] },
                    ...(this.settings || {})
                }
            },
        }
    }
</script>
<style lang="scss" module>
</style>
