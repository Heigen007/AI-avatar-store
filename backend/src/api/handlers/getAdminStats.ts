// src/api/handlers/getAdminStats.ts
import { Request, Response } from 'express';
import { StatsService } from '../services/StatsService';

function parseRange(req: Request): number {
    const r = Number(req.query.range);
    if ([7, 30, 90].includes(r)) return r;
    return 7;
}

export async function getAdminStats(req: Request, res: Response) {
    try {
        const days = parseRange(req);
        const range = StatsService.makeRange(days);

        const [
            overview,
            series,
            avatarBreakdown,
            topChats,
            topUsers,
            feedback,
            funnel
        ] = await Promise.all([
            StatsService.getOverview(range),
            StatsService.getSeries(range),
            StatsService.getAvatarBreakdown(),
            StatsService.getTopChats(range),
            StatsService.getTopUsers(range),
            StatsService.getFeedback(range),
            StatsService.getFunnel(range)
        ]);

        const payload = {
            days,
            range,
            overview,
            series,
            avatarBreakdown,
            topChats,
            topUsers,
            feedback,
            funnel,
            generatedAt: new Date().toISOString()
        };

        // Встраиваем данные как JSON в HTML.
        const html = renderHtml(payload);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.status(200).send(html);
    } catch (err) {
        console.error('getAdminStats error:', err);
        res.status(500).send('Failed to render admin stats');
    }
}

function renderHtml(data: any): string {
    const json = JSON.stringify(data);
    return `<!doctype html>
<html lang="ru">
<head>
    <meta charset="utf-8">
    <title>Repliky — Admin Stats</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js"></script>
    <style>
        :root {
            --bg: #0b0f14;
            --card: rgba(255,255,255,0.06);
            --card-border: rgba(255,255,255,0.12);
            --text: #e6f0ff;
            --muted: #9cb3d3;
            --accent: #5aa9ff;
            --accent-2: #8b5cf6;
            --success: #22c55e;
            --danger: #ef4444;
        }
        * { box-sizing: border-box; }
        html, body { margin: 0; background: radial-gradient(1200px 800px at 80% -20%, rgba(138,92,246,0.15), transparent), var(--bg); color: var(--text); font: 14px/1.5 Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }
        header {
            position: sticky; top: 0; z-index: 10;
            backdrop-filter: blur(10px);
            background: linear-gradient(to bottom, rgba(11,15,20,0.9), rgba(11,15,20,0.6));
            border-bottom: 1px solid var(--card-border);
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 16px 20px; }
        h1 { margin: 0; font-size: 20px; letter-spacing: 0.2px; }
        .sub { color: var(--muted); font-size: 12px; }

        .controls {
            display: flex; gap: 8px; align-items: center; margin-top: 10px;
        }
        .chip {
            padding: 6px 10px; border: 1px solid var(--card-border);
            border-radius: 999px; cursor: pointer; user-select: none;
            background: var(--card); color: var(--text);
        }
        .chip.active { border-color: var(--accent); box-shadow: 0 0 0 2px rgba(90,169,255,0.15) inset; }

        .grid {
            display: grid; gap: 16px;
            grid-template-columns: repeat(12, 1fr);
        }
        .card {
            grid-column: span 3; /* по умолчанию для маленьких карточек */
            background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03));
            border: 1px solid var(--card-border);
            border-radius: 16px;
            padding: 16px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.35);
        }
        .card h3 { margin: 0 0 6px; font-size: 13px; color: var(--muted); font-weight: 500; }
        .metric { font-size: 24px; font-weight: 700; letter-spacing: 0.3px; }
        .row { display: flex; gap: 14px; align-items: baseline; }
        .pill { font-size: 12px; padding: 2px 8px; border-radius: 999px; background: rgba(90,169,255,0.15); color: var(--accent); border: 1px solid rgba(90,169,255,0.3); }

        .card.wide { grid-column: span 6; }
        .card.full { grid-column: span 12; }

        .table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .table th, .table td { padding: 10px 8px; border-bottom: 1px dashed var(--card-border); text-align: left; }
        .table th { color: var(--muted); font-weight: 500; position: sticky; top: 0; background: rgba(11,15,20,0.8); backdrop-filter: blur(6px); }

        .muted { color: var(--muted); }
        .ok { color: var(--success); }
        .bad { color: var(--danger); }

        @media (max-width: 1020px) {
            .card { grid-column: span 12; }
            .card.wide, .card.full { grid-column: span 12; }
        }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <h1>Repliky — Admin Stats</h1>
            <div class="sub">Период: последние <span id="hdr-days"></span> дней • Сгенерировано: <span id="hdr-ts"></span></div>
            <div class="controls">
                <a class="chip" id="r7" href="?range=7">7 дней</a>
                <a class="chip" id="r30" href="?range=30">30 дней</a>
                <a class="chip" id="r90" href="?range=90">90 дней</a>
            </div>
        </div>
    </header>

    <main class="container" style="margin-top: 16px;">
        <section class="grid" id="overview">
            <div class="card"><h3>Новые пользователи (период)</h3><div class="metric" id="m-users-period">—</div></div>
            <div class="card"><h3>Всего пользователей</h3><div class="metric" id="m-users-total">—</div></div>
            <div class="card"><h3>Сообщений всего (период)</h3><div class="metric" id="m-msgs-total">—</div></div>
            <div class="card"><h3>Активные чаты (период)</h3><div class="metric" id="m-active-chats">—</div></div>
            <div class="card">
                <h3>Среднее сообщений на пользователя(период)</h3>
                <div class="metric" id="m-avg-msgs">—</div>
            </div>
            <div class="card"><h3>Сообщения с изображениями(период)</h3><div class="metric" id="m-images">—</div></div>
            <div class="card"><h3>Голосовых сообщений (период)</h3><div class="metric" id="m-voice-msgs">—</div></div>
            <div class="card">
                <h3>Воронка (период)</h3>
                <div class="row"><span class="pill">Рег.</span><div class="metric" id="f-u">—</div></div>
                <div class="row"><span class="pill">Есть чат</span><div class="metric" id="f-a">— <span class="muted" id="f-c1"></span></div></div>
                <div class="row"><span class="pill">Писали</span><div class="metric" id="f-m">— <span class="muted" id="f-c2"></span></div></div>
            </div>
        </section>

        <section class="grid" style="margin-top: 8px;">
            <div class="card wide">
                <h3>Новые пользователи по дням</h3>
                <canvas id="ch-users"></canvas>
            </div>
            <div class="card wide">
                <h3>DAU (пользователи, писавшие за день)</h3>
                <canvas id="ch-dau"></canvas>
            </div>
        </section>

        <section class="grid" style="margin-top: 8px;">
            <div class="card wide">
                <h3>Распределение аватаров по ролям</h3>
                <canvas id="ch-role"></canvas>
            </div>
            <div class="card wide">
                <h3>Распределение аватаров по гендеру</h3>
                <canvas id="ch-gender"></canvas>
            </div>
            <div class="card full">
                <h3>Топ-5 голосов (в аватарах)</h3>
                <canvas id="ch-voice"></canvas>
            </div>
        </section>

        <section class="grid" style="margin-top: 8px;">
            <div class="card wide">
                <h3>Топ-10 чатов (по сообщениям, период)</h3>
                <table class="table" id="tbl-chats">
                    <thead><tr><th>#</th><th>Chat ID</th><th>Сообщений</th></tr></thead>
                    <tbody></tbody>
                </table>
            </div>
            <div class="card wide">
                <h3>Топ-10 пользователей (по user-сообщениям, период)</h3>
                <table class="table" id="tbl-users">
                    <thead><tr><th>#</th><th>User ID</th><th>Сообщений</th></tr></thead>
                    <tbody></tbody>
                </table>
            </div>
        </section>

        <section class="grid" style="margin-top: 8px;">
            <div class="card full">
                <h3>Feedback</h3>
                <div class="row" style="gap: 20px;">
                    <div class="pill">За период: <span id="fb-period">—</span></div>
                    <div class="pill">Всего: <span id="fb-total">—</span></div>
                </div>
                <table class="table" style="margin-top: 10px;">
                    <thead><tr><th>ID</th><th>Дата</th><th>Сообщение</th></tr></thead>
                    <tbody id="fb-list"></tbody>
                </table>
            </div>
        </section>
    </main>

    <script id="stats-data" type="application/json">${json}</script>
    <script>
        const data = JSON.parse(document.getElementById('stats-data').textContent);

        // Header
        document.getElementById('hdr-days').textContent = String(data.days);
        document.getElementById('hdr-ts').textContent = new Date(data.generatedAt).toLocaleString();
        if (data.days === 7) document.getElementById('r7').classList.add('active');
        if (data.days === 30) document.getElementById('r30').classList.add('active');
        if (data.days === 90) document.getElementById('r90').classList.add('active');

        // Overview
        document.getElementById('m-users-period').textContent = data.overview.usersPeriod.toLocaleString();
        document.getElementById('m-users-total').textContent = data.overview.usersTotal.toLocaleString();
        document.getElementById('m-msgs-total').textContent = data.overview.messagesTotalPeriod.toLocaleString();
        document.getElementById('m-voice-msgs').textContent = data.overview.voiceMessagesPeriod.toLocaleString();
        document.getElementById('m-active-chats').textContent = data.overview.activeChatsPeriod.toLocaleString();
        // тут посчитай исходя из новых пользователей и сообщений
        document.getElementById('m-avg-msgs').textContent = (
            data.overview.usersPeriod > 0
                ? (data.overview.messagesTotalPeriod / data.overview.usersPeriod).toFixed(1)
                : '—'
        );
        document.getElementById('m-images').textContent = data.overview.imagesPeriod.toLocaleString();

        document.getElementById('f-u').textContent = data.funnel.users.toLocaleString();
        document.getElementById('f-a').firstChild.textContent = data.funnel.usersWithChat.toLocaleString() + ' ';
        document.getElementById('f-c1').textContent = (data.funnel.conv1 || 0) + '%';
        document.getElementById('f-m').firstChild.textContent = data.funnel.usersWithMsg.toLocaleString() + ' ';
        document.getElementById('f-c2').textContent = (data.funnel.conv2 || 0) + '%';

        // Charts helpers
        const mkLine = (id, labels, series, label) => {
            const ctx = document.getElementById(id);
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels,
                    datasets: [{ label, data: series, tension: 0.35 }]
                },
                options: {
                    responsive: true,
                    scales: {
                        x: { grid: { color: 'rgba(255,255,255,0.06)' } },
                        y: { grid: { color: 'rgba(255,255,255,0.06)' }, ticks: { precision: 0 } }
                    },
                    plugins: { legend: { labels: { color: '#cfe1ff' } } }
                }
            });
        };

        const mkStacked = (id, labels, s1, s2, l1, l2) => {
            const ctx = document.getElementById(id);
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels,
                    datasets: [
                        { label: l1, data: s1, stack: 's' },
                        { label: l2, data: s2, stack: 's' }
                    ]
                },
                options: {
                    responsive: true,
                    scales: {
                        x: { stacked: true, grid: { color: 'rgba(255,255,255,0.06)' } },
                        y: { stacked: true, grid: { color: 'rgba(255,255,255,0.06)' }, ticks: { precision: 0 } }
                    },
                    plugins: { legend: { labels: { color: '#cfe1ff' } } }
                }
            });
        };

        const mkDonut = (id, labels, values) => {
            const ctx = document.getElementById(id);
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels,
                    datasets: [{ data: values }]
                },
                options: {
                    cutout: '60%',
                    plugins: { legend: { labels: { color: '#cfe1ff' } } }
                }
            });
        };

        // Time series
        const labels = data.series.days.map(d => new Date(d + 'T00:00:00').toLocaleDateString());
        mkLine('ch-users', labels, data.series.usersByDay, 'Новые пользователи');
        mkLine('ch-dau', labels, data.series.dauByDay, 'DAU');

        // Avatar breakdown (без дат, т.к. нет created_at)
        const roles = data.avatarBreakdown.role.map(r => r.role);
        const roleVals = data.avatarBreakdown.role.map(r => Number(r.c));
        mkDonut('ch-role', roles, roleVals);

        const genders = data.avatarBreakdown.gender.map(r => r.gender);
        const genderVals = data.avatarBreakdown.gender.map(r => Number(r.c));
        mkDonut('ch-gender', genders, genderVals);

        const voices = data.avatarBreakdown.voiceTop.map(r => r.voice);
        const voiceVals = data.avatarBreakdown.voiceTop.map(r => Number(r.c));
        mkDonut('ch-voice', voices, voiceVals);

        // Tables
        const chatsTBody = document.querySelector('#tbl-chats tbody');
        data.topChats.forEach((r, i) => {
            const tr = document.createElement('tr');
            tr.innerHTML = \`<td>\${i+1}</td><td>\${r.chat_id}</td><td>\${r.msg_cnt}</td>\`;
            chatsTBody.appendChild(tr);
        });

        const usersTBody = document.querySelector('#tbl-users tbody');
        data.topUsers.forEach((r, i) => {
            const tr = document.createElement('tr');
            tr.innerHTML = \`<td>\${i+1}</td><td>\${r.user_profile_id}</td><td>\${r.msg_cnt}</td>\`;
            usersTBody.appendChild(tr);
        });

        const fbBody = document.getElementById('fb-list');
        document.getElementById('fb-period').textContent = data.feedback.period.toLocaleString();
        document.getElementById('fb-total').textContent = data.feedback.total.toLocaleString();
        data.feedback.latest.forEach(r => {
            const tr = document.createElement('tr');
            const dt = new Date(r.created_at).toLocaleString();
            const msg = (r.message || '').slice(0, 300);
            tr.innerHTML = \`<td>\${r.id}</td><td class="muted">\${dt}</td><td>\${msg}</td>\`;
            fbBody.appendChild(tr);
        });
    </script>
</body>
</html>`;
}
