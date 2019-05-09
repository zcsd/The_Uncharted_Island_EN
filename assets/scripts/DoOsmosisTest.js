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

        osmosis: {
            default: null,
            type: cc.Node
        }

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
        var introduction = "渗透作用是指两种不同浓度的溶液隔以半透膜（允许溶剂分子通过，不允许溶质分子通过的膜），水分子或其它溶剂分子从低浓度的溶液通过半透膜进入高浓度溶液中的现象。"
        Alert.show(2, "渗透作用", introduction, null, false);
    },

    backToMapScene: function () {
        cc.director.loadScene("LevelMap");
    },

    readyToBuyMaterial: function (event, customEventData) {
        console.log(event.target);
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

    readyToOsmosis: function () {
        var animationComponent = this.osmosis.getComponent(cc.Animation);
        animationComponent.play("osmosisAni");
    },

    afterBuying: function(cost, code) {
        console.log("确定按钮被点击!");
        var player = cc.find('player').getComponent('Player');
        player.coinsOwned = player.coinsOwned - cost;
        this.coinLabel.string = player.coinsOwned.toString();

        var materialNodePath = 'Canvas/materialBackground/m' + code.toString() + 'Button';
        var isOwnedNode = cc.find((materialNodePath + '/isOwned'));
        isOwnedNode.active = true;
        var materialButton = cc.find(materialNodePath).getComponent(cc.Button);
        materialButton.interactable = false;

        if (code == 1) {
            var tubeNode = cc.find('Canvas/tube');
            tubeNode.active = true;
        }
    },

    // update (dt) {},
});
