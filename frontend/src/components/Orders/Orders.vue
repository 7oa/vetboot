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

                <b-button size="m" variant="info" @click="showOrders">
                    Обновить список
                </b-button>
            </b-form>
        </div>

        <div class="loading" v-if="loading"></div>
        <div v-if="orders">
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

                <tr v-for="order in orders">
                    <td><span class="is-link text-info">{{order.number}}</span></td>
                    <td class="text-center">{{order.date}}</td>
                    <td class="text-right">{{order.sum | formatPrice}}</td>
                    <td class="text-right">{{order.status}}</td>
                    <td class="text-right">{{order.paymentPerc}}</td>
                    <td class="text-right">{{order.shipmentPerc}}</td>
                    <td class="text-right">{{order.debtPerc}}</td>
                    <td class="text-right">{{order.shipmentDate}}</td>
                </tr>
            </table>
        </div>



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
                        console.log(response);
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