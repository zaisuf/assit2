import React from 'react';
import ChatsSection from './chats';
import BillingAnalytics from './billing';
import { Bar } from 'react-chartjs-2';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js';

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

// Generate last 7 days as labels
function getLast7DaysLabels() {
	const days = [];
	const today = new Date();
	for (let i = 6; i >= 0; i--) {
		const d = new Date(today);
		d.setDate(today.getDate() - i);
		days.push(d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }));
	}
	return days;
}

// Generate random dataset for bar chart (Users only)
function getBarData7Days() {
	const base = [60, 80, 55, 90, 70, 100, 85];
	return base.map((v) => v + Math.round(Math.random() * 10 - 5));
}

const data1 = getBarData7Days();
const data2 = getBarData7Days(); // Sessions data

const data = {
	labels: getLast7DaysLabels(),
	datasets: [
		{
			label: 'Chats',
			data: data1,
			backgroundColor: 'rgba(0, 255, 204, 0.8)',
			borderRadius: 8,
			barPercentage: 0.9,
			categoryPercentage: 0.8,
		},
		{
			label: 'Voice Chats',
			data: data2,
			backgroundColor: 'rgba(124, 58, 237, 0.7)',
			borderRadius: 8,
			barPercentage: 0.9,
			categoryPercentage: 0.8,
		},
	],
};

const options = {
	responsive: true,
	plugins: {
		legend: {
			position: 'top' as const,
			labels: {
				color: '#fff',
				font: { size: 16, family: 'sans-serif', weight: 700 },
				padding: 24,
			},
		},
		title: {
			display: true,
			text: '7-Day User & Session Analytics',
			color: '#fff',
			font: { size: 22, family: 'sans-serif', weight: 700 },
			padding: { top: 16, bottom: 24 },
		},
		tooltip: {
			backgroundColor: '#222B3A',
			titleColor: '#fff',
			bodyColor: '#fff',
			borderColor: '#00FFCC',
			borderWidth: 1,
			padding: 12,
			caretSize: 8,
			cornerRadius: 8,
		},
	},
	scales: {
		x: {
			grid: {
				color: 'rgba(255,255,255,0.08)',
				borderColor: '#222B3A',
			},
			ticks: {
				color: '#B0B8D1',
			font: { size: 14, family: 'sans-serif', weight: 400 },
			},
		},
			y: {
				grid: {
					color: 'rgba(255,255,255,0.12)',
					borderColor: '#222B3A',
				},
				ticks: {
					display: false,
				},
			},
	},
	borderRadius: 8,
};

export default function Overview() {
	return (
		<div style={{ maxWidth: 1100, margin: '0 auto', padding: 32 }}>
			{/* Billing Analytics section on top */}
			<BillingAnalytics />
			<div style={{ background: 'transparent', borderRadius: 16, padding: 24, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.18)' }}>
				<Bar data={data} options={{ ...options, plugins: { ...options.plugins, legend: { ...options.plugins.legend }, title: { ...options.plugins.title } }, backgroundColor: 'transparent' }} height={400} width={1000} />
			</div>
			<ChatsSection />
		</div>
	);
}
