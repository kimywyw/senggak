let txtInput;
let uploadedTXT = null;
let img, main_top, underbar, date_top;
let state = 0;
let scrollOffset = 0;
let scrollOffsetReview = 0;
let title, date, user, info;

let bottomSheetY;
let targetBottomSheetY;
let isBottomSheetVisible = false;
let bottomSheetHeight = 400;
let imgW, imgH;


let chatMessages = [];
let summary = "";

let chatYOffset = 0;
let chatInputText = "";
let chatHiddenInput;
let backButton;
let goToChatButton;
let finishChatButton;
let inputHeight = 50;
let scrollAreaHeight;


let bubblePadding = 10;
let maxBubbleWidth = 220;
let bubbleSpacing = 10;


let topImage, plusIcon;
let topImageHeight, topImageWidth;
let imageScale = 1;
let lineHeight = 22;


let apiKey = ""; 
const systemPrompt = "너는 친절한 AI도우미야. 사용자가 말하는 책정보를 바탕으로 사용자가 느낀 감정을 이끌어낼 수있는 역질문을 해줘, 너의 질문에 사용자가 답하면 그 답변을 바탕으로 계속 이어지는질문을 해줘.";

const systemPrompt_summary = "너는 짧은 독후감을 작성해주는 도우미야. 특히, 책에 대한 사용자와 AI 모델간의 대화를 바탕으로, 사용자가 책을 읽고 어떠한 감상을 가졌는지, 어떠한 부분을 좋아하였는지 등등을 요약해줘. 요약된 텍스트의 전체 길이는 250 단어를 넘지 않도록 해.";

let conversationHistory = [];
let chatSummary = [];

function preload() {
  img = loadImage('A.png');

  main_top = loadImage('main_top1.png');
  underbar = loadImage('undervar.png');
  date_top = loadImage('date_top.png');
  topImage = loadImage("rectTop.png", img => {
    topImageWidth = img.width * imageScale;
    topImageHeight = img.height * imageScale;
  });
  plusIcon = loadImage("plus.png");
}


function setup() {
  createCanvas(390, 844);
  textFont('pretendard');


  scrollAreaHeight = height - inputHeight;

  chatHiddenInput = createInput();
  chatHiddenInput.position(60, height - inputHeight + 10);
  chatHiddenInput.size(260, 30);
  chatHiddenInput.style('opacity', '0');
  chatHiddenInput.input(() => {
    chatInputText = chatHiddenInput.value();
  });

  goToChatButton = createButton('AI에게 질문');
  goToChatButton.position(267, 775);
  goToChatButton.size(123, 63);
  goToChatButton.style('opacity','0');
  goToChatButton.mousePressed(() => {
    state = 2;
    chatHiddenInput.elt.focus();
  });

  backButton = createButton('');
  backButton.position(16, 65);
  backButton.size(24, 24);
  backButton.style('opacity','0');
  backButton.mousePressed(() => {
    state = 0;
  });

    finishChatButton = createButton('요약하기');
  finishChatButton.position(320, 59);
  finishChatButton.size(58, 30);
  finishChatButton.style('font-size', '10px');
  finishChatButton.addClass('Fbutton');
  finishChatButton.mousePressed(() => {
    summarizeConversation();
    state = 1;
    
  });
bottomSheetY = height;
targetBottomSheetY = height;
}

function draw() {
  background(220);
  if (state == 0) {
    drawBookPage()
    finishChatButton.style('opacity','0');
  }
  
  else if (state == 1) {
    drawReviewPage();
    finishChatButton.style('opacity','0');

  }
  
  else if (state == 2) {
    drawChatPage();
    finishChatButton.style('opacity','255');
    }
    drawBottomSheet();
}

function summarizeConversation() {
  
  generateChatSummary("AI모델과 사용자 간의 대화를 바탕으로, '만조의 바다는 말을 하지 않는다'라는 책을 읽은 사용자의 입장에서 독후감을 요약 작성해줘.");
  
}


// 메인페이지 
function drawBookPage() {
  image(main_top, 0, 0);
  image(underbar, 0, 762);
  let x = 187, y = 684;
  }


function drawReviewPage() {
  textAlign(LEFT, TOP);
  background(255);
  let textY = 430; // 카드 내부 기준 Y좌표
  let textH =getSummaryHeight(summary,314);
  // 상단 고정 헤더
  date = '2025/05/23';
  title = '만조의 바다는 말을 하지않는다';
  user = 'by 000';
  info = '만조를 기다리며 / 조예은 / 위즈덤 하우스';

  image(date_top, 0, 0);
  noStroke();
  fill('#ABB0BC');
  textSize(14);
  textStyle(BOLD);
  text(date, 149, 75);

  // 전체 스크롤 영역

  // 카드형 배경
  fill(0);
  rect(0, 98, 390, 746);

  fill(255);
  rect(16, 270, 358, 1000 , 30, 30, 0, 0);

  fill(225);
  rect(52, 224, 100, 163);

  // 제목, 정보
  fill(0);
  textSize(18);
  textStyle(BOLD);
  text(title, 169, 289, 149);

  fill('#ABB0BC');
  textSize(11);
  textStyle(NORMAL);
  text(info, 169, 340, 183);

  fill(0);
  textSize(12);
  text(user, 169, 375);

  stroke('#D9D9D9');
  line(37, 408, 355, 408);

  // 요약 텍스트 (카드 내부 기준 위치)
  fill(0);
  textSize(14);
  textLeading(lineHeight);
  noStroke();


  if (summary == "") {
    text("요약된 대화가 없습니다.", 38, textY, 314);
  } else {
    text(summary, 38, textY, 314);  // 카드 내부에 잘 맞춰짐
  }

}


//  전체 높이 계산
function getSummaryHeight(txt, w) {
  textSize(14);
  textLeading(lineHeight);

  let words = txt.split(" ");
  let line = "", lines = 0;

  for (let word of words) {
    let testLine = line + word + " ";
    if (textWidth(testLine) > w) {
      lines++;
      line = word + " ";
    } else {
      line = testLine;
    }
  }
  if (line !== "") lines++;
  return lines * lineHeight;
}


// 채팅페이지 ( 267- 384 )
function drawChatPage() {
  textAlign(LEFT, TOP);
  background(245);
  textSize(14);
  textLeading(lineHeight);
  push();
  translate(0, chatYOffset + topImageHeight + 10);

  let y = 0;
  for (let msg of chatMessages) {
    let bubbleWidth = maxBubbleWidth;
    let textWidthLimit = bubbleWidth - (2 * bubblePadding);

    let bubbleHeight = getTextHeightAuto(msg.text, textWidthLimit) + 2 * bubblePadding;

    // 말풍선 위치
    let bx = (msg.sender == "me") ? width - bubbleWidth - 20 : 20;
    let tx = bx + bubblePadding;

    // 말풍선+텍스트출력
    if (msg.sender == "me") {
      fill('#378CFF');
      noStroke();
      rect(bx, y, bubbleWidth, bubbleHeight, 12, 0, 12, 12);
      fill(255);
        noStroke();
    text(msg.text, tx, y+bubblePadding, textWidthLimit);
    y += bubbleHeight + bubbleSpacing;
    } else {
      fill(255);
      stroke(230);
      rect(bx, y, bubbleWidth, bubbleHeight, 0, 12, 12, 12)
      fill(0);
        noStroke();
    text(msg.text, tx, y+bubblePadding, textWidthLimit);
    y += bubbleHeight + bubbleSpacing;
    }
  }

  pop();

  // 상단 UI
  image(topImage, (width - topImageWidth) / 2, -5, topImageWidth, topImageHeight);
  noStroke();
  fill(255); textAlign(CENTER, CENTER);
  textSize(20); text('만조를 기다리며', width / 2, 77);
}

// 말풍선 높이 계산 함수
function getTextHeightAuto(txt, w) {
  textSize(14);
  textLeading(lineHeight);
  let words = txt.split(" ");
  let line = "", lines = 0;
  for (let word of words) {
    let testLine = line + word + " ";
    if (textWidth(testLine) > w) {
      lines++;
      line = word + " ";
    } else {
      line = testLine;
    }
  }
  if (line !== "") lines++;
  return lines * lineHeight;
}

// 채팅 전체 높이 계산
function getTotalMessageHeight() {
  let total = 10;
  textSize(14);
  textLeading(lineHeight);

  for (let msg of chatMessages) {
    let contentHeight = getTextHeightAuto(msg.text, maxBubbleWidth - 2 * bubblePadding);
    total += contentHeight + 2 * bubblePadding + bubbleSpacing;
  }
  return total;
}

// 스크롤 마우스 휠 
function mouseWheel(event) {

  if (state === 2) {
    const totalHeight = getTotalMessageHeight();
    const minOffset = -totalHeight + scrollAreaHeight - topImageHeight - 10;
    chatYOffset = constrain(chatYOffset - event.delta, minOffset, 0);
  }
}

// 텍스트 입력 란란
function drawCustomInputArea() {
  noStroke(); fill(255);
  rect(0, height - inputHeight, width, inputHeight);
  image(plusIcon, 20, height - inputHeight / 2 - 15, 30, 30);
  fill(255); stroke(200);
  rect(70, height - inputHeight + 10, 300, 30, 20);
  noStroke(); fill(0); textSize(14);
  textAlign(LEFT, CENTER);
  let displayText = chatInputText;
  while (textWidth(displayText) > 280 && displayText.length > 0) {
    displayText = displayText.substring(1);
  }
  text(displayText, 80, height - inputHeight / 2 + 5);
}

// 채팅 보내기 
function sendChatMessage() {
  let text = chatInputText.trim();
  if (text === "") return;
  chatMessages.push({ sender: "me", text });
  chatInputText = "";
  chatHiddenInput.value("");
  generateChatResponse(text);
}


function mouseClicked() {
  const third = width / 3;
  
  // 바텀시트가 열려있고, 버튼을 누르면 기록 화면으로 이동
  if (isBottomSheetVisible && mouseY >= 727 && mouseY <= 779) {
    state = state === 0 ? 1 : 0;
    isBottomSheetVisible = false; // 기록화면에서는 바텀시트 끔
    targetBottomSheetY = height;
  }

  // 가운데 1/3 - 기록 버튼
  else if (mouseX >= third && mouseX < 2 * third && mouseY >= 777 && mouseY <= 811) 
  { if (mouseY < bottomSheetY && state !== 2){
    state = 1;}
  }
    //책 - 오른쪽
else if (mouseX >= 15 && mouseX < 125 && mouseY >= 580 && mouseY <= 760){
  if (mouseY < bottomSheetY && state !== 2 && state !== 1 ) {  // state가 2일 때는 바텀시트 열지 않음
    isBottomSheetVisible = !isBottomSheetVisible;
    targetBottomSheetY = isBottomSheetVisible ? height - bottomSheetHeight : height;
  }
}

//책 - 가운데
else if (mouseX >= 140 && mouseX < 251 && mouseY >= 580 && mouseY <= 760){
  if (mouseY < bottomSheetY && state !== 2 && state !== 1) {
    isBottomSheetVisible = !isBottomSheetVisible;
    targetBottomSheetY = isBottomSheetVisible ? height - bottomSheetHeight : height;
  }
}

//책 - 왼쪽
else if (mouseX >= 266 && mouseX < 376 && mouseY >= 580 && mouseY <= 760){
  if (mouseY < bottomSheetY && state !== 2 && state !== 1) {
    isBottomSheetVisible = !isBottomSheetVisible;
    targetBottomSheetY = isBottomSheetVisible ? height - bottomSheetHeight : height;
  }
}

  // 오른쪽 1/3 - 채팅 버튼
  else if (mouseX >= 2 * third && mouseX <= width && mouseY >= 777 && mouseY <= 811) {
     if (mouseY < bottomSheetY && state !== 2){
    state = 2;
    chatHiddenInput.elt.focus();
  }}
   // ✅ 바텀시트가 열려있고, 그 아래를 누르면 채팅 화면으로 이동
  else   if (isBottomSheetVisible &&  mouseY >= 779) {
    state = 2;
    chatHiddenInput.elt.focus();
     isBottomSheetVisible = false;
    targetBottomSheetY = height;
  }
}



//텍스트입력 엔터로 보내기
function keyPressed() {
  if (document.activeElement === chatHiddenInput.elt && keyCode === ENTER) {
    sendChatMessage();
    return false;
  }
}



function drawBottomSheet() {
  bottomSheetY = lerp(bottomSheetY, targetBottomSheetY, 0.1);

  fill(255);
  stroke(200);
  rect(0, bottomSheetY, width, bottomSheetHeight, 40, 40, 0, 0);

  if (img) {
    // 이미지가 바텀시트 전체 크기 채우도록
    image(img, 0, bottomSheetY, width, bottomSheetHeight);
  }
}

function mousePressed() {
  if (isBottomSheetVisible && mouseY < bottomSheetY) {
    isBottomSheetVisible = false;
    targetBottomSheetY = height;  // 아래로 숨김
  }
}

async function generateChatSummary(question) {
  let url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;
  conversationHistory.push({ role: "user", parts: [{ text: question }] });
  let requestBody = {
    system_instruction: { parts: [{ text: systemPrompt_summary }] },
    contents: conversationHistory,
  };
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });
    let data = await response.json();
    let responseText = (data.candidates && data.candidates.length > 0)
      ? data.candidates[0].content.parts[0].text
      : "AI로부터 응답을 받지 못했습니다.";
    chatMessages.push({ sender: "ai", text: responseText });
    summary = responseText;
    conversationHistory.push({ role: "model", parts: [{ text: responseText }] });
  } catch (error) {
    console.log("Error:", error);
    chatMessages.push({ sender: "ai", text: "에러가 발생했어요. 다시 시도해 주세요." });
  }
}


async function generateChatResponse(question) {
  let url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;
  conversationHistory.push({ role: "user", parts: [{ text: question }] });
  let requestBody = {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents: conversationHistory,
  };
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });
    let data = await response.json();
    let responseText = (data.candidates && data.candidates.length > 0)
      ? data.candidates[0].content.parts[0].text
      : "AI로부터 응답을 받지 못했습니다.";
    chatMessages.push({ sender: "ai", text: responseText });
    conversationHistory.push({ role: "model", parts: [{ text: responseText }] });
  } catch (error) {
    console.log("Error:", error);
    chatMessages.push({ sender: "ai", text: "에러가 발생했어요. 다시 시도해 주세요." });
  }
}
