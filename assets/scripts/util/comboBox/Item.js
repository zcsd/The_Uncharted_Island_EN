cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:
    // onLoad () {},

    initComboBox (cb) {
        this.cb = cb;
    },

    itemBtn (event) {
        // 子项点击后改变下拉按钮上的文本
        this.cb.comboLabel.string = event.target.children[0].getComponent(cc.Label).string;
        // 选择后改变小三角和下拉框显示
        this.cb.comboboxClicked();
    },

    // update (dt) {},
});
