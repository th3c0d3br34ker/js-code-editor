// Monaco Editor configuration
require.config({
  paths: {
    vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/vs',
  },
});
require(['vs/editor/editor.main'], function () {
  window.editor = monaco.editor.create(document.getElementById('editor'), {
    value: '// Enter JavaScript code here',
    language: 'javascript',
    theme: 'vs-dark',
    automaticLayout: true, // Automatically adjust the layout on window resize
  });

  // Capture Ctrl+S (or Cmd+S on Mac) and format the code
  window.editor.addCommand(
    monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
    function () {
      editor.getAction('editor.action.formatDocument').run();
      // alert('Code formatted! (You can implement saving logic here)');
    }
  );
});

// Web worker code as a blob
const code = `
  self.onmessage = function(event) {
    const codeToRun = event.data;
    let result;
    try {
      result = eval(codeToRun);
      self.postMessage({ result: result });
    } catch (error) {
      self.postMessage({ error: error.toString() });
    }
  };
`;

const blob = new Blob([code], { type: 'application/javascript' });
const worker = new Worker(URL.createObjectURL(blob));

// Handling the RUN button click
document.getElementById('runBtn').addEventListener('click', function () {
  const userCode = window.editor.getValue(); // Get code from Monaco editor

  worker.postMessage(userCode); // Send the code to the web worker for execution

  worker.onmessage = function (event) {
    const { result, error } = event.data;
    const outputContent = document.getElementById('outputContent');
    if (error) {
      outputContent.innerHTML = `<pre>Error: ${error}</pre>`;
    } else {
      outputContent.innerHTML = `<pre>Output: ${result}</pre>`;
    }

    // Show the sliding plane
    const outputPanel = document.getElementById('outputPanel');
    outputPanel.classList.add('open');
  };
});

// Handling the close button
document.getElementById('closeBtn').addEventListener('click', function () {
  const outputPanel = document.getElementById('outputPanel');
  outputPanel.classList.remove('open');
});

// Handling the Get Help button
document.getElementById('helpBtn').addEventListener('click', function () {
  alert('Help is on the way!');
});
