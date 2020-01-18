cc.Class({
    extends: cc.Component,

    properties: {
        nameLabel: {
            default: null,
            type: cc.Label
        },

        coinLabel: cc.Label,

        avatarSprite: {
            default: null,
            type: cc.Sprite
        },

        standSprite: {
            default: null,
            type: cc.Sprite
        },

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        var player = cc.find('player').getComponent('Player');
        this.nameLabel.string = player.nickName;
        this.coinLabel.string = player.coinsOwned.toString();

        if (player.coinsOwned > 151) {
            cc.find('Canvas/quizButton').getComponent(cc.Button).interactable = false;
        }
        else {
            cc.find('Canvas/quizButton').getComponent(cc.Button).interactable = true;
        }

        var self = this;
        // load image from resource folder
        cc.loader.loadRes(player.avatarImgDir, cc.SpriteFrame, function (err, spriteFrame) {
            self.standSprite.spriteFrame = spriteFrame;
        });
        cc.loader.loadRes(player.avatarImgDir + '_s', cc.SpriteFrame, function (err, spriteFrame) {
            self.avatarSprite.spriteFrame = spriteFrame;
        });
        
        if(G.isNewUser){
            console.log("fsdfsdf");
            Alert.show(1.5, "欢迎来到无尽之岛", "无尽之岛包含三个关卡，请从扩散实验开始玩起，赚取你的金币吧。如金币不够，可以做测验得金币哦。", null, false);
        }
        
        //socket, username, sequenceID, stage, actionType, operatedItem, rewardType, rewardQty, totalCoins
        //insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "levelmap", "system", "na", "na", 0, G.user.coins);
        G.isNewUser = false;
        this.levelAnimation();
    },

    start () {

    },

    levelAnimation: function () {
        var levelNode = null;
        if(!G.isDiffDone){
            levelNode = cc.find("Canvas/diffButton/Background");
        }else if (!G.isOsmoDone){
            levelNode = cc.find("Canvas/osButton/Background");
        }else if(!G.isBanaDone){
            levelNode = cc.find("Canvas/bananaButton/Background");
        }
        
        var seq = cc.repeatForever(cc.sequence(cc.scaleTo(1, 0.9), cc.scaleTo(1, 1)));
        levelNode.runAction(seq);
    },

    goToDiffScene: function () {
        cc.director.loadScene("DoDiffusionTest");
    },

    goToOsmosisScene: function () {
        cc.director.loadScene("DoOsmosisTest");
    },

    goToBananaScene: function () {
        cc.director.loadScene("SaveBananaTree");
    },

    goToQuizScene: function () {
        cc.director.loadScene("DoQuiz");
    },
    /*
    update: function (dt) {
    },*/
});
