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

        KT.lastScene = 'SaveBananaTree04';

        this.floatingAction();
        this.showHint(0, "Now you help to tranport organic from leaf to other parts, please click to choose correct channel: xylem verssel or sieve tube.");
        //this.hintLabel.string = "Now you help to tranport organic from leaf to other parts, please click to choose correct channel: xylem verssel or sieve tube.";
        //this.guide();
    },

    selectDaoguan: function(){
        console.log("导管");
        var player = cc.find('player').getComponent('Player');
        cc.find("Canvas/allParts/daoguanButton").stopAllActions();
        var self = this;
        Alert.show(1, "Xylem Verssel", "Would you like to carry organic to transport in verssel?", function(){
            self.showHint(0, 'Wrong choice, organic is not transported in xylem verssel, please choose again.');
            //self.hintLabel.string = 'Wrong choice, organic is not transported in xylem verssel, please choose again.';
            self.coinAnimation(-1);
            player.updateCoins(-50);
        });
    },

    selectShaiguan: function(){
        console.log("筛管");
        cc.find("Canvas/allParts/shaiguanButton").stopAllActions();
        var player = cc.find('player').getComponent('Player');
        var self = this;
        Alert.show(1, "Sieve Tube", "Would you like to carry organic to transport in sieve tube?", function(){
            self.showHint(0, "Correct. Now click 'Start quiz' button to continue, to go into sieve tube.");
            //self.hintLabel.string = "Correct. Now click 'Start quiz' button to continue, to go into sieve tube.";
            cc.find("Canvas/goToQuizButton").active = true;
            cc.find("Canvas/walkingButton").active = false;
            self.coinAnimation(1);
            player.updateCoins(50);
        }); 
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
            this.questionLabel.string = "Question: Which of the following is wrong regarding the sieve tube?";
            this.qanswer1Label.string = "Transportation of organic in sieve tube need consume energy.";
            this.qanswer3Label.string = "The cells of sieve tube are live.";
            cc.find('Canvas/questionAlert/contentBg/answerToggleContainer/toggle1').getComponent(cc.Toggle).isChecked = false;
            cc.find('Canvas/questionAlert/contentBg/answerToggleContainer/toggle2').getComponent(cc.Toggle).isChecked = false;
            cc.find('Canvas/questionAlert/contentBg/answerToggleContainer/toggle3').getComponent(cc.Toggle).isChecked = false;
            this.qhintLabel.string = "";
            this.qanswer = 2;
            this.userAnswerChoice = 0;
        }else if(this.qorder == 1){
            this.questionLabel.string = "Question：The energy that released in respiration process is originally from ( )";
            this.qanswer1Label.string = "Chemical energy in organic";
            this.qanswer2Label.string = "Water and carbon dioxide";
            this.qanswer3Label.string = "Light energy";
            cc.find('Canvas/questionAlert/contentBg/answerToggleContainer/toggle1').getComponent(cc.Toggle).isChecked = false;
            cc.find('Canvas/questionAlert/contentBg/answerToggleContainer/toggle2').getComponent(cc.Toggle).isChecked = false;
            cc.find('Canvas/questionAlert/contentBg/answerToggleContainer/toggle3').getComponent(cc.Toggle).isChecked = false;
            this.qhintLabel.string = "";
            this.qanswer = 3;
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
                    self.showHint(0, "Please click ‘Go into sieve tube’ button to final journey.");
                    //self.hintLabel.string = "Please click ‘Go into sieve tube’ button to final journey.";
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

    startWalking: function() {
        cc.find("Canvas/walkingButton").active = false;
        this.showHint(0, "Organic is transporting in sieve tube to all parts, banana tree will get vitality.");
        //this.hintLabel.string = "Organic is transporting in sieve tube to all parts, banana tree will get vitality.";

        var finished = cc.callFunc(function(){
            cc.find("Canvas/background_shaiguan").active = true;
            cc.find("Canvas/allParts").active = false;
            this.posDetailLabel.string = "筛管内";
           // var t = 4.92;
    
            var moveSeq = cc.sequence(cc.moveTo(2.4, 91, 182), cc.moveTo(2.5, -50, 395));
            var moveSeq1 = cc.sequence(cc.moveTo(2.4, 151, -35), cc.moveTo(2.5, 300, -400));
            //var moveSeq2 = cc.sequence(cc.moveTo(4.0, 660, 210));
    
            cc.find("Canvas/yangfen/yangfen1Button").runAction(moveSeq);
            cc.find("Canvas/yangfen/yangfen2Button").runAction(moveSeq1);
            cc.find("Canvas/yangfen/yangfenButton").runAction(cc.moveTo(4.9, 660, 210));
    
            var walkAni = this.manwalk.getComponent(cc.Animation);
            walkAni.on('finished', function(){
                cc.director.loadScene("SaveBananaTree05");
            }, this);
            walkAni.play("walkinroot");
        }, this);

        cc.find("Canvas/posMan").runAction(cc.moveTo(6.4, cc.v2(592, -310)));

        var seq0 = cc.sequence(cc.moveTo(1.5, cc.v2(-320,-15)), finished);

        cc.find("Canvas/yangfen/yangfen1Button").runAction(seq0);
        cc.find("Canvas/yangfen/yangfen2Button").runAction(cc.moveTo(1.5, cc.v2(-320,-15)));
        cc.find("Canvas/yangfen/yangfenButton").runAction(cc.moveTo(1.5, cc.v2(-20,-9)));
    },

    guide: function(){
        var seq = cc.repeatForever(cc.sequence(cc.scaleTo(1, 0.9, 0.9), cc.scaleTo(1, 1.1, 1.1)));
        cc.find("Canvas/guide/pointer").runAction(seq);

    },

    floatingAction: function(){
        var seq = cc.repeatForever(cc.sequence(cc.scaleTo(0.8, 0.92, 0.92), cc.scaleTo(1, 1, 1)));
        var seq1 = cc.repeatForever(cc.sequence(cc.scaleTo(1.1, 0.92, 0.92), cc.scaleTo(1, 1, 1)));
        cc.find("Canvas/allParts/daoguanButton").runAction(seq);
        cc.find("Canvas/allParts/shaiguanButton").runAction(seq1);

        var moveSeq = cc.repeatForever(cc.sequence(cc.moveBy(2.3, cc.v2(-12,9)), cc.moveBy(1.8, cc.v2(12, -9))));
        var moveSeq1 = cc.repeatForever(cc.sequence(cc.moveBy(1.9, cc.v2(11, 8)), cc.moveBy(1.6, cc.v2(-11, -8))));
        var moveSeq2 = cc.repeatForever(cc.sequence(cc.moveBy(2.1, cc.v2(10,-11)), cc.moveBy(2.1, cc.v2(-10, 11))));
   
        cc.find("Canvas/yangfen/yangfenButton").runAction(moveSeq);
        cc.find("Canvas/yangfen/yangfen1Button").runAction(moveSeq1);
        cc.find("Canvas/yangfen/yangfen2Button").runAction(moveSeq2);
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
