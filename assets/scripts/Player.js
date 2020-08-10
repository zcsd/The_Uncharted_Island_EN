cc.Class({
    extends: cc.Component,

    properties: {
        nickName: "",
        gender: "boy",
        avatarImgDir: "boy_0",
        coinsOwned: 250,

        diffMaterialOwned: null,
        diffMaterialUsed: null,
        diffMaterialUsedClass: null,
        diffMaterialState: null,

        osmoMaterialOwned: null,
        osmoMaterialUsed: null,
        osmoMaterialUsedClass: null,
        osmoMaterialState: null,
    },

    onLoad () {
        cc.game.addPersistRootNode(this.node);

        this.coinsOwned = 250;

        this.diffMaterialOwned = new Set();
        this.diffMaterialUsed = new Set();
        this.diffMaterialUsedClass = new Set();
        // 001 not owned and not used; 010 owned and not used; 100 owned and used
        this.diffMaterialState = ['001','001','001','001','001','001','001','001','001'];

        this.osmoMaterialOwned = new Set();
        this.osmoMaterialUsed = new Set();
        this.osmoMaterialUsedClass = new Set();
        this.osmoMaterialState = ['001','001','001','001','001','001','001','001','001'];

        this.initInventory();
    },

    start () {

    },

    initInventory: function(){
        for (i = 1; i < 10; i ++){
            this.diffMaterialOwned.add(i);
            this.diffMaterialState[i-1] = '010';

            this.osmoMaterialOwned.add(i);
            this.osmoMaterialState[i-1] = '010';
        }
    },

    updateInventory: function(stage, action, code, mclass = 'none'){
        if(stage == 'diff') {
            if(action == 'buy') {
                this.diffMaterialOwned.add(code);
                this.diffMaterialState[code-1] = '010';
            }else if(action == 'use') {
                this.diffMaterialUsed.add(code);
                this.diffMaterialUsedClass.add(mclass);
                this.diffMaterialState[code-1] = '100';
            }else if(action == 'takeback') {
                this.diffMaterialUsed.delete(code);
                this.diffMaterialUsedClass.delete(mclass);
                this.diffMaterialState[code-1] = '010';
            }else if(action == 'clear') {
                this.diffMaterialOwned.clear();
                this.diffMaterialUsed.clear(); 
                this.diffMaterialUsedClass.clear();
                this.diffMaterialState = ['001','001','001','001','001','001','001','001','001'];
                G.itemsState = '001001001001001001001001001';
            }
            
            var state = '';
            for (var i = 0; i < this.diffMaterialState.length; i++){
                state = state.concat(this.diffMaterialState[i]);
            }
            G.itemsState = state;
        }else if(stage == 'osmo') {
            if(action == 'buy') {
                this.osmoMaterialOwned.add(code);
                this.osmoMaterialState[code-1] = '010';
            }else if(action == 'use') {
                this.osmoMaterialUsed.add(code);
                this.osmoMaterialUsedClass.add(mclass);
                this.osmoMaterialState[code-1] = '100';
            }else if(action == 'takeback') {
                this.osmoMaterialUsed.delete(code);
                this.osmoMaterialUsedClass.delete(mclass);
                this.osmoMaterialState[code-1] = '010';
            }else if(action == 'clear') {
                this.osmoMaterialOwned.clear();
                this.osmoMaterialUsed.clear(); 
                this.osmoMaterialUsedClass.clear();
                this.osmoMaterialState = ['001','001','001','001','001','001','001','001','001'];
                G.itemsState = '001001001001001001001001001';
            } 

            var state = '';
            for (var i = 0; i < this.osmoMaterialState.length; i++){
                state = state.concat(this.osmoMaterialState[i]);
            }
            G.itemsState = state;
        }
    },

    updateCoins: function(change){
        this.coinsOwned = this.coinsOwned + change;
        G.user.coins = this.coinsOwned;
        G.globalSocket.emit("updateCoins", {username: G.user.username, coins: G.user.coins});
    
        if (G.user.coins > 0) {
            G.isQuizOpen = false;
        }
        else {
            G.isQuizOpen = true;
        }
    },
    /*
    update: function () {   
    },*/
});
