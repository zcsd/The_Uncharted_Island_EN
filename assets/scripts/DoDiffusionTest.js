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
        //socket, username, sequenceID, stage, actionType, operatedItem, rewardType, rewardQty, totalCoins
        insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "diffusion", "init", "na", "na", 0, G.user.coins);
        
        var introduction = "欢迎来到扩散实验室！接下来请用U型管完成一个液体扩散实验，完成实验将有丰厚金币奖励。购买、使用材料均需花费金币，考虑后再做选择哦。";
        Alert.show(1.6, "扩散实验", introduction, function(){
            insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "diffusion", "read", "introduction", "na", 0, G.user.coins);
        }, false);
        this.progressBar.progress = 0;
        this.hintLabel.node.color = new cc.color(4, 84, 114, 255);
        this.hintLabel.string = "请购买使用合适的仪器和溶质";
        this.checkMaterial();
    },

    backToMapScene: function () {
        this.resetScene();
        cc.director.loadScene("LevelMap");
        insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "diffusion", "back", "na", "na", 0, G.user.coins);
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
                    insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "diffusion", "takeback", materialInfo[1], "na", 0, G.user.coins);
                });
            }
            else {
                if (player.materialUsedClass.has(materialClass)) {
                    console.log("owned, can not used");
                    var displayInfo = "你已使用同类物品，请收回后再使用该物品。";
                    //var self = this;
                    Alert.show(1, "提示", displayInfo, function(){
                        insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "diffusion", "refuseusing", materialInfo[1], "na", 0, G.user.coins);
                    }, false);
                }
                else {
                    console.log("owned, can use, but not used");
                    var displayInfo = "你要花费20金币使用" + materialInfo[1]  + "吗？";
                    var self = this;
                    Alert.show(1, "使用", displayInfo, function(){
                        self.afterUsing(materialCode, materialInfo[1], materialClass);    
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
                insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "diffusion", "buy", materialInfo[1], "penalty", materialCost, G.user.coins);
            });
        }
    },

    readyToDiffuse: function () {
        var animationComponent = this.diffusion.getComponent(cc.Animation);
        animationComponent.play("uDiffAni");
    },

    afterBuying: function(cost, code) {
        console.log("购买确定按钮被点击!");
        this.coinAnimation();
        var player = cc.find('player').getComponent('Player');
        player.updateCoins(cost*(-1));
        //player.coinsOwned = player.coinsOwned - cost;
        player.materialOwned.add(code);
        this.coinLabel.string = player.coinsOwned.toString();

        this.setMaterialOwned(code);
    },

    afterUsing: function(code, material, mClass) {
        var player = cc.find('player').getComponent('Player');
        this.coinAnimation();
        //player.coinsOwned = player.coinsOwned - 20;
        player.updateCoins(-20);
        this.coinLabel.string = player.coinsOwned.toString();

        if (mClass == 'a') {
            if (code == 1) {
                this.setMaterialUsed(code);
                player.materialUsed.add(code);
                player.materialUsedClass.add(mClass);
                var nodePath = 'Canvas/container/c' + code.toString();
                var containerNode = cc.find(nodePath);
                containerNode.active = true;
                this.hintLabel.node.color = new cc.color(4, 84, 114, 255);
                this.hintLabel.string = "请继续挑选使用合适的溶质";
                this.progressBar.progress += 0.5;
                insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "diffusion", "use", material, "penalty", 20, G.user.coins); 
            }
            else {
                this.hintLabel.node.color = new cc.color(255, 50, 50, 255);
                this.hintLabel.string = "此仪器不符合要求，试试其他的吧";
                insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "diffusion", "wronguse", material, "penalty", 20, G.user.coins); 
            }
        }

        if (mClass == 'c') {
            if (player.materialUsed.has(1)) {
                if (code == 4) {
                    insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "diffusion", "use", material, "penalty", 20, G.user.coins); 
                    this.setMaterialUsed(code);
                    player.materialUsed.add(code);
                    player.materialUsedClass.add(mClass);
                    var animationComponent = this.diffusion.getComponent(cc.Animation);
                    animationComponent.play("uDiffAni");
                    this.progressBar.progress += 0.5;
                    this.hintLabel.node.color = new cc.color(4, 84, 114, 255);
                    this.hintLabel.string = "做的好，扩散实验完成";
                    G.isDiffDone = true;
                    //player.coinsOwned = player.coinsOwned + 250;
                    player.updateCoins(250);
                    this.coinLabel.string = player.coinsOwned.toString();
                    insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "diffusion", "finish", "na", "reward", 250, G.user.coins);
                    
                }
                else {
                    this.hintLabel.node.color = new cc.color(255, 50, 50, 255);
                    this.hintLabel.string = "此材料不符合要求，试试其他的吧";
                    insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "diffusion", "wronguse", material, "penalty", 20, G.user.coins); 
                }
            }
            else {
                this.hintLabel.node.color = new cc.color(255, 50, 50, 255);
                this.hintLabel.string = "请先挑选使用合适的实验仪器";
            }           
        }

        if (mClass == 'b') {
            this.hintLabel.node.color = new cc.color(255, 50, 50, 255);
            this.hintLabel.string = "该实验不需要此材料";
            insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "diffusion", "wronguse", material, "penalty", 20, G.user.coins); 
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
            if (code == 1) {
                this.progressBar.progress -= 0.5;
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
        insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "diffusion", "reset", "na", "na", 0, G.user.coins);
    },

    start () {

    },

    // update (dt) {},
});
