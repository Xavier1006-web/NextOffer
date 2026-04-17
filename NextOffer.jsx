import React, { useState } from 'react';
import { Plus, Calendar, Link as LinkIcon, MoreHorizontal, User, CheckCircle2 } from 'lucide-react';

// 1. 模拟数据（增加了 interviewRound 字段）
const INITIAL_DATA = [
    { id: '1', company: '美团', position: '产品经理实习生', status: 'interviewing', round: '二面', date: '明日 14:00', tags: ['校招', '北京'], resume: 'V2' },
    { id: '2', company: '字节跳动', position: '前端开发', status: 'interviewing', round: '终面', date: '10-28', tags: ['内推'], resume: 'V1' },
    { id: '3', company: '阿里巴巴', position: '运营管培生', status: 'applied', date: '10-20', tags: ['杭州'], resume: 'V1' },
    { id: '4', company: '腾讯', position: '产品助理', status: 'offered', date: '10-15', tags: ['深圳'], resume: 'V3' },
];

const COLUMNS = [
    { id: 'backlog', title: '准备中', count: 0 },
    { id: 'applied', title: '已投递', count: 1 },
    { id: 'interviewing', title: '面试中', count: 2 },
    { id: 'offered', title: '已斩获', count: 1 },
    { id: 'closed', title: '已结束', count: 0 },
];

const App = () => {
    return (
        <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans p-6">
            {/* Header */}
            <header className="flex justify-between items-center mb-8 max-w-[1600px] mx-auto">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xl">N</span>
                    </div>
                    <h1 className="text-xl font-semibold tracking-tight">NextOffer</h1>
                </div>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 shadow-sm">
                    <Plus size={16} /> 新增申请
                </button>
            </header>

            {/* Kanban Board */}
            <main className="flex gap-4 overflow-x-auto pb-4 max-w-[1600px] mx-auto h-[calc(100vh-120px)]">
                {COLUMNS.map(column => (
                    <div key={column.id} className="flex-shrink-0 w-72 flex flex-col">
                        {/* Column Header */}
                        <div className="flex items-center justify-between px-2 mb-4">
                            <div className="flex items-center gap-2">
                                <h2 className="font-medium text-sm text-slate-500 uppercase tracking-wider">{column.title}</h2>
                                <span className="bg-slate-200 text-slate-600 text-xs px-2 py-0.5 rounded-full">{column.count}</span>
                            </div>
                            <MoreHorizontal size={16} className="text-slate-400 cursor-pointer" />
                        </div>

                        {/* Cards Area */}
                        <div className="flex-1 space-y-3 overflow-y-auto">
                            {INITIAL_DATA.filter(item => item.status === column.id).map(card => (
                                <div key={card.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">{card.company}</h3>
                                        {/* 关键改进：面试轮次标记 */}
                                        {card.round && (
                                            <span className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase border border-indigo-100">
                                                {card.round}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-500 mb-4">{card.position}</p>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {card.tags.map(tag => (
                                            <span key={tag} className="text-[11px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
                                                {tag}
                                            </span>
                                        ))}
                                        <span className="text-[11px] bg-blue-50 text-blue-500 px-2 py-0.5 rounded flex items-center gap-1">
                                            简历 {card.resume}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between pt-3 border-t border-slate-50 text-[11px] text-slate-400">
                                        <div className="flex items-center gap-1">
                                            <Calendar size={12} />
                                            {card.date}
                                        </div>
                                        {card.status === 'offered' && <CheckCircle2 size={14} className="text-emerald-500" />}
                                    </div>
                                </div>
                            ))}

                            {/* Empty state placeholder */}
                            <div className="border-2 border-dashed border-slate-200 rounded-xl py-8 flex flex-col items-center justify-center text-slate-300 hover:border-slate-300 transition-colors cursor-pointer">
                                <Plus size={20} />
                            </div>
                        </div>
                    </div>
                ))}
            </main>
        </div>
    );
};

export default App;