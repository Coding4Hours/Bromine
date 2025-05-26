class TabStore {
  constructor() {
    this.tabs = [];
    this.nextTabId = 0;
    // Initialize with one active tab by default
    this.addTab('about:blank', 'New Tab', true); // Ensure the first tab is active
  }

  addTab(url = 'about:blank', title = 'New Tab', makeActive = true) {
    const newTabId = this.nextTabId;
    const newTab = {
      id: newTabId,
      url: url,
      title: title,
      isActive: false, // Will be set by setActiveTab or initial logic
      iframeId: `uv-frame-${newTabId}`,
    };

    this.tabs.push(newTab);
    this.nextTabId++;

    if (makeActive || this.tabs.length === 1) {
      this.setActiveTab(newTab.id);
    } else {
      // If not making active, ensure it's marked inactive if setActiveTab isn't called for it
      newTab.isActive = false; 
    }
    
    return newTab;
  }

  closeTab(tabId) {
    const tabIndex = this.tabs.findIndex(tab => tab.id === tabId);
    if (tabIndex === -1) {
      console.warn(`Tab with id ${tabId} not found.`);
      return;
    }

    const removedTab = this.tabs.splice(tabIndex, 1)[0];

    if (removedTab.isActive && this.tabs.length > 0) {
      // If the closed tab was active, set the last tab in the array as active.
      // This is a simple strategy; more complex logic (e.g., next/previous) could be added.
      this.setActiveTab(this.tabs[this.tabs.length - 1].id);
    } else if (this.tabs.length === 0) {
      // Optional: Handle the case where no tabs are left.
      // Could add a new default tab: this.addTab('about:blank', 'New Tab', true);
      // For now, it will just be an empty tab list. The UI will need to handle this.
      console.log("All tabs closed.");
    }
  }

  setActiveTab(tabId) {
    let foundTab = false;
    this.tabs.forEach(tab => {
      if (tab.id === tabId) {
        tab.isActive = true;
        foundTab = true;
      } else {
        tab.isActive = false;
      }
    });
    if (!foundTab) {
        console.warn(`setActiveTab: Tab with id ${tabId} not found.`);
    }
  }

  getActiveTab() {
    return this.tabs.find(tab => tab.isActive === true) || null;
  }

  updateTabTitle(tabId, title) {
    const tab = this.tabs.find(t => t.id === tabId);
    if (tab) {
      tab.title = title;
    } else {
      console.warn(`updateTabTitle: Tab with id ${tabId} not found.`);
    }
  }

  updateTabUrl(tabId, url) {
    const tab = this.tabs.find(t => t.id === tabId);
    if (tab) {
      tab.url = url;
    } else {
      console.warn(`updateTabUrl: Tab with id ${tabId} not found.`);
    }
  }

  getTabs() {
    return this.tabs;
  }
}

// Export a single instance of the store
const tabStore = new TabStore();
export default tabStore;
