<template>
    <div class="page orders">
        <div class="page-ttl">
            <h1>Заказы</h1>
        </div>

        <div class="select-date">
            <b-form inline>
                <datepicker
                        v-model="dateFrom"
                        :language="language"
                        :format="format"
                        monday-first
                        bootstrap-styling
                        input-class="mb-4 mr-sm-2 mb-sm-0">
                </datepicker>
                <datepicker
                        v-model="dateTo"
                        :language="language"
                        :format="format"
                        monday-first
                        bootstrap-styling
                        input-class="mb-4 mr-sm-2 mb-sm-0">
                </datepicker>

                <b-button size="m" variant="info" @click="showOrders" :disabled="loading">
                    Обновить список
                </b-button>
            </b-form>
        </div>

        <div class="loading" v-if="loading"></div>
        <div v-if="!loading&&!orders.orders">Выберите период.</div>
        <div v-if="orders.orders&&orders.count>0">

            <table class="table table-bordered allTable">
                <tr>
                    <th>Номер заказа</th>
                    <th>Дата заказа</th>
                    <th>Сумма</th>
                    <th>Статус</th>
                    <th>% оплаты</th>
                    <th>% отгрузки</th>
                    <th>% долга</th>
                    <th>Дата отгрузки</th>
                </tr>

                <tr v-for="order in orders.orders">
                    <td><span class="is-link text-info" @click="showDetail(order)">{{order.number}}</span></td>
                    <td class="text-center">{{order.date}}</td>
                    <td class="text-right">{{order.sum | formatPrice}}</td>
                    <td class="text-right">{{order.status}}</td>
                    <td class="text-right">{{order.paymentPerc}}</td>
                    <td class="text-right">{{order.shipmentPerc}}</td>
                    <td class="text-right">{{order.debtPerc}}</td>
                    <td class="text-right"><template v-if="order.shipmentDate!='0001-01-01'">{{order.shipmentDate}}</template></td>
                </tr>
            </table>
        </div>
        <div v-if="(orders.count==0)&&!loading">Нет заказов за выбранный период</div>

        <!--detail card-->
        <b-modal ref="detailOrders" size="lg" hide-footer>
            <div slot="modal-title">Заказ №{{detailOrder.number}}</div>
            <div class="loading" v-if="!detailOrder"></div>
            <div class="d-block" v-else>
                <div class="d-flex justify-content-end">
                    <b-button-group>

                        <b-button variant="outline-primary">Повторить заказ</b-button>

                        <b-dropdown right variant="primary" :disabled="loadingDoc">

                            <span class="print-dd" slot="text">
                                <i class="material-icons" v-if="!loadingDoc">print</i>
                                <span class="loaderSmall" v-if="loadingDoc"></span>
                                <span>Печать</span>
                            </span>

                            <b-dropdown-item
                                @click="showPdf('ext_ReconcilementOrder',detailOrder)"
                            >
                                Заказ согласование
                            </b-dropdown-item>

                            <template v-if="detailOrder.Protected!=1">
                                <b-dropdown-item
                                    variant="primary"
                                    @click="showPdf('paymentInvoice',detailOrder)"
                                >
                                    Счет на оплату
                                </b-dropdown-item>
                            </template>

                        </b-dropdown>
                    </b-button-group>

                </div>
                <strong>Доставка:</strong> {{detailOrder.shipmentType}} <br/>
                <strong>Адрес доставки:</strong> {{detailOrder.shipmentAddress}}<br/>
                <strong>Комментарий:</strong> {{detailOrder.comment}} <br/>
                <div class="clearfix"></div>
                <div v-if="detailOrder.DOCS">
                    <h4>Документы, связанные с заказом</h4>
                    <ul>
                        <li v-for="doc in detailOrder.DOCS">
                            {{doc.representation}} {{doc.number}} от {{doc.date}} на сумму {{doc.sum | formatPrice}}
                        </li>
                    </ul>
                </div>
                <br/>
                <table class="table table-bordered table-sm detail-table">
                    <tr>
                        <th>Название</th>
                        <th>Количество</th>
                        <th width="100">Цена за шт.</th>
                        <th width="100">Сумма</th>
                    </tr>

                    <tr v-for="string in detailOrder.strings">
                        <td>
                            {{string.name}}
                            <br/><small class="art">{{string.art}}</small>
                        </td>
                        <td class="text-right">{{string.quantity}}</td>
                        <td class="text-right">{{string.price | formatPrice}}</td>
                        <td class="text-right">{{string.sum | formatPrice}}</td>
                    </tr>


                </table>
                <div class="text-right">
                    <div><strong>Итого:</strong> <span class="zakazItog">{{detailOrder.sum | formatPrice}}</span> руб.</div>
                </div>
            </div>
        </b-modal>

    </div>
</template>

<script>
    import Datepicker from 'vuejs-datepicker';

    let now = new Date();
    let monthAgo = new Date(new Date().setMonth(now.getMonth() - 30));

    export default {
        data () {
            return {
                loading: false,
                loadingDoc: false,
                dateFrom: monthAgo,
                dateTo: now,
                format: "dd.MM.yyyy",
                language: "ru",
                orders: false,
                detailOrder: false
            }
        },
        components: {
            Datepicker
        },
        methods: {
            showOrders(){
                this.orders = false;
                this.loading = true;
                this.$http({
                    method: 'post',
                    url: '/ajax/orderActions.php',
                    data: {
                        TYPE: 'list',
                        dfrom: this.dateFrom,
                        dto: this.dateTo
                    }
                })
                    .then(response => {
                        this.orders = response.data;
                        this.loading = false;
                    })
            },
            showDetail(order){
                this.detailOrder = false;
                this.$refs.detailOrders.show();
                this.$http({
                    method: 'post',
                    url: '/ajax/orderActions.php',
                    data: {
                        TYPE: 'detail',
                        number: order.number,
                        date: order.date,
                        guid: order.guid
                    }
                })
                    .then(response => {
                        this.detailOrder = response.data;
                    })
            },
            showPdf(type,item){
                this.loadingDoc = false,
                this.$http({
                    method: 'post',
                    url: '/ajax/orderActions.php',
                    data: {
                        TYPE: 'orderPrint',
                        number: item.number,
                        date: item.date,
                        frm: type
                    }
                })
                    .then(response => {
                        window.open(response.data);
                        this.loadingDoc = false;
                    })
            }
        },
        filters:{
            formatPrice(value){
                let val = (value/1).toFixed(2);
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
            },
            formatDate(value){

            }

        }
    }
</script>

<style scoped>
</style>