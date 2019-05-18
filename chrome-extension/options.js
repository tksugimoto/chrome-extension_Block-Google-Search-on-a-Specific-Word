const key = 'banned_words';

chrome.storage.local.get(key, items => {
	let bannedWords = items[key] || [];

	const removeWord = word => {
		bannedWords = bannedWords.filter(bannedWord => bannedWord !== word);
		return new Promise(resolve => {
			chrome.storage.local.set({
				[key]: bannedWords,
			}, resolve);
		});
	};
	const addWord = word => {
		bannedWords.push(word);
		return new Promise(resolve => {
			chrome.storage.local.set({
				[key]: bannedWords,
			}, resolve);
		});
	};

	const wordListContainer = document.getElementById('word-list-container');
	const displayWordListItem = bannedWord => {
		const li = document.createElement('li');
		const removeButton = document.createElement('button');
		removeButton.classList.add('remove-button');
		removeButton.append('削除');
		li.append(removeButton);
		li.append(bannedWord);
		wordListContainer.append(li);

		removeButton.addEventListener('click', () => {
			removeWord(bannedWord).then(() => {
				wordListContainer.removeChild(li);
			});
		});
	};
	bannedWords.forEach(displayWordListItem);

	const newWordInput = document.getElementById('new-word');
	const addButton = document.getElementById('add');
	addButton.addEventListener('click', () => {
		const newBannedWord = newWordInput.value;
		addWord(newBannedWord).then(() => {
			displayWordListItem(newBannedWord);
			newWordInput.value = '';
			newWordInput.focus();
		});
	});
	newWordInput.addEventListener('keydown', evt => {
		if (evt.key === 'Enter') {
			addButton.click();
		}
	});
});
