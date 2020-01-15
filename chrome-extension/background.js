const key = 'banned_words';

chrome.storage.local.get(key, items => {
	let bannedWords = items[key] || [];

	chrome.storage.onChanged.addListener(changes => {
		bannedWords = changes[key].newValue || [];
	});

	const callback = details => {
		const url = new URL(details.url);
		const searchWord = url.searchParams.get('q').toLowerCase();
		if (bannedWords.some(bannedWord => searchWord.includes(bannedWord.toLowerCase()))) {
			return {
				cancel: true,
			};
		}
	};
	const filter = {
		urls: [
			// origin は manifest.json の permissions で制限している
			'*://*/*q=*',
		],
	};
	const opt_extraInfoSpec = [
		'blocking',
	];

	chrome.webRequest.onBeforeRequest.addListener(callback, filter, opt_extraInfoSpec);
});
