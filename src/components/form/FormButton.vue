<template>
    <component :is="tag" :href="href" :target="target" :class="cssClass" @click="click">
        <Icon :type="leftIcon" v-if="leftIcon" :class="$style.leftIcon"></Icon>
        <slot/>
        <Icon :type="rightIcon" v-if="rightIcon" :class="$style.rightIcon"></Icon>
    </component>
</template>

<script>
    export default {
        name: "FormButton",
        computed: {
            cssClass() {
                return [
                    this.$style.button,
                    this.type ? this.$style[this.type] : this.$style.primary,
                    this.fullWidth ? this.$style.fullWidth : '',
                    this.size ? this.$style[this.size] : this.$style.default,
                    this.rounded ? this.$style.rounded : ''
                ].join(' ')
            }
        },
        props: {
            fullWidth: Boolean,
            type: String,
            rounded: Boolean,
            size: String,
            leftIcon: String,
            rightIcon: String,
            href: String,
            target: String,
            tag: {
                type: String,
                default: 'button'
            },
            preventDefault: {
                type: Boolean,
                default: true
            }
        },
        methods: {

            click(e) {
                if (this.preventDefault) {
                    e.preventDefault();
                }
                this.$emit('click', e)
            }
        }
    }
</script>

<style lang="scss" module>
    .button {
        color: #fff;
        border: none;
        padding: 8px 20px;
        min-width: 90px;
        line-height: 16px;
        font-size: 12px;
        cursor: pointer;
        transition: box-shadow 200ms ease;
        border-radius: 3px;
        outline: none;
        display: inline-block;
        &:focus,
        &:active,
        &:hover {
            color: #fff;
            box-shadow: 0 5px 11px 0 rgba(0,0,0,.18), 0 4px 15px 0 rgba(0,0,0,.15);
        }
        &:disabled {
            cursor: not-allowed;
            opacity: 0.5;
        }
    }

    .leftIcon,
    .rightIcon {
        font-size: 15px;
        margin: 0 10px 0 -10px;
    }

    .rightIcon {
        margin: 0 -10px 0 10px;
    }

    .primary {
        background: #6da2f9;
    }

    .text {
        color: #6da2f9;
        background: none;
        &:focus,
        &:active,
        &:hover {
            color: #6da2f9;
            background: none;
            box-shadow: none;
        }
    }

    .rounded {
        border-radius: 50%;
        padding: 0;
        line-height: 32px;
        text-align: center;
        width: 32px;
        min-width: 32px;
        :global {
            .ivu-icon {
                font-size: 19px;
                vertical-align: middle;
            }
        }
    }

    .info {
        background: #37a0cf;
    }

    .success {
        background: #55a7a0;
    }

    .danger {
        background: #e45252;
    }

    .fullWidth {
        width: 100%;
    }

    .small {
        padding: 0 7px;
        min-width: 70px;
        height: 22px;
        line-height: 22px;
        font-size: 12px;
        .leftIcon,
        .rightIcon {
            font-size: 12px;
            margin: 0 5px 0 0;
        }
        .rightIcon {
            margin: 0 0 0 5px;
        }
    }

    .big {
        padding: 10px 20px;
        line-height: 20px;
        font-size: 14px;
    }
</style>
