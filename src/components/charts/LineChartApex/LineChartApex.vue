<template>
    <div>
        <apexchart type="line" height="350" :options="computedSettings" :series="computedXAxisData"></apexchart>
    </div>
</template>
<script>
    export default {
        name: 'LineChartApex',
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
                chartOptions: {
                    
                },
            } 
        },
        computed: {
            computedSettings() {
                return {
                    chart: {
                        id: 'column-chart',
                        height: 350,
                        type: 'bar',
                        zoom: {
                            type: 'x',
                            enabled: true,
                            autoScaleYaxis: true
                        },
                    },
                    plotOptions: {
                        bar: {
                            borderRadius: 10,
                            columnWidth: '50%',
                        }
                    },
                    dataLabels: {
                        enabled: false
                    },
                    stroke: {
                        width: 2,
                        curve: 'smooth'
                    },
                    
                    grid: {
                        row: {
                            colors: ['#fff', '#f2f2f2']
                        }
                    },
                    xaxis: {
                        title: {
                            text: 'Period',
                            style: {
                                // colors: "#FF1654"
                                fontWeight: 500,
                                fontSize: '16px',
                                fontFamily: 'Helvetica, Arial, sans-serif',
                            }
                        },
                        labels: {
                            rotate: -45
                        },
                        categories: this.computedYAxis,
                        tickPlacement: 'on'
                    },
                    yaxis: {
                        title: {
                            text: this.data[0].name_of_data,
                            style: {
                                // colors: "#FF1654"
                                fontWeight: 500,
                                fontSize: '16px',
                                fontFamily: 'Helvetica, Arial, sans-serif',
                            }
                        },
                    },
                    fill: {
                        type: 'gradient',
                        gradient: {
                            shade: 'light',
                            type: "horizontal",
                            shadeIntensity: 0.25,
                            gradientToColors: undefined,
                            inverseColors: true,
                            opacityFrom: 0.85,
                            opacityTo: 0.85,
                            stops: [50, 0, 100]
                        },
                    }
                }
            },
            computedYAxis() {
                return this.data.map(item => {
                    return item.period
                })
            },
            computedXAxisData() {
                return [{
                        name: 'Stats',
                        data: this.data.map(item => {
                            return item.total
                        })
                }]
            }
        }
    }
</script>
<style lang="scss" module>
</style>
