// Данные исследования (проценты)
const PERCENTS = { food: 41.7, paper: 20.2, plastic: 17.0, glassmetal: 11.5, danger: 1.0, other: 8.6 };
const AVG_PER_PERSON = 5.45;
let currentMode = 'research';

// DOM элементы
const familyInput = document.getElementById('familyCount');
const foodInput = document.getElementById('food');
const paperInput = document.getElementById('paper');
const plasticInput = document.getElementById('plastic');
const glassmetalInput = document.getElementById('glassmetal');
const dangerInput = document.getElementById('danger');
const otherInput = document.getElementById('other');
const resetBtn = document.getElementById('resetBtn');
const modeResearchDiv = document.getElementById('modeResearch');
const modeManualDiv = document.getElementById('modeManual');

function setMode(mode) {
    currentMode = mode;
    if (mode === 'research') {
        modeResearchDiv.classList.add('active');
        modeManualDiv.classList.remove('active');
        [foodInput, paperInput, plasticInput, glassmetalInput, dangerInput, otherInput].forEach(inp => {
            inp.readOnly = true;
            inp.classList.add('disabled-input');
        });
        updateResearch();
    } else {
        modeResearchDiv.classList.remove('active');
        modeManualDiv.classList.add('active');
        [foodInput, paperInput, plasticInput, glassmetalInput, dangerInput, otherInput].forEach(inp => {
            inp.readOnly = false;
            inp.classList.remove('disabled-input');
        });
        updateManual();
    }
}

function updateResearch() {
    let family = parseFloat(familyInput.value);
    if (isNaN(family) || family < 1) family = 1;
    const totalWeight = family * AVG_PER_PERSON;
    foodInput.value = ((PERCENTS.food / 100) * totalWeight).toFixed(2);
    paperInput.value = ((PERCENTS.paper / 100) * totalWeight).toFixed(2);
    plasticInput.value = ((PERCENTS.plastic / 100) * totalWeight).toFixed(2);
    glassmetalInput.value = ((PERCENTS.glassmetal / 100) * totalWeight).toFixed(2);
    dangerInput.value = ((PERCENTS.danger / 100) * totalWeight).toFixed(3);
    otherInput.value = ((PERCENTS.other / 100) * totalWeight).toFixed(2);
    refreshUI(totalWeight, family);
}

function updateManual() {
    let family = parseFloat(familyInput.value);
    if (isNaN(family) || family < 1) family = 1;
    let food = parseFloat(foodInput.value) || 0;
    let paper = parseFloat(paperInput.value) || 0;
    let plastic = parseFloat(plasticInput.value) || 0;
    let glassmetal = parseFloat(glassmetalInput.value) || 0;
    let danger = parseFloat(dangerInput.value) || 0;
    let other = parseFloat(otherInput.value) || 0;
    const totalWeight = food + paper + plastic + glassmetal + danger + other;
    refreshUI(totalWeight, family);
}

function refreshUI(totalWeight, family) {
    const perPerson = totalWeight / family;
    const yearlyPerPerson = perPerson * 52.14;
    document.getElementById('totalKg').innerText = totalWeight.toFixed(1);
    document.getElementById('perPersonKg').innerText = perPerson.toFixed(2);
    document.getElementById('yearlyPerson').innerText = Math.round(yearlyPerPerson);

    let food = parseFloat(foodInput.value) || 0;
    let paper = parseFloat(paperInput.value) || 0;
    let plastic = parseFloat(plasticInput.value) || 0;
    let glassmetal = parseFloat(glassmetalInput.value) || 0;
    let danger = parseFloat(dangerInput.value) || 0;
    let other = parseFloat(otherInput.value) || 0;

    const items = [
        { name: "🍎 Пищевые", color: "#84b870", kg: food },
        { name: "📦 Бумага/картон", color: "#6c91b2", kg: paper },
        { name: "🥤 Пластик", color: "#e5a36f", kg: plastic },
        { name: "🥫 Стекло+металл", color: "#9aaebf", kg: glassmetal },
        { name: "⚠️ Опасные", color: "#d9756b", kg: danger },
        { name: "🛠️ Прочее", color: "#b0a9b4", kg: other }
    ];

    const maxKg = Math.max(...items.map(i => i.kg), 0.001);
    const compContainer = document.getElementById('compList');
    compContainer.innerHTML = '';

    items.forEach(item => {
        let widthPercent = (item.kg / maxKg) * 100;
        widthPercent = Math.min(100, Math.max(0, widthPercent));
        const div = document.createElement('div');
        div.className = 'comp-item';
        const colorSpan = document.createElement('div');
        colorSpan.className = 'comp-color';
        colorSpan.style.backgroundColor = item.color;
        const labelSpan = document.createElement('div');
        labelSpan.className = 'comp-label';
        labelSpan.innerText = item.name;
        const barBg = document.createElement('div');
        barBg.className = 'comp-bar-bg';
        const barFill = document.createElement('div');
        barFill.className = 'comp-bar';
        barFill.style.backgroundColor = item.color;
        barFill.style.width = `${widthPercent}%`;
        barFill.innerText = `${item.kg.toFixed(1)} кг`;
        barBg.appendChild(barFill);
        div.appendChild(colorSpan);
        div.appendChild(labelSpan);
        div.appendChild(barBg);
        compContainer.appendChild(div);
    });

    // Генерация совета
    let advice = "";
    if (perPerson < 3) advice = `🌟 Потрясающе! ${perPerson.toFixed(1)} кг/чел — очень мало. Вы пример для подражания!`;
    else if (perPerson < 5) advice = `👍 Отлично! ${perPerson.toFixed(1)} кг/чел. Чтобы опуститься ниже 3 кг, откажитесь от упаковки и компостируйте.`;
    else if (perPerson < 7) advice = `📊 Средний показатель (${perPerson.toFixed(1)} кг/чел). Сортируйте бумагу и пластик — уменьшите вес на 20-30%.`;
    else if (perPerson < 10) advice = `⚠️ Выше среднего (${perPerson.toFixed(1)} кг/чел). Планируйте меню, покупайте без лишней упаковки.`;
    else if (perPerson < 15) advice = `🚨 Много мусора! ${perPerson.toFixed(1)} кг/чел. Откажитесь от бутилированной воды, используйте многоразовые сумки.`;
    else advice = `🔴 Критический уровень! ${perPerson.toFixed(1)} кг/чел. Немедленно сортируйте, компостируйте, сокращайте упаковку.`;

    if (food > 3 && perPerson > 5) advice += ` 🍎 Пищевые отходы: ${food.toFixed(1)} кг. Компостируйте или замораживайте остатки.`;
    if (plastic > 2 && perPerson > 5) advice += ` 🥤 Пластик: ${plastic.toFixed(1)} кг. Используйте многоразовую бутылку и сумку.`;
    if (paper > 2.5) advice += ` 📦 Бумаги много (${paper.toFixed(1)} кг) — сдавайте макулатуру!`;
    if (danger > 0.2) advice += ` ⚠️ Опасных отходов ${danger.toFixed(1)} кг — батарейки и лампы только в эко-боксы!`;
    if (glassmetal > 3) advice += ` 🥫 Стекло и металл (${glassmetal.toFixed(1)} кг) — мойте и сдавайте.`;
    if (other > 3) advice += ` 🛠️ Прочих отходов много (${other.toFixed(1)} кг) — ремонтируйте вещи.`;

    document.getElementById('dynamicTip').innerHTML = advice;
}

function onFamilyChange() {
    if (currentMode === 'research') updateResearch();
    else updateManual();
}
function onManualInputChange() {
    if (currentMode === 'manual') updateManual();
}
function resetToExample() {
    setMode('research');
    familyInput.value = 4;
    updateResearch();
}

familyInput.addEventListener('input', onFamilyChange);
foodInput.addEventListener('input', onManualInputChange);
paperInput.addEventListener('input', onManualInputChange);
plasticInput.addEventListener('input', onManualInputChange);
glassmetalInput.addEventListener('input', onManualInputChange);
dangerInput.addEventListener('input', onManualInputChange);
otherInput.addEventListener('input', onManualInputChange);
resetBtn.addEventListener('click', resetToExample);
modeResearchDiv.addEventListener('click', () => setMode('research'));
modeManualDiv.addEventListener('click', () => setMode('manual'));

// Навигация по страницам
const navBtns = document.querySelectorAll('.nav-btn');
const pages = document.querySelectorAll('.page');
navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const pageId = btn.getAttribute('data-page');
        navBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        pages.forEach(page => page.classList.remove('active-page'));
        document.getElementById(`${pageId}-page`).classList.add('active-page');
    });
});

// Инициализация
setMode('research');
updateResearch();