import { DialogButton, Focusable, PanelSectionRow } from "decky-frontend-lib";
import { useState } from "react";
import GameBox from "./GameBox";
import { GameDetails } from "./GameDetails";
import { ScrollableWindow } from "./ScrollableWindow";
import { FaArrowLeft } from "react-icons/fa";

interface TrackedGamesProps {
	onBack: () => void;
}

const TrackedGames = ({ onBack }: TrackedGamesProps) => {
	const [selectedGame, setSelectedGame] = useState<{ gameId: string; gameTitle: string } | null>(null);
	const tracked: { gameId: string; gameTitle: string }[] = JSON.parse(localStorage.getItem('steamdeals_tracked') || '[]');

	return (
		<div style={{ position: 'absolute', width: '100%', top: 'var(--basicui-header-height)', bottom: 'var(--gamepadui-current-footer-height)' }}>
			<div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '15px 20px 5px' }}>
				<Focusable style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
					<DialogButton style={{ display: 'flex', alignItems: 'center', width: 'auto', minWidth: '20px' }} onClick={selectedGame ? () => setSelectedGame(null) : onBack}>
						<FaArrowLeft />
					</DialogButton>
				</Focusable>
				<h1 style={{ margin: 0 }}>Tracked Games</h1>
			</div>
			<ScrollableWindow fadeAmount='12px' height='calc(100% - 60px)' scrollBarWidth='0px'>
				{selectedGame ? (
					<GameDetails {...selectedGame} onUntrack={() => setSelectedGame(null)} />
				) : (
					<PanelSectionRow>
						<div>
							{tracked.length === 0 ? (
								<p style={{ padding: '0 16px' }}>No tracked games yet.</p>
							) : (
								tracked.map((game) => (
									<div key={game.gameId}>
										<GameBox gameId={game.gameId} gameTitle={game.gameTitle} onClick={() => setSelectedGame(game)} />
									</div>
								))
							)}
						</div>
					</PanelSectionRow>
				)}
			</ScrollableWindow>
		</div>
	);
};

export default TrackedGames;
