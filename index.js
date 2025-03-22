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
      let container = document.getElementById("imgSetB");
      container.innerHTML = "";

      characters.forEach((value, key, map) => {
        style.innerHTML += `.${key} .dialogue { background-color : ${value[1]};
        
        color : ${isBrightColor(value[1]) ? "#000000" : "#FFFFFF"};} 
        `;

        let charButton = document.createElement("button");
        charButton.textContent = value[0]; // 버튼 텍스트 설정
        charButton.setAttribute("class", "charImgSet");

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
        container.appendChild(charButton);
      });

      //이미지 표시안하는 css
      style.innerHTML += `* {font-family : sans-serif;}
       img {margin : 10px; width: 50px; height: 50px; content : url(https://pbs.twimg.com/profile_banners/1349408517606707202/1674220313/1080x360) }
       .chatBox { display : flex; margin : 15px;}
       .dialogue {border-radius : 5px;  padding : 10px;}
       .character {}
       .img {}
       .disable {}
       .show {}
       .hide {display: none}`;
      //  font-weight:bold;
      logFile.head.appendChild(style);
      //파일 내용 그대로 출력력
      document.getElementById("filedata").innerText =
        logFile.documentElement.outerHTML;

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

function isBrightColor(hex) {
  // HEX -> R, G, B 변환
  let r = parseInt(hex.substring(1, 3), 16);
  let g = parseInt(hex.substring(3, 5), 16);
  let b = parseInt(hex.substring(5, 7), 16);

  // 밝기 공식 (Luminance)
  let brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return brightness > 128; // 128보다 크면 밝은 색
}
