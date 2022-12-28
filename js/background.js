console.log("background.js...");

// 接收message连接
chrome.runtime.onConnect.addListener(function (port) {
    port.onMessage.addListener(function (msg) {        
        /* console.log(msg); */
        let tabId = port.sender.tab.id;
        /* console.log("当前tabId:"+tabId);  */ 
        let action=msg.action;
        if(action=="click"){
            let x = msg.coordinate.x;
            let y = msg.coordinate.y;          
            handleDispatchMouseEventClick(x,y,tabId) 
        }
        if(action=="input"){
            let text=msg.text;
            handleDispatchKeyEventInput(text,tabId);
        }
    });
});

// 坐标点击
function handleDispatchMouseEventClick(x,y,tabId){
    chrome.debugger.attach({ tabId: tabId }, "1.3");  
    chrome.debugger.sendCommand(
        { tabId: tabId },
        "Input.dispatchMouseEvent",//https://chromedevtools.github.io/devtools-protocol/tot/Network/
        { type: "mousePressed", x: x, y: y, button: "left", clickCount: 1 },
        function (e) { console.log('clickDown', e); }
    );
    chrome.debugger.sendCommand(
        { tabId: tabId },
        "Input.dispatchMouseEvent",
        { type: "mouseReleased", x: x, y: y, button: "left", clickCount: 1 },
        function (e) { 
            console.log('clickUp', e); 
            chrome.debugger.detach({tabId:tabId});
        }
    );
}

// 键盘输入单字输入
function handleDispatchKeyEventInput(val,tabId){
    chrome.debugger.attach({ tabId: tabId }, "1.3");
    chrome.debugger.sendCommand(
        { tabId: tabId},            
        "Input.dispatchKeyEvent",        
        { type: "keyDown",text:val,key:val,code:"Key"+val,windowsVirtualKeyCode:val.charCodeAt()},
        function (e) { /* console.log('keyDown', e) */ }
    ); 			
    chrome.debugger.sendCommand(
        { tabId: tabId },            
        "Input.dispatchKeyEvent",
        { type: "keyUp",code:"key"+val,key:val,text:val},
        function (e) {
            /* console.log('keyUp', e); */
            chrome.debugger.detach({tabId:tabId});
        }
    ); 
}