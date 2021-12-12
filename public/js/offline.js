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

//TODO: Event handler when app goes back online

function postIDBTransactions(e) {
    const toPost = [];

    //map each transaction in IDB to toPost array
    db.transactions.each(transaction => toPost.push(transaction))
        .then((data) => {
            //send toPost array to server to add to database
            fetch('/api/transaction/bulk', {
                method: "POST",
                body: JSON.stringify(toPost),
                headers: { "Content-Type": "application/json" }
            }).then((res) => {
                //if transactions were posted successfully, clear IDB
                if(res.status === 200) {
                    db.transactions
                    .where('value').above(0)
                    .or('value').belowOrEqual(0)
                    .delete().then((response) => {
                        console.log(response);
                    });
                }
            });

            
        });
}

window.addEventListener('online',postIDBTransactions);