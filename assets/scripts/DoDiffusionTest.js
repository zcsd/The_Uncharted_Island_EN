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
        var introduction = "扩散作用是指物质（固体，液体，气体）分子从高浓度区域向低浓度区域转移的现象，直到物体内各部分的密度相间为止，主要由于浓度差或温度差所引起。"
        Alert.show(2, "扩散作用", introduction, null, false);
        this.checkMaterial();
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
        player.materialOwned.push(code);
        this.coinLabel.string = player.coinsOwned.toString();

        this.setMaterialOwned(code);

        /*
        if (code == 1) {
            var tubeNode = cc.find('Canvas/tube');
            tubeNode.active = true;
        }*/
    },

    checkMaterial: function() {
        var player = cc.find('player').getComponent('Player');
        var i;
        for (i = 0; i < player.materialOwned.length; i++) {
            this.setMaterialOwned(player.materialOwned[i]);
        }
    },

    setMaterialOwned: function(code) {
        var materialNodePath = 'Canvas/materialBackground/m' + code.toString() + 'Button';
        var isOwnedNode = cc.find((materialNodePath + '/isOwned'));
        isOwnedNode.active = true;
        var materialButton = cc.find(materialNodePath).getComponent(cc.Button);
        materialButton.interactable = false;
    },

    resetScene: function () {
        
    },

    start () {

    },

    // update (dt) {},
});
