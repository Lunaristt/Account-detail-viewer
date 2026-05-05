export const mockUsers = [
    {
        id: 1,
        name: "Leanne Graham",
        username: "Bret",
        email: "Sincere@april.biz",
        phone: "1-770-736-0988",
        website: "hildegard.org",
        company: { name: "Romaguera-Crona", catchPhrase: "Multi-layered client-server neural-net" },
        address: { street: "Kulas Light", suite: "Apt. 556", city: "Gwenborough", zipcode: "92998-3874" },
    },
    {
        id: 2,
        name: "Ervin Howell",
        username: "Antonette",
        email: "Shanna@melissa.tv",
        phone: "010-692-6593",
        website: "anastasia.net",
        company: { name: "Deckow-Crist", catchPhrase: "Proactive didactic contingency" },
        address: { street: "Victor Plains", suite: "Suite 879", city: "Wisokyburgh", zipcode: "90566-7771" },
    },
];

export const mockPosts = [
    { id: 1, userId: 1, title: "Post one", body: "Body one" },
    { id: 2, userId: 1, title: "Post two", body: "Body two" },
    { id: 3, userId: 2, title: "Post three", body: "Body three" },
];

export const mockTodos = [
    { id: 1, userId: 1, title: "Todo one", completed: true },
    { id: 2, userId: 1, title: "Todo two", completed: false },
    { id: 3, userId: 1, title: "Todo three", completed: false },
    { id: 4, userId: 2, title: "Todo four", completed: true },
    { id: 5, userId: 2, title: "Todo five", completed: true },
];