
/**
 * Use the chrome.storage API to store, retrieve, and track changes to user data.
 * Permissions:  "storage"
 * @since Chrome 20.
 */
declare namespace chrome.storage {
	interface StorageArea {
		/**
		 * Sets multiple items.
		 * @param items An object which gives each key/value pair to update storage with. Any other key/value pairs in storage will not be affected.
		 * Primitive values such as numbers will serialize as expected. Values with a typeof "object" and "function" will typically serialize to {}, with the exception of Array (serializes as expected), Date, and Regex (serialize using their String representation).
		 * @param callback Optional.
		 * Callback on success, or on failure (in which case runtime.lastError will be set).
		 */
		set(items: Object, callback?: () => void): void;
		/**
		 * Gets one or more items from storage.
		 * @param keys A dictionary specifying default values. Pass in null to get the entire contents of storage.
		 * @param callback Callback with storage items, or on failure (in which case runtime.lastError will be set).
		 * Parameter items: Object with items in their key-value mappings.
		 */
		get(keys: Object, callback: (items: { [key: string]: any }) => void): void;
	}

	/** Items in the local storage area are local to each machine. */
	var local: StorageArea;
}
