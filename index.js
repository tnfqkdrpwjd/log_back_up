function updateGreeting() {
  let userName = document.getElementById("username").value;
  document.getElementById("greeting").innerText = `안녕하세요, ${userName}님!`;
}

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
          let characterStyle = p.getAttribute("style");

          //해싱하기 - 이름, 탭을 그대로 클레스로 쓸 수 없음
          let tapH = base32Decode(spans[0].outerText, "t");
          let characterH = base32Decode(spans[1].outerText, "c");

          //div태그를 만들고 클래스 추가
          let newDiv = document.createElement("div");
          newDiv.setAttribute("class", `${tapH} ${characterH}`);

          //이름
          let divChar = document.createElement("div");
          divChar.setAttribute("class", "character");
          divChar.textContent = spans[1].outerText;
          //대사
          let divDia = document.createElement("div");
          divDia.setAttribute("class", "dialogue");
          divDia.textContent = spans[2].outerText;
          //이미지
          let divImg = document.createElement("div");
          divImg.setAttribute("class", "img");
          let imgChar = document.createElement("img");
          imgChar.setAttribute("alt", `${spans[1].outerText} 이미지`);
          divImg.appendChild(imgChar);

          newDiv.appendChild(divChar);
          newDiv.appendChild(divDia);

          logFile.body.appendChild(newDiv);
          //탭 지우기
          p.remove();
          //맵에 추가하기
          characters.set(characterH, characterStyle);
          taps.set(tapH, tap);
        }

        //p태그의 style 속성 제거
        p.removeAttribute("style");
      });
      let style = document.createElement("style");

      characters.forEach((value, key, map) => {
        style.innerHTML += `.${key} { ${value}} 
        `;
      });

      logFile.head.appendChild(style);
      // //파일 내용 그대로 출력력
      // document.getElementById("filedata").innerText =
      //   logFile.documentElement.outerHTML;

      // html로 표시하기
      document.getElementById("htmlContent").innerHTML =
        logFile.documentElement.outerHTML;

      // //복사
      // let htmlString = new XMLSerializer().serializeToString(logFile); // 다시 HTML 문자열로 변환

      // navigator.clipboard
      //   .writeText(htmlString)
      //   .then(() => {
      //     alert("HTML이 클립보드에 복사되었습니다!");
      //   })
      //   .catch((err) => {
      //     console.error("복사 실패:", err);
      //   });
    };

    reader.onerror = function () {
      console.error("파일을 읽는 중 오류가 발생했습니다.");
    };

    reader.readAsText(file); // 파일 내용을 텍스트로 읽기
  } else {
    alert("파일을 선택해주세요.");
  }
}

function getFileOld() {
  let fileInput = document.getElementById("logfile");
  let file = fileInput.files[0]; // 선택된 파일 가져오기

  if (file) {
    let reader = new FileReader();
    reader.onload = function (e) {
      let parser = new DOMParser();
      let logFile = parser.parseFromString(e.target.result, "text/html"); // HTML 문자열을 DOM 객체로 변환

      let styles = new Map();
      // HTML 수정 작업
      logFile.querySelectorAll("p").forEach((p) => {
        // p 태그의 style 속성 제거
        let style = p.getAttribute("style");
        //toDo: 다른 안전한 식으로 바꾸기 이름안에도 :가올수 있지 않은가
        p.innerHTML = p.innerHTML.replace(
          /<\/span>\s*:\s*<span>/g,
          "</span><span>"
        );
        // p 태그 내부의 span 태그 찾기
        let spans = p.querySelectorAll("span");
        if (spans.length >= 3) {
          //탭의 []지우기기
          spans[0].textContent = spans[0].outerText.slice(2, -1);
          //p 태그에 클래스 추가
          let tap = base32Decode(spans[0].outerText, "t");
          let character = base32Decode(spans[1].outerText, "c");

          p.setAttribute("class", tap + " " + character);

          //span 태그에 character인지 dialogue 인지 class 로 구분
          spans[1].setAttribute("class", "character");
          spans[2].setAttribute("class", "dialogue");

          //탭 지우기
          // p.remove(spans[0]);
          p.querySelector("span").remove();
          //맵에 추가하기
          styles.set(character, style);
        }

        //p태그의 style 속성 제거
        p.removeAttribute("style");
      });
      let style = document.createElement("style");

      styles.forEach((value, key, map) => {
        style.innerHTML += `.${key} { ${value}} 
        `;
      });

      logFile.head.appendChild(style);
      // //파일 내용 그대로 출력력
      // document.getElementById("filedata").innerText =
      //   logFile.documentElement.outerHTML;

      // html로 표시하기
      document.getElementById("htmlContent").innerHTML =
        logFile.documentElement.outerHTML;

      // //복사
      // let htmlString = new XMLSerializer().serializeToString(logFile); // 다시 HTML 문자열로 변환

      // navigator.clipboard
      //   .writeText(htmlString)
      //   .then(() => {
      //     alert("HTML이 클립보드에 복사되었습니다!");
      //   })
      //   .catch((err) => {
      //     console.error("복사 실패:", err);
      //   });
    };

    reader.onerror = function () {
      console.error("파일을 읽는 중 오류가 발생했습니다.");
    };

    reader.readAsText(file); // 파일 내용을 텍스트로 읽기
  } else {
    alert("파일을 선택해주세요.");
  }
}

//불러온 파일에 클래스 속성을 추가하고 css속성을 빼는 작업

//head 에 css를 추가하는 작업

//해싱함수 - class 명을 색이나 이름으로 쓰기에는 맞지 않음.
function base32Decode(input, first = "") {
  let total = 0;
  for (let i = 0; i < input.length; i++) {
    total += input.charCodeAt(i) * (i + 1);
  }
  let result = total.toString(36);

  console.log("해싱 : " + input + "   결과 : " + result);
  return first + result;
}
