RUNNER_CODE_AND_TESTS = `
arr1 = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
arr2 = [1];
arr3 = [0];
arr4 = [-1];

const passedTests = [
  [arr1, 6],
  [arr2, 1],
  [arr3, 0],
  [arr4, -1],
];

const passedAll = passedTests.every(([input, expected]) => kadaneAlgo(input) === expected);

passedAll ? 'All tests passed!' : 'Some tests failed!';
`;

LEVEL_1_CODE = `
function kadaneAlgo(arr) {
    // function definition
    console.log('Level 1: Only function definition');
}

kadaneAlgo([1, 2, 3]);
`;

LEVEL_2_CODE = `
function kadaneAlgo(arr) {
    let maxSum = -Infinity;
    let currentSum = 0;
    console.log("Level 2: Variables initialized but no logic");
}
`;

LEVEL_3_CODE = `
function kadaneAlgo(arr) {
    let maxSum = -Infinity;
    let currentSum = 0;
    for (let num of arr) {
        currentSum = Math.max(num, currentSum + num);
    }
    console.log("Level 3: After loop, currentSum:", currentSum);
}

kadaneAlgo([1, 2, 3]);
`;

LEVEL_4_CODE = `
function kadaneAlgo(arr) {
    let maxSum = -Infinity;
    let currentSum = 0;
    for (let num of arr) {
        currentSum = Math.max(num, currentSum + num);
        maxSum = Math.max(maxSum, currentSum);
    }
    console.log("Level 4: Max Sum during iteration:", maxSum);
}
`;

LEVEL_5_CODE = `
function kadaneAlgo(arr) {
    let maxSum = -Infinity;
    let currentSum = 0;
    for (let num of arr) {
        currentSum = Math.max(num, currentSum + num);
        maxSum = Math.max(maxSum, currentSum);
    }
    console.log("Level 5: Final Max Sum (before return):", maxSum);
    // return maxSum;
}

kadaneAlgo([1, 2, 3]);
`;

let difficulty_level = 1;

function setDifficultyLevel(level) {
  difficulty_level = level;
  switch (level) {
    case 1:
      window.editor.setValue(LEVEL_1_CODE);
      break;
    case 2:
      window.editor.setValue(LEVEL_2_CODE);
      break;
    case 3:
      window.editor.setValue(LEVEL_3_CODE);
      break;
    case 4:
      window.editor.setValue(LEVEL_4_CODE);
      break;
    case 5:
      window.editor.setValue(LEVEL_5_CODE);
      break;
    default:
      window.editor.setValue(LEVEL_1_CODE);
  }
}

function renderDifficultyLevel() {
  const difficultyLevelElement = document.getElementById('difficultyLevel');
  difficultyLevelElement.innerHTML = ''; // Clear existing content

  // Create emoji elements for 5 difficulty levels
  for (let i = 1; i <= 5; i++) {
    const emoji = document.createElement('span');
    emoji.innerHTML = i <= difficulty_level ? '⭐' : '⚪'; // Use filled star for selected, empty circle for unselected
    emoji.style.cursor = 'pointer';
    emoji.style.fontSize = '24px';
    emoji.style.margin = '5px';
    emoji.setAttribute('data-level', i); // Set difficulty level on the emoji

    // Add click event to set the difficulty level when the emoji is clicked
    emoji.addEventListener('click', function () {
      setDifficultyLevel(parseInt(this.getAttribute('data-level')));
      renderDifficultyLevel(); // Rerender the emojis based on new level
    });

    difficultyLevelElement.appendChild(emoji);
  }

  difficultyLevelElement.style.display = 'flex';
  difficultyLevelElement.style.justifyContent = 'center';
  difficultyLevelElement.style.marginBottom = '20px';
}

function checkUserCode(userCode, callback) {
  try {
    // Attach the runner code and tests to the user code
    const codeToRun = userCode + RUNNER_CODE_AND_TESTS;

    // Create the worker code
    const workerCode = `
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

    // Create a blob from the worker code
    const blob = new Blob([workerCode], { type: 'application/javascript' });

    // Create a worker from the blob
    const worker = new Worker(URL.createObjectURL(blob));

    worker.postMessage(codeToRun);

    // Handle the message from the worker
    worker.onmessage = function (event) {
      const { result, error } = event.data;

      if (error) {
        callback(false);
        return;
      }

      // Check if all tests passed
      if (result.includes('All tests passed!')) {
        callback(true);
        return;
      }

      callback(false);
    };
  } catch (error) {
    console.error('Error in user code:', error);
    callback(false);
  }
}
