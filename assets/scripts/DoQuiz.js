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

        answerChoice: 1,

        answerToggleContainer: cc.ToggleContainer,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        var player = cc.find('player').getComponent('Player');
        this.nameLabel.string = player.nickName;
        this.coinLabel.string = player.coinsOwned.toString();

        var self = this;
        // load image from resource folder
        cc.loader.loadRes(player.avatarImgDir + '_s', cc.SpriteFrame, function (err, spriteFrame) {
            self.avatarSprite.spriteFrame = spriteFrame;
        });

    },

    start () {

    },

    changeAnswer: function (event, customEventData) {
        this.answerChoice = event.node._name.replace('toggle', '');
    },

    backToMapScene: function () {
        cc.director.loadScene("LevelMap");
    },

    // update (dt) {},
});
