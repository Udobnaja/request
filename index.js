import { Request } from "./request/index";
// Run request

const delay = ms => new Promise(r => setTimeout(r, ms));

const reject = (reject) => {
    console.log('I Am Rejected with error: ', reject);
};

const resolve = async (response, data) => {
    await delay(1000);
    console.log('I Should be resolved as First', response);
    return 'This data comes From First Response';
};
const resolveSecond = (response, data) => {
    console.log('I Should be resolved as Second', response, data);
    return 'This data comes From Second Response';
};

const resolveThird =  (response, data) => {
    console.log('I Should be resolved as Third', response, data);
    return 'This data comes From Third Response';
};

const postBody = {
    title: 'Anna',
    body: 'Try walking in my shoes',
    userId: 1
};

const resolvePost = (response, data) => {
    console.log(`Response from POST:`, response, `This comes from previous chain`, data);
    return response.id;
};

const putBody = {
    id: 1,
    title: 'Play with API',
    body: '😭 😭 😭 😭',
    userId: 1
};

const resolvePut = (response, data) => {
    console.log(`Response from PUT:`, response, `This comes from previous chain`, data);
    return response.id;
};

const patchBody = { title: 'Just another Test' };
const patchResolve = (response, data) => {
    console.log(`Response from PATCH:`, response, `This comes from previous chain`, data);
    return response.title;
};

const deleteResolve = (response, data) => {
    console.log(`Response from DELETE:`, response, `This comes from previous chain`, data);
};

new Request()
    .get('https://jsonplaceholder.typicode.com/users', resolve, reject)
    .get('https://slack.com/api/api.test', resolveSecond, reject) // тест асинхронного колбека
    .get('https://slack.com/api/api.test', resolveThird, reject)
    .post('https://jsonplaceholder.typicode.com/posts', postBody, resolvePost, reject)
    .put('https://jsonplaceholder.typicode.com/posts/1', putBody, resolvePut, reject)
    .patch('https://jsonplaceholder.typicode.com/posts/1', patchBody, patchResolve, reject)
    .delete('https://jsonplaceholder.typicode.com/posts/1', deleteResolve, reject)
    .done(); // done обязателен, я хотела выполнять асинхронные запросы в теле колбэка так же, решила так это.

// Тут либо каждый раз вызывать новый экземпляр класса или добавлять метод в начало цепочки, который бы возвращал новый инстанс класса

// const resolve2_1 = async (response, data) => {
//     await delay(1000);
//     console.log('I Should Be resolved as First in the Second Chain', response, data);
//     return 'This come From 1_1';
// };
// const resolve2_2 =  (response, data) => {
//     console.log('I Should Be resolved as Second in the Second Chain', response, data);
// };
//
// new Request()
//     .get('https://slack.com/api/api.test', resolve2_1, reject)
//     .get('https://slack.com/api/api.test', resolve2_2, reject)
//     .done();