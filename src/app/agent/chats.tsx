import React from 'react';


// Example static chat data with dates
type Chat = { user: string; message: string; time: string; date: number };
const chats: Chat[] = [
	{ user: 'Alice', message: 'Hi, how are you?', time: '09:00', date: 0 },
	{ user: 'Bob', message: 'I am good, thanks!', time: '09:01', date: 0 },
	{ user: 'Alice', message: 'What can you do?', time: '09:02', date: 1 },
	{ user: 'Bot', message: 'I can help you with analytics and more!', time: '09:03', date: 2 },
	{ user: 'Alice', message: 'Show me stats.', time: '09:04', date: 2 },
];

// Generate last 3 days as table headers
function getLast3Days() {
	const days = [];
	const today = new Date();
	for (let i = 2; i >= 0; i--) {
		const d = new Date(today);
		d.setDate(today.getDate() - i);
		// Format as 'Fri, 8 Aug' to match server output
		const weekday = d.toLocaleDateString(undefined, { weekday: 'short' });
		const day = d.getDate();
		const month = d.toLocaleDateString(undefined, { month: 'short' });
		days.push(`${weekday}, ${day} ${month}`);
	}
	return days;
}
const last3Days = getLast3Days();

// Group chats by date index (0: first day, 1: second, 2: third)
const chatsByDay: Chat[][] = [[], [], []];
chats.forEach(chat => {
	if (chat.date >= 0 && chat.date < 3) chatsByDay[chat.date].push(chat);
});

import { useState } from 'react';

export default function ChatsSection() {
	const [overlayOpen, setOverlayOpen] = useState(false);
	const [overlayDayIdx, setOverlayDayIdx] = useState<number | null>(null);

	// Overlay content for all chats in a day
	const renderOverlay = () => {
		if (overlayDayIdx === null) return null;
		const day = last3Days[overlayDayIdx];
		const chatsList = chatsByDay[overlayDayIdx];
		return (
			<div style={{
				position: 'fixed',
				top: 0,
				left: 0,
				width: '100vw',
				height: '100vh',
				background: 'rgba(10,16,32,0.92)',
				zIndex: 1000,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}} onClick={() => setOverlayOpen(false)}>
				<div style={{
					background: 'linear-gradient(120deg, #16203a 0%, #1e2740 60%, #22305a 100%)',
					borderRadius: 18,
					minWidth: 400,
					maxWidth: 520,
					minHeight: 220,
					maxHeight: '80vh',
					padding: 36,
					color: '#fff',
					boxShadow: '0 4px 32px 0 rgba(0,0,0,0.18)',
					overflowY: 'auto',
					position: 'relative',
				}} onClick={e => e.stopPropagation()}>
					<h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 18, letterSpacing: 1, color: '#fff', textAlign: 'center', textShadow: '0 2px 12px #00FFCC22' }}>{day} - All Chats</h3>
					{chatsList.length === 0 ? (
						<div style={{ color: '#B0B8D1', textAlign: 'center', fontSize: 16, marginTop: 16 }}>No chats</div>
					) : (
						chatsList.map((chat, idx) => (
							<div key={idx} style={{
								background: 'rgba(0,255,204,0.07)',
								borderRadius: 8,
								marginBottom: 8,
								padding: '8px 14px',
								color: '#fff',
								fontSize: 15,
								fontWeight: 500,
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
								gap: 10,
							}}>
								<span style={{ color: '#00FFCC', fontWeight: 700, marginRight: 8 }}>{chat.user}:</span>
								<span style={{ flex: 1 }}>{chat.message}</span>
								<span style={{ color: '#B0B8D1', fontSize: 13, marginLeft: 8 }}>{chat.time}</span>
							</div>
						))
					)}
					<button onClick={() => setOverlayOpen(false)} style={{
						position: 'absolute',
						top: 18,
						right: 18,
						background: 'none',
						border: 'none',
						color: '#00FFCC',
						fontSize: 22,
						fontWeight: 700,
						cursor: 'pointer',
						zIndex: 10,
					}} title="Close">×</button>
				</div>
			</div>
		);
	};

	return (
		<div style={{ marginTop: 32, background: 'transparent', borderRadius: 18, padding: 36, color: '#fff', maxWidth: 1200, minWidth: 700, minHeight: 900, marginLeft: 'auto', marginRight: 'auto', boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10)' }}>
			<h3 style={{ fontSize: 26, fontWeight: 800, marginBottom: 28, letterSpacing: 1, color: '#fff', textAlign: 'center', textShadow: '0 2px 12px #00FFCC22' }}>Recent Chats</h3>
			<div style={{ display: 'flex', width: '100%', minHeight: 700, background: 'rgba(0,255,204,0.03)', borderRadius: 14, boxShadow: '0 2px 16px 0 rgba(0,255,204,0.04)' }}>
				{last3Days.map((day, idx) => (
					<div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch', position: 'relative' }}>
						<div style={{
							color: '#fff',
							fontWeight: 700,
							fontSize: 18,
							padding: '14px 0 18px 0',
							textAlign: 'center',
							borderBottom: '1.5px solid #00FFCC33',
							letterSpacing: 0.5,
							background: 'rgba(0,255,204,0.07)',
							borderTopLeftRadius: idx === 0 ? 14 : 0,
							borderTopRightRadius: idx === 2 ? 14 : 0,
						}}>{day}</div>
						<div style={{ flex: 1, padding: '10px 6px 6px 6px', minHeight: 120 }}>
							{chatsByDay[idx].length === 0 ? (
								<div style={{ color: '#B0B8D1', textAlign: 'center', fontSize: 15, marginTop: 16 }}>No chats</div>
							) : (
								chatsByDay[idx].map((chat, cidx) => (
									<div
										key={cidx}
										style={{
											background: 'linear-gradient(120deg, #16203a 0%, #1e2740 60%, #22305a 100%)',
											borderRadius: 8,
											marginBottom: 3,
											padding: '2px 8px 2px 8px',
											boxShadow: '0 1px 6px 0 rgba(0,255,204,0.08)',
											display: 'flex',
											flexDirection: 'row',
											alignItems: 'center',
											gap: 6,
											cursor: 'pointer',
										}}
										onClick={() => { setOverlayOpen(true); setOverlayDayIdx(idx); }}
									>
										<span style={{ fontSize: 14, color: '#fff', marginBottom: 0, flex: 1 }}>{chat.message}</span>
										<svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
											<path d="M5 8L10 13L15 8" stroke="#00FFCC" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
										</svg>
									</div>
								))
							)}
						</div>
						{/* Vertical line between columns except last */}
						{idx < 2 && (
							<div style={{
								position: 'absolute',
								top: 18,
								right: 0,
								bottom: 18,
								width: 1,
								background: '#00FFCC33',
								borderRadius: 1,
								zIndex: 2,
							}} />
						)}
					</div>
				))}
			</div>
			{overlayOpen && renderOverlay()}
		</div>
	);
}
