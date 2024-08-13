import { useState } from "react";
import { ShoppingList } from "../Datatypes/ShoppingList";
import InventoryListView from "./InventoryListView"
import ShoppingListView from "./ShoppingListView"

function InventoryShoppingList() {
    const [shoppingList, setShoppingList] = useState<ShoppingList>();

    return (
        <section className='flex flex-row pt-4 h-full justify-start items-start'>
            <section className='flex-1 pl-6 pr-4 h-full'>
                {<ShoppingListView shoppingList={shoppingList} setShoppingList={setShoppingList} />}
            </section>
            <section className='flex-1 pr-6 pl-4 h-full'>
                <InventoryListView />
            </section>
        </section>
    )
}

export default InventoryShoppingList 