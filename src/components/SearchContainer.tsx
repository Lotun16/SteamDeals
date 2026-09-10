import { useState } from "react";
import SearchGame from "./SearchGame";
import SearchSettings from "./SearchSettings";
import { SearchSettingsType } from "../models/pluginModel";

const SearchContainer = () => {
	const [settings, setSettings] = useState<SearchSettingsType>({
		country: "US",
		shop: 61, // Default to Steam
	});
	const [viewSettings, setViewSettings] = useState(false);

	const handleSettingsUpdate = (newSettings: SearchSettingsType) => {
		setSettings(newSettings);
		setViewSettings(false);
	};

	return (
		<>
			{viewSettings ? (
				<SearchSettings settings={settings} onSave={handleSettingsUpdate} onCancel={() => setViewSettings(false)} />
			) : (
				<SearchGame settings={settings} onOpenSettings={() => setViewSettings(true)} />
			)}
		</>
	);
};

export default SearchContainer;
