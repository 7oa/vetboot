<template>
    <div class="page catalog">
        <b-row>

            <b-col cols="3">

                <!--all-brends-link-->
                <div class="all-brends-link">
                    <b-btn size="sm" variant="info" @click="showBrendsAlphabet">Все бренды</b-btn>
                </div>

                <!--group-search-form-->
                <div class="group-search-form">
                    <b-input-group size="sm">
                        <b-form-input></b-form-input>
                        <b-input-group-append>
                            <b-btn variant="info">Сброс</b-btn>
                        </b-input-group-append>
                    </b-input-group>
                </div>

                <!--all-groups-->
                <div class="all-groups">
                    Все группы
                </div>

                <!--catalog-menu-->
                <ul class="catalog-menu">
                    <catalog-menu v-for="section in rootSecitons" :key="section.id" :name="section.name" :id="section.id" @showBrendsList="showBrendsList">
                    </catalog-menu>
                </ul>

            </b-col>

            <b-col cols="9">

                <div class="brands-wrapper">

                    <!--brands-alph-list-->
                    <div class="brands-alph-list" v-if="brandsAlphabet.length!==0">
                        <div class="brands-alph-row">
                            <div class="brand-alph text-info" v-for="alpha,index in brandsAlphabet.EN" @click="showBrendsList('',alpha)">{{alpha}}</div>
                        </div>
                        <div class="brands-alph-row">
                            <div class="brand-alph text-info" v-for="alpha,index in brandsAlphabet.RU" @click="showBrendsList('',alpha)">{{alpha}}</div>
                        </div>
                    </div>

                    <!--brends-list-->
                    <div class="brends-list"  v-if="brandsList.length!==0">
                        <div class="brends-list__column-wrapper">
                            <div class="brends-list__item text-info" v-for="brand in brandsList" @click="showCatalog(brand)">{{brand}}</div>
                        </div>
                    </div>

                </div>

                <div class="loading" v-if="loading"></div>

                <b-table v-if="catalog.length>0" striped bordered outlined small :items="catalog" :fields="fields">
                    <template slot="name" slot-scope="data">
                        <img :src="data.item.img_path" v-if="data.item.img_path" class="catalog-img" />
                        <div class="catalog-item-ttl text-info" @click="showDetail(data.item.id)">{{data.item.name}}</div>
                        <small>Код: {{data.item.art}}</small>
                    </template>
                    <template slot="order" slot-scope="data">
                        <b-input-group size="sm">
                            <b-form-input></b-form-input>
                            <b-input-group-append>
                                <b-btn variant="info" @click="addToBasket(data.item)">
                                    <i class="material-icons">shopping_cart</i>
                                </b-btn>
                            </b-input-group-append>
                        </b-input-group>
                    </template>
                </b-table>
                <div v-if="!catalog">По Вашему запросу ничего не найдено</div>

                <!--detail card-->
                <b-modal ref="detailItem" hide-footer title="Карточка товара">
                    <div class="loading" v-if="detail.length==0"></div>
                    <div class="d-block" v-else>
                        <h4>{{detail.name}}</h4>
                        <img v-if="detail.img" :src="detail.img">
                        <div class="catalog-detail__description">
                            <div v-if="detail.description">
                                <strong>Описание:</strong><br/>
                                {{detail.description}}
                                <br/>
                            </div>
                            <div>
                                <strong>Код: </strong> {{detail.id}} <br/>
                                <strong>Артикул: </strong> {{detail.art}} <br/>
                                <strong>Единицы измерения: </strong> {{detail.unit}} <br/>
                                <strong>Цена: </strong> {{detail.price | formatPrice}} <br/>
                            </div>
                        </div>
                        <strong>Добавить в корзину: </strong> <br/>
                        <div class="catalog-detail__tocart">
                            <b-input-group size="sm">
                                <b-form-input></b-form-input>
                                <b-input-group-append>
                                    <b-btn variant="info">
                                        <i class="material-icons">shopping_cart</i>
                                    </b-btn>
                                </b-input-group-append>
                            </b-input-group>
                        </div>
                    </div>
                </b-modal>

            </b-col>
        </b-row>
    </div>
</template>

<script>
    import CatalogMenu from './CatalogMenu.vue'
    import Service from '../../service.js'

    let catalogActions = '/ajax/catalog.php';

    export default {
        data () {
            return {
                rootSecitons: [],
                brandsAlphabet: [],
                brandsList: [],
                catalog: [],
                detail: [],
                fields: {
                    name: {label: 'Название', sortable: true},
                    brand: {label: 'Бренд', sortable: true},
                    price: {label: 'Цена', sortable: true},
                    order: {label: 'Заказ', sortable: false, class: 'catalog-order-col'},
                },
                loading: false,
                catalogKey: '',
                sortKey: 'name',
                startKey: '0',
                amountKey: '20'
            }
        },
        filters:{
            formatPrice(value){
                let val = (value/1).toFixed(2);
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
            }
        },
        components:{
            CatalogMenu
        },
        methods: {
            showBrendsAlphabet(){
                if(this.brandsAlphabet.length==0){
                    this.loading = true;
                    this.brandsList = [];
                    this.catalog = [];
                    this.$http.post('/ajax/catalog.php',{
                        TYPE: 'allBrends',
                        id: ''
                    })
                    .then(response => {
                        this.brandsAlphabet = response.data;
                        this.loading = false;
                    })
                }
            },
            showBrendsList(id,alpha=''){
                this.loading = true;
                this.brandsList = [];
                if(alpha=='') this.brandsAlphabet = [];
                this.catalog = [];
                this.$http.post('/ajax/catalog.php',{
                    TYPE: 'allBrends',
                    id: id,
                    letter: alpha
                })
                    .then(response => {
                        this.brandsList = response.data;
                        this.loading = false;
                    })
            },
            showCatalog(brand){
                this.loading = true;
                this.catalog = [];

                this.$http.post(catalogActions,{
                    TYPE: 'list_sort',
                    id: '',
                    brand: brand,
                    sort: this.sortKey,
                    start: this.startKey,
                    amount: this.amountKey,
                    checked: 'N'
                })
                    .then(response => {
                        this.catalog = response.data.ITEMS;
                        this.loading = false;
                    })
            },
            showDetail(id){
                this.detail = [];
                this.$refs.detailItem.show();
                this.$http.post(catalogActions,{
                    TYPE: 'detail',
                    id: id
                })
                    .then(response => {
                        this.detail = response.data;
                    })
            },
            addToBasket(item){
                Service.addToBasket(item);
            }
        },
        created(){
            this.$http.post(catalogActions,{
                TYPE: 'section',
                id: ''
            })
                .then(response => {
                    this.rootSecitons = response.data;
                })
        }
    }
</script>

<style scoped>
</style>