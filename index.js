function getFile() {
  let fileInput = document.getElementById("logfile");
  let file = fileInput.files[0]; // 선택된 파일 가져오기

  if (file) {
    let reader = new FileReader();
    reader.onload = function (e) {
      let parser = new DOMParser();
      let logFile = parser.parseFromString(e.target.result, "text/html"); // HTML 문자열을 DOM 객체로 변환

      let characters = new Map();
      let taps = new Map();
      // HTML 수정 작업
      logFile.querySelectorAll("p").forEach((p) => {
        // p 태그 내부의 span 태그 찾기
        let spans = p.querySelectorAll("span");
        if (spans.length >= 3) {
          //탭의 []지우기기
          let tap = spans[0].outerText.slice(2, -1);
          //저널의 색 가져오기
          let characterStyle = p.style.color;

          let name = spans[1].outerText.trim();

          //해싱하기 - 이름, 탭을 그대로 클레스로 쓸 수 없음
          let tapH = base32Decode(spans[0].outerText, "t");
          let characterH = base32Decode(name, "c");

          //div태그를 만들고 클래스 추가
          let newDiv = document.createElement("div");
          newDiv.setAttribute("class", `chatBox ${tapH} ${characterH}`);

          //이름과 대사 들어갈 box
          let chatDiv = document.createElement("div");
          chatDiv.setAttribute("class", ` `);
          //이름
          let divChar = document.createElement("div");
          divChar.setAttribute("class", "character");
          divChar.textContent = name;
          //대사
          let divDia = document.createElement("div");
          divDia.setAttribute("class", "dialogue");
          divDia.textContent = spans[2].outerText;
          //이미지
          let divImg = document.createElement("div");
          divImg.setAttribute("class", "charImg");
          let imgChar = document.createElement("img");
          imgChar.setAttribute("alt", `${name} 이미지`);
          divImg.appendChild(imgChar);

          newDiv.appendChild(divImg);
          chatDiv.appendChild(divChar);
          chatDiv.appendChild(divDia);
          newDiv.appendChild(chatDiv);

          logFile.body.appendChild(newDiv);
          //맵에 캐릭터 색색 추가하기
          characters.set(characterH, [name, characterStyle]);
          //
          taps.set(tapH, tap);

          //탭 지우기
          p.remove();
        }

        //p태그의 style 속성 제거
        p.removeAttribute("style");
      });
      let style = document.createElement("style");

      //버튼 초기화
      let containerI = document.getElementById("imgSetB");
      containerI.innerHTML = "";

      //이미지 버튼 추가
      characters.forEach((value, key, map) => {
        style.innerHTML += `.${key} .dialogue { background-color : ${value[1]};
          color : ${isBrightColor(value[1]) ? "#000000" : "#FFFFFF"};} 
          `;

        let charButton = document.createElement("button");
        charButton.textContent = value[0]; // 버튼 텍스트 설정
        charButton.setAttribute("class", "charImgSet");
        //css 추가
        charButton.style.backgroundColor = value[1];
        charButton.style.color = isBrightColor(value[1])
          ? "#000000"
          : "#FFFFFF";
        // charButton.style.padding = "2px 5px";
        charButton.style.height = "2rem";
        charButton.style.minWidth = "1rem";
        charButton.style.borderRadius = "3px";
        charButton.style.border = "0px";
        charButton.style.margin = "5px 3px";

        // 버튼 클릭 시 실행될 함수
        charButton.onclick = function () {
          let imgUrl = prompt("이미지 주소를 입력하십시오");

          let htmlContent = document.getElementById("htmlContent").innerHTML;
          let parser = new DOMParser();
          let doc = parser.parseFromString(htmlContent, "text/html");

          let style = doc.querySelector("style");

          if (style) {
            // 기존 스타일을 수정하거나 새로운 스타일을 추가할 수 있습니다.
            style.innerHTML += `
            .${key} img { content : url(${imgUrl})
            }
            `;
          } else {
            // 스타일 태그가 없다면 새로 추가
            style = doc.createElement("style");
            style.innerHTML = `
            .${key} img { content : url(${imgUrl})
            }
            `;
            doc.head.appendChild(style);
          }

          document.getElementById("htmlContent").innerHTML =
            doc.documentElement.outerHTML;
        };

        // 버튼을 #buttonContainer에 추가
        containerI.appendChild(charButton);
      });

      // 탭 설정 버튼 추가
      //버튼 초기화
      let containerT = document.getElementById("TabSetC");
      containerT.innerHTML = "";

      // 탭 설정 체크박스 추가
      taps.forEach((value, key, map) => {
        let wrapper = document.createElement("div");
        wrapper.style.display = "flex";
        wrapper.style.alignItems = "center";
        wrapper.style.gap = "5px";

        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = false; // 기본적으로 체크 해제

        let label = document.createElement("label");
        label.textContent = value; // 탭 이름 표시
        label.style.cursor = "pointer";

        // 체크박스 클릭 시 실행될 함수
        checkbox.onclick = function () {
          let htmlContent = document.getElementById("htmlContent").innerHTML;
          let parser = new DOMParser();
          let doc = parser.parseFromString(htmlContent, "text/html");

          let style = doc.querySelector("style");

          if (checkbox.checked) {
            // 체크하면 opacity: 0.5; 추가

            if (style) {
              // 기존 스타일을 수정하거나 새로운 스타일을 추가할 수 있습니다.
              style.innerHTML += `
            .${key}  { opacity: 0.7
            }
            `;
            } else {
              // 스타일 태그가 없다면 새로 추가
              style = doc.createElement("style");
              style.innerHTML = `
            .${key} { opacity: 0.7
            }
            `;
              doc.head.appendChild(style);
            }
          } else {
            // 체크 해제하면 opacity 제거

            if (style) {
              // 기존 스타일을 수정하거나 새로운 스타일을 추가할 수 있습니다.
              style.innerHTML += `
              .${key} { 
              }
              `;
            } else {
              // 스타일 태그가 없다면 새로 추가
              style = doc.createElement("style");
              style.innerHTML = ` .${key} { }`;
              doc.head.appendChild(style);
            }
          }

          document.getElementById("htmlContent").innerHTML =
            doc.documentElement.outerHTML;
        };

        wrapper.appendChild(checkbox);
        wrapper.appendChild(label);

        containerT.appendChild(wrapper);
      });

      //이미지 표시안하는 css
      style.innerHTML += `* {font-family : sans-serif;}
        .charImg {position: relative; margin : 5px 10px 10px 10px; width: 50px; height: 50px; }
        .charImg img {position: absolute; width: 100%; height: 100%; content : url(https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png) }
         .chatBox { display : flex; margin : 15px;}
         .dialogue {border-radius : 5px;  padding : 10px;}
         .character {}
         .img {}
         .disable {}
         .show {}
         .hide {display: none}
         .sub-content {opacity: 0.5;}
         .buttonList{ display: flex; align-items: flex-start;flex-wrap :wrap}
         `;
      logFile.head.appendChild(style);

      // //파일 내용 그대로 출력력
      // document.getElementById("filedata").innerText =
      //   logFile.documentElement.outerHTML;

      // html로 표시하기
      document.getElementById("htmlContent").innerHTML =
        logFile.documentElement.outerHTML;
    };

    reader.onerror = function () {
      console.error("파일을 읽는 중 오류가 발생했습니다.");
    };

    reader.readAsText(file); // 파일 내용을 텍스트로 읽기
  } else {
    alert("파일을 선택해주세요.");
  }
}

async function copyHtml() {
  //복사
  const htmlContent = document.getElementById("htmlContent").innerHTML;

  try {
    await navigator.clipboard.writeText(htmlContent);
    alert("HTML 내용이 클립보드에 복사되었습니다!");
  } catch (err) {
    console.error("클립보드 복사 실패:", err);
  }
}

//해싱함수 - class 명을 색이나 이름으로 쓰기에는 맞지 않음.
function base32Decode(input, first = "") {
  let total = 0;
  for (let i = 0; i < input.length; i++) {
    total += input.charCodeAt(i) * (i + 1);
  }
  let result = total.toString(36);

  // console.log("해싱 : " + input + "   결과 : " + result);
  return first + result;
}

function isBrightColor(rgb) {
  // HEX -> R, G, B 변환
  let match = rgb.match(/\d+/g);
  if (!match || match.length !== 3) return false; // 유효성 검사

  let r = parseInt(match[0], 10);
  let g = parseInt(match[1], 10);
  let b = parseInt(match[2], 10);

  // 밝기 공식 (Luminance)
  let brightness = (r * 299 + g * 587 + b * 114) / 1000;
  // console.log('rgb : ' + rgb + '    brightness : ' + brightness);
  return brightness > 200; // 200보다 크면 밝은 색 (개인취향 )
}
