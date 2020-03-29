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

        diffusion: cc.Node,
        freemove: cc.Node,

        coinRotate: cc.Node,
        coinShine: cc.Node,
        coinBlink: cc.Node,

        isShowCongra: false,
        showCount: 0,

        pressAni: cc.Node,
        freemoveAniComponent: cc.Animation,
        diffAniComponent: cc.Animation,
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
        insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "diffusion", "init", "na", "na", 0, G.user.coins, G.itemsState);
        
        if(G.isDiffDone){
            var introduction = "欢迎来到扩散实验室！恭喜你已经成功完成了扩散实验，再次完成实验将没有奖励。";
            Alert.show(1.4, "扩散实验", introduction, function(){
                self.coinAnimation(0);
                self.pressQuizAnimation();
                self.hintLabel.node.color = new cc.color(150,100,100,255);
                self.hintLabel.string = "本次完成实验将没有奖励";
            }, false);
        }else{
            var introduction = "欢迎来到扩散实验室！接下来请用U型管完成一个液体扩散实验，完成实验将有丰厚金币奖励。实验开始时，你会有200金币，购买、使用材料均需花费金币，考虑后再做选择哦。";
            Alert.show(1.4, "扩散实验", introduction, function(){
                self.coinAnimation(0);
                self.pressQuizAnimation();
                insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "diffusion", "read", "introduction", "na", 0, G.user.coins, G.itemsState);
            }, false);
            if(G.user.coins <= 0){
                this.hintLabel.node.color = new cc.color(230,0,0,255);
                this.hintLabel.string = "金币已不足，无法继续游戏，点击右上角参与答题赢取金币吧";
            }else{
                this.hintLabel.node.color = new cc.color(83,111,122,255);
                this.hintLabel.string = "请购买使用合适的仪器和溶质";
            }
        }

        this.freemoveAniComponent = this.freemove.getComponent(cc.Animation);
        this.diffAniComponent = this.diffusion.getComponent(cc.Animation);

        G.globalSocket.on('diffusion', function(msg){
            console.log('diffusion hint: ', msg);
            self.hintLabel.string = msg;
        });

        G.globalSocket.on('command', function(msg){
            console.log('command received: ', msg);
            
            if (msg == 'colder'){
                self.changeToCold();
            }else if (msg == 'hotter'){
                self.changeToHot();
            }
        });

        this.progressBar.progress = 0;
        this.checkMaterial();
        G.isDiffEnter = true;
    },

    changeToCold: function() {
        this.freemoveAniComponent.stop("freemoveAni");
        cc.find('Canvas/hightempature').active = false;
        cc.find('Canvas/lowtempature').active = true;
        var animState = this.freemoveAniComponent.play("freemoveAni");
        animState.speed = 0.15;
    },

    changeToHot: function() {
        this.freemoveAniComponent.stop("freemoveAni");
        cc.find('Canvas/hightempature').active = true;
        cc.find('Canvas/lowtempature').active = false;
        var animState = this.freemoveAniComponent.play("freemoveAni");
        animState.speed = 0.8;
    },

    readyToBuyMaterial: function (event, customEventData) {
        var materialInfo = customEventData.split("_", 4);
        var materialCost = Number(materialInfo[0]);
        var materialName = materialInfo[1];
        var materialCode = Number(materialInfo[2]);
        var materialClass = materialInfo[3];

        var player = cc.find('player').getComponent('Player');
        if (player.diffMaterialOwned.has(materialCode)) {
            if (player.diffMaterialUsed.has(materialCode)) {
                console.log("is used");
                var displayInfo = "你要收回" + materialInfo[1]  + "吗？";
                var self = this;
                Alert.show(1, "收回", displayInfo, function(){
                    self.afterBacking(materialCode, materialClass);
                    insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "diffusion", "takeback", materialInfo[1], "na", 0, G.user.coins, G.itemsState);
                });
            }
            else {
                if (player.diffMaterialUsedClass.has(materialClass)) {
                    console.log("owned, can not used");
                    var displayInfo = "你已使用同类物品，请收回后再使用该物品。";
                    //var self = this;
                    Alert.show(1, "提示", displayInfo, function(){
                        insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "diffusion", "refuseusing", materialInfo[1], "na", 0, G.user.coins, G.itemsState);
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
                    insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "diffusion", "buy", materialInfo[1], "penalty", materialCost, G.user.coins, G.itemsState);
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
        var animState = this.diffAniComponent.play("uDiffAni");
        animState.wrapMode = cc.WrapMode.Loop;
        animState.repeatCount = 2;
    },

    afterBuying: function(cost, code) {
        console.log("购买确定按钮被点击!");
        this.coinAnimation(-1);
        var player = cc.find('player').getComponent('Player');
        player.updateCoins(cost*(-1));
        //player.diffMaterialOwned.add(code);
        player.updateInventory('diff', 'buy', code);

        this.setMaterialOwned(code);
    },

    afterUsing: function(code, material, mClass) {
        var player = cc.find('player').getComponent('Player');

        if (mClass == 'a') {
            this.coinAnimation(-1);
            player.updateCoins(-10);
            if (code == 1) {
                this.setMaterialUsed(code);
                //player.diffMaterialUsed.add(code);
                //player.diffMaterialUsedClass.add(mClass);
                player.updateInventory('diff', 'use', code, mClass);
                var nodePath = 'Canvas/container/c' + code.toString();
                var containerNode = cc.find(nodePath);
                containerNode.active = true;
                this.hintLabel.node.color = new cc.color(4, 84, 114, 255);
                this.hintLabel.string = "请继续挑选使用合适的溶质";
                this.progressBar.progress += 0.5;
                insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "diffusion", "use", material, "penalty", 10, G.user.coins, G.itemsState); 
            }
            else {
                this.hintLabel.node.color = new cc.color(255, 50, 50, 255);
                this.hintLabel.string = "此仪器不符合要求，试试其他的吧";
                insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "diffusion", "wronguse", material, "penalty", 10, G.user.coins, G.itemsState); 
            }
        }

        if (mClass == 'c') {
            if (player.diffMaterialUsed.has(1)) {
                if (code == 4) {
                    G.isDiffDone = true;
                    this.coinAnimation(-1);
                    player.updateCoins(-10);
                    this.setMaterialUsed(code);
                    //player.diffMaterialUsed.add(code);
                    //player.diffMaterialUsedClass.add(mClass);
                    player.updateInventory('diff', 'use', code, mClass);
                    insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "diffusion", "use", material, "penalty", 10, G.user.coins, G.itemsState); 
    
                    this.diffAniComponent.on('finished', function() {
                        cc.find('Canvas/container/c1/diff').active = false;

                        var freemoveAnimState = this.freemoveAniComponent.play("freemoveAni");
                        freemoveAnimState.wrapMode = cc.WrapMode.Loop;
                        freemoveAnimState.repeatCount = Infinity;

                        this.progressBar.progress += 0.5;
                        var self = this;
                        if(G.isDiffRewarded){
                            Alert.show(1, "实验完成", "做得好,你已经完成扩散实验,本次无奖励！", function(){
                                //player.diffMaterialOwned.clear();
                                //player.diffMaterialUsed.clear(); 
                                //player.diffMaterialUsedClass.clear();
                                player.updateInventory('diff', 'clear', 0);
                                self.hintLabel.string = "实验已完成";
                            }, false);
                        }else{
                            player.updateCoins(300);
                            G.isDiffRewarded = true;
                            insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "diffusion", "finish", "na", "reward", 300, G.user.coins, G.itemsState);
                            Alert.show(1, "实验完成", "做得好,你已经完成扩散实验,请点击确定获取你的奖励300金币吧！", function(){
                                self.coinAnimation(1);
                                //player.diffMaterialOwned.clear();
                                //player.diffMaterialUsed.clear(); 
                                //player.diffMaterialUsedClass.clear();
                                player.updateInventory('diff', 'clear', 0);
                                self.hintLabel.string = "实验已完成";
                            }, false);
                        }
                    }, this);

                    var animState = this.diffAniComponent.play("uDiffAni");
                    //animState.wrapMode = cc.WrapMode.Loop;
                    //animState.repeatCount = Infinity;
                }
                else {
                    this.coinAnimation(-1);
                    player.updateCoins(-10);
                    this.hintLabel.node.color = new cc.color(255, 50, 50, 255);
                    this.hintLabel.string = "此材料不符合要求，试试其他的吧";
                    insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "diffusion", "wronguse", material, "penalty", 10, G.user.coins, G.itemsState); 
                }
            }
            else {
                insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "diffusion", "wronguse", material, "penalty", 10, G.user.coins, G.itemsState); 
                this.hintLabel.node.color = new cc.color(255, 50, 50, 255);
                this.hintLabel.string = "请先挑选使用合适的实验仪器";
            }           
        }

        if (mClass == 'b') {
            this.coinAnimation(-1);
            player.updateCoins(-10);
            this.hintLabel.node.color = new cc.color(255, 50, 50, 255);
            this.hintLabel.string = "该实验不需要此材料";
            insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "diffusion", "wronguse", material, "penalty", 10, G.user.coins, G.itemsState); 
        }
    },

    afterBacking: function(code, mClass) {
        var materialNodePath = 'Canvas/materialBackground/m' + code.toString() + 'Button';
        var isOwnedNode = cc.find((materialNodePath + '/isOwned'));
        isOwnedNode.getComponent(cc.Sprite).setState(0);

        var player = cc.find('player').getComponent('Player');
        //player.diffMaterialUsed.delete(code);
        //player.diffMaterialUsedClass.delete(mClass);
        player.updateInventory('diff', 'takeback', code, mClass);

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
        for (var i of player.diffMaterialOwned) {
            this.setMaterialOwned(i);
        }

        for (var i of player.diffMaterialUsed) {
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

    checkCoinEnough: function(cost) {
        var tempCoins = G.user.coins - cost;
        if (tempCoins >= 0){
            return true;
        }else{
            insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "diffusion", "bankrupt", "na", "na", 0, G.user.coins, G.itemsState);
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
                if(G.user.coins <= 0 && G.isDiffDone == false){
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
        insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "diffusion", "back", "na", "na", 0, G.user.coins, G.itemsState);
		 cc.director.loadScene("LevelMap");
	},

    resetScene: function () {
        G.globalSocket.removeAllListeners("diffusion");
        var player = cc.find('player').getComponent('Player');
        //player.diffMaterialUsed.clear(); 
        //player.diffMaterialUsedClass.clear();
        player.updateInventory('diff', 'clear', 0);
        insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "diffusion", "reset", "na", "na", 0, G.user.coins, G.itemsState);
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
            //cc.find("Canvas/singleColor").active = false;
            //cc.find("Canvas/congraluation").active = false;
        }else if (this.showCount < 150 && this.isShowCongra == true) {
            this.showCount++;
        }
    },
});
