cc.Class({
    extends: cc.Component,

    properties: {
        nickName: "",
        gender: "boy",
        avatarImgDir: "boy_0",
        coinsOwned: 200,

        diffMaterialOwned: null,
        diffMaterialUsed: null,
        diffMaterialUsedClass: null,

        osmoMaterialOwned: null,
        osmoMaterialUsed: null,
        osmoMaterialUsedClass: null,
    },

    onLoad () {
        cc.game.addPersistRootNode(this.node);

        this.diffMaterialOwned = new Set();
        this.diffMaterialUsed = new Set();
        this.diffMaterialUsedClass = new Set();

        this.osmoMaterialOwned = new Set();
        this.osmoMaterialUsed = new Set();
        this.osmoMaterialUsedClass = new Set();
    },

    start () {

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
