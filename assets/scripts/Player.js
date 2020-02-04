cc.Class({
    extends: cc.Component,

    properties: {
        nickName: "",
        gender: "boy",
        avatarImgDir: "boy_0",
        coinsOwned: 200,
        materialOwned: null,
        materialUsed: null,
        materialUsedClass: null,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.game.addPersistRootNode(this.node);
        this.materialOwned = new Set();
        this.materialUsed = new Set();
        this.materialUsedClass = new Set();
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
