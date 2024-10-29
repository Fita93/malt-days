chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "scrape") {
        const items = Array.from(document.querySelectorAll('.payment-timeline__lot-header-work'))
            .map((t) => {
                const str = t.innerText;
                const match = str.match(/(\d+(?:,\d+)?)/);
                if (match) {
                    // Replace comma with dot for proper number conversion
                    const numberStr = match[0].replace(',', '.');
                    return parseFloat(numberStr);
                }
                return null;
            });
        sendResponse({ days: sum(items) });
    }
    return true;
});

function identity(value) {
    return value;
}

function baseSum(array, iteratee) {
    var result,
        index = -1,
        length = array.length;

    while (++index < length) {
        var current = iteratee(array[index]);
        if (current !== undefined) {
            result = result === undefined ? current : (result + current);
        }
    }
    return result;
}

function sum(array) {
    return (array && array.length)
        ? baseSum(array, identity)
        : 0;
}