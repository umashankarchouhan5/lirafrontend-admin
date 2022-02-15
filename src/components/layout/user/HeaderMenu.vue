<template>
    <div :class="$style.menu">
        <router-link :to="routeToGo.path" :class="$style.menuItem">
            <span :class="$style.name">{{ routeToGo.name }}</span>
        </router-link>

        <Dropdown :class="$style.dropdown" trigger="click"  placement="bottom-end">
            <a href="javascript:void(0)" :class="$style.menuItem">
                <div :class="$style.notifCount" v-if="count !== 0">{{count}}</div>
                <img src="../../../assets/images/ring.png">
            </a>
            <DropdownMenu slot="list">
                <DropdownItem v-for="(notif,index) in notifications" :key="index"><p @click="readNotification(notif)" :class="notif.ReadDate !== null ? $style.readed : ''">{{notif.Subject}}</p></DropdownItem>

                <DropdownItem divided v-if="notifications.length > 0" :class="$style.seeAllBackground"><p @click="goToNotification">See All</p></DropdownItem>
                <DropdownItem :class="$style.seeAllBackground" v-else><p >No notifications yet </p></DropdownItem>

            </DropdownMenu>
        </Dropdown>

        <!-- <a href="#" :class="$style.menuItem">
            <img src="../../../assets/images/ring.png">
        </a> -->

        <Dropdown :class="$style.dropdown" trigger="click"  placement="bottom-end">
            <a href="javascript:void(0)" :class="$style.menuItem">
                <img src="../../../assets/images/info.png">
            </a>
            <DropdownMenu slot="list">
                
                <DropdownItem><a href="#"><img  :class="$style.dropDownImage" src="../../../assets/images/mobile.png" alt="User Image">+248-4380-8000</a></DropdownItem>
                <DropdownItem><a href="mailTo:lira@xyz.com"><img  :class="$style.dropDownImage" src="../../../assets/images/mail.png" alt="User Image">info@fsa.com</a></DropdownItem>

                <!-- <DropdownItem><a href="#">1800-123-4567</a></DropdownItem>
                <DropdownItem><a href="#">lira@xyz.com</a></DropdownItem>
                <DropdownItem disabled><a href="#">Inbox</a></DropdownItem>
                <DropdownItem><a href="#">Chat</a></DropdownItem> -->
            </DropdownMenu>
        </Dropdown>

        <Dropdown :class="$style.dropdown" trigger="click" placement="bottom-end">
            <a href="javascript:void(0)" :class="$style.menuItem">
                <span :class="$style.name">{{ userName }}</span>
                <img v-if="userImage!=''" :src="userImage" :class="$style.user_image" alt="User Image">
                <img v-else src="../../../assets/images/user.png" :class="$style.user_image" alt="User Image">
            </a>
            <DropdownMenu slot="list">
                <DropdownItem>
                    <router-link to="/changePassword">Change Password</router-link>
                </DropdownItem>
                <DropdownItem >
                    <router-link to="/login">Logout</router-link>
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    </div>
</template>

<script>

    import { Dropdown, DropdownMenu, DropdownItem } from 'view-design'
    import { getNotification, getNotificationCount, readNotificationWeb, ticketToProcess } from './HeaderMenuApi'

    export default {
        name: "HeaderMenu",
        data() {
            return {
                routes: {
                    dashboard: {
                        name: 'Dashboard',
                        path: '/dashboard'
                    },
                    tasks: {
                        name: 'My Tasks',
                        path: '/tasks'
                    }
                },
                notifications: [],
                count: 0,
                notificationData: [],
                getNotificationInterval: null
            }
        },
        components: {
            Dropdown,
            DropdownMenu,
            DropdownItem
        },
        computed: {
            routeToGo() {
                return this.routes['tasks'];
            },
            userName() {
                return this.$store.state.user.user !== null ? this.$store.state.user.user.user_name : ''
            },
            menu() {
                return this.$store.state.menu.menu
            },
            user(){
                return this.$store.state.user.user;
            },
            userImage(){
                return this.$store.state.user.user !== null ? this.$store.state.user.user.photo_path : null;
            }
        },
        created(){
            // this.getNotifs();
            if(this.user !== undefined && this.user !== null){
                // this.getNotificationInterval = setInterval(this.getNotifs,300000);//(5Min)
                this.getNotifs();
            }
        },
        methods: {
            goToNotification(){
                this.$router.push('/notifications'); 
            },
            handleClick() {

            },
            getNotifs(){
                if(this.user !== undefined && this.user !== null && this.user.user_id && localStorage.userData && navigator.onLine){
                    getNotification({"filterjson":{"sort":[{"key":"id","order":"Desc"}],"paging":[{"startindex":1,"pagesize":10}]}}).then(
                        res => {
                            this.notifications = res.data[0];
                        }
                    )
                    getNotificationCount().then(
                        res => {
                            this.count = res.data[0].Count;
                        }
                    )
                    setTimeout(() => {
                        this.getNotifs();
                    },(5*60*1000))
                }
            },
            readNotification(notif){
                readNotificationWeb({notification_id:notif.notification_id}).then(
                    res => {
                        this.getNotifs();
                    }
                )
                this.$router.push(`/tasks/${notif.TicketReference}`)
            },
        },
    }
</script>

<style lang="scss" module>
    .readed{
        background: lightgray;
    }
    .dropDownImage{
        width: 12px;
        margin-right: 10px;
    }
    .menu {
        position: absolute;
        right: 15px;
        top: 0;
        display: flex;
        height: 100%;
        img {
            vertical-align: middle;
        }
    }
    .menuItem {
        line-height: 52px;
        padding: 0 6px;
        display: block;
        position: relative;
        z-index: 1;
        img{
            z-index: 1;
        }
        .notifCount{
            position: absolute;
            background: #ff3547;
            // background: #6da2f9;
            top: 7px;
            right: -3px;
            color: white;
            // color: black;
            padding: 2px 2px;
            z-index: -1;
            height: 15px;
            min-width: 15px;
            font-size: 10px;
            display: flex;
            font-weight: 700;
            justify-content: center;
            // text-shadow: 1px 1px white;
            align-items: center;
            border-radius: 35px;
        }
    }
    .name {
        font-size: 14px;
        color: #6da2f9;
        font-weight: 600;
        line-height: 15px;
        margin-right: 5px;
        text-align: right;
        text-transform: capitalize;
    }
    .user_image {
        height: 30px;
        width: 30px;
        object-fit: cover;
    }
    .dropdown {
        :global {
            .ivu-select-dropdown {
                margin: 0;
                border: 1px solid rgba(0,0,0,.15);
                border-radius: 4px;
                .ivu-dropdown-item-divided {
                    margin-top: 9px;
                    padding-top: 9px;
                    border-top: 1px solid #eee;
                }
                .ivu-dropdown-item {
                    a {
                        padding: 6px 10px;
                        transition: background-color 200ms ease;
                        font-size: 14px;
                        font-weight: 300;
                        color: #000;
                        display: block;
                        min-width: 160px;
                        cursor: pointer;
                        &:hover {
                            background-color: #e1e3e9;
                            color: #333;
                        }
                    }
                    p{
                        padding: 6px 10px;
                        transition: background-color 200ms ease;
                        font-size: 14px;
                        font-weight: 300;
                        color: #000;
                        display: block;
                        min-width: 160px;
                        cursor: pointer;
                        &:hover {
                            background-color: #e1e3e9;
                            color: #333;
                        }
                    }
                }
            }
        }
    }
    .seeAllBackground {
        background: #fafafa;
    }
</style>
