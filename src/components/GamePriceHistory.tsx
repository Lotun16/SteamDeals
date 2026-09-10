import { ITADHistoryItem } from "../models/gameModel";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useReactTable, getCoreRowModel, createColumnHelper, flexRender } from "@tanstack/react-table";

interface GamePriceDataProps {
	priceHistory: ITADHistoryItem[];
}

const GamePriceHistory = ({ priceHistory }: GamePriceDataProps) => {
	const history = priceHistory
		.map((item) => ({
			date: item.timestamp,
			price: item.deal.price.amount,
		}))
		.reverse();

	return (
		<div style={{ width: "75%", height: "300px", padding: "10px" }}>
			<h4 style={{ margin: "0 0 10px 0" }}>Price Chart</h4>
			<ResponsiveContainer width="100%" height="80%">
				<LineChart data={history}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
					<YAxis />
					<Tooltip labelFormatter={(value) => new Date(value).toLocaleString()} formatter={(value) => [`€${Number(value).toFixed(2)}`, "Price"]} />
					<Line type="stepAfter" dataKey="price" stroke="#4CAF50" strokeWidth={2} dot={{ fill: "#4CAF50", strokeWidth: 2, r: 4 }} />
				</LineChart>
			</ResponsiveContainer>
			<h4 style={{ margin: "0 0 10px 0" }}>Price Data</h4>
			<PriceTable data={history} />
		</div>
	);
};

const columnHelper = createColumnHelper<{ date: string; price: number }>();

const columns = [
	columnHelper.accessor('date', {
		header: 'Date',
		cell: info => new Date(info.getValue()).toLocaleDateString()
	}),
	columnHelper.accessor('price', {
		header: 'Price',
		cell: info => `$${info.getValue().toFixed(2)}`
	})
];

const PriceTable = ({ data }: { data: { date: string; price: number }[] }) => {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel()
	});

	return (
		<table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#1e1e1e', borderRadius: '8px', overflow: 'hidden' }}>
			<thead>
				{table.getHeaderGroups().map(headerGroup => (
					<tr key={headerGroup.id} style={{ backgroundColor: '#2d2d2d' }}>
						{headerGroup.headers.map(header => (
							<th key={header.id} style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #444' }}>
								{flexRender(header.column.columnDef.header, header.getContext())}
							</th>
						))}
					</tr>
				))}
			</thead>
			<tbody>
				{table.getRowModel().rows.map((row, index) => (
					<tr key={row.id} style={{ backgroundColor: index % 2 === 0 ? '#252525' : '#1e1e1e' }}>
						{row.getVisibleCells().map(cell => (
							<td key={cell.id} style={{ padding: '12px', borderBottom: '1px solid #333' }}>
								{flexRender(cell.column.columnDef.cell, cell.getContext())}
							</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default GamePriceHistory;
