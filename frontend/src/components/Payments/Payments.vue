<template>
    <div class="page payments">
        <div class="page-ttl">
            <h1>Взаиморасчеты</h1>
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

                <b-button size="m" variant="info" @click="showPayments">
                    Сформировать
                </b-button>
            </b-form>
        </div>

        <div class="loading" v-if="loading"></div>
        <div v-if="payments">
            <div><strong>Сальдо конечное: {{payments.ClosingBalance | formatPrice}}</strong></div><br/>
            <table class="table table-bordered allTable">
                <thead>
                <tr>
                    <th>Документы</th>
                    <th>Приход</th>
                    <th>Расход</th>
                </tr>
                </thead>
                <tbody>
                    <template v-for="paymentGroup in payments.Contracts">
                        <tr>
                            <td colspan="2" style="border-top-width: 3px;"><h3>{{paymentGroup.Contract_name}}</h3></td>
                            <td style="border-top-width: 3px;">
                                <b>Сальдо начальное:</b><br>
                                {{paymentGroup.BeginningBalance | formatPrice}}
                            </td>
                        </tr>
                        <tr v-for="payment in paymentGroup.Documents">
                            <td>
                                <span v-if="payment.Link" class="is-link text-info" @click="showDetail(payment)">{{payment.Representation}}</span>
                                <span v-else>{{payment.Representation}}</span>
                            </td>
                            <td class="text-right">{{payment.SumIn | formatPrice}}</td>
                            <td class="text-right">{{payment.SumOut | formatPrice}}</td>
                        </tr>
                        <tr>
                            <td colspan="2"  style="border-bottom-width: 3px;"></td>
                            <td style="border-bottom-width: 3px;">
                                <b>Сальдо конечное:</b><br>
                                {{paymentGroup.ClosingBalance | formatPrice}}
                            </td>
                        </tr>
                    </template>

                </tbody>
            </table>
            <div><strong>Сальдо начальное: {{payments.BeginningBalance | formatPrice}}</strong></div><br/>
        </div>

        <!--detail card-->
        <b-modal ref="detailPayments" size="lg" hide-footer :title="detailPayment.representation">
            <div class="loading" v-if="!detailPayment"></div>
            <div class="d-block" v-else>
                <div class="payment-detail-info">
                    <div><strong>Номер:</strong> {{detailPayment.number}} от {{detailPayment.date}}</div>
                    <template v-if="detailPayment.Protected!=1">
                        <div v-if="detailPayment.order"><strong>Реализация по заказу:</strong> {{detailPayment.order}} </div>
                        <div v-if="detailPayment.sf"><strong>Счет-фактура:</strong> {{detailPayment.sf}} </div>
                        <div v-if="detailPayment.warehouse"><strong>Склад:</strong> {{detailPayment.warehouse}} </div>
                        <div v-if="detailPayment.organization"><strong>Организация:</strong> {{detailPayment.organization}} </div>
                        <div v-if="detailPayment.manager"><strong>Менеджер:</strong> {{detailPayment.manager}} </div>
                    </template>
                    <div v-if="detailPayment.comment"><strong>Комментарий:</strong> {{detailPayment.comment}} </div>
                    <div v-if="detailPayment.account_bank"><strong>Банк:</strong> {{detailPayment.account_bank}} </div>
                    <div v-if="detailPayment.account_number"><strong>Банковский счет:</strong> {{detailPayment.account_number}} </div>
                </div>

                <div v-if="detailPayment.strings">
                    <table class="table table-bordered table-sm detail-table">
                        <tr>
                            <template v-if="detailPayment.name=='РеализацияТоваровУслуг'">
                                <th>Название</th>
                                <th>Количество</th>
                                <th width="100">Цена</th>
                                <th>Скидка</th>
                            </template>
                            <template v-if="detailPayment.name!='РеализацияТоваровУслуг'">
                                <th>Основание платежа</th>
                            </template>
                            <th width="100">Сумма</th>
                        </tr>
                        <template v-for="string in detailPayment.strings">
                            <template v-if="detailPayment.name=='РеализацияТоваровУслуг'">
                                <tr>
                                    <td>
                                        {{string.name}}<br/>
                                        <small class="art">{{string.art}}</small>
                                    </td>
                                    <td class="text-right">{{string.quantity}}</td>
                                    <td class="text-right">{{string.price | formatPrice}}</td>
                                    <td class="text-right">{{string.discount | formatPrice}}</td>
                                    <td class="text-right">{{string.sum | formatPrice}}</td>
                                </tr>
                            </template>
                            <template v-else>
                                <tr>
                                    <td>{{string.name}}</td>
                                    <td>{{string.sum | formatPrice}}</td>
                                </tr>
                            </template>
                        </template>

                    </table>
                </div>
                <strong>Сумма:</strong> {{detailPayment.sum | formatPrice}} <br/><br/>
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
                dateFrom: monthAgo,
                dateTo: now,
                format: "dd.MM.yyyy",
                language: "ru",
                payments: false,
                detailPayment: false
            }
        },
        components: {
            Datepicker
        },
        methods: {
            showPayments(){
                this.payments = false;
                this.loading = true;
                this.$http({
                    method: 'post',
                    url: '/ajax/orderActions.php',
                    data: {
                        TYPE: 'paymentList',
                        dfrom: this.dateFrom,
                        dto: this.dateTo
                    }
                })
                    .then(response => {
                        this.payments = response.data;
                        this.loading = false;
                    })
            },
            showDetail(payment){
                this.detailPayment = false;
                this.$refs.detailPayments.show();
                this.$http({
                    method: 'post',
                    url: '/ajax/orderActions.php',
                    data: {
                        TYPE: 'detailPayment',
                        name: payment.Name,
                        guid: payment.GUID
                    }
                })
                    .then(response => {
                        this.detailPayment = response.data;
                        console.log(response);
                    })
            }
        },
        filters:{
            formatPrice(value){
                let val = (value/1).toFixed(2);
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
            }
        },
    }
</script>

<style scoped>
</style>