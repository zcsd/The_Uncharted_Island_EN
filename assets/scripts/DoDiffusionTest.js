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

        diffusion: {
            default: null,
            type: cc.Node
        }

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var player = cc.find('player').getComponent('Player');
        this.nameLabel.string = player.nickName;
        this.coinLabel.string = player.coinsOwned.toString();

        var self = this;
        // load image from resource folder
        cc.loader.loadRes(player.avatarImgDir + '_s', cc.SpriteFrame, function (err, spriteFrame) {
            self.avatarSprite.spriteFrame = spriteFrame;
        });
        Alert.show(2, "提示", "123", null, false);
    },

    backToMapScene: function () {
        cc.director.loadScene("LevelMap");
    },

    readyToBuyMaterial: function (event, customEventData) {
        var materialInfo = customEventData.split("_", 3);
        var materialCost = Number(materialInfo[0]);
        var materialName = materialInfo[1];
        var materialCode = Number(materialInfo[2]);
        var displayInfo = "你要花费" + materialInfo[0] + "金币购买" + materialInfo[1] + "吗？";

        var self = this;
        Alert.show(1, "购买", displayInfo, function(){
            self.afterBuying(materialCost, materialCode);
        });
    },

    readyToDiffuse: function () {
        var animationComponent = this.diffusion.getComponent(cc.Animation);
        animationComponent.play("diffusionAni");
    },

    afterBuying: function(cost, code) {
        console.log("确定按钮被点击!");
        var player = cc.find('player').getComponent('Player');
        player.coinsOwned = player.coinsOwned - cost;
        this.coinLabel.string = player.coinsOwned.toString();
    },

    resetScene: function () {
        
    },

    start () {

    },

    // update (dt) {},
});
