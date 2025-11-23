// app.js — Mock tracking generator (TEST-only)
(() => {
  const carrierSelect = document.getElementById('carrierSelect');
  const countEl = document.getElementById('count');
  const generateBtn = document.getElementById('generateBtn');
  const resultsList = document.getElementById('resultsList');
  const resultTpl = document.getElementById('resultItemTpl');
  const timelinePreview = document.getElementById('timelinePreview');
  const exportBtn = document.getElementById('exportBtn');
  const installBtn = document.getElementById('installBtn');
  const emptyHint = document.getElementById('emptyHint');

  // small util: random int
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  // Carrier-ish formats but always prefix with TEST- so nothing is real
  const formats = {
    usps: () => `TEST-USPS${rand(100000000, 999999999)}`,
    ups:  () => `TEST-1Z${rand(100,999)}${rand(100,999)}${rand(1000000,9999999)}`,
    fedex:()=> `TEST-FX${rand(100000000000, 999999999999)}`,
    dhl:  ()=> `TEST-DHL${rand(10000000, 99999999)}`,
    generic: () => `TEST-GEN${Date.now().toString().slice(-6)}${rand(10,99)}`
  };

  function makeMockTimeline(id, carrier) {
    const statuses = [
      'Label created',
      'Picked up by carrier',
      'In transit',
      'Arrived at sorting facility',
      'Out for delivery',
      'Delivered'
    ];
    // produce between 3 and 6 events
    const count = rand(3, statuses.length);
    const now = Date.now();
    const events = [];
    for (let i=0;i<count;i++){
      const ts = new Date(now - (count - i) * rand(2,48) * 3600 * 1000);
      events.push({
        status: statuses[i],
        time: ts.toLocaleString(),
        station: ['Hub A','Sorting Center','Local Depot','Courier Truck'][rand(0,3)],
        carrier
      });
    }
    return events;
  }

  function createResultElement(id, carrier){
    const node = resultTpl.content.cloneNode(true);
    node.querySelector('.id').textContent = id;
    node.querySelector('.carrier').textContent = carrier;
    const li = node.querySelector('li');
    li.dataset.id = id;
    li.dataset.carrier = carrier;
    const copyBtn = li.querySelector('.copyBtn');
    const viewBtn = li.querySelector('.viewBtn');
    const shareBtn = li.querySelector('.shareBtn');

    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(id);
        copyBtn.textContent = 'Copied ✅';
        setTimeout(()=>copyBtn.textContent='Copy',900);
      } catch (e) {
        // fallback: select text in an alert so the user can copy manually
        alert('Copy failed — your browser may block clipboard access. You can select the ID and copy manually.');
      }
    });

    viewBtn.addEventListener('click', () => {
      const timeline = makeMockTimeline(id, carrier);
      renderTimeline(timeline, id);
      // gently scroll into view
      timelinePreview.scrollIntoView({behavior:'smooth', block:'center'});
    });

    shareBtn.addEventListener('click', async () => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: `Mock Tracking ${id}`,
            text: `Mock tracking ID (TEST-only): ${id} — carrier: ${carrier}`,
          });
        } catch(e){
          // user canceled or share failed
        }
      } else {
        // fallback: copy to clipboard
        try {
          await navigator.clipboard.writeText(`Mock tracking ID (TEST-only): ${id} — carrier: ${carrier}`);
          alert('Copied to clipboard (fallback).');
        } catch (err) {
          alert('Sharing not supported. Try copying manually.');
        }
      }
    });

    return li;
  }

  function renderTimeline(events, id){
    timelinePreview.innerHTML = '';
    const header = document.createElement('div');
    header.innerHTML = `<strong>Preview timeline for ${id}</strong>`;
    timelinePreview.appendChild(header);

    events.forEach(e => {
      const row = document.createElement('div');
      row.style.padding = '8px 0';
      row.innerHTML = `<div style="font-weight:700">${e.status}</div>
        <div class="muted" style="font-size:13px">${e.time} — ${e.station} — ${e.carrier}</div>`;
      timelinePreview.appendChild(row);
    });
  }

  function generateMocks(carrierKey, count){
    const arr = [];
    for (let i=0;i<count;i++){
      const make = formats[carrierKey] || formats.generic;
      const id = make();
      arr.push({id, carrier: carrierKey});
    }
    return arr;
  }

  generateBtn.addEventListener('click', () => {
    const carrier = carrierSelect.value;
    const count = Math.max(1, Math.min(50, Number(countEl.value) || 1));
    const items = generateMocks(carrier, count);

    items.forEach(it => {
      const el = createResultElement(it.id, it.carrier);
      resultsList.appendChild(el);
    });

    emptyHint.style.display = resultsList.children.length ? 'none' : '';
  });

  exportBtn.addEventListener('click', () => {
    const rows = [['id','carrier']];
    for (const li of resultsList.children){
      rows.push([li.dataset.id, li.dataset.carrier]);
    }
    if(rows.length <= 1) return alert('No mock IDs to export — generate some first');
    const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], {type: 'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mock-trackings.csv';
    a.click();
    URL.revokeObjectURL(url);
  });

  // Tiny install prompt handling
  let deferredPrompt;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.classList.remove('hidden');
  });
  installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    installBtn.classList.add('hidden');
    deferredPrompt = null;
  });

  // Service Worker registration
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {/*ignore*/});
    });
  }

  // initial state
  emptyHint.style.display = '';
})();