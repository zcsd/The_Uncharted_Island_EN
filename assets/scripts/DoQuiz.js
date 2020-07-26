cc.Class({
    extends: cc.Component,

    properties: {
        nameLabel: {
            default: null,
            type: cc.Label
        },

        coinLabel: cc.Label,

        avatarSprite: {
            default: null,
            type: cc.Sprite
        },

        hintLabel: cc.Label,
        userAnswerChoice: 0, // user choice
        questionLabel: cc.Label,
        option1Label: cc.Label,
        option2Label: cc.Label,
        option3Label: cc.Label,
        option4Label: cc.Label,
        currentOrder: 1,
        answerToggleContainer: cc.ToggleContainer,
        mcqData: cc.JsonAsset,
        currentAnswerChoice: 1, // correct choice

        coinRotate: cc.Node,
        coinShine: cc.Node,
        coinBlink: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        var player = cc.find('player').getComponent('Player');
        this.nameLabel.string = player.nickName;
        this.coinLabel.string = player.coinsOwned.toString();

        //socket, username, sequenceID, stage, actionType, operatedItem, rewardType, rewardQty, totalCoins
        insertNewAction(G.globalSocket, G.user.username, G.sequenceCnt, "quiz", "init", "na", "na", 0, G.user.coins);

        this.hintLabel.string = '';

        var self = this;
        // load image from resource folder
        cc.loader.loadRes(player.avatarImgDir + '_s', cc.SpriteFrame, function (err, spriteFrame) {
            self.avatarSprite.spriteFrame = spriteFrame;
        });
        // load mcq data from json
        cc.loader.loadRes('mcq', function (err, data) {
            if (err) {
                console.log(err);
            }
            else {
                self.mcqData = data;
                self.loadMCQ(self.currentOrder);
            }
        });

        var introduction = "Welcome to quiz to win coins! Please start your quiz now, you will get coins reward for answering correctly.";
        Alert.show(1.2, "Quiz to Win Coins", introduction, function(){
            self.coinAnimation(0);
        }, false);
    },

    //start () {},

    loadMCQ: function (order) {
        this.questionLabel.string = this.mcqData.json[order].question;
        this.option1Label.string = this.mcqData.json[order].option1;
        this.option2Label.string = this.mcqData.json[order].option2;
        this.option3Label.string = this.mcqData.json[order].option3;
        this.option4Label.string = this.mcqData.json[order].option4;

        cc.find('Canvas/answerToggleContainer/toggle1').getComponent(cc.Toggle).isChecked = false;
        cc.find('Canvas/answerToggleContainer/toggle2').getComponent(cc.Toggle).isChecked = false;
        cc.find('Canvas/answerToggleContainer/toggle3').getComponent(cc.Toggle).isChecked = false;
        cc.find('Canvas/answerToggleContainer/toggle4').getComponent(cc.Toggle).isChecked = false;

        this.userAnswerChoice = 0;
    },

    submitAnswer: function () {
        var player = cc.find('player').getComponent('Player');
        
        if (this.userAnswerChoice == this.mcqData.json[this.currentOrder].answerOrder) {
            //console.log("答对了");
            this.hintLabel.string = this.mcqData.json[this.currentOrder].correctHint;
            this.coinAnimation(1);
            player.updateCoins(50);
            //this.coinLabel.string = player.coinsOwned.toString();
            cc.find("Canvas/submitButton").getComponent(cc.Button).interactable = false;
        }
        else if (this.userAnswerChoice == 0) {
            Alert.show(1, "Hint", "Please choose an option.", null, false);
        } else {
            //console.log("答错了");
            this.hintLabel.string = this.mcqData.json[this.currentOrder].wrongHint;
            cc.find("Canvas/submitButton").getComponent(cc.Button).interactable = false;
        }
    },

    goToNextQuestion: function () {
        this.hintLabel.string = '';
        this.currentOrder += 1;
        this.loadMCQ(this.currentOrder);
        cc.find("Canvas/submitButton").getComponent(cc.Button).interactable = true;
    },

    changeAnswer: function (event, customEventData) {
        this.userAnswerChoice = event.node._name.replace('toggle', '');
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

    backToMapScene: function () {
        cc.director.loadScene("LevelMap");
    },

    // update (dt) {},
});
