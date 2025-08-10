// src/api/handlers/getAdminChatsPage.ts
import { Request, Response } from 'express';

export async function getAdminChatsPage(_req: Request, res: Response) {
    try {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.status(200).send(renderHtml());
    } catch (err) {
        console.error('getAdminChatsPage error:', err);
        res.status(500).send('Failed to render chats page');
    }
}

function renderHtml(): string {
    return `<!doctype html>
<html lang="ru">
<head>
    <meta charset="utf-8" />
    <title>Repliky — Admin Chats</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
        :root {
            --bg: #0b0f14;
            --card: rgba(255,255,255,0.06);
            --card-border: rgba(255,255,255,0.12);
            --text: #e6f0ff;
            --muted: #9cb3d3;
            --accent: #5aa9ff;
        }
        * { box-sizing: border-box; }
        html, body { margin: 0; background: var(--bg); color: var(--text); font: 14px/1.5 Inter, system-ui, Segoe UI, Roboto, sans-serif; }
        header {
            position: sticky; top: 0; z-index: 10;
            backdrop-filter: blur(10px);
            background: linear-gradient(to bottom, rgba(11,15,20,0.9), rgba(11,15,20,0.6));
            border-bottom: 1px solid var(--card-border);
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 16px 20px; }
        h1 { margin: 0; font-size: 20px; letter-spacing: 0.2px; }
        .toolbar { display: flex; gap: 10px; margin-top: 10px; flex-wrap: wrap; }
        .input {
            background: var(--card); color: var(--text);
            border: 1px solid var(--card-border); border-radius: 10px;
            padding: 8px 10px;
        }
        .btn {
            background: var(--card); color: var(--text);
            border: 1px solid var(--card-border); border-radius: 10px;
            padding: 8px 12px; cursor: pointer;
        }
        .btn:hover { border-color: var(--accent); }
        .card {
            background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03));
            border: 1px solid var(--card-border);
            border-radius: 16px;
            padding: 16px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.35);
        }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 10px 8px; border-bottom: 1px dashed var(--card-border); text-align: left; }
        th { color: var(--muted); font-weight: 500; user-select: none; cursor: pointer; }
        tr.expand-row td { padding: 0; background: rgba(255,255,255,0.03); }
        .chat-box {
            padding: 12px 16px; max-height: 600px; overflow: auto;
            display: grid; gap: 8px;
        }
        .msg { display: inline-block; max-width: 70%; padding: 8px 10px; border-radius: 10px; }
        .msg.user { background: rgba(90,169,255,0.12); border: 1px solid rgba(90,169,255,0.3); }
        .msg.avatar { background: rgba(139,92,246,0.12); border: 1px solid rgba(139,92,246,0.3); }
        .muted { color: var(--muted); font-size: 12px; }
        .row-head { display: flex; gap: 8px; align-items: center; }
        .badge { padding: 2px 8px; border-radius: 999px; background: rgba(90,169,255,0.12); border: 1px solid rgba(90,169,255,0.3); color: var(--accent); font-size: 12px; }
        .flex { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
        .right { text-align: right; }
        .nowrap { white-space: nowrap; }
        .actions .btn { padding: 6px 10px; font-size: 12px; }
        .empty { text-align: center; padding: 24px; color: var(--muted); }
    </style>
</head>
<body>
<header>
    <div class="container">
        <h1>Repliky — Все чаты</h1>
        <div class="toolbar">
            <input id="q" class="input" placeholder="Поиск: Chat ID, User ID, Avatar..." />
            <select id="pageSize" class="input">
                <option value="25">25</option>
                <option value="50" selected>50</option>
                <option value="100">100</option>
            </select>
            <button id="reload" class="btn">Обновить</button>
            <span id="meta" class="muted"></span>
        </div>
    </div>
</header>

<main class="container" style="margin-top: 16px;">
    <div class="card">
        <table id="tbl">
            <thead>
                <tr>
                    <th data-key="chat_id">Chat ID</th>
                    <th data-key="user_profile_id">User ID</th>
                    <th data-key="avatar_name">Avatar</th>
                    <th class="right nowrap" data-key="msg_cnt">Сообщений ▾/▴</th>
                    <th class="nowrap" data-key="last_msg_at">Последнее сообщение ▾/▴</th>
                    <th>Действия</th>
                </tr>
            </thead>
            <tbody id="rows"></tbody>
        </table>
        <div id="empty" class="empty" style="display:none;">Нет данных</div>
        <div class="flex" style="justify-content: space-between; margin-top: 12px;">
            <div class="muted" id="count"></div>
            <div class="flex">
                <button id="prev" class="btn">Назад</button>
                <div class="badge" id="pageInfo">1 / 1</div>
                <button id="next" class="btn">Вперёд</button>
            </div>
        </div>
    </div>
</main>

<script>
    const API_BASE = 'https://api.repliky.kz/api';

    function toAbsoluteImageUrl(raw) {
        return API_BASE + raw;
    }
    const state = {
        items: [],
        filtered: [],
        sortKey: 'msg_cnt',
        sortDir: 'desc', // 'asc' | 'desc'
        page: 1,
        pageSize: 50
    };

    const elRows = document.getElementById('rows');
    const elCount = document.getElementById('count');
    const elPageInfo = document.getElementById('pageInfo');
    const elEmpty = document.getElementById('empty');

    function fmtDate(s) {
        if (!s) return '';
        const d = new Date(s);
        if (isNaN(+d)) return '';
        return d.toLocaleString();
    }

    async function load() {
        const res = await fetch('/api/admin/chats/list');
        if (!res.ok) throw new Error('Failed to load list');
        const json = await res.json();
        state.items = json.items || [];
        document.getElementById('meta').textContent = 'Загружено: ' + (json.items?.length || 0);
        applyFilters();
    }

    function applyFilters() {
        const q = (document.getElementById('q').value || '').trim().toLowerCase();
        let arr = state.items.slice();

        if (q) {
            arr = arr.filter(r =>
                String(r.chat_id).includes(q) ||
                String(r.user_profile_id).includes(q) ||
                (r.avatar_name || '').toLowerCase().includes(q)
            );
        }

        // sort
        arr.sort((a, b) => {
            const k = state.sortKey;
            let va = a[k];
            let vb = b[k];
            // дата — сравниваем по timestamp
            if (k === 'last_msg_at') {
                va = va ? Date.parse(va) : 0;
                vb = vb ? Date.parse(vb) : 0;
            }
            if (va < vb) return state.sortDir === 'asc' ? -1 : 1;
            if (va > vb) return state.sortDir === 'asc' ? 1 : -1;
            return 0;
        });

        state.filtered = arr;
        state.page = 1;
        render();
    }

    function render() {
        const ps = state.pageSize;
        const start = (state.page - 1) * ps;
        const end = start + ps;
        const pageItems = state.filtered.slice(start, end);

        elRows.innerHTML = '';
        if (!pageItems.length) {
            elEmpty.style.display = '';
        } else {
            elEmpty.style.display = 'none';
        }

        pageItems.forEach(r => {
            const tr = document.createElement('tr');
            tr.innerHTML = \`
                <td>\${r.chat_id}</td>
                <td>\${r.user_profile_id}</td>
                <td>\${r.avatar_name || ''}</td>
                <td class="right">\${r.msg_cnt}</td>
                <td class="nowrap">\${fmtDate(r.last_msg_at)}</td>
                <td class="actions">
                    <button class="btn" data-expand="\${r.chat_id}">Раскрыть</button>
                </td>\`;
            elRows.appendChild(tr);

            // строчка для раскрытия
            const trExpand = document.createElement('tr');
            trExpand.className = 'expand-row';
            trExpand.style.display = 'none';
            trExpand.innerHTML = \`<td colspan="6">
                <div class="chat-box" id="box-\${r.chat_id}">
                    <div class="muted">Загрузка истории...</div>
                </div>
            </td>\`;
            elRows.appendChild(trExpand);
        });

        const total = state.filtered.length;
        const pages = Math.max(1, Math.ceil(total / state.pageSize));
        elCount.textContent = \`\${start + 1 || 0}–\${Math.min(end, total)} из \${total}\`;
        elPageInfo.textContent = \`\${state.page} / \${pages}\`;
    }

    async function toggleExpand(chatId) {
        // находим пары строк
        const btn = document.querySelector('button[data-expand="' + chatId + '"]');
        if (!btn) return;
        const tr = btn.closest('tr');
        const trExpand = tr.nextElementSibling;
        if (trExpand.style.display === 'none') {
            trExpand.style.display = '';
            // грузим историю
            const box = document.getElementById('box-' + chatId);
            try {
                const res = await fetch('/api/chat/' + chatId + '/messages');
                if (!res.ok) throw new Error('History load failed');
                const json = await res.json();
                const msgs = json || [];
                if (!Array.isArray(msgs) && Array.isArray(json?.messages)) {
                    // на всякий случай, если ваш handler возвращает {messages: [...]}
                    renderMessages(box, json.messages);
                } else {
                    renderMessages(box, msgs);
                }
            } catch (e) {
                box.innerHTML = '<div class="muted">Ошибка загрузки истории</div>';
            }
        } else {
            trExpand.style.display = 'none';
        }
    }

    function renderMessages(box, messages) {
        if (!messages || !messages.length) {
            box.innerHTML = '<div class="muted">Пусто</div>';
            return;
        }
        box.innerHTML = '';
        messages.forEach(m => {
            const wrap = document.createElement('div');
            wrap.className = 'msg ' + (m.sender === 'user' ? 'user' : 'avatar');

            const text = (m.text || '').replace(/</g,'&lt;').replace(/>/g,'&gt;');
            const ts = m.timestamp ? new Date(m.timestamp).toLocaleString() : '';

            // поддерживаем оба ключа: imageUrl и image_url
            const rawImg = (m.imageUrl !== undefined ? m.imageUrl : m.image_url);
            const imgSrc = toAbsoluteImageUrl(rawImg);

            let html = '<div>' + text + '</div>';
            if (imgSrc) {
                html += '<div style="margin-top:6px;">' +
                        '<img src="' + imgSrc + '" alt="" ' +
                        'style="max-width:280px;border-radius:10px;border:1px solid var(--card-border);" />' +
                        '</div>';
            }
            html += '<div class="muted" style="margin-top:4px;">' + ts + '</div>';

            wrap.innerHTML = html;
            box.appendChild(wrap);
        });
        box.scrollTop = box.scrollHeight;
    }

    // события
    document.getElementById('reload').addEventListener('click', load);
    document.getElementById('q').addEventListener('input', () => {
        state.page = 1; applyFilters();
    });
    document.getElementById('pageSize').addEventListener('change', (e) => {
        state.pageSize = Number(e.target.value || 50);
        state.page = 1; render();
    });
    document.getElementById('prev').addEventListener('click', () => {
        if (state.page > 1) { state.page -= 1; render(); }
    });
    document.getElementById('next').addEventListener('click', () => {
        const pages = Math.max(1, Math.ceil(state.filtered.length / state.pageSize));
        if (state.page < pages) { state.page += 1; render(); }
    });

    // сортировка по клику на заголовок
    document.querySelectorAll('th[data-key]').forEach(th => {
        th.addEventListener('click', () => {
            const key = th.getAttribute('data-key');
            if (state.sortKey === key) {
                state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
            } else {
                state.sortKey = key;
                // по умолчанию: для чисел и дат — desc, для текста — asc
                state.sortDir = (key === 'msg_cnt' || key === 'last_msg_at' || key === 'chat_id' || key === 'user_profile_id') ? 'desc' : 'asc';
            }
            applyFilters();
        });
    });

    // делегирование: кнопка "Раскрыть"
    document.getElementById('rows').addEventListener('click', (e) => {
        const t = e.target;
        if (t && t.matches('button[data-expand]')) {
            const id = Number(t.getAttribute('data-expand'));
            toggleExpand(id);
        }
    });

    // старт
    load().catch(err => {
        console.error(err);
        document.getElementById('meta').textContent = 'Ошибка загрузки';
    });
</script>
</body>
</html>`;
}
