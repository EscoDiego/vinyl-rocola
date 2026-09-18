const records=[["Metallica","Master of Puppets","Rock","1986","#594034"],["Bad Bunny","Un Verano Sin Ti","Pop","2022","#b96d41"],["Duki","Desde el Fin del Mundo","Hip-hop","2021","#5f4c73"],["AC/DC","Back in Black","Rock","1980","#3c3935"],["Nirvana","Nevermind","Rock","1991","#47747d"],["Taylor Swift","Midnights","Pop","2022","#374c77"],["BTS","Map of the Soul","Pop","2020","#7c5076"],["The Weeknd","After Hours","Pop","2020","#a73f38"],["NF","The Search","Rap","2019","#6f6c68"],["Eminem","The Eminem Show","Rap","2002","#9d845b"]].map((item,id)=>({artist:item[0],album:item[1],genre:item[2],year:item[3],color:item[4],id}));let basket=[];const $=id=>document.getElementById(id);function setup(){[...new Set(records.map(r=>r.artist))].forEach(a=>$("artist-filter").add(new Option(a,a)));[...new Set(records.map(r=>r.year))].forEach(y=>$("year-filter").add(new Option(y,y)));renderCatalog()}function renderCatalog(){const q=$("search").value.toLowerCase(),g=$("genre-filter").value,a=$("artist-filter").value,y=$("year-filter").value;const list=records.filter(r=>(!q||(r.artist+" "+r.album).toLowerCase().includes(q))&&(!g||r.genre===g)&&(!a||r.artist===a)&&(!y||r.year===y));$("count").textContent=list.length+" DISCOS DISPONIBLES";$("catalog").innerHTML=list.map(r=>'<article class="card"><div><div class="cover" style="--cover:'+r.color+'">'+r.artist[0]+'</div><div class="artist">'+r.artist+'</div><div class="album">'+r.album+'</div><div class="meta">'+r.genre+' · '+r.year+' · $15 USD</div></div><div class="actions"><button onclick="play('+r.id+')">▶ RÓCOLA</button><button onclick="add('+r.id+')">+ AGREGAR</button><button onclick="reserve('+r.id+')">APARTAR</button></div></article>').join("")||"<p>No hay resultados.</p>"}function play(id){const r=records[id];$("now-playing").textContent=r.album;$("now-artist").textContent=r.artist;$("rocola").scrollIntoView({behavior:"smooth"})}function add(id){if(!basket.includes(id))basket.push(id);updateBasket()}function reserve(id){add(id);alert(records[id].album+" quedó apartado en tu canasta.")}function updateBasket(){$("basket-count").textContent=basket.length;$("basket-items").innerHTML=basket.length?basket.map(id=>'<div class="item"><span>'+records[id].artist+'<br><b>'+records[id].album+'</b></span><span>$15</span></div>').join(""):'<p class="meta">Tu canasta está vacía.</p>';$("total").textContent="$"+basket.length*15}function toggleBasket(){$("basket").classList.toggle("open")}function checkout(){alert(basket.length?"Pedido de demostración: "+basket.length+" vinilo(s), total $"+basket.length*15+" USD y envío gratis. No se realizó ningún cobro.":"Agrega un vinilo para continuar.")}setup();

let ambientContext;
let ambientTimer;
let ambientOn = false;

function toggleAmbient() {
  const button = $("sound-button");

  if (ambientOn) {
    clearInterval(ambientTimer);
    ambientOn = false;
    button.classList.remove("active");
    button.setAttribute("aria-pressed", "false");
    button.textContent = "♫ INDIE ROCK";
    return;
  }

  ambientContext = ambientContext || new (window.AudioContext || window.webkitAudioContext)();
  const progression = [164.81, 196, 220, 146.83];
  let step = 0;

  const hit = (frequency, type, volume, duration) => {
    const oscillator = ambientContext.createOscillator();
    const gain = ambientContext.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, ambientContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(volume, ambientContext.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ambientContext.currentTime + duration);
    oscillator.connect(gain).connect(ambientContext.destination);
    oscillator.start();
    oscillator.stop(ambientContext.currentTime + duration + 0.05);
  };

  const playIndieBar = () => {
    const root = progression[step++ % progression.length];
    hit(root / 2, "triangle", 0.06, 0.52);
    hit(root, "sawtooth", 0.028, 0.23);
    setTimeout(() => hit(root * 1.25, "sawtooth", 0.022, 0.2), 230);
    setTimeout(() => hit(root * 1.5, "sawtooth", 0.018, 0.2), 460);
    setTimeout(() => hit(root, "sine", 0.04, 0.45), 700);
  };

  playIndieBar();
  ambientTimer = setInterval(playIndieBar, 950);
  ambientOn = true;
  button.classList.add("active");
  button.setAttribute("aria-pressed", "true");
  button.textContent = "❚❚ PAUSAR ROCK";
}