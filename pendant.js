var default_image = "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==";
var pendant = new Vue({
    el: '.pendant-page',
    data: {
        select:'',
        user_id:'',
        pageData:[],
        user_vip:'',
        tabActive: 0,
        user_name:'',
        pendant_buy:[],
        user_pendant_id:'',
        user_pendant_url:'',
        user_avatar:default_image,
        default_image:default_image,
    },
    created(){
        this.getAllPend();
    },
    mounted() {
    },
    computed:{
        curSkin(){
            const id = this.select || this.user_pendant_id;
            let cur  = {};
            let tab;
            for(tab of this.pageData){
                var item;
                for(item of tab.pends){
                    if(item.pendant_id == id) cur = item;
                }
            }
            return cur;
        },
        skin_url(){
            return this.curSkin.image_url || this.user_pendant_url || this.default_image;
        },
        isBuy(){
            return !this.curSkin.vip && !this.pendant_buy.includes(this.curSkin.pendant_id) && this.curSkin.pendant_value !== 0;
        },
        isonly_user(){
            let only_user_id_all;
            let user_id;
            if(this.curSkin.pendant_only_user_id){
                only_user_id_all = this.curSkin.pendant_only_user_id.split(',');
                user_id          = userTools.$data.userData.id;
                only_user_id     = only_user_id_all.indexOf(user_id);
            }
            if(this.curSkin.pendant_only == '1' && this.curSkin.pendant_only_user_id !== '' && only_user_id !== -1){
                return true;
            }else if(this.curSkin.pendant_only == '0' || this.curSkin.pendant_only_user_id === ''){
                return true;
            }else{
                return false;
            }
        },
        saveSkinBtn(){
            const isVip     = this.user_vip.indexOf('vip') > -1;
            const needVip   = this.curSkin.vip;
            const isSelect  = this.select !== '';
            return (needVip && isVip) || !needVip;
        }
    },
    methods: {
        login(type) {
            login.show      = true;
            login.loginType = type;
        },
        clickTabs(id) {
            this.select     = '';
            this.tabActive  = id;
        },
        getAllPend(){
            this.$http.post(b2_rest_url +'getPenDant').then(({data:rv})=>{
                this.pageData           = rv.data;
                this.user_id            = userTools.$data.userData.id;
                this.user_vip           = rv.user_vip;
                this.tabActive          = rv.data[0].id || 0;
                this.user_name          = userTools.$data.userData.user_display_name;
                this.user_avatar        = userTools.$data.userData.avatar || this.user_avatar;
                this.pendant_buy        = rv.pendant_buy.split(',');
                this.user_pendant_id    = rv.user_pendant_id;
                this.user_pendant_url   = rv.user_pendant_url;
            });
        },
        selectItem(id){
            this.select = this.select === id ? '' : id;
        },
        buySkin(){
            if(!this.user_id) {
                this.login(1);
                return;
            }
            const {select:id} = this;
            this.$http.post(b2_global.site_info.admin_ajax +`b2_pendant_buy&wear_id=${id}`).then(({data:rv})=>{
                if(rv.status === 200){
                    this.user_pendant_id = id;
                    this.pendant_buy.push(id);
                    this.$toasted.show(rv.msg,{
                        theme:'primary',
                        position:'top-center',
                        duration: 3000
                    });
                }else{
                    this.$toasted.show(rv.msg,{
                        theme:'primary',
                        position:'top-center',
                        duration: 3000
                    });
                }
                this.select = '';
            });
        },
        switchSkin(){
            if(!this.user_id) {
                this.login(1);
                return;
            }
            const {select,user_pendant_id} = this;
            let id = select === user_pendant_id ? 0 : select;
            this.$http.post(b2_global.site_info.admin_ajax +`b2_pendant_wear&wear_id=${id}`).then(({data:rv})=>{
                if(rv.status === 200){
                    this.user_pendant_id = id;
                    if(!id) this.user_pendant_url = '';
                    this.$toasted.show(rv.msg,{
                        theme:'primary',
                        position:'top-center',
                        duration: 3000
                    });
                }else{
                    this.$toasted.show(rv.msg,{
                        theme:'primary',
                        position:'top-center',
                        duration: 3000
                    });
                }
                this.select = '';
            });
        }
    },
});