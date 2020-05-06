cc.Class({
    extends: cc.Component,

    properties: {
        nameLabel: cc.Label,
        coinLabel: cc.Label,
        hintLabel: cc.Label,
        avatarSprite: cc.Sprite,

        coinRotate: cc.Node,
        coinShine: cc.Node,
        coinBlink: cc.Node,

        binRead: 0b000, //how many holes read
        numCollect: 0,

        mask: cc.Node,
        isMinsaltFirst: true,
        isH2OFirst: true,
        currentQStage: "",
        currentBtnNode: "",

        questionLabel: cc.Label,
        qhintLabel: cc.Label,
        qanswer1Label: cc.Label,
        qanswer2Label: cc.Label,
        qanswer3Label: cc.Label,
        qanswer: 0,
        userAnswerChoice: 0, // user choice

        manwalk: cc.Node,
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
        this.setMolecueStatus(false);

        this.floatingAction();
    },

    selectFreeDiff: function(){
        console.log("自由扩散");
        Alert.show(1.3, "自由扩散", "自由扩散是小分子物质从浓度高的一侧通过细胞膜向浓度低的一侧转运，不需要载体，不需要消耗能量，属于被动运输的一种，是最简单的运输方式之一。", null, false);

        cc.find("Canvas/freeDiffHole/Background").stopAllActions();

        if ((this.binRead & 0b001) == 0b000) {
            this.binRead = this.binRead | 0b001;
        }
        console.log(this.binRead);
        if((this.binRead & 0b111) == 0b111) {
            this.setMolecueStatus(true);
            this.hintLabel.string = "开始点击水分子和无机盐来收集它们吧，请收集全部，植物生长需要它们。";
        }
    },

    selectFaciDiff: function(){
        console.log("协助扩散");
        Alert.show(1.3, "协助扩散", "协助扩散也称促进扩散，是大分子物质从浓度高的一侧通过细胞膜上的特殊载体向浓度低的一侧转运，不需要消耗能量，属于被动运输的一种。", null, false);
        
        cc.find("Canvas/faciDiffHole/Background").stopAllActions();

        if ((this.binRead & 0b010) == 0b000) {
            this.binRead = this.binRead | 0b010;
        }
        console.log(this.binRead);
        if((this.binRead & 0b111) == 0b111) {
            this.setMolecueStatus(true);
            this.hintLabel.string = "开始点击水分子和无机盐来收集它们吧，请收集全部，植物生长需要它们。";
        }
    },

    selectActTran: function(){
        console.log("主动运输");
        Alert.show(1.3, "主动运输", "主动运输是物质从浓度低的一侧通过细胞膜上的特殊载体向浓度高的一侧转运, 需要消耗能量，常见的有钠离子钾离子进出细胞膜。", null, false);
        
        cc.find("Canvas/actTranHole/Background").stopAllActions();
        
        if ((this.binRead & 0b100) == 0b000) {
            this.binRead = this.binRead | 0b100;
        }
        console.log(this.binRead);
        if((this.binRead & 0b111) == 0b111) {
            this.setMolecueStatus(true);
            this.hintLabel.string = "开始点击水分子和无机盐来收集它们吧，植物生长需要它们。";
        }
    },

    collectMolecues: function(event, btnName) {
        //cc.find(btnName).active = false;
        //cc.find(btnName).getComponent(cc.Button).interactable = false;
        this.currentBtnNode = btnName;
        cc.find("Canvas/collectBox").active = true;
    
        if(this.currentBtnNode.includes("salt")){
            this.currentQStage = "minsalt";
            if (this.isMinsaltFirst){
                cc.find("Canvas/questionAlert").active = true;
                cc.find("Canvas/questionAlert/contentBg/submitButton").getComponent(cc.Button).interactable = true;
                this.questionLabel.string = "问题：无机盐主要是通过下列哪种方式被植物的根吸收？";
                this.qanswer1Label.string = "自由扩散";
                this.qanswer2Label.string = "协助扩散";
                this.qanswer3Label.string = "主动运输";
                cc.find('Canvas/questionAlert/contentBg/answerToggleContainer/toggle1').getComponent(cc.Toggle).isChecked = false;
                cc.find('Canvas/questionAlert/contentBg/answerToggleContainer/toggle2').getComponent(cc.Toggle).isChecked = false;
                cc.find('Canvas/questionAlert/contentBg/answerToggleContainer/toggle3').getComponent(cc.Toggle).isChecked = false;
                this.qhintLabel.string = "";
                this.qanswer = 2;
                this.userAnswerChoice = 0;
                this.isMinsaltFirst = false; 
            }else{
                this.goIntoBox();
            }
        }else if(this.currentBtnNode.includes("h2o")){
            this.currentQStage = "h2o";
            if (this.isH2OFirst){
                cc.find("Canvas/questionAlert").active = true;
                cc.find("Canvas/questionAlert/contentBg/submitButton").getComponent(cc.Button).interactable = true;
                this.questionLabel.string = "问题：水分子主要是通过下列哪种方式被植物的根吸收?";
                this.qanswer1Label.string = "自由扩散";
                this.qanswer2Label.string = "协助扩散";
                this.qanswer3Label.string = "主动运输";
                cc.find('Canvas/questionAlert/contentBg/answerToggleContainer/toggle1').getComponent(cc.Toggle).isChecked = false;
                cc.find('Canvas/questionAlert/contentBg/answerToggleContainer/toggle2').getComponent(cc.Toggle).isChecked = false;
                cc.find('Canvas/questionAlert/contentBg/answerToggleContainer/toggle3').getComponent(cc.Toggle).isChecked = false;
                this.qhintLabel.string = "";
                this.qanswer = 1;
                this.userAnswerChoice = 0;
                this.isH2OFirst = false;
            }else{
                this.goIntoBox();
            }
        }

        this.numCollect += 1;
        if(this.numCollect >= 7 ){
            this.hintLabel.string = "收集完成，现在带着水和无机盐准备进入根毛里面吧!";
            cc.find("Canvas/gotoinsiderootButton").interactable = true;
            cc.find("Canvas/gotoinsiderootButton").active = true;
        }
    },

    goIntoBox: function(){
        cc.find(this.currentBtnNode).getComponent(cc.Button).interactable = false;
        var self = this;
        
        if (this.currentBtnNode.includes('salt')){
            var finished0 = cc.callFunc(function(){
                cc.find(self.currentBtnNode).active = false;
                cc.find("Canvas/minSaltOwned").active = true;
                var seq0 = cc.sequence(cc.scaleBy(0.15, 1.2), cc.scaleBy(0.15, 0.833), cc.scaleBy(0.15, 1.11));
                cc.find("Canvas/minSaltOwned").runAction(seq0);
                self.currentBtnNode = "";
            }, this);
            var seq1 = cc.sequence(cc.moveTo(1.0, -108, -285), finished0);
            cc.find(this.currentBtnNode).runAction(seq1);
        }else if (this.currentBtnNode.includes('h2o')){
            var finished1 = cc.callFunc(function(){
                cc.find(self.currentBtnNode).active = false;
                cc.find("Canvas/h2oOwned").active = true;
                var seq2 = cc.sequence(cc.scaleBy(0.15, 1.2), cc.scaleBy(0.15, 0.833), cc.scaleBy(0.15, 1.11));
                cc.find("Canvas/h2oOwned").runAction(seq2);
                self.currentBtnNode = "";
            }, this);
            var seq3 = cc.sequence(cc.moveTo(1.0, -171, -286), finished1);
            cc.find(this.currentBtnNode).runAction(seq3);
        }
    },

    submitQAnswer: function(){
        var player = cc.find('player').getComponent('Player');
        
        if (this.userAnswerChoice == this.qanswer) {
            cc.find("Canvas/questionAlert/contentBg/submitButton").getComponent(cc.Button).interactable = false;
            this.qhintLabel.string = "恭喜你答对了";
            this.coinAnimation(1);
            player.updateCoins(50);
            self = this;
            setTimeout(function(){
                cc.find("Canvas/questionAlert").active = false;
                if(self.currentQStage == "minsalt"){
                    self.goIntoBox();
                }else if(self.currentQStage == "h2o"){
                    self.goIntoBox();
                }
            }, 1200);
        }
        else if (this.userAnswerChoice == 0) {
            this.qhintLabel.string = "请选择一个答案";
            cc.find("Canvas/questionAlert/contentBg/submitButton").getComponent(cc.Button).interactable = true;
        } else {
            this.coinAnimation(-1);
            player.updateCoins(-50);
            this.qhintLabel.string = "选择错误，重新选择一个答案吧！";
            cc.find("Canvas/questionAlert/contentBg/submitButton").getComponent(cc.Button).interactable = true;
        }
    },

    changeAnswer: function (event, customEventData) {
        this.userAnswerChoice = event.node._name.replace('toggle', '');
    },

    floatingAction: function(){
        var seq = cc.repeatForever(cc.sequence(cc.scaleTo(0.8, 0.92, 0.92), cc.scaleTo(1, 1, 1)));
        var seq1 = cc.repeatForever(cc.sequence(cc.scaleTo(1.1, 0.92, 0.92), cc.scaleTo(1, 1, 1)));
        var seq2 = cc.repeatForever(cc.sequence(cc.scaleTo(1.0, 0.92, 0.92), cc.scaleTo(0.9, 1, 1)));
        cc.find("Canvas/freeDiffHole/Background").runAction(seq);
        cc.find("Canvas/faciDiffHole/Background").runAction(seq1);
        cc.find("Canvas/actTranHole/Background").runAction(seq2);

        var moveSeq = cc.repeatForever(cc.sequence(cc.moveBy(2.3, cc.v2(-12,9)), cc.moveBy(1.8, cc.v2(12, -9))));
        var moveSeq1 = cc.repeatForever(cc.sequence(cc.moveBy(1.9, cc.v2(11, 8)), cc.moveBy(1.6, cc.v2(-11, -8))));
        var moveSeq2 = cc.repeatForever(cc.sequence(cc.moveBy(2.1, cc.v2(10,-11)), cc.moveBy(2.1, cc.v2(-10, 11))));
        var moveSeq3 = cc.repeatForever(cc.sequence(cc.moveBy(1.6, cc.v2(-9,12)), cc.moveBy(1.7, cc.v2(9, -12))));
        var moveSeq4 = cc.repeatForever(cc.sequence(cc.moveBy(2, cc.v2(-11,-10)), cc.moveBy(1.7, cc.v2(11, 10))));
        var moveSeq5 = cc.repeatForever(cc.sequence(cc.moveBy(2.2, cc.v2(12, 8)), cc.moveBy(2, cc.v2(-12, -8))));
        var moveSeq6 = cc.repeatForever(cc.sequence(cc.moveBy(1.7, cc.v2(-9, 12)), cc.moveBy(1.5, cc.v2(9, -12))));
        
        cc.find("Canvas/minsaltBtn").runAction(moveSeq);
        cc.find("Canvas/minsalt1Btn").runAction(moveSeq1);
        cc.find("Canvas/minsalt2btn").runAction(moveSeq2);
        cc.find("Canvas/minsalt3btn").runAction(moveSeq3);
        cc.find("Canvas/h2obtn").runAction(moveSeq4);
        cc.find("Canvas/h2o1btn").runAction(moveSeq5);
        cc.find("Canvas/h2o2btn").runAction(moveSeq6);
    },

    setMolecueStatus: function(status) {
        cc.find('Canvas/minsaltBtn').getComponent(cc.Button).interactable = status;
        cc.find('Canvas/minsalt1Btn').getComponent(cc.Button).interactable = status;
        cc.find('Canvas/minsalt2btn').getComponent(cc.Button).interactable = status;
        cc.find('Canvas/minsalt3btn').getComponent(cc.Button).interactable = status;
        cc.find('Canvas/h2obtn').getComponent(cc.Button).interactable = status;
        cc.find('Canvas/h2o1btn').getComponent(cc.Button).interactable = status;
        cc.find('Canvas/h2o2btn').getComponent(cc.Button).interactable = status;
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
            }, this);
            coinRotComponent.play("coinRotAni");
        }else if(type == -1){
            cc.find("Canvas/coinShine").active = true;
            var coinShnComponent = this.coinShine.getComponent(cc.Animation);
            coinShnComponent.on('finished', function(){
                cc.find("Canvas/coinShine").active = false;
                cc.find("Canvas/coin").active = true;
                this.coinLabel.string = G.user.coins.toString();
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

    goIntoHole: function(){
        //self = this;
        var finished = cc.callFunc(function(){
            cc.find("Canvas/minSaltOwned").active = false;
            cc.find("Canvas/h2oOwned").active = false;
            var walkAniComponent = this.manwalk.getComponent(cc.Animation);
            walkAniComponent.on('finished', function(){
                cc.director.loadScene("SaveBananaTree02");
            }, this);
            walkAniComponent.play("walktohole");
        }, this);;
        var seq1 = cc.sequence(cc.scaleBy(0.2, 1.8), cc.moveTo(2.2, -394, 33), finished);
        var seq2 = cc.sequence(cc.scaleBy(0.2, 1.8), cc.moveTo(2.2, -144, 88));
        cc.find("Canvas/minSaltOwned").runAction(seq1);
        cc.find("Canvas/h2oOwned").runAction(seq2);

    },

    goToRootInsideScene: function () {
        this.goIntoHole();
    },

    onEnable : function(){
        this.mask.on('touchstart',function(event){
            event.stopPropagation();
        });

        this.mask.on('touchend', function (event) {
            event.stopPropagation();
        });
    },
        
    onDisable : function(){

        this.mask.off('touchstart',function(event){
            event.stopPropagation();
        });
        this.mask.off('touchend', function (event) {
            event.stopPropagation();
        });
    },

    start () {

    },

    update: function (dt) {},
});
