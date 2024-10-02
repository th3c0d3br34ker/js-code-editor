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

if (passedAll) {
  console.log("All tests passed!");
}
`;

LEVEL_1_CODE = `
function kadaneAlgo(arr) {
    // function definition
    console.log('Level 1: Only function definition');
}
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

function checkUserCode(userCode) {
  try {
    // attach the runner code and tests to the user code
    const code = userCode + RUNNER_CODE_AND_TESTS;

    // Create a blob from the code
    const blob = new Blob([code], { type: 'application/javascript' });

    // Create a worker from the blob
    const worker = new Worker(URL.createObjectURL(blob));

    // Post a message to the worker
    worker.postMessage(blob);

    // Handle the message from the worker
    worker.onmessage = function (event) {
      // Get the result and error from the worker
      const { result, error } = event.data;

      if (error) {
        console.error('Error in user code:', error);
        return false;
      }

      // if the user code passes all the tests
      if (result === 'All tests passed!' && difficulty_level !== 5) {
        return true;
      }

      return false;
    };
  } catch (error) {
    console.error('Error in user code:', error);
    return false;
  }
}
