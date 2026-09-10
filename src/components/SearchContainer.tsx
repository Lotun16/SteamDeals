import { useState } from "react";
import SearchGame from "./SearchGame";
import SearchSettings from "./SearchSettings";
import RecentSearches from "./RecentSearches";
import TrackedGames from "./TrackedGames";
import { SearchSettingsType } from "../models/pluginModel";

type View = 'search' | 'settings' | 'recent' | 'tracked';

const SearchContainer = () => {
	const [settings, setSettings] = useState<SearchSettingsType>({
		country: "US",
		shop: 61,
	});
	const [view, setView] = useState<View>('search');

	const handleSettingsUpdate = (newSettings: SearchSettingsType) => {
		setSettings(newSettings);
		setView('search');
	};

	return (
		<>
			{view === 'settings' && <SearchSettings settings={settings} onSave={handleSettingsUpdate} onCancel={() => setView('search')} />}
			{view === 'recent' && <RecentSearches onBack={() => setView('search')} />}
			{view === 'tracked' && <TrackedGames onBack={() => setView('search')} />}
			{view === 'search' && (
				<SearchGame
					settings={settings}
					onOpenSettings={() => setView('settings')}
					onOpenRecent={() => setView('recent')}
					onOpenTracked={() => setView('tracked')}
				/>
			)}
		</>
	);
};

export default SearchContainer;
