(function() {
  'use strict';

  // 텍스트를 따옴표로 감싸는 함수 (개행은 \n으로 변환)
  function convertToQuoted(text) {
    const lines = text.split('\n');
    const filtered = lines.filter(line => line.trim() !== ''); // 빈 줄 제거
    const joined = filtered.join('\\n'); // 개행을 \n 문자열로 변환
    return `"${joined}"`;
  }

  // 결과 박스 생성
  function createResultBox(convertedText) {
    const resultBox = document.createElement('pre');
    resultBox.className = 'sampledata boj-quote-result-box';
    resultBox.textContent = convertedText;

    // 클릭 시 복사 기능
    resultBox.addEventListener('click', () => {
      navigator.clipboard.writeText(convertedText).then(() => {
        resultBox.classList.add('copied');
        setTimeout(() => {
          resultBox.classList.remove('copied');
        }, 1000);
      });
    });

    return resultBox;
  }

  // 예제 섹션에 변환 결과 자동 추가
  function addResultsToExamples() {
    // 예제 입력/출력 섹션 찾기
    const sampleSections = document.querySelectorAll('.sampledata');

    sampleSections.forEach((section) => {
      // 결과 박스는 건너뛰기
      if (section.classList.contains('boj-quote-result-box')) {
        return;
      }

      // 이미 결과 박스가 추가되어 있는지 확인
      if (section.nextElementSibling?.classList.contains('boj-quote-result-box')) {
        return;
      }

      const text = section.textContent;
      const converted = convertToQuoted(text);
      const resultBox = createResultBox(converted);

      // 원본 예제 바로 아래에 결과 박스 추가
      section.parentElement.insertBefore(resultBox, section.nextSibling);
    });
  }

  // 페이지 로드 후 실행
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addResultsToExamples);
  } else {
    addResultsToExamples();
  }
})();
