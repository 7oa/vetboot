<template>
    <li class="catalog-menu-li">
        <div @click="openSections" class="catalog-menu-link">{{name}}
            <span class="caret"></span>
        </div>
        <ul class="catalog-menu-child" v-if="sectionOpen">
            <li class="catalog-menu-li" v-for="child in childSecitons">
                <div class="catalog-menu-link" :class="{'active' : (active==child.id)}"  @click="showBrendsList(child.id)">{{child.name}}</div>
            </li>
        </ul>
    </li>
</template>

<script>
    import Service from '../../service.js'

    const catalogActions = '/ajax/catalog.php';

    export default {
        props: ["name","id"],
        data () {
            return {
                childSecitons: [],
                sectionOpen: false,
                active: ''
            }
        },
        methods: {
            openSections(){
                this.sectionOpen = !this.sectionOpen;
                if(this.sectionOpen&&this.childSecitons.length==0){
                    Service.loading(true);
                    this.$http.post(catalogActions,{
                        id: this.id,
                        TYPE: 'section'
                    })
                        .then(response => {
                            this.childSecitons = response.data;
                            Service.loading(false);
                        })
                }
            },
            showBrendsList(id){
                this.active = id;
                this.$emit('showBrendsList', id);
            }
        }
    }
</script>

<style scoped>
</style>