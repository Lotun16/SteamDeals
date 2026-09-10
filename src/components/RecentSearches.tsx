import { DialogButton, Focusable } from "decky-frontend-lib";
import { useState } from "react";
import GameBox from "./GameBox";
import { GameDetails } from "./GameDetails";
import { FaArrowLeft } from "react-icons/fa";

interface RecentSearchesProps {
	onBack: () => void;
}

const RecentSearches = ({ onBack }: RecentSearchesProps) => {
	const [selectedGame, setSelectedGame] = useState<{ gameId: string; gameTitle: string } | null>(null);
	const recent: { gameId: string; gameTitle: string }[] = JSON.parse(localStorage.getItem('steamdeals_recent') || '[]');

	return (
		<div style={{ position: 'absolute', width: '100%', top: 'var(--basicui-header-height)', bottom: 'var(--gamepadui-current-footer-height)', overflowY: 'auto' }}>
			<div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '15px 20px 5px' }}>
				<Focusable style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
					<DialogButton style={{ display: 'flex', alignItems: 'center', width: 'auto', minWidth: '20px' }} onClick={selectedGame ? () => setSelectedGame(null) : onBack}>
						<FaArrowLeft />
					</DialogButton>
				</Focusable>
				<h1 style={{ margin: 0 }}>Recent Searches</h1>
			</div>
			{selectedGame ? (
				<GameDetails {...selectedGame} />
			) : (
				<Focusable>
					{recent.length === 0 ? (
						<p style={{ padding: '0 16px' }}>No recent searches yet.</p>
					) : (
						recent.map((game) => (
							<GameBox key={game.gameId} gameId={game.gameId} gameTitle={game.gameTitle} onClick={() => setSelectedGame(game)} />
						))
					)}
				</Focusable>
			)}
		</div>
	);
};

export default RecentSearches;
