import http from "k6/http";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export const options = {
    scenarios: {
        constant_request_rate: {
            executor: "constant-arrival-rate",
            rate: 100,
            timeUnit: "1s",
            duration: "60s",
            preAllocatedVUs: 20,
            maxVUs: 1000,
        },
    },
    // stages: [
    //     { duration: '30s', target: 2 },
    //     { duration: '1m30s', target: 3 },
    //     { duration: '20s', target: 1 },
    //     { duration: '1m20s', target: 2 },
    //     { duration: '1m20s', target: 5 },
    // ],
};

export function handleSummary(data) {
    return {
      "/jsonoutput/summary.html": htmlReport(data),
    };
  }

export default function () {
    const url = "http://host.docker.internal:3000/graphql";
    const payload1 = JSON.stringify({
        query: "query Query($sessionId: String!) {\n  order(sessionId: $sessionId) {\n    id\n    completed\n    created\n    sessionId\n    number\n    items {\n      id\n      quantity\n      product {\n        id\n        title\n        description\n        shopId\n      }\n    }\n  }\n}\n",
        variables: { sessionId: "qwernull" },
        operationName: "Query",
    });
    const payload2 = JSON.stringify({
        query: "mutation CreateOrder($urlHash: String!, $sessionId: String!, $items: [OrderItemInput]!) {\n  createOrder(urlHash: $urlHash, sessionId: $sessionId, items: $items) {\n    id\n    number\n    completed\n    modify\n    sessionId\n    items {\n      id\n      product {\n        id\n      }\n      quantity\n    }\n    shop {\n      contact\n      id\n      products {\n        id\n        title\n      }\n    }\n  }\n}\n",
        variables: {
            urlHash: "p81g4rv",
            sessionId: "qwernull",
            items: [
                { productId: "1", quantity: 1 },
                { productId: "2", quantity: 2 },
            ],
        },
        operationName: "CreateOrder",
    });
    const payload3 = JSON.stringify({
        query: "mutation CreateShopMutation {\n  createShop {\n    id\n    urlHash\n    editHash\n    name\n    created\n    modify\n    contact\n    products {\n      id\n      created\n    }\n  }\n}\n",
        variables: {},
        operationName: "CreateShopMutation",
    });

    const params = {
        headers: {
            "Content-Type": "application/json",
        },
    };

    http.post(url, payload1, params);
    http.post(url, payload2, params);
    http.post(url, payload3, params);
}
