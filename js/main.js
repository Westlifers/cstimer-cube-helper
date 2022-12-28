Cube.initSolver()
let port = chrome.runtime.connect({ name: "message" }); // 与后台建立message连接
var scramble = ""
// 键位
const keys = {
    ["R"]: "I",
    ["R'"]: "K",
    ["U"]: "J",
    ["U'"]: "F",
    ["F"]: "H",
    ["F'"]: "G",
    ["L"]: "D",
    ["L'"]: "E",
    ["D"]: "S",
    ["D'"]: "L",
    ["B"]: "W",
    ["B'"]: "O",
}

// 更新打乱函数
function scrambleChange(){
    scramble = $("#scrambleTxt div").text()
}

// 双击解魔方
$(document).on("dblclick", autoSolve)

// 更新当前打乱并给出当前打乱的解法
function solveCurrentCube(){
    scrambleChange()
    const cube = new Cube()
    cube.move(scramble)
    return cube.solve()
}

function ipt(str, i, time) {    
    port.postMessage({ action: "input", text: str[i] });
    if (i < str.length - 1) {
        setTimeout(function () {
            ipt(str, ++i, time);
        }, time);                          // time为按键间隔时间
    }
}

// 自动复原虚拟魔方
function autoSolve(){
    solveSteps = solveCurrentCube()
    // 将X2替换为X X，方便操作
    solveSteps = solveSteps.replace(/(?<pat>.)2/g, '$<pat> $<pat>')
    // 复原操作转数组
    solveSteps = solveSteps.split(" ")
    // 复原操作转键位
    i = 0
    for (let step of solveSteps){
        solveSteps[i] = keys[step]
        i = i + 1
    }
    // 键位转回字符串
    solveSteps = solveSteps.join("")
    // 读取配置并复原
    console.log("读取配置中......")
    chrome.storage.local.get("tps", function (item){
        let tps = item.tps
        console.log(`配置已读取，tps：${tps}，每次操作间隔：${(1/tps) * 1000}`)
        ipt(solveSteps, 0, 1/tps * 1000); 
    })
}

// 监听solve信号，得到信号就复原
chrome.runtime.onMessage.addListener(function(request, _sender, _sendResponse) {
    if (request.solve) {
        autoSolve();
    }
});




