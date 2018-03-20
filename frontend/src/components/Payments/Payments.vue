<template>
    <div class="page payments">
        <div class="page-ttl">
            <h1>Взаиморасчеты</h1>
        </div>

        <div class="select-date">
            <b-form inline>
                <datepicker v-model="dateFrom" :language="language" :format="format" input-class="mb-4 mr-sm-2 mb-sm-0"></datepicker>
                <datepicker v-model="dateTo" :language="language" :format="format" input-class="mb-4 mr-sm-2 mb-sm-0"></datepicker>

                <b-button size="sm" variant="info" @click="showPayments">
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
                                {{payment.Representation}}
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
                payments: false
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