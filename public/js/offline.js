//init indexed db with dexie
let db = new Dexie('OfflineTransactions');

db.version(1).stores({
    transactions: `
        name,
        value,
        date`
});

//when fetch to send transaction fails, add to indexeddb instead
function saveRecord(trans) {
    db.transactions.add(trans);
}