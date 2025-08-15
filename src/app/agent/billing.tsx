import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);
// Pie chart data for Text to Speech Hours
const ttsHoursUsed = 1;
const ttsHoursTotal = 10;
const ttsPieData = {
	labels: ['Used', 'Remaining'],
	datasets: [
		{
			data: [ttsHoursUsed, ttsHoursTotal - ttsHoursUsed],
			backgroundColor: [
				'linear-gradient(135deg, #a78bfa 0%, #38bdf8 100%)', // Will be replaced with plugin
				'#23243a',
			],
			borderWidth: 0,
		},
	],
};

const ttsPieOptions = {
	cutout: '0%',
	plugins: {
		legend: { display: false },
		tooltip: {
			callbacks: {
				label: function(context: any) {
					const label = context.label || '';
					const value = context.raw;
					return `${label}: ${value} hours`;
				}
			}
		}
	},
	elements: {
		arc: {
			borderRadius: 8,
		}
	},
	animation: {
		animateRotate: true,
		animateScale: true,
		duration: 1200,
	},
};

import React, { useState } from 'react';

// Simple custom tooltip component
function CustomTooltip({ children, content }: { children: React.ReactNode, content: string }) {
	const [visible, setVisible] = useState(false);
	return (
		<span
			style={{ position: 'relative', display: 'inline-block' }}
			onMouseEnter={() => setVisible(true)}
			onMouseLeave={() => setVisible(false)}
		>
			{children}
			{visible && (
				<span
					style={{
						position: 'absolute',
						left: '50%',
						top: '-38px',
						transform: 'translateX(-50%)',
						background: '#23243a',
						color: '#fff',
						padding: '7px 16px',
						borderRadius: 8,
						fontSize: 15,
						fontWeight: 500,
						whiteSpace: 'nowrap',
						boxShadow: '0 4px 16px 0 rgba(0,0,0,0.18)',
						zIndex: 10,
						pointerEvents: 'none',
					}}
				>
					{content}
				</span>
			)}
		</span>
	);
}

// Example chatbot token usage data
const usageData = [
	{ label: '1', percent: 30 },
	{ label: '2', percent: 50 },
];

function getBarGradient(percent: number) {
	// Simulate a purple-pink gradient with a glow at the end
	return `linear-gradient(90deg, #a78bfa 0%, #c084fc 60%, #f0abfc 100%)`;
}


function BillingAnalytics() {
	// Always show a visible arc for small values (e.g. 1/10)
	const minPie = 0.06; // ~22 degrees, visually clear for 1/10
	const usageRatio = ttsHoursUsed / ttsHoursTotal;
	const [pieValue, setPieValue] = useState(usageRatio > 0 && usageRatio < minPie ? minPie : usageRatio);
	React.useEffect(() => {
		setPieValue(usageRatio > 0 && usageRatio < minPie ? minPie : usageRatio);
	}, [usageRatio]);

	return (
		<div style={{ maxWidth: 900, margin: '0 0 0 -24px', padding: 32, background: 'transparent' }}>
			<div style={{ display: 'flex', flexDirection: 'row', gap: 40, alignItems: 'flex-start', width: '100%' }}>
				{/* Chatbot Token Usage Section */}
				<div style={{ flex: 1, minWidth: 420, marginLeft: 80 }}>
					<h3 style={{ color: '#fff', fontWeight: 700, fontSize: 24, marginBottom: 18, letterSpacing: 1 }}>Chatbot Token Usage</h3>
					<div style={{ marginBottom: 18, display: 'flex', alignItems: 'center', gap: 12 }}>
						<span style={{ color: '#B0B8D1', fontWeight: 600, fontSize: 16 }}>Chatbot Model:</span>
						<span style={{ color: '#fff', fontWeight: 700, fontSize: 17, background: 'rgba(124,58,237,0.13)', borderRadius: 8, padding: '2px 12px' }}>gpt-4-turbo</span>
					</div>
								<div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 32 }}>
												{usageData.map((row, idx) => (
													<div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: 28 }}>
														<span style={{ color: '#fff', fontWeight: 600, fontSize: 18, width: 32, textAlign: 'right', marginRight: 24 }}>{row.label}</span>
														<CustomTooltip content={`Line ${row.label}: ${row.percent}% tokens used`}>
															<div style={{ flex: 2, height: 22, borderRadius: 12, background: '#2d2e42', position: 'relative', overflow: 'hidden', marginRight: 24, minWidth: 180 }}>
																<div style={{
																	width: `${row.percent}%`,
																	height: '100%',
																	borderRadius: 12,
																	background: getBarGradient(row.percent),
																	boxShadow: row.percent > 0 ? `0 0 24px 4px #f0abfc88` : 'none',
																	position: 'relative',
																	transition: 'width 0.5s',
																}}>
																	{/* Glow dot at the end */}
																	<div style={{
																		position: 'absolute',
																		right: -12,
																		top: '50%',
																		transform: 'translateY(-50%)',
																		width: 24,
																		height: 24,
																		borderRadius: '50%',
																		background: 'radial-gradient(circle, #fff 0%, #f0abfc 60%, #a78bfa 100%)',
																		boxShadow: '0 0 32px 8px #f0abfc88',
																		opacity: row.percent > 0 ? 1 : 0,
																		pointerEvents: 'none',
																	}} />
																</div>
															</div>
														</CustomTooltip>
														<span style={{ color: '#fff', fontWeight: 500, fontSize: 18, width: 48, textAlign: 'left' }}>{row.percent}%</span>
													</div>
												))}
					</div>
				</div>
				{/* Text to Speech Hours Pie Chart Section */}
				<div style={{ minWidth: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 8, marginLeft: 150 }}>
					<h4 style={{ color: '#fff', fontWeight: 700, fontSize: 18, marginBottom: 12 }}>Text to Speech Hours</h4>
					  <div style={{ width: 240, height: 240, position: 'relative' }}>
									<Pie
										data={{
											labels: [],
											datasets: [
												{
													data: [pieValue, 1 - pieValue],
													backgroundColor: [
														'#7c3aed',
														'rgba(124,58,237,0.08)',
													],
													borderWidth: 0,
												},
											],
										}}
										options={ttsPieOptions}
									/>
						{/* Thin border circle overlay */}
												<div style={{
													position: 'absolute',
													top: 0,
													left: 0,
													width: '100%',
													height: '100%',
													borderRadius: '50%',
													border: '1px solid rgba(255,255,255,0.08)',
													pointerEvents: 'none',
													boxSizing: 'border-box',
												}} />
					</div>
					<div style={{ color: '#B0B8D1', fontWeight: 600, fontSize: 15, marginTop: 10 }}>{ttsHoursUsed} / {ttsHoursTotal} hours used</div>
				</div>
			</div>
		</div>
	);
}

export default BillingAnalytics;
