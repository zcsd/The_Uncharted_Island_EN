cc.Class({
    extends: cc.Component,

    properties: {
        nameLabel: {
            default: null,
            type: cc.Label
        },

        coinLabel: cc.Label,

        hintLabel: cc.Label,

        progressBar: cc.ProgressBar,

        avatarSprite: {
            default: null,
            type: cc.Sprite
        },

        osmosisLeft: {
            default: null,
            type: cc.Node
        },

        osmosisRight: {
            default: null,
            type: cc.Node
        },

        sodium: {
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

        this.progressBar.progress = 0;
        this.checkMaterial();
    },

    backToMapScene: function () {
        this.resetScene();
        cc.director.loadScene("LevelMap");
    },

    readyToBuyMaterial: function (event, customEventData) {
        var materialInfo = customEventData.split("_", 4);
        var materialCost = Number(materialInfo[0]);
        var materialName = materialInfo[1];
        var materialCode = Number(materialInfo[2]);
        var materialClass = materialInfo[3];

        var player = cc.find('player').getComponent('Player');
        if (player.materialOwned.has(materialCode)) {
            if (player.materialUsed.has(materialCode)) {
                console.log("is used");
                var displayInfo = "你要收回" + materialInfo[1]  + "吗？";
                var self = this;
                Alert.show(1, "收回", displayInfo, function(){
                    self.afterBacking(materialCode, materialClass);
                });
            }
            else {
                if (player.materialUsedClass.has(materialClass)) {
                    console.log("owned, can not used");
                    var displayInfo = "你已使用同类物品，请收回后再使用该物品。";
                    var self = this;
                    Alert.show(1, "提示", displayInfo, null, false);
                }
                else {
                    console.log("owned, can use, but not used");
                    var displayInfo = "你要花费20金币使用" + materialInfo[1]  + "吗？";
                    var self = this;
                    Alert.show(1, "使用", displayInfo, function(){
                        self.afterUsing(materialCode, materialClass);
                    });
                }
            }
        }
        else {
            console.log("Not owned.");
            var displayInfo = "你要花费" + materialInfo[0] + "金币购买" + materialInfo[1] + "吗？";
            var self = this;
            Alert.show(1, "购买", displayInfo, function(){
                self.afterBuying(materialCost, materialCode);
            });
        }
    },

    readyToDiffuse: function () {
        var animationComponent = this.diffusion.getComponent(cc.Animation);
        animationComponent.play("diffusionAni");
    },

    afterBuying: function(cost, code) {
        console.log("购买确定按钮被点击!");
        this.coinAnimation();
        var player = cc.find('player').getComponent('Player');
        player.coinsOwned = player.coinsOwned - cost;
        player.materialOwned.add(code);
        this.coinLabel.string = player.coinsOwned.toString();

        this.setMaterialOwned(code);
    },

    afterUsing: function(code, mClass) {
        var player = cc.find('player').getComponent('Player');
        this.coinAnimation();
        player.coinsOwned = player.coinsOwned - 20;
        this.coinLabel.string = player.coinsOwned.toString();

        if (mClass == 'a') {
            if (code == 2) {
                this.setMaterialUsed(code);
                player.materialUsed.add(code);
                player.materialUsedClass.add(mClass);
                var nodePath = 'Canvas/container/c' + code.toString();
                var containerNode = cc.find(nodePath);
                containerNode.active = true;
                this.hintLabel.node.color = new cc.color(4, 84, 114, 255);
                this.hintLabel.string = "请继续挑选使用合适的材料";
                this.progressBar.progress += 0.33;
            }
            else {
                this.hintLabel.node.color = new cc.color(255, 50, 50, 255);
                this.hintLabel.string = "此仪器不符合要求，试试其他的吧";
            }
        }

        if (mClass == 'b') {
            if(player.materialUsed.has(2)) {
                if (code == 6) {
                    this.setMaterialUsed(code);
                    player.materialUsed.add(code);
                    player.materialUsedClass.add(mClass);
                    var nodePath = 'Canvas/container/c2/membrane';
                    cc.find(nodePath).active = true;
                    this.hintLabel.node.color = new cc.color(4, 84, 114, 255);
                    this.hintLabel.string = "请继续挑选使用合适的溶质";
                    this.progressBar.progress += 0.33;
                }
                else {
                    this.hintLabel.node.color = new cc.color(255, 50, 50, 255);
                    this.hintLabel.string = "此材料不符合要求，试试其他的吧";
                }
            }
            else {
                this.hintLabel.node.color = new cc.color(255, 50, 50, 255);
                this.hintLabel.string = "请先挑选使用合适的实验容器";
            }
        }

        if (mClass == 'c') {
            if (player.materialUsed.has(6)) {
                if (code == 7) {
                    this.setMaterialUsed(code);
                    player.materialUsed.add(code);
                    player.materialUsedClass.add(mClass);
                    this.osmosisLeft.getComponent(cc.Animation).play("leftAni");
                    this.osmosisRight.getComponent(cc.Animation).play("rightAni");
                    this.sodium.getComponent(cc.Animation).play("sodiumAni");
                    this.progressBar.progress = 1.0;
                    this.hintLabel.node.color = new cc.color(4, 84, 114, 255);
                    this.hintLabel.string = "做的好，渗透实验完成";
                    GainNode.isOsmoDone = true;
                    player.coinsOwned = player.coinsOwned + 250;
                    this.coinLabel.string = player.coinsOwned.toString();
                }
                else {
                    this.hintLabel.string = "此材料不符合要求，试试其他的吧";
                }
            }
            else {
                this.hintLabel.node.color = new cc.color(255, 50, 50, 255);
                this.hintLabel.string = "请先挑选使用合适的实验容器或者材料";
            }
        }

    },

    afterBacking: function(code, mClass) {
        var materialNodePath = 'Canvas/materialBackground/m' + code.toString() + 'Button';
        var isOwnedNode = cc.find((materialNodePath + '/isOwned'));
        isOwnedNode.getComponent(cc.Sprite).setState(0);

        var player = cc.find('player').getComponent('Player');
        player.materialUsed.delete(code);
        player.materialUsedClass.delete(mClass);

        if (mClass == 'a') {
            var nodePath = 'Canvas/container/c' + code.toString();
            var containerNode = cc.find(nodePath);
            containerNode.active = false;
            if (code == 2) {
                this.progressBar.progress -= 0.33;
            }
        }
    },

    checkMaterial: function() {
        var player = cc.find('player').getComponent('Player');
        for (var i of player.materialOwned) {
            this.setMaterialOwned(i);
        }

        for (var i of player.materialUsed) {
            this.setMaterialUsed(i);
        }
    },

    setMaterialOwned: function(code) {
        var materialNodePath = 'Canvas/materialBackground/m' + code.toString() + 'Button';
        var isOwnedNode = cc.find((materialNodePath + '/isOwned'));
        isOwnedNode.active = true;
    },

    setMaterialUsed: function(code) {
        var materialNodePath = 'Canvas/materialBackground/m' + code.toString() + 'Button';
        var isOwnedNode = cc.find((materialNodePath + '/isOwned'));
        isOwnedNode.getComponent(cc.Sprite).setState(1);
    },

    coinAnimation: function () {
        var coinNode = cc.find("Canvas/coin");
        var seq = cc.sequence(cc.scaleTo(0.3, 0.7), cc.scaleTo(0.3, 1), cc.scaleTo(0.3, 0.7), cc.scaleTo(0.3, 1) );
        coinNode.runAction(seq);
    },

    resetScene: function () {
        var player = cc.find('player').getComponent('Player');
        player.materialUsed.clear(); 
        player.materialUsedClass.clear();
    },

    start () {

    },

    // update (dt) {},
});
