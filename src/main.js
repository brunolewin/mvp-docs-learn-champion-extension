const QUERY_KEY = 'WT.mc_id';

chrome.contextMenus.onClicked.addListener(function (itemData) {
    var url = new URL(itemData.linkUrl);
    url.searchParams.append(QUERY_KEY, itemData.menuItemId);
    copyTextToClipboard(url.href);
});

function copyTextToClipboard(text) {
    var copyFrom = document.createElement("textarea");
    copyFrom.textContent = text;
    document.body.appendChild(copyFrom);
    copyFrom.select();
    document.execCommand('copy');
    copyFrom.blur();
    document.body.removeChild(copyFrom);
}

function createContextMenues(creatorIds) {
    chrome.contextMenus.removeAll();
    if (creatorIds.length < 1) {
        return
    }

    let parentId = (creatorIds.length > 1) ? "docslearnchampion" : creatorIds[0];

    chrome.contextMenus.create({
        title: 'Copy link address with CreatorID',
        id: parentId,
        targetUrlPatterns: [
            "https://social.technet.microsoft.com/*",
            "https://docs.microsoft.com/*",
            "https://azure.microsoft.com/*",
            "https://techcommunity.microsoft.com/*",
            "https://social.msdn.microsoft.com/*",
            "https://devblogs.microsoft.com/*",
            "https://developer.microsoft.com/*",
            "https://channel9.msdn.com/*",
            "https://gallery.technet.microsoft.com/*",
            "https://cloudblogs.microsoft.com/*",
            "https://technet.microsoft.com/*",
            "https://docs.azure.cn/*",
            "https://www.azure.cn/*",
            "https://msdn.microsoft.com/*",
            "https://blogs.msdn.microsoft.com/*",
            "https://blogs.technet.microsoft.com/*",
            "https://microsoft.com/handsonlabs/*",
            "https://csc.docs.microsoft.com/*"
        ],
        contexts: ['link']
    });

    if (creatorIds.length > 1) {
        creatorIds.forEach(function (creatorId) {
            chrome.contextMenus.create({
                title: creatorId,
                id: creatorId,
                parentId: parentId,
                contexts: ['link']
            });
        });
    }
}

function updateContextMenues() {
    chrome.storage.sync.get({
        list: [],
    }, function (items) {
        if (items) {
            createContextMenues(items.list)
        }
        else {
            chrome.contextMenus.removeAll();
        }
    });
}


chrome.runtime.onMessage.addListener(function(request) {
    if (request === 'updateDocsLearnContextMenues') {
        updateContextMenues()
    }
});


chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete') {
    updateContextMenues()
  }
})