cc.Class({
    extends: cc.Component,

    properties: {
        nameLabel: cc.Label,
        coinLabel: cc.Label,
        hintLabel: cc.Label,
        progressBar: cc.ProgressBar,
        avatarSprite: cc.Sprite,

        hints: cc.JsonAsset,

        osmosisLeft: cc.Node,
        osmosisRight: cc.Node,
        sodium: cc.Node,

        osmosisLeft1: cc.Node,
        osmosisRight1: cc.Node,
        sodium1: cc.Node,

        coinRotate: cc.Node,
        coinShine: cc.Node,
        coinBlink: cc.Node,

        isShowCongra: false,
        showCount: 0,

        pressAni: cc.Node,

        sodAni: cc.Animation,
        leftAni: cc.Animation,
        rightAni: cc.Animation,

        sod1Ani: cc.Animation,
        left1Ani: cc.Animation,
        right1Ani: cc.Animation,
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
        // load hints from json
        cc.loader.loadRes('hints', function (err, data) {
            if (err) {
                console.log(err);
            }
            else {
                self.hints = data;
            }
        });

        //socket, username, sequenceID, stage, actionType, operatedItem, rewardType, rewardQty, totalCoins
        insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "osmosis", "init", "na", "na", 0, G.user.coin, G.itemsState);
        
        if(G.isOsmoDone){
            var introduction = "欢迎来到渗透实验室！恭喜你已经成功完成了扩散实验，再次完成实验将没有奖励。";
            Alert.show(1.4, "渗透实验", introduction, function(){
                self.coinAnimation(0);
                self.pressQuizAnimation();
                self.hintLabel.node.color = new cc.color(150,100,100,255);
                self.hintLabel.string = "本次完成实验将没有奖励";
            }, false);
        }else{
            var introduction = "欢迎来到渗透实验室！接下来请用大烧杯完成一个渗透实验，完成实验将有丰厚金币奖励。实验开始时，你会有250金币，购买、使用材料均需花费金币，考虑后再做选择哦。";
            Alert.show(1.4, "渗透实验", introduction, function(){
                self.coinAnimation(0);
                self.pressQuizAnimation();
                insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "osmosis", "read", "introduction", "na", 0, G.user.coins, G.itemsState);
            }, false);

            if(G.user.coins <= 0){
                this.hintLabel.node.color = new cc.color(230,0,0,255);
                this.hintLabel.string = "金币已不足，无法继续游戏，点击右上角参与答题赢取金币吧";
            }else{
                this.hintLabel.node.color = new cc.color(83,111,122,255);
                this.hintLabel.string = "请购买使用合适的仪器和溶质";
            }
        }

        KT.lastScene = 'DoOsmosisTest';

        this.sodAni = this.sodium.getComponent(cc.Animation);
        this.leftAni = this.osmosisLeft.getComponent(cc.Animation);
        this.rightAni = this.osmosisRight.getComponent(cc.Animation);

        this.sod1Ani = this.sodium1.getComponent(cc.Animation);
        this.left1Ani = this.osmosisLeft1.getComponent(cc.Animation);
        this.right1Ani = this.osmosisRight1.getComponent(cc.Animation);

        G.globalSocket.on('osmosis', function(msg){
            console.log('osmosis hint: ', msg);
            self.hintLabel.string = msg;
        });

        G.globalSocket.on('command', function(msg){
            console.log('command received: ', msg);
            
            if (msg == 'leftsalt'){
                self.addSaltToLeft();
            }
        });

        this.progressBar.progress = 0;
        this.checkMaterial();
        G.isOsmoEnter = true;
    },

    addSaltToLeft: function () {
        this.sodAni.stop("sodiumAni");
        cc.find('Canvas/container/c2/left').active = false;
        cc.find('Canvas/container/c2/right').active = false;
        cc.find('Canvas/container/c2/sodium').active = false;

        cc.find('Canvas/container/c2/left1').active = true;
        cc.find('Canvas/container/c2/right1').active = true;
        cc.find('Canvas/container/c2/sodium1').active = true;

        var sod1State = this.sod1Ani.play('sodium1Ani');
        sod1State.wrapMode = cc.WrapMode.Loop;
        sod1State.repeatCount = Infinity;

        this.left1Ani.play('left1Ani');
        this.right1Ani.play('right1Ani');
    },

    changeHint: function(){
        var player = cc.find('player').getComponent('Player');
        var used = player.osmoMaterialUsed;

        var situation = '';

        if (used.size == 0){
            situation = 'zero';
        } else if (used.size == 1 && used.has(2)){
            situation = 'utube';
        } else if (used.size == 2 && used.has(2) && used.has(6)){
            situation = 'utubemembrane';
        }

        console.log(this.hints.json["osmo"][situation][G.finalStyle]);
        this.hintLabel.node.color = new cc.color(83, 111, 122, 255);
        this.hintLabel.string = this.hints.json["osmo"][situation][G.finalStyle];
    },

    readyToBuyMaterial: function (event, customEventData) {
        var materialInfo = customEventData.split("_", 4);
        var materialCost = Number(materialInfo[0]);
        var materialName = materialInfo[1];
        var materialCode = Number(materialInfo[2]);
        var materialClass = materialInfo[3];

        var player = cc.find('player').getComponent('Player');
        if (player.osmoMaterialOwned.has(materialCode)) {
            if (player.osmoMaterialUsed.has(materialCode)) {
                console.log("is used");
                var displayInfo = "你要收回" + materialInfo[1]  + "吗？";
                var self = this;
                Alert.show(1, "收回", displayInfo, function(){
                    self.afterBacking(materialCode, materialClass);
                    insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "osmosis", "takeback", materialInfo[1], "na", 0, G.user.coins, G.itemsState);
                });
            }
            else {
                if (player.osmoMaterialUsedClass.has(materialClass)) {
                    console.log("owned, can not used");
                    var displayInfo = "你已使用同类物品，请收回后再使用该物品。";
                    Alert.show(1, "提示", displayInfo, function(){
                        insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "osmosis", "refuseusing", materialInfo[1], "na", 0, G.user.coins, G.itemsState);
                    }, false);
                }
                else {
                    console.log("owned, can use, but not used");
                    var displayInfo = "你要花费10金币使用" + materialInfo[1]  + "吗？";
                    var self = this;
                    Alert.show(1, "使用", displayInfo, function(){
                        if(self.checkCoinEnough(10)){
                            self.afterUsing(materialCode, materialInfo[1], materialClass);
                        }else{
                            self.hintLabel.node.color = new cc.color(230, 0, 0, 255);
                            self.hintLabel.string = "金币已不足，无法使用材料，点击右上角参与答题赢取金币吧";
                        }  
                    });
                }
            }
        }
        else {
            console.log("Not owned.");
            var displayInfo = "你要花费" + materialInfo[0] + "金币购买" + materialInfo[1] + "吗？";
            var self = this;
            Alert.show(1, "购买", displayInfo, function(){
                if(self.checkCoinEnough(50)){
                    self.afterBuying(materialCost, materialCode);
                    insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "osmosis", "buy", materialInfo[1], "penalty", materialCost, G.user.coins, G.itemsState);
                }else{
                    if(G.user.coins >0){
                        G.isQuizOpen = true;
                        self.pressQuizAnimation();
                    }
                    self.hintLabel.node.color = new cc.color(230, 0, 0, 255);
                    self.hintLabel.string = "金币已不足，无法购买材料，点击右上角参与答题赢取金币吧";
                } 
            });
        }
    },

    readyToDiffuse: function () {
        var animationComponent = this.diffusion.getComponent(cc.Animation);
        animationComponent.play("diffusionAni");
    },

    afterBuying: function(cost, code) {
        console.log("购买确定按钮被点击!");
        this.coinAnimation(-1);
        var player = cc.find('player').getComponent('Player');
        player.updateCoins(cost*(-1));
        //player.osmoMaterialOwned.add(code);
        player.updateInventory('osmo', 'buy', code);

        this.setMaterialOwned(code);
    },

    afterUsing: function(code, material, mClass) {
        var player = cc.find('player').getComponent('Player');

        if (mClass == 'a') {
            this.coinAnimation(-1);
            player.updateCoins(-10);
            if (code == 2) {
                this.setMaterialUsed(code);
                //player.osmoMaterialUsed.add(code);
                //player.osmoMaterialUsedClass.add(mClass);
                player.updateInventory('osmo', 'use', code, mClass);
                var nodePath = 'Canvas/container/c' + code.toString();
                var containerNode = cc.find(nodePath);
                containerNode.active = true;
                this.hintLabel.node.color = new cc.color(4, 84, 114, 255);
                this.hintLabel.string = "请继续挑选使用合适的材料";
                this.progressBar.progress += 0.33;
                insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "osmosis", "use", material, "penalty", 10, G.user.coins, G.itemsState); 
            }
            else {
                this.hintLabel.node.color = new cc.color(255, 50, 50, 255);
                this.hintLabel.string = "此仪器不符合要求，试试其他的吧";
                insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "osmosis", "wronguse", material, "penalty", 10, G.user.coins, G.itemsState); 
            }
        }

        if (mClass == 'b') {
            if(player.osmoMaterialUsed.has(2)) {
                this.coinAnimation(-1);
                player.updateCoins(-10);
                if (code == 6) {
                    //player.osmoMaterialUsed.add(code);
                    //player.osmoMaterialUsedClass.add(mClass);
                    player.updateInventory('osmo', 'use', code, mClass);
                    insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "osmosis", "use", material, "penalty", 10, G.user.coins, G.itemsState); 
                    this.setMaterialUsed(code);
                    var nodePath = 'Canvas/container/c2/membrane';
                    cc.find(nodePath).active = true;
                    this.hintLabel.node.color = new cc.color(4, 84, 114, 255);
                    this.hintLabel.string = "请继续挑选使用合适的溶质";
                    this.progressBar.progress += 0.33;
                }
                else {
                    insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "osmosis", "wronguse", material, "penalty", 10, G.user.coins, G.itemsState); 
                    this.hintLabel.node.color = new cc.color(255, 50, 50, 255);
                    this.hintLabel.string = "此材料不符合要求，试试其他的吧";
                }
            }
            else {
                insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "osmosis", "wronguse", material, "penalty", 10, G.user.coins, G.itemsState); 
                this.hintLabel.node.color = new cc.color(255, 50, 50, 255);
                this.hintLabel.string = "请先挑选使用合适的实验容器";
            }
        }

        if (mClass == 'c') {
            if (player.osmoMaterialUsed.has(6)) {
                if (code == 7) {
                    G.isOsmoDone = true;
                    this.coinAnimation(-1);
                    player.updateCoins(-10);
                    this.setMaterialUsed(code);
                    //player.osmoMaterialUsed.add(code);
                    //player.osmoMaterialUsedClass.add(mClass);
                    player.updateInventory('osmo', 'use', code, mClass);
                    insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "osmosis", "use", material, "penalty", 10, G.user.coins, G.itemsState); 

                    this.leftAni.on('finished', function() {
                        this.progressBar.progress = 1.0;
                        var self = this;
                        if(G.isOsmoRewarded){
                            Alert.show(1, "实验完成", "做得好,你已经完成渗透实验,本次无奖励！", function(){
                                //player.osmoMaterialOwned.clear();
                                //player.osmoMaterialUsed.clear(); 
                                //player.osmoMaterialUsedClass.clear();
                                player.updateInventory('osmo', 'clear', 0);
                                self.hintLabel.string = "实验已完成";
                            }, false);
                        }else{
                            player.updateCoins(400);
                            G.isOsmoRewarded = true;
                            insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "osmosis", "finish", "na", "reward", 400, G.user.coins, G.itemsState);
                            Alert.show(1, "实验完成", "做得好,你已经完成渗透实验,请点击确定获取你的奖励400金币吧！", function(){
                                self.coinAnimation(1);
                                //player.osmoMaterialOwned.clear();
                                //player.osmoMaterialUsed.clear(); 
                                //player.osmoMaterialUsedClass.clear();
                                player.updateInventory('osmo', 'clear', 0);
                                self.hintLabel.string = "实验已完成";
                            }, false);
                        }
                    }, this);

                    

                    var sodiAniState = this.sodAni.play("sodiumAni");
                    sodiAniState.wrapMode = cc.WrapMode.Loop;
                    sodiAniState.repeatCount = Infinity;

                    this.leftAni.play("leftAni");
                    this.rightAni.play("rightAni");
                }
                else {
                    this.coinAnimation(-1);
                    player.updateCoins(-10);
                    this.hintLabel.node.color = new cc.color(255, 50, 50, 255);
                    this.hintLabel.string = "此材料不符合要求，试试其他的吧";
                    insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "osmosis", "wronguse", material, "penalty", 10, G.user.coins, G.itemsState); 
                }
            }
            else {
                insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "osmosis", "wronguse", material, "penalty", 10, G.user.coins, G.itemsState); 
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
        //player.osmoMaterialUsed.delete(code);
        //player.osmoMaterialUsedClass.delete(mClass);
        player.updateInventory('osmo', 'takeback', code, mClass);

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
        for (var i of player.osmoMaterialOwned) {
            this.setMaterialOwned(i);
        }

        for (var i of player.osmoMaterialUsed) {
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
        isOwnedNode.getComponent(cc.Sprite).setMaterial(1);
    },

    checkCoinEnough: function(cost) {
        var tempCoins = G.user.coins - cost;
        if (tempCoins >= 0){
            return true;
        }else{
            insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "osmosis", "bankrupt", "na", "na", 0, G.user.coins, G.itemsState);
            return false;
        }
    },

    coinAnimation: function (type) {
        cc.find("Canvas/coin").active = false;
        if(type == 1){
            cc.find("Canvas/coinRotate").active = true;
            var coinRotComponent = this.coinRotate.getComponent(cc.Animation);
            coinRotComponent.on('finished', function(){
                cc.find("Canvas/coinRotate").active = false;
                cc.find("Canvas/coin").active = true;
                this.coinLabel.string = G.user.coins.toString();

                this.isShowCongra = true;
                //cc.find("Canvas/singleColor").active = true;
                //cc.find("Canvas/congraluation").active = true;
            }, this);
            coinRotComponent.play("coinRotAni");
        }else if(type == -1){
            cc.find("Canvas/coinShine").active = true;
            var coinShnComponent = this.coinShine.getComponent(cc.Animation);
            coinShnComponent.on('finished', function(){
                cc.find("Canvas/coinShine").active = false;
                cc.find("Canvas/coin").active = true;
                this.coinLabel.string = G.user.coins.toString();
                if(G.user.coins <= 0 && G.isOsmoDone == false){
                    //this.hintLabel.node.color = new cc.color(230, 0, 0, 255);
                    //this.hintLabel.string = "金币已不足，无法继续试验，点击右上角参与答题赢取金币吧";
                }
                this.pressQuizAnimation();
            }, this);
            coinShnComponent.play("coinShineAni");
        }else if(type == 0){
            cc.find("Canvas/coinBlink").active = true;
            var coinBlkComponent = this.coinBlink.getComponent(cc.Animation);
            coinBlkComponent.on('finished', function(){
                cc.find("Canvas/coinBlink").active = false;
                cc.find("Canvas/coin").active = true;
            }, this);
            coinBlkComponent.play("coinBlkAni");
        }
    },

    pressQuizAnimation: function(){
        if(G.isQuizOpen){
            cc.find("Canvas/quizButton").active = true;
            cc.find('Canvas/quizButton').getComponent(cc.Button).interactable = true;
            cc.find("Canvas/pressAni").active = true;
            var pressQuizComponent = this.pressAni.getComponent(cc.Animation);
            pressQuizComponent.on('finished', function(){
                cc.find("Canvas/pressAni").active = false;
                var quizSeq = cc.repeatForever(cc.sequence(cc.scaleTo(1.4, 0.68), cc.scaleTo(1.4, 0.72)));
                cc.find('Canvas/quizButton').runAction(quizSeq);
            }, this);
            pressQuizComponent.play("pressAni");
        }else{
            cc.find("Canvas/quizButton").active = false;
            cc.find('Canvas/quizButton').getComponent(cc.Button).interactable = false;
        }
    },

    backToMapScene: function () {
        this.resetScene();
        insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "osmosis", "back", "na", "na", 0, G.user.coins, G.itemsState);
        cc.director.loadScene("LevelMap");
    },
    
    resetScene: function () {
        G.globalSocket.removeAllListeners("osmosis");
        G.globalSocket.removeAllListeners("command");
        var player = cc.find('player').getComponent('Player');
        //player.osmoMaterialUsed.clear(); 
        //player.osmoMaterialUsedClass.clear();
        player.updateInventory('osmo', 'clear', 0);
        insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "osmosis", "reset", "na", "na", 0, G.user.coins, G.itemsState);
    },

    goToQuizScene: function() {
        this.resetScene();
        cc.director.loadScene("DoQuiz");
    },

    //start () {},

    update: function () {
        if (this.showCount >= 150){
            this.isShowCongra = false;
            this.showCount = 0;
            cc.find("Canvas/singleColor").active = false;
            cc.find("Canvas/congraluation").active = false;
        }else if (this.showCount < 150 && this.isShowCongra == true) {
            this.showCount++;
        }
    },
});
