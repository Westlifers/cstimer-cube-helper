Cube.initSolver() // 初始化魔方
let port = chrome.runtime.connect({ name: "message" }) // 与后台建立message连接
port.onDisconnect.addListener(function() {
    port = chrome.runtime.connect({name: "message"})
}) // 断开后立即重连，防止自动断开
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

// 双击解魔方
$(document).on("dblclick", autoSolve)

// 给出当前打乱的解法
function solveCurrentCube(){
    scramble = $("#scrambleTxt div").text()
    const cube = new Cube()
    cube.move(scramble)
    return cube.solve()
}

// 自动复原虚拟魔方
function autoSolve(){
    solveSteps = solveCurrentCube()
    // 将X2替换为X X，方便操作
    solveSteps = solveSteps.replace(/(?<pat>.)2/g, '$<pat> $<pat>')
    // 复原操作转数组
    solveSteps = solveSteps.split(" ")
    // 复原操作转键位
    var i = 0
    for (let step of solveSteps){
        solveSteps[i] = keys[step]
        i = i + 1
    }
    // 键位转回字符串
    solveSteps = solveSteps.join("")
    // 向后台请求键盘复原
    port.postMessage({ action: "input", text: solveSteps });
}

// 监听solve信号，得到信号就复原
chrome.runtime.onMessage.addListener(function(request, _sender, _sendResponse) {
    if (request.solve) {
        autoSolve();
    }
});




