// DOM Elements
const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const spinButton = document.getElementById('spin-button');
const nameInput = document.getElementById('name-input');
const title = document.getElementById('title');
const footerText = document.getElementById('footer-text');
const languageToggle = document.getElementById('language-toggle');

const rollButton = document.getElementById('roll-button');
const diceCountInput = document.getElementById('dice-count');
const diceResultsDiv = document.getElementById('dice-results');

let entries = [];
let isSpinning = false;
let isChinese = false;

// Draw the wheel
function drawWheel() {
  const numEntries = entries.length;
  if (numEntries === 0) return;

  const arcAngle = (2 * Math.PI) / numEntries;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < numEntries; i++) {
    ctx.beginPath();
    ctx.fillStyle = `hsl(${(i * 360) / numEntries}, 70%, 50%)`;
    ctx.moveTo(200, 200);
    ctx.arc(200, 200, 200, i * arcAngle, (i + 1) * arcAngle);
    ctx.lineTo(200, 200);
    ctx.fill();

    // Add text
    ctx.save();
    ctx.translate(200, 200);
    ctx.rotate(i * arcAngle + arcAngle / 2);
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.fillText(entries[i], 120, 10);
    ctx.restore();
  }
}

// Spin the wheel
spinButton.addEventListener('click', () => {
  if (isSpinning || entries.length === 0) return;

  isSpinning = true;
  const randomIndex = Math.floor(Math.random() * entries.length);

  let rotation = 0;
  const interval = setInterval(() => {
    rotation += 5;
    if (rotation >= 360) rotation %= 360;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(200, 200);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-200, -200);
    drawWheel();
    ctx.restore();

    if (rotation >= (randomIndex * (360 / entries.length)) + 720) {
      clearInterval(interval);
      setTimeout(() => {
        alert(`Winner: ${entries[randomIndex]}`);
        isSpinning = false;
      }, 500);
    }
  }, 16);
});

// Update entries
nameInput.addEventListener('input', (e) => {
  entries = e.target.value.split(',').map(name => name.trim()).filter(name => name !== '');
  drawWheel();
});

// Roll dice
rollButton.addEventListener('click', () => {
  const diceCount = parseInt(diceCountInput.value, 10);
  if (isNaN(diceCount) || diceCount < 1 || diceCount > 6) {
    alert('Please enter a number between 1 and 6.');
    return;
  }

  diceResultsDiv.innerHTML = ''; // Clear previous results

  for (let i = 0; i < diceCount; i++) {
    const diceValue = Math.floor(Math.random() * 6) + 1; // Random number between 1 and 6
    const diceElement = document.createElement('div');
    diceElement.className = 'dice';
    diceElement.textContent = diceValue;
    diceResultsDiv.appendChild(diceElement);
  }
});

// Language toggle
languageToggle.addEventListener('click', () => {
  isChinese = !isChinese;

  if (isChinese) {
    title.textContent = '名字轉盤與骰子滾動';
    spinButton.textContent = '旋轉轉盤';
    nameInput.placeholder = '輸入名字（用逗號分隔）';
    footerText.textContent = '© 2023 名字轉盤與骰子滾動。保留所有權利。';
    languageToggle.textContent = '切換到 English';

    rollButton.textContent = '滾動骰子';
    diceCountInput.setAttribute('placeholder', '骰子數量 (1-6)');
  } else {
    title.textContent = 'Wheel of Names & Dice Roller';
    spinButton.textContent = 'Spin Wheel';
    nameInput.placeholder = 'Enter names (comma-separated)';
    footerText.textContent = '© 2023 Wheel of Names & Dice Roller. All rights reserved.';
    languageToggle.textContent = 'Switch to 中文';

    rollButton.textContent = 'Roll Dice';
    diceCountInput.setAttribute('placeholder', 'Number of Dice (1-6)');
  }
});
