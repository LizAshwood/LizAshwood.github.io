import { createAuditBarDone, createAuditBarRecieved, goPiscineTriesChart, jsPiscineTriesChart, progressOverTime } from "./svg.js";
const jwt = sessionStorage.getItem('token')
let user = 0;

window.addEventListener('DOMContentLoaded', async(event) => {
  if (jwt && jwt !== 'Bearer ') {

    // fetch user details
    fetchUser().then((user) => {
    let { firstName, lastName, email, createdAt, totalUp, totalDown, attrs, firstUpTransaction, lastUpTransaction, lastDownTransaction } = user[0];
      createdAt = new Date(createdAt).toLocaleDateString('en-GB');
      firstUpTransaction = new Date(firstUpTransaction[0].createdAt).toLocaleDateString('en-GB');
      lastUpTransaction = new Date(lastUpTransaction[0].createdAt).toLocaleDateString('en-GB');
      lastDownTransaction = new Date(lastDownTransaction[0].createdAt).toLocaleDateString('en-GB');

      totalUp = parseFloat(totalUp/1000000).toFixed(2);
      totalDown = parseFloat(totalDown/1000000).toFixed(2);
      // temporary for displaying data
      const userDetails = `
        <p>Name: ${firstName} ${lastName}</p>
        <p>Email: ${email}</p>
        <p>Profile Created: ${createdAt}</p>
        <p>Nationality: ${attrs.nationality}</p>
        <p>City: ${attrs.addressCity}</p>
      `;
      const userDetailsContainer = document.querySelector('#account');
      userDetailsContainer.innerHTML = userDetails; 
      const auditDetails = `
        <div id="done">
        <p>Audits Done: ${totalUp}MB</p>
        </div>
        <div id="audit-bars"></div> 
        <div id="recieved">
        <p>Audits Received: ${totalDown}MB</p>
        </div>
        <div id="audit-dates">
        <p>First audit done: ${firstUpTransaction}</p>
        <p>Latest audit done: ${lastUpTransaction}</p>
        <p>Latest audit recieved: ${lastDownTransaction}</p>
        </div>
        `;
      const auditDetailsContainer = document.querySelector('#audit');
      auditDetailsContainer.innerHTML = auditDetails;
      createAuditBarDone(totalUp, totalDown);
      createAuditBarRecieved(totalUp, totalDown);
      })


    // fetch user transactions
      fetchUserId().then((userId) => {
          user = userId;
          fetchTransactions().then((transactions) => {
            const filteredTransactions = transactions
              .filter(transaction => !transaction.path.includes('piscine'))
              .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
              .map(transaction => ({
                xp: transaction.amount / 1000,
                date: new Date(transaction.createdAt).toLocaleDateString('en-GB'),
                path: transaction.path.split('div-01/')[1]
              }))
              .reduce((acc, curr) => {
                const prevXp = acc.length > 0 ? acc[acc.length - 1].xp : 0;
                const currXp = (parseFloat(prevXp) + parseFloat(curr.xp)).toFixed(2);
                return [...acc, { ...curr, xp: currXp }];
              }, []);
    
            progressOverTime(filteredTransactions);
          });
      });
            // fetch piscines 
            // const data = await fetchGoPiscineTries();
            fetchGoPiscineTries().then((data) => {
              goPiscineTriesChart(data);
            })
            // console.log(data)

            fetchJSPiscineTries().then((data) => {
              jsPiscineTriesChart(data);
            })
  } else {
    window.location.href = '/login';
  }
});

async function fetchUserId() {
    const query = `query {user {id}}`
    const response = await fetch("https://01.kood.tech/api/graphql-engine/v1/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": jwt,
      },
      body: JSON.stringify({ query }),
    });
  
    const data = await response.json();

    user = data.data.user[0].id;
    return user;
}

async function fetchUser() {
  const query = `query {
                    user {
                    id
                    firstName
                    lastName
                    email
                    createdAt
                    totalUp
                    totalDown
                    attrs
                    firstUpTransaction: transactions(where: {type: {_eq: "up"}}, order_by: {createdAt: asc}, limit: 1) {
                            createdAt
                    }
                    lastUpTransaction: transactions(where: {type: {_eq: "up"}}, order_by: {createdAt: desc}, limit: 1) {
                        createdAt
                    }
                    lastDownTransaction: transactions(where: {type: {_eq: "down"}}, order_by: {createdAt: desc}, limit: 1) {
                        createdAt
                    }
                    }
                }`
  const response = await fetch("https://01.kood.tech/api/graphql-engine/v1/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": jwt,
    },
    body: JSON.stringify({ query }),
  });

  const data = await response.json();
  const user = data.data.user;
  return user;
}

async function fetchTransactions() {
    const query = `query {
                    transaction(where: { userId: { _eq: ${user} }, type: { _eq: "xp" } }) {
                    type
                    amount
                    createdAt
                    path
                    }
                }`;
  
    const response = await fetch("https://01.kood.tech/api/graphql-engine/v1/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": jwt,
      },
      body: JSON.stringify({ query }),
    });
  
    const data = await response.json();
  
    const transactions = data.data.transaction;
    return transactions;
}

async function fetchGoPiscineTries() {
   const query = `query {
                  result {
                    objectId
                    path 
                  }
                }`
  const response = await fetch("https://01.kood.tech/api/graphql-engine/v1/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": jwt,
    },
    body: JSON.stringify({ query }),
  })
  const data = await response.json();
  const resultArray = data.data.result;
  
  const tasks = [
    "quest-01",
    "quest-02",
    "quest-03",
    "exam-01",
    "quest-04",
    "quest-05",
    "quest-06",
    "quest-07",
    "exam-02",
    "quest-08",
    "quest-09",
    "quest-10",
    "exam-03"
  ];
  const questCount = resultArray
    .filter(task => tasks.includes(task.path.split('/')[3]))
    .reduce((acc, cur) => {
      const pathArray = cur.path.split('/');
      const questPath = pathArray[3];
      if (acc.hasOwnProperty(questPath)) {
        acc[questPath]++;
      } else {
        acc[questPath] = 1;
      }
      return acc;
    }, {});

  return questCount;
}

async function fetchJSPiscineTries() {
  const query = `query {
                 result {
                   objectId
                   path 
                 }
               }`
 const response = await fetch("https://01.kood.tech/api/graphql-engine/v1/graphql", {
   method: "POST",
   headers: {
     "Content-Type": "application/json",
     "Authorization": jwt,
   },
   body: JSON.stringify({ query }),
 })

 
 const tasks = [
   "data",
   "loop",
   "find",
   "time",
   "call-me-maybe",
   "dom",
   "object",
   "async",
   "node",
 ];

const data = await response.json();
const resultArray = data.data.result;

const questCount = resultArray
    .filter(task => tasks.includes(task.path.split('/')[4]))
    .reduce((acc, cur) => {
      const pathArray = cur.path.split('/');
      const questPath = pathArray[4];
      if (acc.hasOwnProperty(questPath)) {
        acc[questPath]++;
      } else {
        acc[questPath] = 1;
      }
      return acc;
    }, {});

  // console.log(questCount);
  return questCount;
}

const logoutButton = document.getElementById('log-out-button');
logoutButton.addEventListener('click', (event) => {
    sessionStorage.removeItem('token');
    window.location.href = '/login';
})