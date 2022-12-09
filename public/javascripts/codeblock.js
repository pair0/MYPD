const COPY_TEXT_CHANGE_OFFSET = 1000;
const COPY_BUTTON_TEXT_BEFORE = 'Copy';
const COPY_BUTTON_TEXT_AFTER = 'Copied';
const COPY_ERROR_MESSAGE = '코드를 복사할 수 없습니다. 다시 시도해 주세요.';

const codeBlocks = document.querySelectorAll('pre > code');

const copyBlockCode = async (target = null) => {
  if (!target) return;
  try {
    const code = decodeURI(target.dataset.code);

    await navigator.clipboard.writeText(code);
    target.textContent = COPY_BUTTON_TEXT_AFTER;
    setTimeout(() => {
      target.textContent = COPY_BUTTON_TEXT_BEFORE;
    }, COPY_TEXT_CHANGE_OFFSET);
  } catch(error) {
    alert(COPY_ERROR_MESSAGE);
    console.error(error);
  }
}
$(document).ready(function(){
  cnt = 0;
  for (const codeBlock of codeBlocks) {
    const codes = codeBlock.innerHTML.match(/(.*)(\n|.*$)/g);
    // const codes = codeBlock.innerHTML.split('\n');
    const processedCodes = codes.reduce((prevCodes, curCode) => prevCodes + 
  `<div class="line">${curCode}</div>`, '');
    const ExplainText = `<h3 id="clickhere${cnt}">Click here!!!</h3>`
    const copyButton = `<button type="button" class="copy-btn" 
  data-code="${encodeURI(codeBlock.textContent)}" 
  onclick="copyBlockCode(this)">${COPY_BUTTON_TEXT_BEFORE}</button>`;
    
    const codeBody = `<div class="code-body code-body${cnt}" style="display:none">${processedCodes}</div>`;
    const codeHeader = `
    <div class="code-header code-header${cnt}">
      <span class="red btn"></span>
      <span class="yellow btn"></span>
      <span class="green btn"></span>
      ${ExplainText}
      ${copyButton}
    </div>`;
  
    codeBlock.innerHTML = codeHeader + codeBody;
    cnt +=1
  }

})
$(function (){
  $("#clickhere0").click(function (){
      $(".code-body0").toggle();
  });
});
$(function (){
  $("#clickhere1").click(function (){
      $(".code-body1").toggle();
  });
});
$(document).ready(function() {
  document.getElementsByClassName("side_bar2")[0].style.left = "20px";
})