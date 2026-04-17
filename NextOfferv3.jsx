import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Link as LinkIcon, CheckCircle2, TrendingUp, AlertCircle, ExternalLink, Heart, Trash2 } from 'lucide-react';

// --- 温暖色调配置 ---
const COLORS = {
    bg: 'bg-[#FFFBF5]',
    primary: 'bg-[#F59E0B]', // 温暖橙
    secondary: 'text-[#4F6F52]', // 森林绿
    card: 'bg-white',
    accent: 'indigo'
};

const MOTIVATIONS = [
    "今天的努力，是为了明天更有选择的权利。☀️",
    "每一分努力都不会被辜负，Offer 正在路上。🚀",
    "保持节奏，你是最棒的！💪",
    "心态稳住，我们能赢！✨"
];

const App = () => {
    // --- 状态管理 (让产品动起来的关键) ---
    const [apps, setApps] = useState([
        { id: 1, company: '美团', position: '产品经理实习生', status: 'interviewing', round: '二面', date: '2023-11-01', isReferral: true, notesLink: 'https://notion.so/xxx', materials: [{ name: '简历', done: true }] },
        { id: 2, company: '字节跳动', position: '前端开发', status: 'interviewing', round: '终面', date: '2023-10-28', isReferral: false, notesLink: '' },
    ]);

    const [selectedCard, setSelectedCard] = useState(null);
    const [quote] = useState(MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)]);

    // --- 业务逻辑 ---
    const addApp = () => {
        const newApp = {
            id: Date.now(),
            company: '新公司',
            position: '待定岗位',
            status: 'backlog',
            date: '请选择日期',
            isReferral: false,
            materials: []
        };
        setApps([...apps, newApp]);
        setSelectedCard(newApp); // 直接打开编辑
    };

    const updateApp = (id, fields) => {
        setApps(apps.map(a => a.id === id ? { ...a, ...fields } : a));
    };

    const deleteApp = (id) => {
        setApps(apps.filter(a => a.id !== id));
        setSelectedCard(null);
    };

    const stats = {
        total: apps.length,
        interviewing: apps.filter(a => a.status === 'interviewing').length,
        offers: apps.filter(a => a.status === 'offered').length
    };

    return (
        <div className={`min-h-screen ${COLORS.bg} text-slate-700 p-6 transition-colors duration-500`}>
            {/* 顶部激励区 - “喊话”功能 */}
            <div className="max-w-[1600px] mx-auto mb-8 bg-orange-100/50 border border-orange-200 p-4 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center text-white shadow-inner">
                    <Heart size={20} fill="currentColor" />
                </div>
                <p className="text-orange-800 font-medium italic">“ {quote} ”</p>
            </div>

            <header className="flex justify-between items-center mb-8 max-w-[1600px] mx-auto">
                <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 ${COLORS.primary} rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200`}>
                        <TrendingUp size={24} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-800">NextOffer</h1>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Your Dream Starts Here</p>
                    </div>
                </div>
                <button onClick={addApp} className={`${COLORS.primary} hover:opacity-90 text-white px-6 py-3 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg active:scale-95`}>
                    <Plus size={20} /> 新增投递申请
                </button>
            </header>

            {/* 统计数据 */}
            <div className="grid grid-cols-3 gap-6 mb-10 max-w-[1600px] mx-auto">
                {[
                    { label: '累计投递', value: stats.total, icon: '🔥' },
                    { label: '面试安排', value: stats.interviewing, icon: '🎤' },
                    { label: '已获意向', value: stats.offers, icon: '🏆' }
                ].map((s, i) => (
                    <div key={i} className="bg-white/80 backdrop-blur-md p-6 rounded-[24px] border border-white shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase mb-1">{s.label}</p>
                            <p className="text-3xl font-black text-slate-800">{s.value}</p>
                        </div>
                        <span className="text-4xl">{s.icon}</span>
                    </div>
                ))}
            </div>

            {/* 看板区域 */}
            <main className="flex gap-6 overflow-x-auto pb-8 max-w-[1600px] mx-auto">
                {['backlog', 'applied', 'interviewing', 'offered', 'closed'].map(status => (
                    <div key={status} className="w-80 flex-shrink-0">
                        <h2 className="px-2 mb-4 font-bold text-sm text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            {status === 'interviewing' && <span className="w-2 h-2 bg-orange-400 rounded-full animate-ping" />}
                            {status.toUpperCase()}
                        </h2>

                        <div className="space-y-4">
                            {apps.filter(a => a.status === status).map(card => (
                                <div
                                    key={card.id}
                                    onClick={() => setSelectedCard(card)}
                                    className="bg-white rounded-[24px] p-6 shadow-sm border border-orange-50 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group relative"
                                >
                                    {card.isReferral && <div className="absolute top-4 right-4 text-[10px] font-black text-orange-500 bg-orange-50 px-2 py-1 rounded-md">內推</div>}
                                    <h3 className="font-bold text-slate-800 text-lg mb-1 group-hover:text-orange-500 transition-colors">{card.company}</h3>
                                    <p className="text-sm text-slate-400 font-medium mb-4">{card.position}</p>

                                    <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
                                        <Calendar size={12} />
                                        {card.date}
                                        {card.round && <span className="ml-auto bg-slate-100 px-2 py-1 rounded-lg text-slate-500">{card.round}</span>}
                                    </div>
                                </div>
                            ))}
                            <button onClick={addApp} className="w-full py-4 border-2 border-dashed border-slate-200 rounded-[24px] text-slate-300 hover:border-orange-200 hover:text-orange-200 transition-all flex justify-center">
                                <Plus size={24} />
                            </button>
                        </div>
                    </div>
                ))}
            </main>

            {/* 详情编辑抽屉 */}
            {selectedCard && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div className="absolute inset-0 bg-orange-900/10 backdrop-blur-sm" onClick={() => setSelectedCard(null)} />
                    <div className="relative w-[500px] bg-white h-full shadow-2xl p-10 overflow-y-auto flex flex-col">
                        <div className="flex justify-between items-center mb-10">
                            <span className="text-xs font-black text-orange-500 bg-orange-50 px-3 py-1 rounded-full uppercase tracking-tighter">Edit Application</span>
                            <div className="flex gap-2">
                                <button onClick={() => deleteApp(selectedCard.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={20} /></button>
                                <button onClick={() => setSelectedCard(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
                            </div>
                        </div>

                        <input
                            value={selectedCard.company}
                            onChange={(e) => updateApp(selectedCard.id, { company: e.target.value })}
                            className="text-4xl font-black text-slate-800 mb-2 focus:outline-none w-full"
                            placeholder="公司名称"
                        />
                        <input
                            value={selectedCard.position}
                            onChange={(e) => updateApp(selectedCard.id, { position: e.target.value })}
                            className="text-xl font-bold text-slate-400 mb-10 focus:outline-none w-full"
                            placeholder="投递岗位"
                        />

                        <div className="space-y-8 flex-1">
                            <section>
                                <label className="text-xs font-black text-slate-300 uppercase tracking-widest mb-4 block">当前进度</label>
                                <select
                                    value={selectedCard.status}
                                    onChange={(e) => updateApp(selectedCard.id, { status: e.target.value })}
                                    className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold text-slate-600 focus:ring-2 focus:ring-orange-200"
                                >
                                    <option value="backlog">准备中</option>
                                    <option value="applied">已投递</option>
                                    <option value="interviewing">面试中</option>
                                    <option value="offered">已获得 Offer</option>
                                    <option value="closed">已结束</option>
                                </select>
                            </section>

                            <section>
                                <label className="text-xs font-black text-slate-300 uppercase tracking-widest mb-4 block">面经与资源 (Notion/飞书)</label>
                                <div className="relative">
                                    <LinkIcon className="absolute left-4 top-4 text-slate-300" size={18} />
                                    <input
                                        value={selectedCard.notesLink}
                                        onChange={(e) => updateApp(selectedCard.id, { notesLink: e.target.value })}
                                        placeholder="粘贴你的面经链接..."
                                        className="w-full p-4 pl-12 bg-slate-50 rounded-2xl border-none text-sm focus:ring-2 focus:ring-orange-200"
                                    />
                                </div>
                            </section>
                        </div>

                        <div className="mt-auto pt-6 border-t border-slate-50">
                            <button onClick={() => setSelectedCard(null)} className="w-full py-4 bg-slate-800 text-white rounded-2xl font-bold shadow-lg shadow-slate-200 active:scale-95 transition-all">
                                保存修改
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;