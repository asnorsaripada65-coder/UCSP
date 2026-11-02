document.addEventListener('DOMContentLoaded', () => {
  
  // --- 1. HISTORY ACCORDION LOGIC ---
  const cards = document.querySelectorAll('.card');

  cards.forEach(card => {
    const header = card.querySelector('.card-header');
    const body = card.querySelector('.card-body');
    const icon = card.querySelector('.toggle-icon');

    header.addEventListener('click', () => {
      const isExpanded = header.getAttribute('aria-expanded') === 'true';

      cards.forEach(otherCard => {
        if (otherCard !== card) {
          otherCard.querySelector('.card-header').setAttribute('aria-expanded', 'false');
          otherCard.querySelector('.card-body').style.maxHeight = null;
          otherCard.querySelector('.toggle-icon').textContent = '+';
        }
      });

      if (isExpanded) {
        header.setAttribute('aria-expanded', 'false');
        body.style.maxHeight = null;
        icon.textContent = '+';
      } else {
        header.setAttribute('aria-expanded', 'true');
        body.style.maxHeight = body.scrollHeight + "px";
        icon.textContent = '−';
      }
    });
  });

  // --- 2. MEMORY GAME LOGIC ---
  const gameBoard = document.getElementById('game-board');
  const gameMessage = document.getElementById('game-message');
  const resetBtn = document.getElementById('reset-btn');

  const gameData = [
    { id: 'mamluk', text: 'Mamluk' },
    { id: 'mamluk', text: 'Slave soldiers who formed a powerful military caste.' },
    { id: 'ainjalut', text: 'Ain Jalut' },
    { id: 'ainjalut', text: 'The 1260 battle that halted the Mongol expansion.' },
    { id: 'bahri', text: 'Bahri Dynasty' },
    { id: 'bahri', text: 'The dynasty founded by Baybars after taking the throne.' },
    { id: 'mongols', text: 'Mongols' },
    { id: 'mongols', text: 'The invading army from the East defeated by the Mamluks.' }
  ];

  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;
  let matchedPairs = 0;

  function shuffle(array) {
    return array.sort(() => 0.5 - Math.random());
  }

  function startGame() {
    gameBoard.innerHTML = '';
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    matchedPairs = 0;
    gameMessage.textContent = 'Find all 4 pairs!';
    
    const shuffledData = shuffle([...gameData]);

    shuffledData.forEach(item => {
      const card = document.createElement('div');
      card.classList.add('memory-card');
      card.dataset.id = item.id;
      
      card.innerHTML = `
        <div class="card-front">?</div>
        <div class="card-back" style="display:none">${item.text}</div>
      `;

      card.addEventListener('click', flipCard);
      gameBoard.appendChild(card);
    });
  }

  function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    const front = this.querySelector('.card-front');
    const back = this.querySelector('.card-back');
    front.style.display = 'none';
    back.style.display = 'block';
    this.classList.add('flipped');

    if (!firstCard) {
      firstCard = this;
      return;
    }

    secondCard = this;
    checkForMatch();
  }

  function checkForMatch() {
    let isMatch = firstCard.dataset.id === secondCard.dataset.id;

    if (isMatch) {
      disableCards();
    } else {
      unflipCards();
    }
  }

  function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    
    matchedPairs++;
    if (matchedPairs === 4) {
      gameMessage.textContent = 'You won! Great job.';
    }
    
    resetBoard();
  }

  function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
      firstCard.querySelector('.card-front').style.display = 'flex';
      firstCard.querySelector('.card-back').style.display = 'none';
      firstCard.classList.remove('flipped');

      secondCard.querySelector('.card-front').style.display = 'flex';
      secondCard.querySelector('.card-back').style.display = 'none';
      secondCard.classList.remove('flipped');

      resetBoard();
    }, 1200);
  }

  function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
  }

  resetBtn.addEventListener('click', startGame);

  startGame();

});