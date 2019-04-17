cc.Class({
    extends: cc.Component,

    properties: {
        nameLabel: {
            default: null,
            type: cc.Label
        },

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

        var self = this;
        // load image from resource folder
        cc.loader.loadRes(player.avatarImgDir + '_s', cc.SpriteFrame, function (err, spriteFrame) {
            self.avatarSprite.spriteFrame = spriteFrame;
        });
    },

    backToMapScene: function () {
        cc.director.loadScene("LevelMap");

    },

    readyToBuyMaterial: function (event, customEventData) {
        var materialInfo = customEventData.split("_", 2);
        var displayInfo = "你要花费" + materialInfo[0] + "金币购买" + materialInfo[1] + "吗？";

        var self = this;
        Alert.show(displayInfo, function(){
            console.log("确定按钮被点击！");
            self.doTest();
        });
    },

    readyToDiffuse: function () {
        var animationComponent = this.diffusion.getComponent(cc.Animation);
        animationComponent.play("diffusionAni");
    },

    doTest: function() {
        console.log("确定按钮被点击! in outside");
    },

    resetScene: function () {
        
    },

    start () {

    },

    // update (dt) {},
});
