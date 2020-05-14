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

        this.floatingAction();
        this.hintLabel.string = "你现在要帮忙把有机物从叶子运输到其他部位，请点击选择它要经过的通道：导管或筛管。";
        //this.guide();
    },

    selectDaoguan: function(){
        console.log("导管");
        var player = cc.find('player').getComponent('Player');
        cc.find("Canvas/allParts/daoguanButton").stopAllActions();
        var self = this;
        Alert.show(1, "导管", "你要带着有机物在导管里运输吗？", function(){
            self.hintLabel.string = '选择错误，有机物不是在导管里运输的，请重新选择。';
            self.coinAnimation(-1);
            player.updateCoins(-50);
        });
    },

    selectShaiguan: function(){
        console.log("筛管");
        cc.find("Canvas/allParts/shaiguanButton").stopAllActions();
        var player = cc.find('player').getComponent('Player');
        var self = this;
        Alert.show(1, "筛管", "你要带着有机物在筛管里运输吗？", function(){
            self.hintLabel.string = '选择正确。现在点击开始答题按钮完成任务以进入筛管。';
            cc.find("Canvas/goToQuizButton").active = true;
            cc.find("Canvas/walkingButton").active = false;
            self.coinAnimation(1);
            player.updateCoins(50);
        }); 
    },

    goToQuiz: function(){
        cc.find("Canvas/goToQuizButton").active = false;
        cc.find("Canvas/questionAlert").active = true;
        cc.find("Canvas/questionAlert/contentBg/submitButton").getComponent(cc.Button).interactable = true;
        
        if(this.qorder == 0){
            this.questionLabel.string = "问题：关于植物的筛管，下列说法错误的是？";
            this.qanswer1Label.string = "有机物在筛管里运输需要消耗能量";
            this.qanswer2Label.string = "有机物在筛管里的运输不属于主动运输";
            this.qanswer3Label.string = "组成筛管的细胞是活细胞";
            cc.find('Canvas/questionAlert/contentBg/answerToggleContainer/toggle1').getComponent(cc.Toggle).isChecked = false;
            cc.find('Canvas/questionAlert/contentBg/answerToggleContainer/toggle2').getComponent(cc.Toggle).isChecked = false;
            cc.find('Canvas/questionAlert/contentBg/answerToggleContainer/toggle3').getComponent(cc.Toggle).isChecked = false;
            this.qhintLabel.string = "";
            this.qanswer = 2;
            this.userAnswerChoice = 0;
        }else if(this.qorder == 1){
            this.questionLabel.string = "问题：呼吸作用中有机物分解所释放的能量的最终源头是";
            this.qanswer1Label.string = "有机物中的化学能";
            this.qanswer2Label.string = "植物细胞来自光能，动物细胞来自食物";
            this.qanswer3Label.string = "叶绿体中的色素吸收的光能";
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
                    self.hintLabel.string = "现在点击进入筛管按钮开始最后的旅程吧!";
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

    startWalking: function() {
        cc.find("Canvas/walkingButton").active = false;
        this.hintLabel.string = "有机物正在筛管内运输，会分发到各个部位，香蕉树即将重现生机。";

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
