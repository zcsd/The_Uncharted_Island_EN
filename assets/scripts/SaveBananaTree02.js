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

        mask: cc.Node,
        manwalk: cc.Node,

        binRead: 0b00, //how many holes read

        questionLabel: cc.Label,
        qhintLabel: cc.Label,
        qanswer1Label: cc.Label,
        qanswer2Label: cc.Label,
        qanswer3Label: cc.Label,
        qanswer: 0,
        userAnswerChoice: 0, // user choice

        qorder: 0,
        qtotal: 2,

        posDetailLabel: cc.Label,
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

        KT.lastScene = 'SaveBananaTree02';

        this.floatingAction();
        this.hintLabel.string = "现在点击跳动的导管和筛管，了解一下它们吧！";
        //this.guide();
    },

    selectDaoguan: function(){
        console.log("导管");
        Alert.show(1.3, "导管", "导管位于木质部里面，是木质部的主要组成部分，属于植物的输导组织，是由长管状死细胞纵向连接而形成的。该细胞的细胞壁非常坚硬，上下相接处的细胞壁消失，形成中空管道即导管。", null, false);

        cc.find("Canvas/allParts/daoguanButton/Background").stopAllActions();

        if ((this.binRead & 0b01) == 0b00) {
            this.binRead = this.binRead | 0b01;
        }
        console.log(this.binRead);
        if((this.binRead & 0b11) == 0b11) {
            //this.setMolecueStatus(true);
            this.hintLabel.string = "现在对导管和筛管有所了解了。马上点击答题按钮然后继续任务吧！";
            cc.find("Canvas/goToQuizButton").active = true;
            cc.find("Canvas/walkingButton").active = false;
        }
    },

    selectShaiguan: function(){
        console.log("筛管");
        Alert.show(1.3, "筛管", "筛管位于韧皮部(环绕木质部)，属于植物的输导组织，是由长管状活细胞纵向连接而成。上下连接处的细胞壁上有许多小孔(筛孔), 筛管细胞间的细胞质可经筛孔相连通。", null, false); 

        cc.find("Canvas/allParts/shaiguanButton/Background").stopAllActions();

        if ((this.binRead & 0b10) == 0b00) {
            this.binRead = this.binRead | 0b10;
        }
        console.log(this.binRead);
        if((this.binRead & 0b11) == 0b11) {
            //this.setMolecueStatus(true);
            this.hintLabel.string = "现在对导管和筛管有所了解了。马上点击答题按钮然后继续任务吧！";
            cc.find("Canvas/goToQuizButton").active = true;
            cc.find("Canvas/walkingButton").active = false;
        }
    },

    goToQuiz: function(){
        cc.find("Canvas/goToQuizButton").active = false;
        cc.find("Canvas/questionAlert").active = true;
        cc.find("Canvas/questionAlert/contentBg/submitButton").getComponent(cc.Button).interactable = true;
        
        if(this.qorder == 0){
            this.questionLabel.string = "问题：关于植物的运输系统，下列说法错误的是？";
            this.qanswer1Label.string = "水和无机盐是在导管里自下而上运输的";
            this.qanswer2Label.string = "有机物是通过筛管运输到各个部位的";
            this.qanswer3Label.string = "导管需要消耗有机物产生能量来运输物质";
            cc.find('Canvas/questionAlert/contentBg/answerToggleContainer/toggle1').getComponent(cc.Toggle).isChecked = false;
            cc.find('Canvas/questionAlert/contentBg/answerToggleContainer/toggle2').getComponent(cc.Toggle).isChecked = false;
            cc.find('Canvas/questionAlert/contentBg/answerToggleContainer/toggle3').getComponent(cc.Toggle).isChecked = false;
            this.qhintLabel.string = "";
            this.qanswer = 3;
            this.userAnswerChoice = 0;
        }else if(this.qorder == 1){
            this.questionLabel.string = "问题：导管运输水和无机盐的动力主要来自于？";
            this.qanswer1Label.string = "消耗有机物产生的能量";
            this.qanswer2Label.string = "蒸腾作用";
            this.qanswer3Label.string = "光合作用";
            cc.find('Canvas/questionAlert/contentBg/answerToggleContainer/toggle1').getComponent(cc.Toggle).isChecked = false;
            cc.find('Canvas/questionAlert/contentBg/answerToggleContainer/toggle2').getComponent(cc.Toggle).isChecked = false;
            cc.find('Canvas/questionAlert/contentBg/answerToggleContainer/toggle3').getComponent(cc.Toggle).isChecked = false;
            this.qhintLabel.string = "";
            this.qanswer = 2;
            this.userAnswerChoice = 0;
        }
    },

    changeAnswer: function (event, customEventData) {
        this.userAnswerChoice = event.node._name.replace('toggle', '');
    },

    submitQAnswer: function(){
        var player = cc.find('player').getComponent('Player');
        
        if (this.userAnswerChoice == this.qanswer) {
            cc.find("Canvas/questionAlert/contentBg/submitButton").getComponent(cc.Button).interactable = false;
            this.qhintLabel.string = "恭喜你答对了";
            this.coinAnimation(1);
            player.updateCoins(50);
            self = this;
            this.qorder += 1;
            if(this.qorder < this.qtotal ){
                setTimeout(function(){
                    self.goToQuiz();
                }, 800);
            }else{
                setTimeout(function(){
                    cc.find("Canvas/questionAlert").active = false;
                    cc.find("Canvas/goToQuizButton").active = false;
                    cc.find("Canvas/walkingButton").active = true;
                    self.hintLabel.string = "现在点击进入导管按钮开始下一旅程吧!";
                }, 1200);
            }
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

    startWalking: function(){
        cc.find("Canvas/walkingButton").active = false;
        this.hintLabel.string = "正在导管内运输，即将到达叶子";

        var finished = cc.callFunc(function(){
            cc.find("Canvas/background_daoguan").active = true;
            cc.find("Canvas/allParts").active = false;
            this.posDetailLabel.string = "导管内";
            var t = 4.92;
    
            var moveSeq = cc.spawn(cc.scaleBy(t, 0.6, 0.6), cc.moveTo(t, cc.v2(350,150)));
            var moveSeq1 = cc.spawn(cc.scaleBy(t, 0.6, 0.6), cc.moveTo(t, cc.v2(340,155)));
            var moveSeq2 = cc.spawn(cc.scaleBy(t, 0.6, 0.6), cc.moveTo(t, cc.v2(355,145)));
            var moveSeq3 = cc.spawn(cc.scaleBy(t, 0.6, 0.6), cc.moveTo(t, cc.v2(320,130)));
            var moveSeq4 = cc.spawn(cc.scaleBy(t, 0.6, 0.6), cc.moveTo(t, cc.v2(360,120)));
            var moveSeq5 = cc.spawn(cc.scaleBy(t, 0.6, 0.6), cc.moveTo(t, cc.v2(350,140)));
            var moveSeq6 = cc.spawn(cc.scaleBy(t, 0.6, 0.6), cc.moveTo(t, cc.v2(330,170)));
    
            cc.find("Canvas/minsaltBtn").runAction(moveSeq);
            cc.find("Canvas/minsalt1Btn").runAction(moveSeq1);
            cc.find("Canvas/minsalt2btn").runAction(moveSeq2);
            cc.find("Canvas/minsalt3btn").runAction(moveSeq3);
            cc.find("Canvas/h2obtn").runAction(moveSeq4);
            cc.find("Canvas/h2o1btn").runAction(moveSeq5);
            cc.find("Canvas/h2o2btn").runAction(moveSeq6);
    
            var walkAni = this.manwalk.getComponent(cc.Animation);
            walkAni.on('finished', function(){
                cc.director.loadScene("SaveBananaTree03");
            }, this);
            walkAni.play("walkinroot");
        }, this);

        cc.find("Canvas/posMan").runAction(cc.moveTo(6.4, cc.v2(592, -130)));

        var seq0 = cc.sequence(cc.moveTo(1.5, cc.v2(-95,-31)), finished);

        cc.find("Canvas/minsaltBtn").runAction(seq0);
        cc.find("Canvas/minsalt1Btn").runAction(cc.moveTo(1.5, cc.v2(-95,-31)));
        cc.find("Canvas/minsalt2btn").runAction(cc.moveTo(1.5, cc.v2(-24,110)));
        cc.find("Canvas/minsalt3btn").runAction(cc.moveTo(1.5, cc.v2(96,0)));
        cc.find("Canvas/h2obtn").runAction(cc.moveTo(1.5, cc.v2(96,0)));
        cc.find("Canvas/h2o1btn").runAction(cc.moveTo(1.5, cc.v2(-24,110)));
        cc.find("Canvas/h2o2btn").runAction(cc.moveTo(1.5, cc.v2(-95,-31)));
    },

    guide: function(){
        var seq = cc.repeatForever(cc.sequence(cc.scaleTo(1, 0.9, 0.9), cc.scaleTo(1, 1.1, 1.1)));
        cc.find("Canvas/guide/pointer").runAction(seq);

    },

    floatingAction: function(){
        var seq = cc.repeatForever(cc.sequence(cc.scaleTo(0.8, 0.92, 0.92), cc.scaleTo(1, 1, 1)));
        var seq1 = cc.repeatForever(cc.sequence(cc.scaleTo(1.1, 0.92, 0.92), cc.scaleTo(1, 1, 1)));
        cc.find("Canvas/allParts/daoguanButton/Background").runAction(seq);
        cc.find("Canvas/allParts/shaiguanButton/Background").runAction(seq1);

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
