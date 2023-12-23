import "./App.css";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TItemData, TOnItemDrop } from "./types";
import { DropBox } from "./dropBox/DropBox";
import { ItemDragLayer } from "./itemDragLayer/ItemDragLayer";
import { useState } from "react";

export const ACCEPT_TYPE = "ITEMS";

const data: Record<string, TItemData[]> = {
	box1: [
		{ id: "i1", text: "Item - 101" },
		{ id: "i2", text: "Item - 102" },
		{ id: "i3", text: "Item - 103" },
	],
	box2: [],
};

function App() {
	const [dataRecord, setDataRecord] = useState(data);

	const handleDropItems: TOnItemDrop = (
		movedItems,
		sourceId,
		destinationId
	) => {
		const newData = { ...dataRecord };

		newData[sourceId] = newData[sourceId].filter(
			(item) => !movedItems.find((mi) => mi.id === item.id)
		);
		newData[destinationId] = [...newData[destinationId], ...movedItems];

		setDataRecord(newData);
	};

	return (
		<div className="App">
			<DndProvider backend={HTML5Backend}>
				<ItemDragLayer />
				{Object.keys(dataRecord).map((boxId) => (
					<DropBox
						key={boxId}
						onItemDropped={handleDropItems}
						items={dataRecord[boxId]}
						dropBoxId={boxId}
					/>
				))}
			</DndProvider>
		</div>
	);
}

export default App;
