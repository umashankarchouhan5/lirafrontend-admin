<template>
    <div>
        
        <FormRow>
            <div class="col-sm-12" v-for="(item,i) in value" :key="i" >
                <div :class="$style.flexClass" >
                    <span  :class="$style.firstItem" ><b> {{ item.QNo }} .  </b></span><span v-html="item.QText">   </span>
                </div>
                <div :class="$style.indent">
                    <ListItem v-model="value[i]"></ListItem>
                </div>
            </div>
        </FormRow>
        
    </div>
</template>

<script>

    import moment from 'moment';
    import ListItem from './listRender';


    export default {
        name:'RiskMatrixGrid',
        props:{
            value:[Array,Object]
        },
        components:{
            ListItem
        },
        data(){
            return{
            }
        },
        computed:{
            userData() {
                return this.$store.state.user.user
            },
            currentProcessId() {
                return this.$store.state.common.currentProcessId
            },
        },
        created(){
        },
        methods:{
            
        }
    }
</script>

<style lang="scss" module>


    .flexClass {
        display: flex;
        justify-content: flex-start;
        .firstItem{
            min-width: 40px;
        }
    }
    .indent{
        margin: 15px 20px 15px  40px;
    }

</style>
