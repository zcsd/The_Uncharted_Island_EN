cc.Class({
    extends: cc.Component,

    properties: {
        nameLabel: cc.Label,
        coinLabel: cc.Label,
        avatarSprite: cc.Sprite,
        standSprite: cc.Sprite,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        var player = cc.find('player').getComponent('Player');
        this.nameLabel.string = player.nickName;
        this.coinLabel.string = player.coinsOwned.toString();

        var self = this;
        // load image from resource folder
        cc.loader.loadRes(player.avatarImgDir, cc.SpriteFrame, function (err, spriteFrame) {
            self.standSprite.spriteFrame = spriteFrame;
        });

        cc.loader.loadRes(player.avatarImgDir + '_s', cc.SpriteFrame, function (err, spriteFrame) {
            self.avatarSprite.spriteFrame = spriteFrame;
        });

        // load hints from json
        cc.loader.loadRes('kgPoint', function (err, data) {
            if (err) {
                console.log(err);
            }
            else {
                G.kgPoint = data;
                console.log("Knowledge data loaded.");
            }
        });

        var sunSeq = cc.repeatForever(cc.sequence(cc.moveBy(2, cc.v2(-9, -5)), cc.moveBy(2, cc.v2(9, 5))));
        cc.find("Canvas/cloudsSunBg").runAction(sunSeq);
    },

    start () {

    },

    goToLevelScene: function () {
        cc.director.loadScene("LevelMap");
    },

    goToCardStudyScene : function () {
        cc.director.loadScene("CardStudy");
    },

    goToKtScene: function () {
        cc.director.loadScene("KnowledgeTree");
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
