var lc = new RTCPeerConnection();
var rc = new RTCPeerConnection();
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
    let msg= A.value;
    sendChannel.send(msg);
    msgBox.innerHTML+=`<br><p><strong>you : </strong>${msg}</p>`;
    A.value=""
}
function createOffer() {

        sendChannel.onmessage = e => msgBox.innerHTML+=`<br><p><strong>B : </strong>${e.data}</p>`;
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
    let msg= B.value;
        rc.receiveChannel.send(msg);
        msgBox.innerHTML+=`<br><p><strong>you : </strong>${msg}</p>`;
        B.value="";

}
function createAns() {

    rc.ondatachannel = e => {
       rc.receiveChannel = e.channel
        rc.receiveChannel.onmessage = e => msgBox.innerHTML+=`<br><p><strong>A : </strong>${e.data}</p>`;
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
