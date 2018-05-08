<template>
    <div class="page-wrapper">
        <loading :show="showLoading">
        </loading>
        <b-container class="page-body">
            <div class="header">

                <b-navbar toggleable="md" type="dark" variant="info">
                    <div>
                        <b-navbar-brand href="/">Vetkom&Vue</b-navbar-brand>
                    </div>

                    <div>
                        <b-navbar-nav>
                            <b-nav-item to="/" exact>Каталог</b-nav-item>
                            <b-nav-item to="/basket">Текущий заказ</b-nav-item>
                            <b-nav-item to="/orders">Заказы</b-nav-item>
                            <b-nav-item to="/payments">Взаиморасчеты</b-nav-item>
                            <b-nav-item to="/stock">Акции</b-nav-item>
                        </b-navbar-nav>
                    </div>
                </b-navbar>
            </div>
            <div>
                <keep-alive>
                    <router-view></router-view>
                </keep-alive>
            </div>
        </b-container>
        <b-container class="footer">
            <b-container class="footer-inner bg-info text-light">
                Футер
            </b-container>
        </b-container>
    </div>
</template>

<script>
    import Service from './service.js'
    import Loading from './components/Loading.vue'

    export default {
        data () {
          return {
              showLoading: false
          }
        },
        components: {
            Loading
        },
        created(){
            Service.$watch("showLoading",()=>{
                this.showLoading = Service.showLoading;
            });
        }
    }
</script>
