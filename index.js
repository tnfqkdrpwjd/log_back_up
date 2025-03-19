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
    };

    reader.onerror = function () {
      console.error("파일을 읽는 중 오류가 발생했습니다.");
    };

    reader.readAsText(file); // 파일 내용을 텍스트로 읽기
  } else {
    alert("파일을 선택해주세요.");
  }
}
