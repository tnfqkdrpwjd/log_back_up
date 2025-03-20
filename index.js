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
      document.getElementById(
        "filedata"
      ).innerText = `파일 내용:\n${e.target.result}`;
      document.getElementById(
        "htmlContent"
      ).innerHTML = `파일 내용:\n${e.target.result}`;
    };

    reader.onerror = function () {
      console.error("파일을 읽는 중 오류가 발생했습니다.");
    };

    reader.readAsText(file); // 파일 내용을 텍스트로 읽기
  } else {
    alert("파일을 선택해주세요.");
  }
}

//해싱함수 - class 명을 색이나 이름으로 쓰기에는 맞지 않음.
function base32Hash(input) {
  const base32Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let total = 0;

  for (let i = 0; i < input.length; i++) {
    total += input.charCodeAt(i) * (i + 1);
  }

  let hash = base32Chars[total % base32Chars.length]; // 항상 영어로 시작
  for (let i = 0; i < 4; i++) {
    // 5자리 해시
    hash += base32Chars[(total + i * 13) % base32Chars.length];
  }

  return hash;
}
