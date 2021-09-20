'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  movementsDates: [
    '2021-09-08T12:01:20.894Z',
    '2021-09-09T06:04:23.907Z',
    '2021-09-10T09:48:16.867Z',
    '2021-09-11T13:15:33.035Z',
    '2021-09-12T18:49:59.371Z',
    '2021-09-13T14:43:26.374Z',
    '2021-09-14T16:33:06.386Z',
    '2021-09-15T14:18:46.235Z',
  ],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  movementsDates: [
    '2021-09-08T12:01:20.894Z',
    '2021-09-09T06:04:23.907Z',
    '2021-09-10T09:48:16.867Z',
    '2021-09-11T13:15:33.035Z',
    '2021-09-12T18:49:59.371Z',
    '2021-09-13T14:43:26.374Z',
    '2021-09-14T16:33:06.386Z',
    '2021-09-15T14:18:46.235Z',
  ],
  interestRate: 1.5,
  pin: 2222,
  locale: 'pt-PT',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  movementsDates: [
    '2021-09-08T12:01:20.894Z',
    '2021-09-09T06:04:23.907Z',
    '2021-09-10T09:48:16.867Z',
    '2021-09-11T13:15:33.035Z',
    '2021-09-12T18:49:59.371Z',
    '2021-09-13T14:43:26.374Z',
    '2021-09-14T16:33:06.386Z',
    '2021-09-15T14:18:46.235Z',
  ],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90, 340, -300, -20],
  movementsDates: [
    '2021-09-08T12:01:20.894Z',
    '2021-09-09T06:04:23.907Z',
    '2021-09-10T09:48:16.867Z',
    '2021-09-11T13:15:33.035Z',
    '2021-09-12T18:49:59.371Z',
    '2021-09-13T14:43:26.374Z',
    '2021-09-14T16:33:06.386Z',
    '2021-09-15T14:18:46.235Z',
  ],
  interestRate: 1,
  pin: 4444,
  locale: 'en-US',
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

//--------------------------------------------------------------------------------------------------
const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  const daysPassed = calcDaysPassed(new Date(), date);
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yestarday';
  if (daysPassed < 7) return `${daysPassed} days ego`;
  else {
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach((item, index) => {
    const type = item > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[index]);
    const displayDate = formatMovementDate(date, acc.locale);

    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${item.toFixed(2)}€</div>
  </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
//---------------------------------------------------------------------
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, item) => acc + item, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
};
//-----------------------------------------------------------------------
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(item => item > 0)
    .reduce((acc, item) => acc + item, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  const out = acc.movements
    .filter(item => item < 0)
    .reduce((acc, item) => acc + item, 0);
  labelSumOut.textContent = `${Math.abs(out).toFixed(2)}€`;

  const interest = acc.movements
    .filter(item => item > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(item => item > 1)
    .reduce((acc, item) => acc + item, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};
//---------------------------------------------------------------------------
const createUsernames = function (accs) {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(item => item[0])
      .join('');
  });
};
createUsernames(accounts);
//-----------------------------------------------------------------------------
const updateUI = () => {
  displayMovements(currentAcount);
  calcDisplayBalance(currentAcount);
  calcDisplaySummary(currentAcount);
};
//--------------------------------------------------------------------------------------
const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }
    time--;
  };
  let time = 120;
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};
//----------------------------------------------------------------------------
let currentAcount, timer;
//----------------------------------------------------------------------------
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAcount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currentAcount?.pin === Number(inputLoginPin.value)) {
    containerApp.style.opacity = 100;
    labelWelcome.textContent = `Welcome Back, ${
      currentAcount.owner.split(' ')[0]
    }`;

    const now = new Date();
    const options = {
      hour: '2-digit',
      minute: 'numeric',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long',
    };
    console.log(navigator.language);
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAcount.locale,
      options
    ).format(now);

    console.log(
      new Intl.DateTimeFormat(currentAcount.locale, options).format(now)
    );
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    updateUI(currentAcount);
  }
});
//--------------------------------------------------------------------------
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  if (
    amount > 0 &&
    receiverAcc &&
    currentAcount.balance >= amount &&
    receiverAcc?.username !== currentAcount.username
  ) {
    currentAcount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    currentAcount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());
    updateUI(currentAcount);
    clearInterval(timer);
    timer = startLogOutTimer();
    inputTransferAmount.value = inputTransferTo.value = '';
  }
});
//---------------------------------------------------------------------------
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && currentAcount.movements.some(mov => mov >= amount / 10)) {
    setTimeout(function () {
      currentAcount.movements.push(amount);
      currentAcount.movementsDates.push(new Date().toISOString());
      updateUI(currentAcount);
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);
    inputLoanAmount.value = '';
  }
});
//------------------------------------------------------------------------------
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    currentAcount.username === inputCloseUsername.value &&
    currentAcount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAcount.username
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
});
//----------------------------------------------------------------------------------
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAcount, !sorted);
  sorted = !sorted;
});
//--------------------------------------------------------------------------------
