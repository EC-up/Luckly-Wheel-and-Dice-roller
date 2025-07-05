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

// Support Enter key for name input
nameInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    spinButton.click();
  }
});

// Roll dice and display total sum
rollButton.addEventListener('click', () => {
  const diceCount = parseInt(diceCountInput.value, 10);
  if (isNaN(diceCount) || diceCount < 1 || diceCount > 6) {
    alert('Please enter a number between 1 and 6.');
    return;
  }

  diceResultsDiv.innerHTML = '';
  let totalSum = 0;

  for (let i = 0; i < diceCount; i++) {
    const diceValue = Math.floor(Math.random() * 6) + 1;
    totalSum += diceValue;

    const diceElement = document.createElement('div');
    diceElement.className = 'dice';
    diceElement.textContent = diceValue;
    diceResultsDiv.appendChild(diceElement);
  }

  // Display total sum
  const totalSumElement = document.createElement('p');
  totalSumElement.textContent = `Total: ${totalSum}`;
  diceResultsDiv.appendChild(totalSumElement);
});

// Language toggle
languageToggle.addEventListener('click', () => {
  isChinese = !isChinese;

  if (isChinese) {
    title.textContent = '幸运转盘与骰子滚动';
    spinButton.textContent = '旋转转盘';
    nameInput.placeholder = '输入名字（用逗号分隔）';
    footerText.innerHTML = `
      © 2023 幸运转盘与骰子滚动。保留所有权利。<br>
      <small>
        我们致力于保护您的隐私并确保数据安全。本项目符合 GDPR、CCPA 等隐私法规。<br>
        100% 的电力来自可再生能源，其中 93% 为无碳能源。
      </small>
    `;
    languageToggle.textContent = '切换到 English';

    rollButton.textContent = '滚动骰子';
    diceCountInput.setAttribute('placeholder', '骰子数量 (1-6)');
  } else {
    title.textContent = 'Lucky Wheel & Dice Roller';
    spinButton.textContent = 'Spin Wheel';
    nameInput.placeholder = 'Enter names (comma-separated)';
    footerText.innerHTML = `
      © 2023 Lucky Wheel & Dice Roller. All rights reserved.<br>
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

// Initialize the wheel on page load
drawWheel();
