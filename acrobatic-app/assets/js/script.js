function preventSubmit(form, handler) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        handler(e);
    });
}
// Router
const sections = ['home', 'math', 'science', 'time', 'everyday'];
const navButtons = document.querySelectorAll('.sidebar [data-route]');

function showSection(id) {
    sections.forEach(s => {
        const el = document.getElementById(s);
        if (!el) return;
        el.classList.toggle('active', s === id);
        if (s === id) el.classList.add('fadeUp');
    });
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}
navButtons.forEach(btn => {
    btn.addEventListener('click', () => showSection(btn.dataset.route));
});
// Home quick actions
const globalSearch = document.getElementById('globalSearch');
const clearSearch = document.getElementById('clearSearch');
document.querySelectorAll('.tag').forEach(t => {
    t.addEventListener('click', () => {
        const id = t.dataset.jump;
        const group = (['calculator', 'currency', 'aspect', 'unit', 'datecalc'].includes(id)) ? 'math' :
            (['ptable', 'planets', 'physics'].includes(id)) ? 'science' :
                (['clock', 'worldclock', 'countdown', 'weather', 'moon'].includes(id)) ? 'time' :
                    'everyday';
        showSection(group);
        const card = document.getElementById(id);
        if (card) card.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});
globalSearch.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const q = (globalSearch.value || '').toLowerCase();
        const map = {
            'calc': 'calculator',
            'calculator': 'calculator',
            'currency': 'currency',
            'money': 'currency',
            'exchange': 'currency',
            'aspect': 'aspect',
            'ratio': 'aspect',
            'unit': 'unit',
            'convert': 'unit',
            'date': 'datecalc',
            'days': 'datecalc',
            'periodic': 'ptable',
            'elements': 'ptable',
            'planet': 'planets',
            'planets': 'planets',
            'physics': 'physics',
            'formula': 'physics',
            'clock': 'clock',
            'world': 'worldclock',
            'countdown': 'countdown',
            'stopwatch': 'countdown',
            'weather': 'weather',
            'moon': 'moon',
            'todo': 'todo',
            'password': 'password',
            'qr': 'qr',
            'text': 'texttools'
        };
        const id = map[q] || Object.keys(map).find(k => q.includes(k)) && map[Object.keys(map).find(k => q.includes(k))];
        if (id) {
            document.querySelector(`.tag[data-jump="${id}"]`)?.click();
        }
    }
});
clearSearch.addEventListener('click', () => {
    globalSearch.value = '';
    globalSearch.focus();
});
// Tool links + toast
const toolToast = document.getElementById('toolToast');
const toolToastName = document.getElementById('toolToastName');
const toastClose = document.getElementById('toastClose');

function showToast(name) {
    toolToastName.textContent = name;
    toolToast.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toolToast.classList.remove('show'), 2000);
}
toastClose.addEventListener('click', () => toolToast.classList.remove('show'));
document.querySelectorAll('.tool-link').forEach(btn => {
    btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-tool');
        const group = (['calculator', 'currency', 'aspect', 'unit', 'datecalc'].includes(id)) ? 'math' :
            (['ptable', 'planets', 'physics'].includes(id)) ? 'science' :
                (['clock', 'worldclock', 'countdown', 'weather', 'moon'].includes(id)) ? 'time' :
                    'everyday';
        showSection(group);
        showToast(btn.textContent.trim());
        document.getElementById(id)?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});
// Theme toggle
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('theme-dark');
});
// ============ Math & Numbers ============
// Calculator
const calcForm = document.getElementById('calcForm');
const calcInput = document.getElementById('calcInput');
const calcResult = document.getElementById('calcResult');
preventSubmit(calcForm, () => {
    const raw = (calcInput.value || '').trim();
    if (!raw) return;
    const safe = raw.replace(/[^0-9+\-*/().%\s]/g, '');
    try {
        const val = Function('"use strict";return(' + safe + ')')();
        calcResult.textContent = '= ' + val;
        calcResult.style.display = 'block';
        calcResult.classList.add('fadeUp');
        setTimeout(() => calcResult.classList.remove('fadeUp'), 300);
    } catch {
        calcResult.textContent = 'Invalid expression';
        calcResult.style.display = 'block';
    }
});
// Currency Converter (live API + full list)
const currencyForm = document.getElementById('currencyForm');
const curAmount = document.getElementById('curAmount');
const curFrom = document.getElementById('curFrom');
const curTo = document.getElementById('curTo');
const curResult = document.getElementById('curResult');
const API = 'https://api.exchangerate-api.com/v4/latest/USD';
const currencySymbols = {
    USD: "$",
    AED: "د.إ",
    ARS: "$",
    AUD: "$",
    BGN: "лв",
    BRL: "R$",
    BSD: "$",
    CAD: "$",
    CHF: "CHF",
    CLP: "$",
    CNY: "¥",
    COP: "$",
    CZK: "Kč",
    DKK: "kr",
    DOP: "$",
    EGP: "£",
    EUR: "€",
    FJD: "$",
    GBP: "£",
    GTQ: "Q",
    HKD: "$",
    HRK: "kn",
    HUF: "Ft",
    IDR: "Rp",
    ILS: "₪",
    INR: "₹",
    ISK: "kr",
    JPY: "¥",
    KRW: "₩",
    KZT: "₸",
    MVR: "Rf",
    MXN: "$",
    MYR: "RM",
    NGN: "₦",
    NOK: "kr",
    NZD: "$",
    PAB: "฿",
    PEN: "S/",
    PHP: "₱",
    PKR: "₨",
    PLN: "zł",
    PYG: "₲",
    RON: "lei",
    RUB: "₽",
    SAR: "﷼",
    SEK: "kr",
    SGD: "$",
    THB: "฿",
    TRY: "₺",
    TWD: "NT$",
    UAH: "₴",
    UYU: "$",
    ZAR: "R"
};
let ratesData = null;
async function loadRatesAndPopulate() {
    try {
        const res = await fetch(API);
        if (!res.ok) throw new Error('Network');
        const data = await res.json();
        ratesData = data;
        const keys = Object.keys(data.rates).sort();
        const common = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CNY', 'INR'];
        const all = [...new Set([...common, ...keys])];
        const setOpts = (sel) => {
            sel.innerHTML = all.map(k => `<option value="${k}">${k}</option>`).join('');
        };
        setOpts(curFrom);
        setOpts(curTo);
        curFrom.value = 'USD';
        curTo.value = 'EUR';
    } catch (e) {
        const fallback = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD'];
        curFrom.innerHTML = fallback.map(k => `<option>${k}</option>`).join('');
        curTo.innerHTML = fallback.map(k => `<option>${k}</option>`).join('');
    }
}
loadRatesAndPopulate();
preventSubmit(currencyForm, async () => {
    const amt = parseFloat(curAmount.value);
    if (isNaN(amt)) return;
    const from = curFrom.value;
    const to = curTo.value;
    curResult.style.display = 'block';
    curResult.textContent = 'Converting…';
    try {
        if (!ratesData) {
            const res = await fetch(API);
            if (!res.ok) throw new Error('Network error');
            ratesData = await res.json();
        }
        const fromRate = ratesData.rates[from];
        const toRate = ratesData.rates[to];
        if (!fromRate || !toRate) throw new Error('Unsupported currency');
        const convertedAmount = ((toRate / fromRate) * amt).toFixed(2);
        const symbol = currencySymbols[to] || '';
        const formatted = Number(convertedAmount).toLocaleString('en-GB').replace(/,/g, ' ');
        curResult.textContent = `${amt.toFixed(2)} ${from} → ${symbol} ${formatted} ${to}`;
        curResult.classList.add('fadeUp');
        setTimeout(() => curResult.classList.remove('fadeUp'), 300);
    } catch (err) {
        curResult.textContent = 'Conversion unavailable. Please try again.';
    }
});
// Aspect Ratio
const aspectForm = document.getElementById('aspectForm');
const arWidth = document.getElementById('arWidth');
const arHeight = document.getElementById('arHeight');
const arLock = document.getElementById('arLock');
const arTarget = document.getElementById('arTarget');
const arResult = document.getElementById('arResult');
preventSubmit(aspectForm, () => {
    const w = parseFloat(arWidth.value),
        h = parseFloat(arHeight.value),
        t = parseFloat(arTarget.value);
    if ([w, h, t].some(isNaN) || w <= 0 || h <= 0 || t <= 0) return;
    let nw = w,
        nh = h;
    if (arLock.value === 'width') {
        nh = Math.round((h / w) * t);
        nw = t;
    } else {
        nw = Math.round((w / h) * t);
        nh = t;
    }
    arResult.textContent = `New size: ${nw} × ${nh} (ratio ${(w / h).toFixed(3)})`;
});
// Unit Converter
const unitForm = document.getElementById('unitForm');
const unitCat = document.getElementById('unitCat');
const unitFrom = document.getElementById('unitFrom');
const unitTo = document.getElementById('unitTo');
const unitVal = document.getElementById('unitVal');
const unitResult = document.getElementById('unitResult');
const unitOptions = {
    length: ['m', 'km', 'ft', 'mi'],
    weight: ['g', 'kg', 'lb', 'oz'],
    temp: ['°C', '°F', 'K']
};

function fillUnits() {
    const opts = unitOptions[unitCat.value];
    unitFrom.innerHTML = opts.map(u => `<option>${u}</option>`).join('');
    unitTo.innerHTML = opts.map(u => `<option>${u}</option>`).join('');
    unitTo.selectedIndex = 1;
}
unitCat.addEventListener('change', () => {
    fillUnits();
    const tempFormulas = document.getElementById('tempFormulas');
    tempFormulas.style.display = unitCat.value === 'temp' ? 'block' : 'none';
});
fillUnits();

function convertUnits(cat, from, to, val) {
    if (cat === 'length') {
        const m = {
            m: 1,
            km: 1000,
            ft: 0.3048,
            mi: 1609.34
        };
        return val * (m[from] / m[to]);
    } else if (cat === 'weight') {
        const g = {
            g: 1,
            kg: 1000,
            lb: 453.592,
            oz: 28.3495
        };
        return val * (g[from] / g[to]);
    } else {
        let c;
        if (from === '°C') c = val;
        else if (from === '°F') c = (val - 32) * 5 / 9;
        else c = val - 273.15;
        if (to === '°C') return c;
        if (to === '°F') return c * 9 / 5 + 32;
        return c + 273.15;
    }
}
preventSubmit(unitForm, () => {
    const cat = unitCat.value,
        from = unitFrom.value,
        to = unitTo.value,
        v = parseFloat(unitVal.value);
    if (isNaN(v)) return;
    const out = convertUnits(cat, from, to, v);
    unitResult.textContent = `${v} ${from} → ${out.toFixed(4)} ${to}`;
    unitResult.style.display = 'block';
    unitResult.classList.add('fadeUp');
    setTimeout(() => unitResult.classList.remove('fadeUp'), 300);
});
// Date Calculator
const dateForm = document.getElementById('dateForm');
const dateFrom = document.getElementById('dateFrom');
const dateTo = document.getElementById('dateTo');
const dateDir = document.getElementById('dateDir');
const dateExtra = document.getElementById('dateExtra');
const dateDays = document.getElementById('dateDays');
const dateResult = document.getElementById('dateResult');
dateDir.addEventListener('change', () => {
    dateExtra.style.display = dateDir.value === 'add' ? 'block' : 'none';
});
preventSubmit(dateForm, () => {
    if (dateDir.value === 'diff') {
        if (!dateFrom.value || !dateTo.value) return;
        const d1 = new Date(dateFrom.value),
            d2 = new Date(dateTo.value);
        const diff = Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
        dateResult.textContent = `Difference: ${diff} day(s)`;
    } else {
        if (!dateFrom.value || !dateDays.value) return;
        const d = new Date(dateFrom.value);
        d.setDate(d.getDate() + parseInt(dateDays.value, 10));
        dateResult.textContent = `Resulting date: ${d.toDateString()}`;
    }
});
// ============ Science ============
// Periodic table (complete list 1..118 as cards)
const ptableGrid = document.getElementById('ptableGrid');
const ptSearch = document.getElementById('ptSearch');
const ptFilter = document.getElementById('ptFilter');
const elements = [{
    Z: 1,
    s: 'H',
    n: 'Hydrogen'
}, {
    Z: 2,
    s: 'He',
    n: 'Helium'
}, {
    Z: 3,
    s: 'Li',
    n: 'Lithium'
}, {
    Z: 4,
    s: 'Be',
    n: 'Beryllium'
}, {
    Z: 5,
    s: 'B',
    n: 'Boron'
},
{
    Z: 6,
    s: 'C',
    n: 'Carbon'
}, {
    Z: 7,
    s: 'N',
    n: 'Nitrogen'
}, {
    Z: 8,
    s: 'O',
    n: 'Oxygen'
}, {
    Z: 9,
    s: 'F',
    n: 'Fluorine'
}, {
    Z: 10,
    s: 'Ne',
    n: 'Neon'
},
{
    Z: 11,
    s: 'Na',
    n: 'Sodium'
}, {
    Z: 12,
    s: 'Mg',
    n: 'Magnesium'
}, {
    Z: 13,
    s: 'Al',
    n: 'Aluminium'
}, {
    Z: 14,
    s: 'Si',
    n: 'Silicon'
}, {
    Z: 15,
    s: 'P',
    n: 'Phosphorus'
},
{
    Z: 16,
    s: 'S',
    n: 'Sulfur'
}, {
    Z: 17,
    s: 'Cl',
    n: 'Chlorine'
}, {
    Z: 18,
    s: 'Ar',
    n: 'Argon'
},
{
    Z: 19,
    s: 'K',
    n: 'Potassium'
}, {
    Z: 20,
    s: 'Ca',
    n: 'Calcium'
}, {
    Z: 21,
    s: 'Sc',
    n: 'Scandium'
}, {
    Z: 22,
    s: 'Ti',
    n: 'Titanium'
}, {
    Z: 23,
    s: 'V',
    n: 'Vanadium'
},
{
    Z: 24,
    s: 'Cr',
    n: 'Chromium'
}, {
    Z: 25,
    s: 'Mn',
    n: 'Manganese'
}, {
    Z: 26,
    s: 'Fe',
    n: 'Iron'
}, {
    Z: 27,
    s: 'Co',
    n: 'Cobalt'
}, {
    Z: 28,
    s: 'Ni',
    n: 'Nickel'
},
{
    Z: 29,
    s: 'Cu',
    n: 'Copper'
}, {
    Z: 30,
    s: 'Zn',
    n: 'Zinc'
}, {
    Z: 31,
    s: 'Ga',
    n: 'Gallium'
}, {
    Z: 32,
    s: 'Ge',
    n: 'Germanium'
}, {
    Z: 33,
    s: 'As',
    n: 'Arsenic'
},
{
    Z: 34,
    s: 'Se',
    n: 'Selenium'
}, {
    Z: 35,
    s: 'Br',
    n: 'Bromine'
}, {
    Z: 36,
    s: 'Kr',
    n: 'Krypton'
},
{
    Z: 37,
    s: 'Rb',
    n: 'Rubidium'
}, {
    Z: 38,
    s: 'Sr',
    n: 'Strontium'
}, {
    Z: 39,
    s: 'Y',
    n: 'Yttrium'
}, {
    Z: 40,
    s: 'Zr',
    n: 'Zirconium'
}, {
    Z: 41,
    s: 'Nb',
    n: 'Niobium'
},
{
    Z: 42,
    s: 'Mo',
    n: 'Molybdenum'
}, {
    Z: 43,
    s: 'Tc',
    n: 'Technetium'
}, {
    Z: 44,
    s: 'Ru',
    n: 'Ruthenium'
}, {
    Z: 45,
    s: 'Rh',
    n: 'Rhodium'
}, {
    Z: 46,
    s: 'Pd',
    n: 'Palladium'
},
{
    Z: 47,
    s: 'Ag',
    n: 'Silver'
}, {
    Z: 48,
    s: 'Cd',
    n: 'Cadmium'
}, {
    Z: 49,
    s: 'In',
    n: 'Indium'
}, {
    Z: 50,
    s: 'Sn',
    n: 'Tin'
},
{
    Z: 51,
    s: 'Sb',
    n: 'Antimony'
}, {
    Z: 52,
    s: 'Te',
    n: 'Tellurium'
}, {
    Z: 53,
    s: 'I',
    n: 'Iodine'
}, {
    Z: 54,
    s: 'Xe',
    n: 'Xenon'
},
{
    Z: 55,
    s: 'Cs',
    n: 'Cesium'
}, {
    Z: 56,
    s: 'Ba',
    n: 'Barium'
}, {
    Z: 57,
    s: 'La',
    n: 'Lanthanum'
}, {
    Z: 58,
    s: 'Ce',
    n: 'Cerium'
}, {
    Z: 59,
    s: 'Pr',
    n: 'Praseodymium'
},
{
    Z: 60,
    s: 'Nd',
    n: 'Neodymium'
}, {
    Z: 61,
    s: 'Pm',
    n: 'Promethium'
}, {
    Z: 62,
    s: 'Sm',
    n: 'Samarium'
}, {
    Z: 63,
    s: 'Eu',
    n: 'Europium'
}, {
    Z: 64,
    s: 'Gd',
    n: 'Gadolinium'
},
{
    Z: 65,
    s: 'Tb',
    n: 'Terbium'
}, {
    Z: 66,
    s: 'Dy',
    n: 'Dysprosium'
}, {
    Z: 67,
    s: 'Ho',
    n: 'Holmium'
}, {
    Z: 68,
    s: 'Er',
    n: 'Erbium'
}, {
    Z: 69,
    s: 'Tm',
    n: 'Thulium'
},
{
    Z: 70,
    s: 'Yb',
    n: 'Ytterbium'
}, {
    Z: 71,
    s: 'Lu',
    n: 'Lutetium'
}, {
    Z: 72,
    s: 'Hf',
    n: 'Hafnium'
}, {
    Z: 73,
    s: 'Ta',
    n: 'Tantalum'
}, {
    Z: 74,
    s: 'W',
    n: 'Tungsten'
},
{
    Z: 75,
    s: 'Re',
    n: 'Rhenium'
}, {
    Z: 76,
    s: 'Os',
    n: 'Osmium'
}, {
    Z: 77,
    s: 'Ir',
    n: 'Iridium'
}, {
    Z: 78,
    s: 'Pt',
    n: 'Platinum'
}, {
    Z: 79,
    s: 'Au',
    n: 'Gold'
},
{
    Z: 80,
    s: 'Hg',
    n: 'Mercury'
}, {
    Z: 81,
    s: 'Tl',
    n: 'Thallium'
}, {
    Z: 82,
    s: 'Pb',
    n: 'Lead'
}, {
    Z: 83,
    s: 'Bi',
    n: 'Bismuth'
}, {
    Z: 84,
    s: 'Po',
    n: 'Polonium'
},
{
    Z: 85,
    s: 'At',
    n: 'Astatine'
}, {
    Z: 86,
    s: 'Rn',
    n: 'Radon'
}, {
    Z: 87,
    s: 'Fr',
    n: 'Francium'
}, {
    Z: 88,
    s: 'Ra',
    n: 'Radium'
}, {
    Z: 89,
    s: 'Ac',
    n: 'Actinium'
},
{
    Z: 90,
    s: 'Th',
    n: 'Thorium'
}, {
    Z: 91,
    s: 'Pa',
    n: 'Protactinium'
}, {
    Z: 92,
    s: 'U',
    n: 'Uranium'
}, {
    Z: 93,
    s: 'Np',
    n: 'Neptunium'
}, {
    Z: 94,
    s: 'Pu',
    n: 'Plutonium'
},
{
    Z: 95,
    s: 'Am',
    n: 'Americium'
}, {
    Z: 96,
    s: 'Cm',
    n: 'Curium'
}, {
    Z: 97,
    s: 'Bk',
    n: 'Berkelium'
}, {
    Z: 98,
    s: 'Cf',
    n: 'Californium'
}, {
    Z: 99,
    s: 'Es',
    n: 'Einsteinium'
},
{
    Z: 100,
    s: 'Fm',
    n: 'Fermium'
}, {
    Z: 101,
    s: 'Md',
    n: 'Mendelevium'
}, {
    Z: 102,
    s: 'No',
    n: 'Nobelium'
}, {
    Z: 103,
    s: 'Lr',
    n: 'Lawrencium'
},
{
    Z: 104,
    s: 'Rf',
    n: 'Rutherfordium'
}, {
    Z: 105,
    s: 'Db',
    n: 'Dubnium'
}, {
    Z: 106,
    s: 'Sg',
    n: 'Seaborgium'
}, {
    Z: 107,
    s: 'Bh',
    n: 'Bohrium'
}, {
    Z: 108,
    s: 'Hs',
    n: 'Hassium'
},
{
    Z: 109,
    s: 'Mt',
    n: 'Meitnerium'
}, {
    Z: 110,
    s: 'Ds',
    n: 'Darmstadtium'
}, {
    Z: 111,
    s: 'Rg',
    n: 'Roentgenium'
}, {
    Z: 112,
    s: 'Cn',
    n: 'Copernicium'
},
{
    Z: 113,
    s: 'Nh',
    n: 'Nihonium'
}, {
    Z: 114,
    s: 'Fl',
    n: 'Flerovium'
}, {
    Z: 115,
    s: 'Mc',
    n: 'Moscovium'
}, {
    Z: 116,
    s: 'Lv',
    n: 'Livermorium'
},
{
    Z: 117,
    s: 'Ts',
    n: 'Tennessine'
}, {
    Z: 118,
    s: 'Og',
    n: 'Oganesson'
}
];

function renderElements(list) {
    ptableGrid.innerHTML = '';
    list.forEach(el => {
        const card = document.createElement('div');
        card.className = 'soft';
        card.innerHTML = `
    <div class="row-between">
    <div class="mono muted" style="font-size:12px">#${el.Z}</div>
    <div class="center" style="width:40px;height:40px;border-radius:10px;background:var(--brand-soft);color:var(--brand);font-weight:700">${el.s}</div>
    </div>
    <div style="font-weight:600; margin-top:6px">${el.n}</div>
`;
        ptableGrid.appendChild(card);
    });
}

function filterElements() {
    const q = (ptSearch.value || '').toLowerCase().trim();
    const range = ptFilter.value;
    let filtered = elements;
    // Apply range filter
    if (range !== 'all') {
        const [min, max] = range.split('-').map(Number);
        filtered = filtered.filter(e => e.Z >= min && e.Z <= max);
    }
    // Apply search filter
    if (q) {
        filtered = filtered.filter(e =>
            e.n.toLowerCase().includes(q) ||
            e.s.toLowerCase().includes(q) ||
            String(e.Z) === q
        );
    }
    renderElements(filtered);
}
renderElements(elements.slice(0, 20)); // Show first 20 by default
ptFilter.value = '1-20';
ptSearch.addEventListener('input', filterElements);
ptFilter.addEventListener('change', filterElements);
// Planet Viewer (8 planets)
const planetsGroup = document.getElementById('planetsGroup');
const planetSpeed = document.getElementById('planetSpeed');
const planetFocus = document.getElementById('planetFocus');
const planets = [{
    key: 'mercury',
    r: 30,
    size: 3,
    period: 88,
    color: '#10A37F'
},
{
    key: 'venus',
    r: 50,
    size: 5,
    period: 225,
    color: '#10A37F'
},
{
    key: 'earth',
    r: 70,
    size: 5,
    period: 365,
    color: '#10A37F'
},
{
    key: 'mars',
    r: 95,
    size: 4,
    period: 687,
    color: '#10A37F'
},
{
    key: 'jupiter',
    r: 125,
    size: 7,
    period: 4333,
    color: '#10A37F'
},
{
    key: 'saturn',
    r: 160,
    size: 6.5,
    period: 10759,
    color: '#10A37F'
},
{
    key: 'uranus',
    r: 195,
    size: 6,
    period: 30687,
    color: '#10A37F'
},
{
    key: 'neptune',
    r: 230,
    size: 6,
    period: 60190,
    color: '#10A37F'
},
];
const center = {
    x: 320,
    y: 190
};
planets.forEach(p => {
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('r', p.size);
    c.setAttribute('cx', center.x + p.r);
    c.setAttribute('cy', center.y);
    c.setAttribute('fill', p.color);
    c.dataset.key = p.key;
    planetsGroup.appendChild(c);
    p.node = c;
    p.angle = Math.random() * 360;
});
let lastT = performance.now();

function tick(t) {
    const dt = (t - lastT) / 1000 * 60;
    lastT = t;
    const speedScale = (parseInt(planetSpeed.value, 10) + 1) / 50;
    planets.forEach(p => {
        const focus = planetFocus.value;
        const visible = focus === 'all' || focus === p.key;
        p.node.style.opacity = visible ? '1' : '0.15';
        p.angle += (dt * (360 / p.period)) * speedScale;
        const rad = p.angle * Math.PI / 180;
        const x = center.x + Math.cos(rad) * p.r;
        const y = center.y + Math.sin(rad) * p.r;
        p.node.setAttribute('cx', x);
        p.node.setAttribute('cy', y);
    });
    requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
// Physics
const velForm = document.getElementById('velForm');
const velS = document.getElementById('velS');
const velT = document.getElementById('velT');
const velOut = document.getElementById('velOut');
preventSubmit(velForm, () => {
    const s = parseFloat(velS.value),
        t = parseFloat(velT.value);
    if (isNaN(s) || isNaN(t) || t === 0) return;
    const v = s / t;
    velOut.textContent = `v = ${v.toFixed(3)} m/s`;
    velOut.style.display = 'block';
});
const forceForm = document.getElementById('forceForm');
const forceM = document.getElementById('forceM');
const forceA = document.getElementById('forceA');
const forceOut = document.getElementById('forceOut');
preventSubmit(forceForm, () => {
    const m = parseFloat(forceM.value),
        a = parseFloat(forceA.value);
    if (isNaN(m) || isNaN(a)) return;
    const F = m * a;
    forceOut.textContent = `F = ${F.toFixed(3)} N`;
    forceOut.style.display = 'block';
});
const keForm = document.getElementById('keForm');
const keM = document.getElementById('keM');
const keV = document.getElementById('keV');
const keOut = document.getElementById('keOut');
preventSubmit(keForm, () => {
    const m = parseFloat(keM.value),
        v = parseFloat(keV.value);
    if (isNaN(m) || isNaN(v)) return;
    const ke = 0.5 * m * v * v;
    keOut.textContent = `KE = ${ke.toFixed(3)} J`;
    keOut.style.display = 'block';
});
const peForm = document.getElementById('peForm');
const peM = document.getElementById('peM');
const peH = document.getElementById('peH');
const peG = document.getElementById('peG');
const peOut = document.getElementById('peOut');
preventSubmit(peForm, () => {
    const m = parseFloat(peM.value),
        h = parseFloat(peH.value),
        g = parseFloat(peG.value);
    if (isNaN(m) || isNaN(h) || isNaN(g)) return;
    const pe = m * g * h;
    peOut.textContent = `PE = ${pe.toFixed(3)} J`;
    peOut.style.display = 'block';
});
const pForm = document.getElementById('pForm');
const pM = document.getElementById('pM');
const pV = document.getElementById('pV');
const pOut = document.getElementById('pOut');
preventSubmit(pForm, () => {
    const m = parseFloat(pM.value),
        v = parseFloat(pV.value);
    if (isNaN(m) || isNaN(v)) return;
    const p = m * v;
    pOut.textContent = `p = ${p.toFixed(3)} kg·m/s`;
    pOut.style.display = 'block';
});
const ohmForm = document.getElementById('ohmForm');
const ohmI = document.getElementById('ohmI');
const ohmR = document.getElementById('ohmR');
const ohmOut = document.getElementById('ohmOut');
preventSubmit(ohmForm, () => {
    const I = parseFloat(ohmI.value),
        R = parseFloat(ohmR.value);
    if (isNaN(I) || isNaN(R)) return;
    const V = I * R;
    ohmOut.textContent = `V = ${V.toFixed(3)} V`;
    ohmOut.style.display = 'block';
});
// ============ Time ============
// Local clock
const localClock = document.getElementById('localClock');
const localDate = document.getElementById('localDate');

function pad(n) {
    return String(n).padStart(2, '0')
}

function updateLocalTime() {
    const d = new Date();
    localClock.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    localDate.textContent = d.toDateString();
}
setInterval(updateLocalTime, 1000);
updateLocalTime();
// World clock
const nyTime = document.getElementById('nyTime');
const ldnTime = document.getElementById('ldnTime');
const tkyTime = document.getElementById('tkyTime');

function updateWorld() {
    const d = new Date();
    nyTime.textContent = d.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/New_York'
    });
    ldnTime.textContent = d.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/London'
    });
    tkyTime.textContent = d.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Tokyo'
    });
}
setInterval(updateWorld, 1000);
updateWorld();
// Countdown
const cdForm = document.getElementById('cdForm');
const cdSeconds = document.getElementById('cdSeconds');
const cdDisplay = document.getElementById('cdDisplay');
const cdPulse = document.getElementById('cdPulse');
const cdReset = document.getElementById('cdReset');
let cdTimer = null,
    cdRemaining = 0;

function fmtSec(s) {
    const m = Math.floor(s / 60),
        r = s % 60;
    return `${pad(m)}:${pad(r)}`
}
preventSubmit(cdForm, () => {
    const secs = parseInt(cdSeconds.value, 10);
    if (isNaN(secs) || secs <= 0) return;
    cdRemaining = secs;
    cdDisplay.textContent = fmtSec(cdRemaining);
    cdPulse.style.display = 'block';
    if (cdTimer) clearInterval(cdTimer);
    cdTimer = setInterval(() => {
        cdRemaining--;
        if (cdRemaining <= 0) {
            cdRemaining = 0;
            clearInterval(cdTimer);
            cdPulse.style.display = 'none';
        }
        cdDisplay.textContent = fmtSec(cdRemaining);
    }, 1000);
});
cdReset.addEventListener('click', () => {
    if (cdTimer) clearInterval(cdTimer);
    cdTimer = null;
    cdRemaining = 0;
    cdDisplay.textContent = '00:00';
    cdPulse.style.display = 'none';
});
// Stopwatch
const swDisplay = document.getElementById('swDisplay');
const swStart = document.getElementById('swStart');
const swLap = document.getElementById('swLap');
const swReset = document.getElementById('swReset');
const swLaps = document.getElementById('swLaps');
let swRunning = false,
    swStartTime = 0,
    swElapsed = 0,
    swInt = null;

function renderSW() {
    const ms = swElapsed;
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centi = Math.floor((ms % 1000) / 10);
    swDisplay.textContent = `${pad(minutes)}:${pad(seconds)}.${pad(centi)}`;
}
swStart.addEventListener('click', () => {
    if (!swRunning) {
        swRunning = true;
        swStart.textContent = 'Pause';
        swStartTime = performance.now() - swElapsed;
        swInt = setInterval(() => {
            swElapsed = performance.now() - swStartTime;
            renderSW();
        }, 30);
    } else {
        swRunning = false;
        swStart.textContent = 'Start';
        clearInterval(swInt);
    }
});
swLap.addEventListener('click', () => {
    const div = document.createElement('div');
    div.textContent = `Lap: ${swDisplay.textContent}`;
    swLaps.prepend(div);
});
swReset.addEventListener('click', () => {
    swRunning = false;
    clearInterval(swInt);
    swElapsed = 0;
    renderSW();
    swStart.textContent = 'Start';
    swLaps.innerHTML = '';
});
renderSW();
// Weather (Live API)
const apiKey = "3b65f1bc7b0de2d7df867b6f020ae01f";
const aUrl = "https://api.openweathermap.org/data/2.5/weather?&q=";
const fUrl = "https://api.openweathermap.org/data/2.5/forecast?&q=";
const weatherForm = document.getElementById('weatherForm');
const weatherCity = document.getElementById('weatherCity');
const weatherCard = document.getElementById('weatherCard');
let weatherUnit = 'celsius';
let kelvinTemp = null;
const formatTemp = (k, u) => {
    if (!k) return "";
    switch (u) {
        case "fahrenheit":
            return Math.round((k - 273.15) * 9 / 5 + 32) + "°F";
        case "kelvin":
            return Math.round(k) + "K";
        default:
            return Math.round(k - 273.15) + "°C";
    }
};
const getWeatherIcon = (condition) => {
    switch (condition) {
        case "Clouds":
            return "☁️";
        case "Clear":
            return "☀️";
        case "Rain":
        case "Drizzle":
            return "🌧️";
        case "Mist":
        case "Fog":
        case "Haze":
            return "🌫️";
        case "Snow":
            return "❄️";
        case "Thunderstorm":
            return "⛈️";
        default:
            return "🌤️";
    }
};
const fetchWeather = async (city) => {
    if (!city) {
        weatherCard.innerHTML = `
    <div style="color: #ef4444; font-weight: 600">Please enter a city name</div>
`;
        return;
    }
    weatherCard.innerHTML = `
<div style="color: var(--brand); font-weight: 600">Loading weather data...</div>
`;
    try {
        const response = await fetch(aUrl + city + `&appid=${apiKey}`);
        if (response.status === 404) {
            weatherCard.innerHTML = `
    <div style="color: #ef4444; font-weight: 600">City not found. Please check the spelling.</div>
    `;
            return;
        }
        const data = await response.json();
        kelvinTemp = data.main.temp;
        const temp = formatTemp(kelvinTemp, weatherUnit);
        const feelsLike = formatTemp(data.main.feels_like, weatherUnit);
        const humidity = data.main.humidity;
        const windSpeed = Math.round(data.wind.speed * 3.6);
        const pressure = data.main.pressure;
        const visibility = (data.visibility / 1000).toFixed(1);
        const condition = data.weather[0].main;
        const description = data.weather[0].description;
        const icon = getWeatherIcon(condition);
        weatherCard.innerHTML = `
    <div>
    <div style="font-size: 22px; font-weight: 600">${temp} • ${description} in ${data.name}</div>
    <div class="muted" style="font-size: 13px">Feels like ${feelsLike} • ${windSpeed} km/h • ${humidity}% RH • ${pressure} hPa • ${visibility} km visibility</div>
    </div>
    <div style="font-size: 28px">${icon}</div>
`;
        weatherCard.classList.add('fadeUp');
        setTimeout(() => weatherCard.classList.remove('fadeUp'), 300);
    } catch (error) {
        weatherCard.innerHTML = `
    <div style="color: #ef4444; font-weight: 600">Unable to fetch weather data. Please try again.</div>
`;
    }
};
preventSubmit(weatherForm, () => {
    fetchWeather(weatherCity.value.trim());
});
// Moon Phase
const moonForm = document.getElementById('moonForm');
const moonDate = document.getElementById('moonDate');
const moonName = document.getElementById('moonName');
const moonEmoji = document.getElementById('moonEmoji');

function moonPhase(date) {
    const lp = 2551443;
    const ref = new Date(Date.UTC(1970, 0, 7, 20, 35, 0));
    const phase = ((date - ref) / 1000) % lp / lp;
    if (phase < 0.03) return ['New Moon', '🌑'];
    if (phase < 0.22) return ['Waxing Crescent', '🌒'];
    if (phase < 0.28) return ['First Quarter', '🌓'];
    if (phase < 0.47) return ['Waxing Gibbous', '🌔'];
    if (phase < 0.53) return ['Full Moon', '🌕'];
    if (phase < 0.72) return ['Waning Gibbous', '🌖'];
    if (phase < 0.78) return ['Last Quarter', '🌗'];
    if (phase < 0.97) return ['Waning Crescent', '🌘'];
    return ['New Moon', '🌑'];
}
preventSubmit(moonForm, () => {
    const d = moonDate.value ? new Date(moonDate.value) : new Date();
    const [name, emoji] = moonPhase(d);
    moonName.textContent = name;
    moonEmoji.textContent = emoji;
});
// ============ Everyday ============
// To-Do
const todoForm = document.getElementById('todoForm');
const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');
let todos = [];
preventSubmit(todoForm, () => {
    const v = (todoInput.value || '').trim();
    if (!v) return;
    todos.push({
        text: v,
        done: false,
        id: Date.now()
    });
    todoInput.value = '';
    renderTodos();
});

function renderTodos() {
    todoList.innerHTML = '';
    todos.forEach((t, idx) => {
        const item = document.createElement('div');
        item.style.border = '1px solid var(--border)';
        item.style.borderRadius = '12px';
        item.style.padding = '10px';
        item.style.display = 'flex';
        item.style.alignItems = 'center';
        item.style.gap = '10px';
        const mark = document.createElement('button');
        mark.className = 'btn';
        mark.style.width = '36px';
        mark.style.height = '36px';
        mark.style.padding = '0';
        mark.innerHTML = t.done ?
            '<span class="material-symbols-outlined" style="color: var(--brand)">check_small</span>' :
            '<span class="material-symbols-outlined">crop_square</span>';
        const text = document.createElement('div');
        text.style.flex = '1';
        text.textContent = t.text;
        if (t.done) {
            text.style.textDecoration = 'line-through';
            text.classList.add('muted');
        }
        const del = document.createElement('button');
        del.className = 'btn btn-ghost';
        del.textContent = 'Delete';
        mark.addEventListener('click', () => {
            t.done = !t.done;
            renderTodos();
        });
        del.addEventListener('click', () => {
            todos.splice(idx, 1);
            renderTodos();
        });
        item.appendChild(mark);
        item.appendChild(text);
        item.appendChild(del);
        todoList.appendChild(item);
    });
}
// Passwords
const passForm = document.getElementById('passForm');
const passLen = document.getElementById('passLen');
const passUpper = document.getElementById('passUpper');
const passLower = document.getElementById('passLower');
const passNum = document.getElementById('passNum');
const passSym = document.getElementById('passSym');
const passOut = document.getElementById('passOut');
const passCopy = document.getElementById('passCopy');

function genPassword(len, sets) {
    let pool = '';
    if (sets.upper) pool += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (sets.lower) pool += 'abcdefghijklmnopqrstuvwxyz';
    if (sets.num) pool += '0123456789';
    if (sets.sym) pool += '!@#$%^&*()-_=+[]{};:,.<>/?';
    if (!pool) return '';
    let out = '';
    const cryptoOK = window.crypto && crypto.getRandomValues;
    for (let i = 0; i < len; i++) {
        let idx;
        if (cryptoOK) {
            const arr = new Uint32Array(1);
            crypto.getRandomValues(arr);
            idx = arr[0] % pool.length;
        } else {
            idx = Math.floor(Math.random() * pool.length);
        }
        out += pool[idx];
    }
    return out;
}
preventSubmit(passForm, () => {
    const len = Math.max(4, Math.min(64, parseInt(passLen.value, 10) || 16));
    const pwd = genPassword(len, {
        upper: passUpper.checked,
        lower: passLower.checked,
        num: passNum.checked,
        sym: passSym.checked
    });
    passOut.value = pwd;
    passOut.classList.add('fadeUp');
    setTimeout(() => passOut.classList.remove('fadeUp'), 280);
});
passCopy.addEventListener('click', async () => {
    if (!passOut.value) return;
    try {
        await navigator.clipboard.writeText(passOut.value);
        passCopy.textContent = 'Copied!';
        setTimeout(() => passCopy.textContent = 'Copy', 1200);
    } catch {
        passCopy.textContent = 'Select & Copy';
        setTimeout(() => passCopy.textContent = 'Copy', 1200);
    }
});
// QR
const qrForm = document.getElementById('qrForm');
const qrText = document.getElementById('qrText');
const qrPattern = document.getElementById('qrPattern');

function generateQRPattern(text) {
    const size = 16;
    const cellSize = 160 / size;
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
        hash = ((hash << 5) - hash + text.charCodeAt(i)) & 0xffffffff;
    }
    qrPattern.innerHTML = '';
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const seed = hash + x * 31 + y * 17;
            if ((seed & 1) || (x < 3 && y < 3) || (x >= size - 3 && y < 3) || (x < 3 && y >= size - 3)) {
                const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                rect.setAttribute('x', x * cellSize);
                rect.setAttribute('y', y * cellSize);
                rect.setAttribute('width', cellSize);
                rect.setAttribute('height', cellSize);
                rect.setAttribute('fill', 'var(--brand)');
                qrPattern.appendChild(rect);
            }
        }
    }
}
preventSubmit(qrForm, () => {
    generateQRPattern(qrText.value || 'Hello, Acrobatic!');
});
generateQRPattern('https://thekzbn.name.ng');
// Text tools
const txtInput = document.getElementById('txtInput');
const txtOutput = document.getElementById('txtOutput');
const txtMeta = document.getElementById('txtMeta');

function updateMeta(str) {
    const words = (str.trim().match(/\S+/g) || []).length;
    const chars = str.length;
    txtMeta.textContent = `Words: ${words} • Characters: ${chars}`;
}

function toTitleCase(s) {
    return s.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

function applyTransform(type) {
    const v = txtInput.value || '';
    let out = v;
    if (type === 'upper') out = v.toUpperCase();
    if (type === 'lower') out = v.toLowerCase();
    if (type === 'title') out = toTitleCase(v);
    if (type === 'reverse') out = v.split('').reverse().join('');
    txtOutput.textContent = out;
    updateMeta(out);
    txtOutput.parentElement.classList.add('fadeUp');
    setTimeout(() => txtOutput.parentElement.classList.remove('fadeUp'), 280);
}
document.querySelectorAll('[data-txt]').forEach(btn => {
    btn.addEventListener('click', () => {
        const type = btn.getAttribute('data-txt');
        if (type === 'copy') {
            const text = txtOutput.textcontent || txtOutput.textContent || '';
            if (!text) return;
            navigator.clipboard.writeText(text);
            btn.textContent = 'Copied!';
            setTimeout(() => btn.textContent = 'Copy Output', 1200);
        } else {
            applyTransform(type);
        }
    });
});
txtInput.addEventListener('input', () => {
    txtOutput.textContent = txtInput.value || '';
    updateMeta(txtInput.value || '');
});
// Initial section
showSection('home');

(function () {
    function c() {
        var b = a.contentDocument || a.contentWindow.document;
        if (b) {
            var d = b.createElement('script');
            d.innerHTML = "window.__CF$cv$params={r:'984a4bcb46bcef4d',t:'MTc1ODgwMDk0NC4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";
            b.getElementsByTagName('head')[0].appendChild(d)
        }
    }
    if (document.body) {
        var a = document.createElement('iframe');
        a.height = 1;
        a.width = 1;
        a.style.position = 'absolute';
        a.style.top = 0;
        a.style.left = 0;
        a.style.border = 'none';
        a.style.visibility = 'hidden';
        document.body.appendChild(a);
        if ('loading' !== document.readyState) c();
        else if (window.addEventListener) document.addEventListener('DOMContentLoaded', c);
        else {
            var e = document.onreadystatechange || function () { };
            document.onreadystatechange = function (b) {
                e(b);
                'loading' !== document.readyState && (document.onreadystatechange = e, c())
            }
        }
    }
})();