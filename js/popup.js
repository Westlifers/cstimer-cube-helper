// 初始化nice-select.js
$(document).ready(function() {
    $('#tps').niceSelect();
    $('#method').niceSelect();
    $('#tps').change(function() {
        var selection = $(this).val()
        restoreConfigTps(selection)
    })
    // 建立solve连接
    $("#solve").click(function (){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {solve: true}, function(response) {
                console.log(response);
            });
        });
    })
});
// 初始化折叠菜单
$(document).ready(function(){
    $('.collapsible').collapsible();
});

// 设置tps函数
function restoreConfigTps(tps){
    chrome.storage.local.set({'tps': tps}, function() {
        console.log(`配置已储存，TPS：${tps}`)
    });
}

