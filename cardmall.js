var cardMall = new Vue({
    el: '.feed-page',
    data: {
        select: '',
        user_id: '',
        pageData: [],
        user_vip: '',
        user_name: '',
        tabActive: 0,
        user_avatar: 'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==',
        user_cardmall_id: '',
    },
    created() {
        this.getAllCard();
    },
    mounted() {},
    computed: {
        curSkin() {
            const id = this.select || this.user_cardmall_id;
            let cur = {};
            let tab;
            for (tab of this.pageData) {
                let item;
                for (item of tab.cards) {
                    if (item.cardmall_id == id) cur = item;
                }
            }
            return cur;
        },
        curSkinName() {
            return this.curSkin.cardmall_name || '';
        },
        cardTitle() {
            return this.curSkinName ? `我正在使用“${this.curSkinName}”评论背景，你也一起来试试吧~` : '使用了专属评论背景，说话嚣张点~';
        },
        saveSkinBtn() {
            const isVip     = this.user_vip.indexOf('vip') > -1;
            const needVip   = this.curSkin.vip;
            const isSelect  = this.select !== '';
            return (needVip && isVip) || !needVip;
        },
        isUnload() {
            return this.select === this.user_cardmall_id;
        },
        isonly_user(){
            let only_user_id;
            if(this.curSkin.cardmall_only_user_id){
                only_user_id_all = this.curSkin.cardmall_only_user_id.split(',');
                user_id          = userTools.$data.userData.id;
                only_user_id     = only_user_id_all.indexOf(user_id);
            }
            if(this.curSkin.cardmall_only == '0' || this.curSkin.cardmall_only_user_id === ''){
                return true;
            }else if(this.curSkin.cardmall_only == '1' && this.curSkin.cardmall_only_user_id !== '' && only_user_id !== -1){
                return true;
            }else{
                return false;
            }
        },
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
        getAllCard() {
            this.$http.post(b2_rest_url + 'getCardMall').then(({ data: rv }) => {
                this.user_id            = userTools.$data.userData.id;
                this.pageData           = rv.data;
                this.user_vip           = rv.user_vip;
                this.tabActive          = rv.data[0].id || 0;
                this.user_name          = userTools.$data.userData.user_display_name;
                this.user_avatar        = userTools.$data.userData.avatar || this.user_avatar;
                this.user_cardmall_id   = rv.user_cardmall_id;
            });
        },
        selectItem(id) {
            this.select = this.select === id ? '' : id;
        },
        saveSkin() {
            if (!this.user_id) {
                this.login(1);
                return;
            }
            const { select, pageData, isUnload } = this;
            const id = isUnload ? '0' : select;
            this.$http.post(b2_global.site_info.admin_ajax + `b2_cardmall_wear&wear_id=${id}`).then(({ data: rv }) => {
                if (rv.status === 200) {
                    this.user_cardmall_id = id;
                    this.$toasted.show(rv.msg, {
                        theme: 'primary',
                        position: 'top-center',
                        duration: 3000
                    });
                }else{
                    this.$toasted.show(rv.msg, {
                        theme: 'primary',
                        position: 'top-center',
                        duration: 3000
                    });
                }
                this.select = '';
            });
        }
    },
});