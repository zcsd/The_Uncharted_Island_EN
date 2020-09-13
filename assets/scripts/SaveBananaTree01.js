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
        guideMask: cc.Node,
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
        this.guideStep = 1;
        this.guideMask.on('touchstart', this.onTouchStart, this);
        this.showGuide();

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

        KT.lastScene = 'SaveBananaTree01';
    },

    selectFreeDiff: function(){
        console.log("自由扩散");
        Alert.show(1.3, "Free Diffusion", "Free diffusion is a process in which the substance moves through a semipermeable membrane or in a solution without any help from transport proteins, and no energy required too.", null, false);

        cc.find("Canvas/freeDiffHole/Background").stopAllActions();
        KT.check['check1'] = true;
        KT.check['check2'] = true;
        KT.toStart['start1'] = false;
        KT.toStart['start2'] = false;

        if ((this.binRead & 0b001) == 0b000) {
            this.binRead = this.binRead | 0b001;
        }
        console.log(this.binRead);
        if((this.binRead & 0b111) == 0b111) {
            this.setMolecueStatus(true);
            this.showHint(0, "Please click all water molecules and minerals to collect all of them, plants need them for growth.");
            //this.hintLabel.string = "Please click all water molecules and minerals to collect all of them, plants need them for growth.";
        }
    },

    selectFaciDiff: function(){
        console.log("协助扩散");
        Alert.show(1.3, "Facilitated Diffusion", "Facilitated diffusion is a passive movement of molecules across the semipermeable membrane from the region of higher concentration to the region of lower concentration by means of a carrier molecule.", null, false);
        
        cc.find("Canvas/faciDiffHole/Background").stopAllActions();
        KT.check['check7'] = true;
        KT.check['check8'] = true;
        KT.toStart['start7'] = false;
        KT.toStart['start8'] = false;

        if ((this.binRead & 0b010) == 0b000) {
            this.binRead = this.binRead | 0b010;
        }
        console.log(this.binRead);
        if((this.binRead & 0b111) == 0b111) {
            this.setMolecueStatus(true);
            this.showHint(0, "Please click all water molecules and minerals to collect all of them, plants need them for growth.");
            //this.hintLabel.string = "Please click all water molecules and minerals to collect all of them, plants need them for growth.";
        }
    },

    selectActTran: function(){
        console.log("主动运输");
        Alert.show(1.3, "Active Transport", "Active Transport is defined as a process that involves the movement of molecules from a region of lower concentration to a region of higher concentration against a gradient or an obstacle with the use of external energy.", null, false);
        
        cc.find("Canvas/actTranHole/Background").stopAllActions();
        KT.check['check9'] = true;
        KT.check['check10'] = true;
        KT.toStart['start9'] = false;
        KT.toStart['start10'] = false;
        
        if ((this.binRead & 0b100) == 0b000) {
            this.binRead = this.binRead | 0b100;
        }
        console.log(this.binRead);
        if((this.binRead & 0b111) == 0b111) {
            this.setMolecueStatus(true);
            this.showHint(0, "Please click all water molecules and minerals to collect all of them, plants need them for growth.");
            //this.hintLabel.string = "Please click all water molecules and minerals to collect all of them, plants need them for growth.";
        }
    },

    showHint: function(method, content) {
        //method: how to show hint content
        //        0 - default
        //        1 - popup window
        //        2 - speech T2S
        if(method == 0){
            cc.find("Canvas/hintLabel").active = true;
            this.hintLabel.string = content;
            var blink = cc.blink(2, 2);
            this.hintLabel.node.runAction(blink);   
        }else if (method == 1){
            cc.find("Canvas/hintLabel").active = false;
        }else if(method == 2){
            console.log('22');
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
                this.questionLabel.string = "Question：Minerals are mainly absorbed by roots of plants with the help of ( )";
                this.qanswer1Label.string = "Free Diffusion";
                this.qanswer2Label.string = "Facilitated Diffusion";
                this.qanswer3Label.string = "Active Transport";
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
                this.questionLabel.string = "Question：Water is mainly absorbed by roots of plants with the help of ( )";
                this.qanswer1Label.string = "Free Diffusion";
                this.qanswer2Label.string = "Facilitated Diffusion";
                this.qanswer3Label.string = "Active Transport";
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
            this.showHint(0, "Collection done, now you can take minerals and water to go into the root hair.");
            //this.hintLabel.string = "Collection done, now you can take minerals and water to go into the root hair.";
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
            this.qhintLabel.string = "Congratulations, it's correct.";
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
            this.qhintLabel.string = "Please choose one answer.";
            cc.find("Canvas/questionAlert/contentBg/submitButton").getComponent(cc.Button).interactable = true;
        } else {
            this.coinAnimation(-1);
            player.updateCoins(-50);
            this.qhintLabel.string = "Wrong choice, please choose again.";
            cc.find("Canvas/questionAlert/contentBg/submitButton").getComponent(cc.Button).interactable = true;
            if (this.currentQStage == 'h2o'){
                KT.check['check1'] = false;
                KT.attention['attention1'] = true;
            }else if (this.currentQStage == 'minsalt'){
                KT.check['check7'] = false;
                KT.attention['attention7'] = true;
            }
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
        cc.find("Canvas/h2oOwned").runAction(seq1);
        cc.find("Canvas/minSaltOwned").runAction(seq2);
        cc.find("Canvas/collectBox").active = false;
    },

    goToRootInsideScene: function () {
        this.goIntoHole();
    },

    goToKtScene: function () {
        cc.director.loadScene("KnowledgeTree");
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

    showGuide: function(){
        if (this.guideStep == 1) {
            this.setHand(cc.find("Canvas/freeDiffHole").position);
        }
        else if (this.guideStep == 2) {
            this.setHand(cc.find("Canvas/faciDiffHole").position);
        }
        else if (this.guideStep == 3) {
            this.setHand(cc.find("Canvas/actTranHole").position);
        }else if (this.guideStep == 4) {
            this.setHand(cc.find("Canvas/h2o2btn").position);
        }
    },

    setHand (pos) {
        // 设置引导手
        //cc.find("Canvas/pointer").setPosition(cc.v2(pos.x, pos.y));
        cc.find("Canvas/finger").setPosition(cc.v2(pos.x+15, pos.y-80));
        
        let moveForward = cc.moveBy(0.8, cc.v2(0, 50));
        let moveBack = cc.moveBy(0.8, cc.v2(0, -50));
        let repeatAction = cc.repeatForever(cc.sequence(moveForward, moveBack));
        cc.find("Canvas/finger").stopAllActions();             // 记得停止之前的动作
        cc.find("Canvas/finger").runAction(repeatAction);

        cc.find("Canvas/pointer").setPosition(cc.v2(pos.x, pos.y));
        
        let scaleUp = cc.scaleTo(0.8, 1.3);
        let scaleDown = cc.scaleTo(0.8, 1);
        let repeatAction_scale = cc.repeatForever(cc.sequence(scaleUp, scaleDown));
        cc.find("Canvas/pointer").stopAllActions();             // 记得停止之前的动作
        cc.find("Canvas/pointer").runAction(repeatAction_scale);
    },

    onTouchStart: function(event) {
        if(this.guideStep) {
            // 获取触摸点，转为Canvas画布上的坐标
            let pos = this.guideMask.parent.convertToNodeSpaceAR(event.getLocation());
            
            // 获取相应按钮的大小范围
            let btn;
            if (this.guideStep == 1)
                btn = cc.find("Canvas/freeDiffHole");
            else if(this.guideStep == 2)
                btn = cc.find("Canvas/faciDiffHole");
            else if (this.guideStep == 3)
                btn = cc.find("Canvas/actTranHole");
            else if (this.guideStep == 4)
                btn = cc.find("Canvas/h2o2btn");

            let rect = btn.getBoundingBox();

            // 判断触摸点是否在按钮上
            if (rect.contains(pos)) {
                // 允许触摸事件传递给按钮(允许冒泡)
                this.guideMask._touchListener.setSwallowTouches(false);
                this.guideStep++;
                
                // 如果三个按钮都点击了，则将guideStep设置为0，并隐藏所有相关节点
                if (this.guideStep > 4) {
                    this.guideStep = 0;

                    cc.find("Canvas/pointer").active = false;
                    cc.find("Canvas/finger").active = false;
                }
                else{
                    this.showGuide();
                }     
            } 
            else {
                // 吞噬触摸，禁止触摸事件传递给按钮(禁止冒泡)
                this.guideMask._touchListener.setSwallowTouches(true);
            }
        }
    },

    onDestroy: function() {
        // 取消监听
        this.guideMask.off('touchstart', this.onTouchStart, this);
    },

    start () {

    },

    update: function (dt) {},
});
