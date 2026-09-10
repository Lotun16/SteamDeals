import { DialogButton, Field, Focusable, gamepadDialogClasses, quickAccessControlsClasses, Dropdown } from "decky-frontend-lib";
import { useState } from "react";
import { SearchSettingsType } from "../models/pluginModel";
import { FaArrowLeft } from "react-icons/fa";

interface SearchSettingsProps {
	settings: SearchSettingsType;
	onSave: (settings: SearchSettingsType) => void;
	onCancel?: () => void;
}

const SearchSettings = ({ settings, onSave, onCancel }: SearchSettingsProps) => {
	const [selectedCountry, setSelectedCountry] = useState(settings.country);
	const [selectedShop, setSelectedShop] = useState(settings.shop);

	const countryOptions = [
		{ data: "US", label: "United States" },
		{ data: "GB", label: "United Kingdom" },
		{ data: "DE", label: "Germany" },
		{ data: "FR", label: "France" },
		{ data: "CA", label: "Canada" },
	];

	const shopOptions = [
		{ data: 61, label: "Steam" },
		{ data: 1, label: "GOG" },
		{ data: 27, label: "Epic Games Store" },
		{ data: 8, label: "Humble Store" },
	];

	return (
		<>
			<style>{`
            .search-game-container .${gamepadDialogClasses.FieldDescription} {
                margin: 0;
            }
            .search-game-container .${quickAccessControlsClasses.PanelSectionRow}>:first-child {
                padding: 0 16px;
            }
            .search-game-container .loadingthrobber_ContainerBackground_2ngG3 {
                background: transparent;
            }
            .search-game-container .${gamepadDialogClasses.Button} {
                overflow: hidden;
            }
            `}</style>
			<div className="search-game-container" style={{ position: "absolute", width: "100%", top: "var(--basicui-header-height)", bottom: "var(--gamepadui-current-footer-height)" }}>
				<div>
					<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 20px 5px" }}>
						<h1 style={{ margin: 0 }}>Search Settings</h1>
						<div>
							<DialogButton style={{ display: "flex", alignItems: "center", width: "auto", minWidth: "20px" }} onClick={onCancel}>
								<FaArrowLeft />
							</DialogButton>
						</div>
					</div>
					<Field
						description={
							<Focusable style={{ display: "flex", flexDirection: "row", gap: "10px", padding: "0 16px" }}>
								<div style={{ width: "100%" }}>
									<h1>Country</h1>
									<div style={{ width: "300px" }}>
										<Dropdown rgOptions={countryOptions} selectedOption={selectedCountry} onChange={(e) => setSelectedCountry(e.data)}></Dropdown>
									</div>
								</div>
							</Focusable>
						}
					/>
					<Field
						description={
							<Focusable style={{ display: "flex", flexDirection: "row", gap: "10px", padding: "0 16px" }}>
								<div style={{ width: "100%" }}>
									<h1>Shops</h1>
									<div style={{ width: "300px" }}>
										<Dropdown rgOptions={shopOptions} selectedOption={selectedShop} onChange={(e) => setSelectedShop(e.data)}></Dropdown>
									</div>
								</div>
							</Focusable>
						}
					/>
					<div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
						<DialogButton style={{ display: "flex", alignItems: "center", width: "auto", minWidth: "20px" }} onClick={() => onSave({ country: selectedCountry, shop: selectedShop })}>
							Save Settings
						</DialogButton>
					</div>
				</div>
			</div>
		</>
	);
};

export default SearchSettings;
