import { GraphQLServer } from 'graphql-yoga';

// Scalar types = String, Boolean, Int, Float, ID
const users = [{
    id:'1',
    name: 'Terry',
    email:'terry@gmail.com',
    age: 30
},{
    id:'2',
    name: 'Rayn',
    email:'rayn@gmail.com',
    age: 27
}]

const posts = [{
    id:'10',
    title:'GraphQL 101',
    body:'This is how to use GraphQL...',
    published: true,
    author:'1'
},{
    id:'11',
    title:'GraphQL 201',
    body:'This is how to use GraphQL...',
    published: true,
    author:'1'
},{
    id:'12',
    title:'Programming Music',
    body:'',
    published: false,
    author:'2'
}]

//Type definitions (schema)
const typeDefs = `
    type Query {
        greeting(name: String): String!
        me: User!
        posts(query: String): [Post!]!
        users(query: String):[User!]!
    }

    type User {
        id: ID!
        name: String!
        email:String!
        age: Int
        posts:[Post!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
    }
`
//Resolvers
const resolvers = {
    Query: {
        greeting(parent, args, ctx, info) {
            if(args.name)
                return `Hello! + ${args.name}!`
            else
                return 'Hello';
        },
        me() {
            return {
                id: '123923',
                name: 'Terry',
                email: 'terry@gmail.com',
                age: 20
            }
        },
        posts(parent, args, ctx, info) {
            if(!args.query) {
                return posts;
            }

            return posts.filter(post => {
                const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase());
                const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase());
                return isTitleMatch || isBodyMatch;
            })
        },
        users(parent, args, ctx, info) {
            if(!args.query) {
                return users;
            } 

            return users.filter((user) => {
                return user.name.toLowerCase().includes(args.query.toLowerCase());
            })
        }
    },
    Post: {
        author(parent, args, ctx, info) {
            return users.find(user => user.id === parent.author);
        }
    },
    User: {
        posts(parent, args, ctx, info) {
            return posts.filter(post => post.author === parent.id);
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(()=> {
    console.log('The server is up!')
})