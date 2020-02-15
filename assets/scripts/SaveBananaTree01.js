cc.Class({
    extends: cc.Component,

    properties: {
        nameLabel: cc.Label,
        coinLabel: cc.Label,

        avatarSprite: cc.Sprite,
    },

    onLoad: function () {
        var player = cc.find('player').getComponent('Player');
        this.nameLabel.string = player.nickName;
        this.coinLabel.string = player.coinsOwned.toString();

        var self = this;
        // load image from resource folder
        cc.loader.loadRes(player.avatarImgDir + '_s', cc.SpriteFrame, function (err, spriteFrame) {
            self.avatarSprite.spriteFrame = spriteFrame;
        });

        //Alert.show(1.4, "xxx", "xxx。", null, false);

    },

    backToMapScene: function () {
        cc.director.loadScene("LevelMap");
    },

    start () {

    },

    // update (dt) {},
});
