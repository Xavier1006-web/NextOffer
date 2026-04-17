import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Link as LinkIcon, CheckCircle2, TrendingUp, AlertCircle, Heart, Trash2, PartyPopper } from 'lucide-react';

// --- 温暖色调与动画配置 ---
const COLORS = {
    bg: 'bg-[#FFFBF5]',
    primary: 'bg-[#F59E0B]',
    card: 'bg-white',
};

const MOTIVATIONS = [
    "每一份拒绝，都是在为最好的那个 Offer 攒运气。✨",
    "保持节奏，你离大厂 Offer 只差最后一步！🚀",
    "今天的努力，是为了明天更有选择的权利。☀️",
    "心态稳住，我们能赢！💪"
];

const App = () => {
    // --- 1. 恢复丰富多样的初始数据 (满足题目 DDL 要求) ---
    const [apps, setApps] = useState([
        {
            id: 1, company: '美团', position: '产品经理实习生', status: 'interviewing',
            round: '二面', date: '2023-11-01 14:00', isReferral: true,
            notesLink: 'https://notion.so/meituan', materials: [{ name: '简历', done: true }]
        },
        {
            id: 2, company: '字节跳动', position: '前端开发', status: 'interviewing',
            round: '终面', date: '2023-10-28', isReferral: false, notesLink: ''
        },
        {
            id: 3, company: '小红书', position: '产品运营', status: 'backlog',
            deadline: '2023-10-31', isReferral: true, tags: ['急'], materials: [{ name: '简历', done: false }]
        },
        {
            id: 4, company: '腾讯', position: '策略产品', status: 'applied',
            date: '2023-10-25', isReferral: false, materials: [{ name: '简历', done: true }, { name: '笔试', done: true }]
        }
    ]);

    const [selectedCard, setSelectedCard] = useState(null);
    const [showCelebration, setShowCelebration] = useState(false);
    const [quote] = useState(MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)]);

    // --- 2. 逻辑：当状态变为“已斩获”时触发庆祝 ---
    const updateApp = (id, fields) => {
        if (fields.status === 'offered') {
            setShowCelebration(true);
            setTimeout(() => setShowCelebration(false), 3000); // 3秒后停止动画
        }
        setApps(apps.map(a => a.id === id ? { ...a, ...fields } : a));
    };

    const addApp = () => {
        const newApp = { id: Date.now(), company: '新公司', position: '待定岗位', status: 'backlog', date: '未设置', isReferral: false, materials: [] };
        setApps([...apps, newApp]);
        setSelectedCard(newApp);
    };

    const stats = {
        total: apps.length,
        interviewing: apps.filter(a => a.status === 'interviewing').length,
        offers: apps.filter(a => a.status === 'offered').length,
        rate: apps.length > 0 ? ((apps.filter(a => a.status !== 'backlog' && a.status !== 'applied').length / apps.length) * 100).toFixed(0) : 0
    };

    return (
        <div className={`min-h-screen ${COLORS.bg} text-slate-700 p-6 relative overflow-hidden`}>

            {/* 庆祝动画层 (情绪价值模块) */}
            {showCelebration && (
                <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center bg-white/40 backdrop-blur-sm animate-in fade-in duration-500">
                    <div className="text-center animate-bounce">
                        <div className="text-8xl mb-4">🎉</div>
                        <h2 className="text-4xl font-black text-orange-600">恭喜斩获新 OFFER !</h2>
                        <p className="text-lg text-orange-400 font-bold mt-2">所有的努力终有回响 ✨</p>
                    </div>
                </div>
            )}

            {/* 顶部激励区 */}
            <div className="max-w-[1600px] mx-auto mb-8 bg-orange-100/40 border border-orange-100 p-4 rounded-3xl flex items-center gap-3">
                <Heart size={20} className="text-orange-500 fill-orange-500" />
                <p className="text-orange-800 font-semibold tracking-wide">“ {quote} ”</p>
            </div>

            <header className="flex justify-between items-center mb-10 max-w-[1600px] mx-auto">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center shadow-xl shadow-orange-100 rotate-3">
                        <TrendingUp size={24} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-800">NextOffer</h1>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">智能求职进度管理</p>
                    </div>
                </div>
                <button onClick={addApp} className="bg-slate-800 hover:bg-slate-900 text-white px-8 py-3.5 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 shadow-xl active:scale-95">
                    <Plus size={20} /> 新增投递
                </button>
            </header>

            {/* 核心统计卡片 */}
            <div className="grid grid-cols-4 gap-6 mb-12 max-w-[1600px] mx-auto">
                {[
                    { label: '累计投递', value: stats.total, color: 'text-slate-400' },
                    { label: '面试转化', value: `${stats.rate}%`, color: 'text-orange-500' },
                    { label: '正在面试', value: stats.interviewing, color: 'text-orange-400' },
                    { label: '已获意向', value: stats.offers, color: 'text-emerald-500' },
                ].map((s, i) => (
                    <div key={i} className="bg-white/60 backdrop-blur-xl p-8 rounded-[32px] border border-white/50 shadow-sm">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">{s.label}</p>
                        <p className={`text-4xl font-black ${s.color}`}>{s.value}</p>
                    </div>
                ))}
            </div>

            {/* 看板区域 (纯中文标识) */}
            <main className="flex gap-8 overflow-x-auto pb-10 max-w-[1600px] mx-auto">
                {[
                    { id: 'backlog', title: '准备中', icon: '📝' },
                    { id: 'applied', title: '已投递', icon: '📨' },
                    { id: 'interviewing', title: '面试中', icon: '💬' },
                    { id: 'offered', title: '已斩获', icon: '🎉' },
                    { id: 'closed', title: '已结束', icon: '📁' }
                ].map(col => (
                    <div key={col.id} className="w-80 flex-shrink-0">
                        <div className="flex items-center justify-between mb-6 px-2">
                            <div className="flex items-center gap-2">
                                <span className="text-xl">{col.icon}</span>
                                <h2 className="font-black text-sm text-slate-400 tracking-tighter uppercase">{col.title}</h2>
                                <span className="bg-slate-200 text-slate-500 text-[10px] font-black px-2 py-0.5 rounded-full">
                                    {apps.filter(a => a.status === col.id).length}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-5">
                            {apps.filter(a => a.status === col.id).map(card => (
                                <div
                                    key={card.id}
                                    onClick={() => setSelectedCard(card)}
                                    className="bg-white rounded-[28px] p-6 shadow-sm border border-transparent hover:border-orange-200 hover:shadow-2xl transition-all cursor-pointer group relative overflow-hidden"
                                >
                                    {card.isReferral && <div className="absolute top-0 right-0 bg-orange-100 text-orange-600 text-[10px] font-black px-3 py-1 rounded-bl-xl">内推</div>}
                                    <h3 className="font-bold text-slate-800 text-lg mb-1 group-hover:text-orange-500">{card.company}</h3>
                                    <p className="text-sm text-slate-400 font-semibold mb-5">{card.position}</p>

                                    <div className="flex items-center justify-between text-[11px] font-black tracking-tight">
                                        {/* 重点：截止日期高亮提醒 */}
                                        <div className={`flex items-center gap-1.5 ${card.deadline ? 'text-rose-500' : 'text-slate-300'}`}>
                                            {card.deadline ? <AlertCircle size={14} /> : <Calendar size={14} />}
                                            {card.deadline ? `截止: ${card.deadline}` : card.date}
                                        </div>
                                        {card.round && <span className="bg-slate-100 text-slate-500 px-2 py-1 rounded-lg uppercase">{card.round}</span>}
                                    </div>
                                </div>
                            ))}
                            <button onClick={addApp} className="w-full py-5 border-2 border-dashed border-slate-200 rounded-[28px] text-slate-300 hover:border-orange-200 hover:text-orange-200 transition-all">
                                <Plus size={24} className="mx-auto" />
                            </button>
                        </div>
                    </div>
                ))}
            </main>

            {/* 侧边详情抽屉 */}
            {selectedCard && (
                <div className="fixed inset-0 z-[110] flex justify-end">
                    <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-md" onClick={() => setSelectedCard(null)} />
                    <div className="relative w-[500px] bg-white h-full shadow-2xl p-12 overflow-y-auto animate-in slide-in-from-right duration-500">
                        <div className="flex justify-between items-center mb-12">
                            <span className="text-[10px] font-black text-orange-500 bg-orange-50 px-4 py-1.5 rounded-full uppercase tracking-[0.2em]">Application Details</span>
                            <button onClick={() => setSelectedCard(null)} className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 transition-colors">✕</button>
                        </div>

                        <h2 className="text-4xl font-black text-slate-800 mb-2 leading-tight">{selectedCard.company}</h2>
                        <p className="text-xl font-bold text-slate-300 mb-12">{selectedCard.position}</p>

                        <div className="space-y-10">
                            <section>
                                <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4 block">状态流转</label>
                                <select
                                    value={selectedCard.status}
                                    onChange={(e) => updateApp(selectedCard.id, { status: e.target.value })}
                                    className="w-full p-5 bg-slate-50 rounded-[20px] border-none font-black text-slate-600 appearance-none focus:ring-2 focus:ring-orange-100"
                                >
                                    <option value="backlog">准备中 (待投递)</option>
                                    <option value="applied">已投递 (流程中)</option>
                                    <option value="interviewing">面试中 (核心冲刺)</option>
                                    <option value="offered">已斩获 (梦想达成)</option>
                                    <option value="closed">已结束</option>
                                </select>
                            </section>

                            <section>
                                <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4 block">复盘与外链</label>
                                <a href={selectedCard.notesLink} target="_blank" className="flex items-center justify-between p-5 bg-orange-50 rounded-[20px] border border-orange-100 group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-orange-500">
                                            <LinkIcon size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-orange-900">面试/备考笔记</p>
                                            <p className="text-[10px] text-orange-400 font-bold uppercase tracking-widest">Notion / 飞书 链接</p>
                                        </div>
                                    </div>
                                    <Plus className="text-orange-200 rotate-45" size={20} />
                                </a>
                            </section>

                            <section>
                                <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4 block">材料 Checkbox</label>
                                <div className="space-y-3">
                                    {(selectedCard.materials || [{ name: '待定项', done: false }]).map((m, i) => (
                                        <div key={i} className="flex items-center gap-4 p-5 bg-slate-50 rounded-[20px]">
                                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${m.done ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' : 'bg-white border-2 border-slate-100'}`}>
                                                {m.done && <CheckCircle2 size={14} />}
                                            </div>
                                            <span className={`text-sm font-bold ${m.done ? 'text-slate-300 line-through' : 'text-slate-600'}`}>{m.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;