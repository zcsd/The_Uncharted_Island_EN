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

        userAnswerChoice: 1, // user choice

        questionLabel: cc.Label,

        option1Label: cc.Label,

        option2Label: cc.Label,

        option3Label: cc.Label,

        option4Label: cc.Label,

        currentOrder: 1,

        answerToggleContainer: cc.ToggleContainer,

        mcqData: cc.JsonAsset,

        currentAnswerChoice: 1, // correct choice
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        var player = cc.find('player').getComponent('Player');
        this.nameLabel.string = player.nickName;
        this.coinLabel.string = player.coinsOwned.toString();

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

    },

    start () {

    },

    loadMCQ: function (order) {
        this.questionLabel.string = this.mcqData.json[order].question;
        this.option1Label.string = this.mcqData.json[order].option1;
        this.option2Label.string = this.mcqData.json[order].option2;
        this.option3Label.string = this.mcqData.json[order].option3;
        this.option4Label.string = this.mcqData.json[order].option4;

        //cc.find('Canvas/answerToggleContainer/toggle4/checkmark').active = false;
        //cc.find('Canvas/answerToggleContainer/toggle1/checkmark').active = true;
    },

    submitAnswer: function () {
        var player = cc.find('player').getComponent('Player');
        
        if (this.userAnswerChoice == this.mcqData.json[this.currentOrder].answerOrder) {
            console.log("答对了");
            player.coinsOwned += 50;
            this.coinLabel.string = player.coinsOwned.toString();
        }
        else {
            console.log("答错了");
        }
        
        cc.find("Canvas/submitButton").getComponent(cc.Button).interactable = false;
    },

    goToNextQuestion: function () {
        this.currentOrder += 1;
        this.loadMCQ(this.currentOrder);
        cc.find("Canvas/submitButton").getComponent(cc.Button).interactable = true;
    },

    changeAnswer: function (event, customEventData) {
        this.userAnswerChoice = event.node._name.replace('toggle', '');
    },

    backToMapScene: function () {
        cc.director.loadScene("LevelMap");
    },

    // update (dt) {},
});
