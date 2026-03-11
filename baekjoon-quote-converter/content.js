(function() {
  'use strict';

  // ========== 따옴표 변환 기능 ==========

  // 텍스트를 따옴표로 감싸는 함수 (개행은 \n으로 변환)
  function convertToQuoted(text) {
    const lines = text.split('\n');
    const filtered = lines.filter(line => line.trim() !== '');
    const joined = filtered.join('\\n');
    return `"${joined}"`;
  }

  // 결과 박스 생성
  function createResultBox(convertedText) {
    const resultBox = document.createElement('pre');
    resultBox.className = 'sampledata boj-quote-result-box';
    resultBox.textContent = convertedText;

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
    const sampleSections = document.querySelectorAll('.sampledata');

    sampleSections.forEach((section) => {
      if (section.classList.contains('boj-quote-result-box')) return;
      if (section.id === 'boj-test-output') return;
      if (section.nextElementSibling?.classList.contains('boj-quote-result-box')) return;

      const text = section.textContent;
      const converted = convertToQuoted(text);
      const resultBox = createResultBox(converted);

      section.parentElement.insertBefore(resultBox, section.nextSibling);
    });
  }

  // ========== JUnit 테스트 코드 생성 기능 ==========

  // 예제 입력/출력 쌍 추출
  function getExamplePairs() {
    const pairs = [];
    let i = 1;
    while (true) {
      const inputEl = document.getElementById(`sample-input-${i}`);
      const outputEl = document.getElementById(`sample-output-${i}`);
      if (!inputEl || !outputEl) break;

      const inputText = inputEl.textContent.replace(/^\n+/, '').replace(/\n+$/, '');
      const outputText = outputEl.textContent.replace(/^\n+/, '').replace(/\n+$/, '');
      pairs.push({ input: inputText, output: outputText, index: i });
      i++;
    }
    return pairs;
  }

  // 입력 텍스트를 setInput용 문자열로 변환
  function toSetInputString(text) {
    return text.split('\n').join('\\n');
  }

  // JUnit 테스트 코드 생성
  function generateTestCode(className) {
    const pairs = getExamplePairs();
    if (pairs.length === 0) return '// 예제를 찾을 수 없습니다.';

    const testMethods = pairs.map((pair) => {
      const inputStr = toSetInputString(pair.input);
      const outputStr = pair.output.trim();
      return `
    @Test
    void 예제${pair.index}() throws IOException {
        setInput("${inputStr}");
        ${className}.main(new String[] {});
        assertEquals("${outputStr}", getOutput());
    }`;
    }).join('\n');

    return `import static java.lang.System.*;
import static org.junit.jupiter.api.Assertions.*;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintStream;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ${className}Test {
    private final InputStream originalIn = in;
    private final PrintStream originalOut = out;
    private ByteArrayOutputStream outputCapture;

    @BeforeEach
    void setUp() {
        outputCapture = new ByteArrayOutputStream();
        setOut(new PrintStream(outputCapture));
    }

    @AfterEach
    void tearDown() {
        setIn(originalIn);
        setOut(originalOut);
    }

    private void setInput(String input) {
        setIn(new ByteArrayInputStream(input.getBytes()));
    }

    private String getOutput() {
        return outputCapture.toString().trim();
    }
${testMethods}

}
`;
  }

  // 테스트 코드 생성 UI 추가
  function addTestGeneratorUI() {
    // 예제 섹션 찾기
    const sampleSections = document.querySelectorAll('.sampledata');
    if (sampleSections.length === 0) return;

    // 이미 추가되어 있는지 확인
    if (document.getElementById('boj-test-generator')) return;

    // "예제 입력 1" 제목 바로 앞에 삽입
    let insertBefore = null;
    const bodyChildren = document.querySelectorAll('#problem-body > *');
    for (const el of bodyChildren) {
      if (el.id?.startsWith('sampleinput') || el.textContent?.trim().startsWith('예제 입력')) {
        insertBefore = el;
        break;
      }
    }

    // 폴백: 첫 번째 예제의 부모 앞에 삽입
    if (!insertBefore) {
      const firstSample = sampleSections[0];
      insertBefore = firstSample.closest('.row') || firstSample.parentElement;
    }

    const container = document.createElement('div');
    container.id = 'boj-test-generator';
    container.className = 'col-md-12';
    container.innerHTML = `
      <h2 class="boj-test-title">JUnit 테스트 코드 생성</h2>
      <div class="boj-test-input-row">
        <input type="text" id="boj-class-name" placeholder="클래스명을 입력하세요 (예: TreeInvestment_16235)" />
        <button id="boj-generate-btn">생성</button>
      </div>
      <div id="boj-test-output-container" style="display:none;">
        <pre id="boj-test-output" class="boj-test-result-box"></pre>
      </div>
    `;

    insertBefore.parentElement.insertBefore(container, insertBefore);

    // 생성 버튼 이벤트
    const generateBtn = document.getElementById('boj-generate-btn');
    const classNameInput = document.getElementById('boj-class-name');
    const outputContainer = document.getElementById('boj-test-output-container');
    const outputPre = document.getElementById('boj-test-output');

    function generate() {
      const className = classNameInput.value.trim();
      if (!className) {
        classNameInput.focus();
        classNameInput.classList.add('boj-input-error');
        setTimeout(() => classNameInput.classList.remove('boj-input-error'), 1000);
        return;
      }

      const code = generateTestCode(className);
      outputPre.textContent = code;
      outputContainer.style.display = 'block';
    }

    generateBtn.addEventListener('click', generate);
    classNameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') generate();
    });

    // 결과 클릭 시 복사
    outputPre.addEventListener('click', () => {
      navigator.clipboard.writeText(outputPre.textContent).then(() => {
        outputPre.classList.add('copied');
        setTimeout(() => {
          outputPre.classList.remove('copied');
        }, 1000);
      });
    });
  }

  // ========== 초기화 ==========

  function init() {
    addResultsToExamples();
    addTestGeneratorUI();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
