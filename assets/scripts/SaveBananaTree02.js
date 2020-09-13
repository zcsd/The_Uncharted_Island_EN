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

        guideMask: cc.Node,
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

        KT.lastScene = 'SaveBananaTree02';

        this.floatingAction();
        this.showHint(0, "Please click the beating xylem vessel and phloem sieve tube, to know more about them.");
        //this.hintLabel.string = "Please click the beating xylem vessel and phloem sieve tube, to know more about them.";
        //this.guide();
    },

    selectDaoguan: function(){
        console.log("导管");
        Alert.show(1.3, "Xylem Vessel", "Xylem vessels are long hollow chains of tough long dead xylem cells, it's transport tissue in vascular plants. Xylem tissue is the water transporter cells of plants. It carries water and minerals around a plant.", null, false);
        
        cc.find("Canvas/allParts/daoguanButton/Background").stopAllActions();

        if ((this.binRead & 0b01) == 0b00) {
            this.binRead = this.binRead | 0b01;
        }
        console.log(this.binRead);
        if((this.binRead & 0b11) == 0b11) {
            //this.setMolecueStatus(true);
            this.showHint(0, "You have known xylem vessel and sieve tube, please click 'start quiz' buuton to continue game.");
            //this.hintLabel.string = "You have known xylem vessel and sieve tube, please click 'start quiz' buuton to continue game.";
            cc.find("Canvas/goToQuizButton").active = true;
            cc.find("Canvas/walkingButton").active = false;
        }
    },

    selectShaiguan: function(){
        console.log("筛管");
        Alert.show(1.3, "Sieve Tube", "Sieve tube, elongated living cells (sieve-tube elements) of the phloem, the nuclei of which have fragmented and disappeared and the transverse end walls of which are pierced by sievelike groups of pores (sieve plates).They are the conduits of food transport", null, false); 
        
        cc.find("Canvas/allParts/shaiguanButton/Background").stopAllActions();

        if ((this.binRead & 0b10) == 0b00) {
            this.binRead = this.binRead | 0b10;
        }
        console.log(this.binRead);
        if((this.binRead & 0b11) == 0b11) {
            //this.setMolecueStatus(true);
            this.showHint(0, "You have known xylem vessel and sieve tube, please click 'start quiz' buuton to continue game.");
            //this.hintLabel.string = "You have known xylem vessel and sieve tube, please click 'start quiz' buuton to continue game.";
            cc.find("Canvas/goToQuizButton").active = true;
            cc.find("Canvas/walkingButton").active = false;
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

    goToQuiz: function(){
        cc.find("Canvas/goToQuizButton").active = false;
        cc.find("Canvas/questionAlert").active = true;
        cc.find("Canvas/questionAlert/contentBg/submitButton").getComponent(cc.Button).interactable = true;
        
        if(this.qorder == 0){
            this.questionLabel.string = "Question：Which of following is wrong regarding the plant transportation?";
            this.qanswer1Label.string = "Water and minerals are transported upward in xylem vessel.";
            this.qanswer2Label.string = "Sugar is transported to parts of plants in sieve tube.";
            this.qanswer3Label.string = "Transportation in xylem vessel need consume energy.";
            cc.find('Canvas/questionAlert/contentBg/answerToggleContainer/toggle1').getComponent(cc.Toggle).isChecked = false;
            cc.find('Canvas/questionAlert/contentBg/answerToggleContainer/toggle2').getComponent(cc.Toggle).isChecked = false;
            cc.find('Canvas/questionAlert/contentBg/answerToggleContainer/toggle3').getComponent(cc.Toggle).isChecked = false;
            this.qhintLabel.string = "";
            this.qanswer = 3;
            this.userAnswerChoice = 0;
        }else if(this.qorder == 1){
            this.questionLabel.string = "Question：The force that xylem vessel use to transport water and minerals is from";
            this.qanswer1Label.string = "energy released by organic/sugar consumption";
            this.qanswer2Label.string = "transpiration";
            this.qanswer3Label.string = "photosynthesis";
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
            this.qhintLabel.string = "Congratulations, it's correct.";
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
                    self.showHint(0, "Please click 'go into verssel' button to continue the game.");
                    //self.hintLabel.string = "Please click 'go into verssel' button to continue the game.";
                }, 1200);
            }
        }
        else if (this.userAnswerChoice == 0) {
            this.qhintLabel.string = "Please choose one answer.";
            cc.find("Canvas/questionAlert/contentBg/submitButton").getComponent(cc.Button).interactable = true;
        } else {
            this.coinAnimation(-1);
            player.updateCoins(-50);
            this.qhintLabel.string = "Wrong choice, please choose again.";
            cc.find("Canvas/questionAlert/contentBg/submitButton").getComponent(cc.Button).interactable = true;
        }
    },

    startWalking: function(){
        cc.find("Canvas/walkingButton").active = false;
        this.showHint(0, "It's transporting in xylem verssel, will arrive leaf soon.");
        //this.hintLabel.string = "It's transporting in xylem verssel, will arrive leaf soon.";

        var finished = cc.callFunc(function(){
            cc.find("Canvas/background_daoguan").active = true;
            cc.find("Canvas/allParts").active = false;
            this.posDetailLabel.string = "inside of verssel";
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

    showGuide: function(){
        if (this.guideStep == 1) {
            this.setHand(cc.find("Canvas/allParts/daoguanButton").position);
        }
        else if (this.guideStep == 2) {
            this.setHand(cc.find("Canvas/allParts/shaiguanButton").position);
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
        
        let scaleUp = cc.scaleTo(0.8, 1.0);
        let scaleDown = cc.scaleTo(0.8, 0.65);
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
                btn = cc.find("Canvas/allParts/daoguanButton");
            else if(this.guideStep == 2)
                btn = cc.find("Canvas/allParts/shaiguanButton");

            let rect = btn.getBoundingBox();

            // 判断触摸点是否在按钮上
            if (rect.contains(pos)) {
                // 允许触摸事件传递给按钮(允许冒泡)
                this.guideMask._touchListener.setSwallowTouches(false);
                this.guideStep++;
                
                // 如果三个按钮都点击了，则将guideStep设置为0，并隐藏所有相关节点
                if (this.guideStep > 2) {
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
