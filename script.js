let config={
  'iceServers': [
    {
      'url': ['stun:stun1.l.google.com:19302',
              'stun:stun2.l.google.com:19302',
              'stun:stun3.l.google.com:19302',
              'stun:stun4.l.google.com:19302']
    }
  ]
}

var lc = new RTCPeerConnection(config);
var rc = new RTCPeerConnection(config);
var sendChannel = lc.createDataChannel("sendChannel");
// var receiveChannel;

const offer = document.getElementById("offer");
const answer = document.getElementById("answer");
const chat = document.getElementById("chat");

const msgBox=document.querySelector(".msg");
const A=document.querySelector(".A");
const send=document.querySelector(".send");
const B=document.querySelector(".B");
const sendr=document.querySelector(".sendr");

offer.addEventListener("click", createOffer);
answer.addEventListener("click", createAns)
chat.addEventListener("click", startChat)

send.addEventListener("click", sendA)
sendr.addEventListener("click", sendB)

function sendA() {
    let msg= A.value + "\n";
    sendChannel.send(msg);
    msgBox.textContent+="\nyou : " + msg;
    A.value=""
}
function createOffer() {

        sendChannel.onmessage = e => msgBox.textContent+="\nB : " + e.data;
        sendChannel.onopen = e => {
            console.log("Open!!!");
            A.style.display="block";
            send.style.display="block";
        }
        sendChannel.onclose = e => console.log("Close!!!");

    lc.createOffer().then(o => lc.setLocalDescription(o));
    lc.onicecandidate = e => {
        console.log("New ice candidate on local connection\n");
        console.log(JSON.stringify(lc.localDescription));
        navigator.clipboard.writeText(JSON.stringify(lc.localDescription))

    }
}
function startChat() {
    const text2 = document.getElementById("text2");
    const answer = JSON.parse(text2.value);
    const sessionDescription = new RTCSessionDescription(answer);

    lc.setRemoteDescription(sessionDescription).then(() => console.log("Done"));

}
function sendB() {
    let msg= B.value + "\n";
        rc.receiveChannel.send(msg);
        msgBox.textContent +="\nyou : " + msg;
        B.value="";

}
function createAns() {

    rc.ondatachannel = e => {
       rc.receiveChannel = e.channel
        rc.receiveChannel.onmessage = e => msgBox.textContent+="\nA : " + e.data;
        rc.receiveChannel.onopen = e =>  {
            console.log("Open!!!");
            B.style.display="block";
            sendr.style.display="block";
        };
        rc.receiveChannel.onclose = e => console.log("Close!!!");
    };
    const text = document.getElementById("text");
    const offer = JSON.parse(text.value);
    const sessionDescription = new RTCSessionDescription(offer);

    rc.setRemoteDescription(sessionDescription)
        .then(() => {
            console.log("Remote description set successfully.");

            // Create answer and set local description
            return rc.createAnswer();
        })
        .then(answer => {
            return rc.setLocalDescription(answer);
        })
        .then(() => {
            console.log("Local description set successfully:", JSON.stringify(rc.localDescription));
            navigator.clipboard.writeText(JSON.stringify(rc.localDescription));
        })
        .catch(error => {
            console.error("Error:", error);
        });

    rc.onicecandidate = e => {
        console.log(JSON.stringify(rc.localDescription));
    };
}
