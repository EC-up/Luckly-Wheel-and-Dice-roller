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
  let accelerationTime = 1000; // 1 second of acceleration
  let decelerationTime = 2000; // 2 seconds of deceleration
  let totalRotation = Math.random() * 360; // Random rotation between 0 and 360
  let startTime = Date.now();

  const interval = setInterval(() => {
    let elapsed = Date.now() - startTime;

    if (elapsed < accelerationTime) {
      // Acceleration phase
      rotation += 5;
    } else if (elapsed < accelerationTime + decelerationTime) {
      // Deceleration phase
      rotation += (decelerationTime - (elapsed - accelerationTime)) / 100;
    } else {
      // Stop the wheel
      clearInterval(interval);
      setTimeout(() => {
        alert(`Winner: ${entries[randomIndex]}`);
        isSpinning = false;
      }, 500);
    }

    if (rotation >= 360) rotation %= 360;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(200, 200);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-200, -200);
    drawWheel();
    ctx.restore();
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
    footerText.innerHTML = `
      © 2023 名字轉盤與骰子滾動。保留所有權利。<br>
      <small>
        我們致力於保護您的隱私並確保數據安全。本項目符合 GDPR、CCPA 等隱私法規。<br>
        100% 的電力來自可再生能源，其中 93% 為無碳能源。
      </small>
    `;
    languageToggle.textContent = '切換到 English';

    rollButton.textContent = '滾動骰子';
    diceCountInput.setAttribute('placeholder', '骰子數量 (1-6)');
  } else {
    title.textContent = 'Wheel of Names & Dice Roller';
    spinButton.textContent = 'Spin Wheel';
    nameInput.placeholder = 'Enter names (comma-separated)';
    footerText.innerHTML = `
      © 2023 Wheel of Names & Dice Roller. All rights reserved.<br>
      <small>
        We are committed to protecting your privacy and securing your data. This project complies with GDPR, CCPA, and other privacy regulations.<br>
        100% of the electricity that powers this project comes from renewable energy sources, with 93% being carbon-free.
      </small>
    `;
    languageToggle.textContent = 'Switch to 中文';

    rollButton.textContent = 'Roll Dice';
    diceCountInput.setAttribute('placeholder', 'Number of Dice (1-6)');
  }
});
