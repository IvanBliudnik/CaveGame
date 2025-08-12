let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["кулаки"];

const button1 = document.querySelector('#button1');
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");
const weapons = [
  { name: 'кулаки', power: 5 },
  { name: 'клюшка для хоккея на траве', power: 30 },
  { name: 'топор', power: 50 },
  { name: 'Desert Eagle cal.50', power: 100 }
];
const monsters = [
  {
    name: "Урка",
    level: 2,
    health: 15
  },
  {
    name: "Мафиози",
    level: 8,
    health: 60
  },
  {
    name: "Босс",
    level: 20,
    health: 300
  }
]
const locations = [
  {
    name: "Городская площадь",
    "button text": ["Пойти на рынок", "Логово", "Решить проблему с Боссом"],
    "button functions": [goStore, goCave, fightDragon],
    text: "Вы находитесь на центральной площади. Что будешь делать?."
  },
  {
    name: "Рынок",
    "button text": ["Купить 10 едениц здоровья (10 gold)", "Купить оружие (30 gold)", "Вернуться на площадь"],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "Вы находитесь в магазине."
  },
  {
    name: "Логово",
    "button text": ["Драка с Уркой", "Драка с Мафиози", "Вернуться на площадь"],
    "button functions": [fightSlime, fightBeast, goTown],
    text: "Вы в логове. Тут повсюду опасность"
  },
  {
    name: "Драка",
    "button text": ["Атаковать", "Увернуться", "Убежать"],
    "button functions": [attack, dodge, goTown],
    text: "Вы деретесь с противником"
  },
  {
    name: "Победил",
    "button text": ["На центральную площадь", "На центральную площадь", "На центральную площадь"],
    "button functions": [goTown, goTown, easterEgg],
    text: 'Оппонент что-то крякнул. Ты заработал опыт и немного денег'
  },
  {
    name: "Wasted",
    "button text": ["Повторить?"],
    "button functions": [restart, restart, restart],
    text: "You die. ☠️"
  },
  { 
    name: "Победа",
    "button text": ["REPLAY?"],
    "button functions": [restart, restart, restart], 
    text: "Ты решил проблему мирных жителей! Ты выиграл игру, теперь ты Босс! 🎉"
  },
  {
    name: "Лотерея",
    "button text": ["2", "8", "3", "Go to town square?"],
    "button functions": [pickTwo, pickEight, pickThree, goTown],
    text: "Вы нашли секретную игру. Выберите число выше. Будет случайным образом выбрано десять чисел в диапазоне от 0 до 10. Если выбранное вами число совпадает с одним из случайных чисел, вы выигрываете!"
  }
];

// initialize buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerText = location.text;
}

function goTown() {
  update(locations[0]);
}

function goStore() {
  update(locations[1]);
}

function goCave() {
  update(locations[2]);
}

function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    goldText.innerText = gold;
    healthText.innerText = health;
  } else {
    text.innerText = "You do not have enough gold to buy health.";
  }
}

function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = "You now have a " + newWeapon + ".";
      inventory.push(newWeapon);
      text.innerText += " In your inventory you have: " + inventory;
    } else {
      text.innerText = "You do not have enough gold to buy a weapon.";
    }
  } else {
    text.innerText = "You already have the most powerful weapon!";
    button2.innerText = "Sell weapon for 15 gold";
    button2.onclick = sellWeapon;
  }
}

function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    goldText.innerText = gold;
    let currentWeapon = inventory.shift();
    text.innerText = "You sold a " + currentWeapon + ".";
    text.innerText += " In your inventory you have: " + inventory;
  } else {
    text.innerText = "Don't sell your only weapon!";
  }
}

function fightSlime() {
  fighting = 0;
  goFight();
}

function fightBeast() {
  fighting = 1;
  goFight();
}

function fightDragon() {
  fighting = 2;
  goFight();
}

function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterName.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;
}

function attack() {
  text.innerText = "The " + monsters[fighting].name + " attacks.";
  text.innerText += " You attack it with your " + weapons[currentWeapon].name + ".";
  health -= getMonsterAttackValue(monsters[fighting].level);
  if (isMonsterHit()) {
    monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;    
  } else {
    text.innerText += " You miss.";
  }
  healthText.innerText = health;
  monsterHealthText.innerText = monsterHealth;
  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    fighting === 2 ? winGame() : defeatMonster();
  }
  if (Math.random() <= .1 && inventory.length !== 1) {
    text.innerText += " Your " + inventory.pop() + " breaks.";
    currentWeapon--;
  }
}

function getMonsterAttackValue(level) {
  const hit = (level * 5) - (Math.floor(Math.random() * xp));
  console.log(hit);
  return hit > 0 ? hit : 0;
}

function isMonsterHit() {
  return Math.random() > .2 || health < 20;
}

function dodge() {
  text.innerText = "You dodge the attack from the " + monsters[fighting].name;
}

function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  update(locations[4]);
}

function lose() {
  update(locations[5]);
}

function winGame() {
  update(locations[6]);
}

function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["stick"];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  goTown();
}

function easterEgg() {
  update(locations[7]);
}

function pickTwo() {
  pick(2);
}

function pickEight() {
  pick(8);
}
function pickThree() {
  pick(3);
}

function pick(guess) {
  const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  text.innerText = "You picked " + guess + ". Here are the random numbers:\n";
  for (let i = 0; i < 10; i++) {
    text.innerText += numbers[i] + "\n";
  }
  if (numbers.includes(guess)) {
    text.innerText += "Right! You win 20 gold!";
    gold += 20;
    goldText.innerText = gold;
  } else {
    text.innerText += "Wrong! You lose 10 health!";
    health -= 10;
    healthText.innerText = health;
    if (health <= 0) {
      lose();
    }
  }
}