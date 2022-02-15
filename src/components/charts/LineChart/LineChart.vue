<template>
    <div>
        <ve-line :data="{rows: data}" :settings="computedSettings" :height="height" :grid="grid"  />
    </div>
</template>
<script>
    export default {
        name: 'LineChart',
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
                        label: 'period_id',
                        order: 'asc'
                    },
                    legendName: {
                        'mm': 'Stats'
                    },
                    // axisSite: { bottom: ['period'] },
                    labelMap: {
                        'mm': 'Stats'
                    },
                    ...(this.settings || {})
                }
            },
        }
    }
</script>
<style lang="scss" module>
</style>
