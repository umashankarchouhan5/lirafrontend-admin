<template>
    <div :class="$style.title">
        <div :class="$style.leftSlot">
            <slot name="left" />
        </div>
        
        <h1>{{ title }}</h1>
        <div :class="$style.rightSlot">
            <slot name="right" />
        </div>
        <div :class="$style.rightMiddleSlot" v-if="pdf" @click="pdf">
            <img src="../../assets/images/PDF.png" alt="">
        </div>
        <div :class="$style.question" v-if="link">
            <a :href="link" target="_blank">
                <img src="../../assets/images/ques.png" alt="">
            </a>
        </div>
    </div>
</template>

<script>
    export default {
        name: "PageTitle",
        props: {
            title: {
                type: String,
                required: true
            },
            link: {
                type: String,
                default: ''
            },
            pdf: {
                type: Function
            }
        }
    };
</script>

<style lang="scss" module>
    .title {
        box-shadow: 0 4px 5px rgba(0, 0, 0, 0.45);
        position: relative;
        background: #6da2f9;
        padding: 0 10px;
        z-index: 1;
        > h1 {
            font-size: 14px;
            line-height: 35px;
            margin: 0;
            text-align: center;
            font-weight: 700;
        }
    }

    .leftSlot {
        position: absolute;
        left: 10px;
        top: 0;
    }
    .rightMiddleSlot {
        position: absolute;
        right: 35px;
        top: 8px;
        cursor: pointer;
        img {
            max-width: 20px;
        }
    }
    .rightSlot {
        position: absolute;
        right: 60px;
        top: 0;
    }
    .question {
        position: absolute;
        right: 10px;
        top: 8px;

        img {
            max-width: 20px;
        }
    }
</style>
