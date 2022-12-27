Cube.initSolver()
let port = chrome.runtime.connect({ name: "message" });
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

// 每当按键或鼠标点击，都重新获取当前打乱
$(document).on("click", scrambleChange)




// 双击测试
$(document).on("dblclick", autoSolve)






// 给出当前打乱的解法
function solveCurrentCube(){
    const cube = new Cube()
    cube.move(scramble)
    return cube.solve()
}

function ipt(str, i) {    
    port.postMessage({ action: "input", text: str[i] });
    if (i < str.length - 1) {
        setTimeout(function () {
            ipt(str,++i);
        }, 50);                          // 50为按键间隔时间
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
    // 逐步复原
    setTimeout(function () { 
        ipt(solveSteps,0); 
    }, 500);
    
}






